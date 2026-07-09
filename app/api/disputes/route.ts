import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const STATUS_MAP: Record<string, string> = {
    pending: "pendiente",
    refunded: "reembolsada",
    replaced: "repuesta",
    rejected: "rechazada",
};

export async function GET(request: NextRequest) {
    const apiKey = request.headers.get("X-API-Key");
    if (apiKey !== process.env.PAYMENTS_API_KEY) {
        return new Response(JSON.stringify({ message: "Acceso no autorizado" }), { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const statusFiltered = status ? STATUS_MAP[status] : undefined;
    const q = searchParams.get("q")?.trim();
    const offset = Math.max(parseInt(searchParams.get("offset") ?? "0", 10) || 0, 0);
    const limit = Math.max(parseInt(searchParams.get("limit") ?? "10", 10) || 10, 1);

    const where = {
        ...(statusFiltered && { estado: statusFiltered }),
        ...(q && { id: { contains: q, mode: "insensitive" as const } }),
    };

    try {
        const [disputes, total] = await Promise.all([
            prisma.disputa.findMany({
                select: {
                    id: true,
                    clerkUserId: true,
                    pedidoId: true,
                    pagoId: true,
                    fechaDeInicio: true,
                    fechaDeFinalizacion: true,
                    estado: true,
                    descripcion: true,
                },
                where,
                orderBy: { fechaDeInicio: "desc" },
                skip: offset,
                take: limit,
            }),
            prisma.disputa.count({ where }),
        ]);

        return NextResponse.json({ disputes, total, offset, limit }, { status: 200 });
    } catch {
        return NextResponse.json({ error: "Failed to fetch disputes" }, { status: 500 });
    }
}