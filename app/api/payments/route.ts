import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
    const apiKey = request.headers.get("X-API-Key");
    if (apiKey !== process.env.PAYMENTS_API_KEY) {
        return new Response(JSON.stringify({ message: "Acceso no autorizado" }), { status: 401 });
    }

    try {
        const payments = await prisma.pago.findMany({
            select: {
                id: true,
                fecha: true,
                buyerId: true,
                sellerId: true,
                formaDePago: true,
                monto: true,
                estado: true,
                pedidoId: true,
            },
            orderBy: { fecha: "desc" },
        });

        return NextResponse.json(payments, { status: 200 });
    } catch {
        return NextResponse.json({ error: "Failed to fetch payments" }, { status: 500 });
    }
}