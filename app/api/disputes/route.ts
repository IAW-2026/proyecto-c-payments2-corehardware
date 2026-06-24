import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
    const apiKey = request.headers.get("X-API-Key");
    if (apiKey !== process.env.PAYMENTS_API_KEY) {
        return new Response(JSON.stringify({ message: "Acceso no autorizado" }), { status: 401 });
    }

    try {
        const disputes = await prisma.disputa.findMany({
            select: {
                id: true,
                pedidoId: true,
                fechaDeInicio: true,
                fechaDeFinalizacion: true,
                estado: true,
                descripcion: true,
            },
            orderBy: { fechaDeInicio: "desc" },
        });

        return NextResponse.json(disputes, { status: 200 });
    } catch {
        return NextResponse.json({ error: "Failed to fetch disputes" }, { status: 500 });
    }
}