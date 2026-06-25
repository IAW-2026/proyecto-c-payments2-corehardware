import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const STATUS_MAP: Record<string, string> = {
    open: "ABIERTA",
    resolved: "RESUELTA",
    under_review: "EN_REVISION",
};

export async function GET(request: NextRequest) {
    const apiKey = request.headers.get("X-API-Key");
    if (apiKey !== process.env.PAYMENTS_API_KEY) {
        return new Response(JSON.stringify({ message: "Acceso no autorizado" }), { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const statusFiltered = status ? STATUS_MAP[status] : undefined;

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
            ...(statusFiltered && { where: { estado: statusFiltered } }),
            orderBy: { fechaDeInicio: "desc" },
        });

        return NextResponse.json(disputes, { status: 200 });
    } catch {
        return NextResponse.json({ error: "Failed to fetch disputes" }, { status: 500 });
    }
}