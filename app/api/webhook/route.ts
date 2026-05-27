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
    try {
        const body = await req.json();
        const xSignature = req.headers.get("x-signature") ?? "";
        const xRequestId = req.headers.get("x-request-id") ?? "";
        const dataId = req.nextUrl.searchParams.get("data.id") ?? body.data?.id ?? "";

        // Log de datos recibidos
        console.log("--- Inicio de Webhook ---");
        console.log("x-signature:", xSignature);
        console.log("x-request-id:", xRequestId);
        console.log("dataId detectado:", dataId);

        const secret = process.env.MERCADOPAGO_SECRET_KEY!;
        const parts = xSignature.split(',');
        let ts, hash;

        parts.forEach(part => {
            const [key, value] = part.split('=');
            if (key?.trim() === 'ts') ts = value?.trim();
            if (key?.trim() === 'v1') hash = value?.trim();
        });

        if (!ts || !hash) {
            console.error("Firma incompleta: ts o hash no encontrados");
            return NextResponse.json({ message: "Firma incompleta" }, { status: 401 });
        }

        const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;
        const expected = crypto.createHmac("sha256", secret).update(manifest).digest("hex");

        if (expected !== hash) {
            console.error("Firma inválida. Esperado:", hash, "Calculado:", expected);
            return NextResponse.json({ message: "Firma inválida" }, { status: 401 });
        }

        if (body.type !== "payment") {
            console.log("Evento ignorado (no es payment):", body.type);
            return NextResponse.json({ received: true });
        }

        const mpPaymentId = body.data?.id;
        console.log("Consultando pago ID:", mpPaymentId);

        const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${mpPaymentId}`, {
            headers: { 
                Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}` 
            },
        });

        if (!mpRes.ok) {
            const errorText = await mpRes.text();
            console.error("Error al consultar MP. Status:", mpRes.status, "Body:", errorText);
            return NextResponse.json({ message: "Error al consultar MP", details: errorText }, { status: 502 });
        }

        const mpData = await mpRes.json();
        console.log("Pago consultado exitosamente, status:", mpData.status);
        
        const externalReference = mpData.external_reference;
        if (!externalReference) {
            console.log("No se encontró external_reference en el pago");
            return NextResponse.json({ received: true });
        }

        await prisma.pago.update({
            where: { id: externalReference },
            data: {
                estado: MP_STATUS_MAP[mpData.status] ?? "desconocido",
                formaDePago: mpData.payment_method_id,
            },
        });

        console.log("Base de datos actualizada para:", externalReference);
        return NextResponse.json({ received: true }, { status: 200 });

    } catch (error) {
        console.error("Error crítico en el webhook:", error);
        return NextResponse.json({ message: "Error interno" }, { status: 500 });
    }
}