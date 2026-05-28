import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

const MP_STATUS_MAP: Record<string, string> = {
    pending:      "pendiente",
    in_process:   "en_proceso",
    approved:     "acreditado",
    processed:    "acreditado", // Estado para 'orders'
    rejected:     "rechazado",
    cancelled:    "cancelado",
    refunded:     "reembolsado",
    charged_back: "contracargo",
};

export async function POST(req: NextRequest) {
    try {
        // 1. Extraer headers y query params requeridos para la validación
        const xSignature = req.headers.get("x-signature") ?? "";
        const xRequestId = req.headers.get("x-request-id") ?? "";
        const dataId = req.nextUrl.searchParams.get("data.id") ?? "";

        // 2. Parsear la firma
        const parts = xSignature.split(',');
        let ts = "";
        let hash = "";
        parts.forEach(part => {
            const [key, value] = part.split('=');
            if (key?.trim() === 'ts') ts = value?.trim() ?? "";
            if (key?.trim() === 'v1') hash = value?.trim() ?? "";
        });

        console.log("Webhook Debug - Raw Headers:", { xSignature, xRequestId });
        console.log("Webhook Debug - Parsed Data:", { ts, hash, dataId });

        if (!ts || !hash || !dataId) {
            console.error("Webhook Error - Firma o datos incompletos");
            return NextResponse.json({ message: "Firma o datos incompletos" }, { status: 401 });
        }

        // 3. Construir el manifest según el template oficial
        const manifest = `id:${dataId.toLowerCase()};request-id:${xRequestId};ts:${ts};`;
        const secret = process.env.MERCADOPAGO_SECRET_KEY!;
        const expected = crypto.createHmac("sha256", secret).update(manifest).digest("hex");

        console.log("Webhook Debug - Manifest:", manifest);
        console.log("Webhook Debug - Hash esperado:", expected);
        console.log("Webhook Debug - Hash recibido:", hash);

        if (expected !== hash) {
            console.error("Webhook Error - Firma inválida");
            return NextResponse.json({ message: "Firma inválida" }, { status: 401 });
        }

        // 4. Leer el cuerpo tras validar la firma
        const body = await req.json();

        // 5. Determinar el endpoint de consulta según el tipo
        const topic = body.type; // 'payment' o 'order'
        const resourceId = body.data?.id;

        if (!resourceId) return NextResponse.json({ received: true });

        const endpoint = topic === 'order' 
            ? `https://api.mercadopago.com/v1/orders/${resourceId}`
            : `https://api.mercadopago.com/v1/payments/${resourceId}`;

        const mpRes = await fetch(endpoint, {
            headers: { Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}` }
        });

        if (!mpRes.ok) return NextResponse.json({ message: "Error al consultar MP" }, { status: 502 });

        const mpData = await mpRes.json();
        const externalReference = mpData.external_reference;

        if (externalReference) {
            // Extraer forma de pago de forma segura
            const formaDePago = mpData.payment_method_id || mpData.payments?.[0]?.payment_method_id;

            // Definir datos de actualización dinámicos
            const dataToUpdate: any = {
                estado: MP_STATUS_MAP[mpData.status] ?? "desconocido",
            };

            // Solo agregar formaDePago si está presente
            if (formaDePago) {
                dataToUpdate.formaDePago = formaDePago;
            }

            await prisma.pago.update({
                where: { id: externalReference },
                data: dataToUpdate,
            });
        }

        return NextResponse.json({ received: true }, { status: 200 });

    } catch (error) {
        console.error("Error en Webhook:", error);
        return NextResponse.json({ message: "Error interno" }, { status: 500 });
    }
}