import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

console.log("DEBUG: El archivo webhook/route.ts ha sido invocado");

export async function POST(req: NextRequest) {
    try {
        // 1. Leer el cuerpo como texto para validación de firma (y JSON para uso posterior)
        const rawBody = await req.text();
        const body = JSON.parse(rawBody);
        
        const xSignature = req.headers.get("x-signature") ?? "";
        const xRequestId = req.headers.get("x-request-id") ?? "";

        // 2. Extraer parámetros de firma
        const parts = xSignature.split(',');
        const ts = parts.find(p => p.startsWith('ts='))?.split('=')[1];
        const hash = parts.find(p => p.startsWith('v1='))?.split('=')[1];

        if (!ts || !hash) return NextResponse.json({ message: "Firma incompleta" }, { status: 401 });

        // 3. Obtener el ID del objeto (debe estar en minúsculas según docs)
        const dataId = (body.data?.id || "").toLowerCase();

        // 4. Construir el manifest según el formato oficial
        const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;

        // 5. Validar firma
        const secret = process.env.MERCADOPAGO_SECRET_KEY!;
        const expected = crypto.createHmac("sha256", secret).update(manifest).digest("hex");

        if (expected !== hash) {
            console.error("Firma inválida. Esperado:", hash, "Calculado:", expected);
            return NextResponse.json({ message: "Firma inválida" }, { status: 401 });
        }

        // 6. Lógica de negocio (Solo si es payment, tal como definiste)
        if (body.type !== "payment") {
            return NextResponse.json({ received: true });
        }

        const mpPaymentId = body.data?.id;
        const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${mpPaymentId}`, {
            headers: { Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}` }
        });

        if (!mpRes.ok) return NextResponse.json({ message: "Error al consultar MP" }, { status: 502 });

        const mpData = await mpRes.json();
        
        // 7. Actualización DB
        await prisma.pago.update({
            where: { id: mpData.external_reference },
            data: { estado: 'acreditado', formaDePago: mpData.payment_method_id }
        });

        return NextResponse.json({ received: true }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: "Error interno" }, { status: 500 });
    }
}