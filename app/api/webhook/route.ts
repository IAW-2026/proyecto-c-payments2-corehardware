import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { PaymentStatus } from "@/types/payments";

const MP_STATUS_MAP: Record<string, PaymentStatus> = {
    pending:      "pendiente",
    in_process:   "en_proceso",
    approved:     "acreditado",
    rejected:     "rechazado",
    cancelled:    "cancelado",
    refunded:     "reembolsado",
    charged_back: "contracargo",
};

function validateSignature(req: NextRequest): boolean {
    const xSignature  = req.headers.get("x-signature") ?? "";
    const xRequestId  = req.headers.get("x-request-id") ?? "";
    const dataId      = req.nextUrl.searchParams.get("data.id") ?? "";
    const secret      = process.env.MERCADOPAGO_SECRET_KEY!;

    const parts: Record<string, string> = {};
    xSignature.split(",").forEach(part => {
        const [k, v] = part.split("=");
        if (k && v) parts[k.trim()] = v.trim();
    });

    const ts   = parts["ts"];
    const hash = parts["v1"];
    if (!ts || !hash) return false;

    const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;

    const expected = crypto
        .createHmac("sha256", secret)
        .update(manifest)
        .digest("hex");

    return expected === hash;
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        if (!validateSignature(req)) {
            return NextResponse.json({ message: "Firma inválida" }, { status: 401 });
        }

        if (body.type !== "payment") {
            return NextResponse.json({ received: true }, { status: 200 });
        }

        const mpPaymentId = body.data?.id;
        if (!mpPaymentId) {
            return NextResponse.json({ message: "data.id ausente" }, { status: 400 });
        }

        const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${mpPaymentId}`, {
            headers: {
                Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
            },
        });

        if (!mpRes.ok) {
            console.error("Error al obtener pago de MP:", mpRes.status);
            return NextResponse.json({ message: "Error consultando MP" }, { status: 502 });
        }

        const mpPayment = await mpRes.json();

        const externalReference = mpPayment.external_reference;
        const mpStatus          = mpPayment.status;
        const paymentMethodId   = mpPayment.payment_method_id ?? "";

        if (!externalReference) {
            return NextResponse.json({ received: true }, { status: 200 });
        }

        const estadoLocal = MP_STATUS_MAP[mpStatus] ?? "pendiente";

        await prisma.pago.update({
            where: { id: externalReference },
            data: {
                estado:      estadoLocal,
                formaDePago: paymentMethodId,
            },
        });

        return NextResponse.json({ received: true }, { status: 200 });

    } catch (error) {
        console.error("Error en webhook de MercadoPago:", error);
        return NextResponse.json({ message: "Error interno" }, { status: 500 });
    }
}