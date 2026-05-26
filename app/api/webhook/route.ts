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
    // 1. Obtener datos de firma y URL
    const xSignature = req.headers.get("x-signature") ?? "";
    const xRequestId = req.headers.get("x-request-id") ?? "";
    const dataId = req.nextUrl.searchParams.get("data.id") ?? "";
    
    // 2. Validar firma (según documentación oficial)
    const secret = process.env.MERCADOPAGO_SECRET_KEY!;
    const parts = new URLSearchParams(xSignature.replace(/ /g, ""));
    const ts = parts.get("ts");
    const hash = parts.get("v1");

    if (!ts || !hash) return NextResponse.json({ message: "Firma incompleta" }, { status: 401 });

    const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;
    const expected = crypto.createHmac("sha256", secret).update(manifest).digest("hex");

    if (expected !== hash) return NextResponse.json({ message: "Firma inválida" }, { status: 401 });

    // 3. Procesar evento
    const body = await req.json();
    if (body.type !== "payment") return NextResponse.json({ received: true });

    const mpPaymentId = body.data?.id;

    // Consultar el pago a la API de MP (Obligatorio según documentación)
    const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${mpPaymentId}`, {
        headers: { Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}` },
    });

    if (!mpRes.ok) return NextResponse.json({ message: "Error al consultar MP" }, { status: 502 });

    const mpData = await mpRes.json();
    const externalReference = mpData.external_reference; // Este es tu ID de Prisma

    if (!externalReference) return NextResponse.json({ received: true });

    // Actualizar DB
    await prisma.pago.update({
        where: { id: externalReference },
        data: {
            estado: MP_STATUS_MAP[mpData.status] ?? "desconocido",
            formaDePago: mpData.payment_method_id,
            // mpPaymentId: String(mpPaymentId) // Recomendado añadir este campo
        },
    });

    return NextResponse.json({ received: true }, { status: 200 });
}