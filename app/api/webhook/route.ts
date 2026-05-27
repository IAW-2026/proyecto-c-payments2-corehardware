import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

// Mapa de estados oficial de MP
const MP_STATUS_MAP: Record<string, string> = {
    pending:      "pendiente",
    in_process:   "en_proceso",
    approved:     "acreditado",
    rejected:     "rechazado",
    cancelled:    "cancelado",
    refunded:     "reembolsado",
    charged_back: "contracargo",
};

export async function POST(req: NextRequest) {
    // 1. Leer el body primero (es necesario para el fallback del dataId y para procesar el pago)
    const body = await req.json();

    // 2. Obtener datos de firma y URL
    const xSignature = req.headers.get("x-signature") ?? "";
    const xRequestId = req.headers.get("x-request-id") ?? "";
    
    // Obtenemos data.id de la URL (si existe) o del body (como fallback para el simulador)
    const dataId = req.nextUrl.searchParams.get("data.id") ?? body.data?.id ?? "";
    
    // 3. Validar firma (parseando con split por coma como dicta la doc)
    const secret = process.env.MERCADOPAGO_SECRET_KEY!;
    const parts = xSignature.split(',');
    let ts, hash;

    parts.forEach(part => {
        const [key, value] = part.split('=');
        if (key?.trim() === 'ts') ts = value?.trim();
        if (key?.trim() === 'v1') hash = value?.trim();
    });

    if (!ts || !hash) return NextResponse.json({ message: "Firma incompleta" }, { status: 401 });

    // 4. Calcular HMAC usando el template de la documentación
    const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;
    const expected = crypto.createHmac("sha256", secret).update(manifest).digest("hex");

    if (expected !== hash) return NextResponse.json({ message: "Firma inválida" }, { status: 401 });

    // 5. Procesar evento
    if (body.type !== "payment") return NextResponse.json({ received: true });

    const mpPaymentId = body.data?.id;

    // Consultar el pago a la API de MP
    const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${mpPaymentId}`, {
        headers: { Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}` },
    });

    if (!mpRes.ok) return NextResponse.json({ message: "Error al consultar MP" }, { status: 502 });

    const mpData = await mpRes.json();
    const externalReference = mpData.external_reference;

    if (!externalReference) return NextResponse.json({ received: true });

    // Actualizar DB
    await prisma.pago.update({
        where: { id: externalReference },
        data: {
            estado: MP_STATUS_MAP[mpData.status] ?? "desconocido",
            formaDePago: mpData.payment_method_id,
        },
    });

    return NextResponse.json({ received: true }, { status: 200 });
}