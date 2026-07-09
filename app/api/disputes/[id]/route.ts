import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


const STATUS_MAP: Record<string, string> = {
    pending: "pendiente",
    refunded: "reembolsada",
    replaced: "repuesta",
    rejected: "rechazada",
};


export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    const apiKey = request.headers.get("X-API-Key");
    if (apiKey !== process.env.PAYMENTS_API_KEY) {
        return new Response(JSON.stringify({ message: "Acceso no autorizado" }), { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const newStatus = body.status ? STATUS_MAP[body.status] : undefined;

    if (!newStatus) {
        return NextResponse.json({ error: "status inválido" }, { status: 400 });
    }

    try {
        const dispute = await prisma.disputa.findUnique({ where: { id } });

        if (!dispute) {
            return NextResponse.json({ error: "Disputa no encontrada" }, { status: 404 });
        }

        if (dispute.estado !== "pendiente" && newStatus === "pendiente") {
            return NextResponse.json(
                { error: "No se puede volver a pendiente una disputa resuelta" },
                { status: 409 },
            );
        }

        const disputes = await prisma.disputa.update({
            where: { id },
            data: {
                estado: newStatus,
                ...(newStatus !== "pendiente" && !dispute.fechaDeFinalizacion
                    ? { fechaDeFinalizacion: new Date() }
                    : {}),
            },
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
        });

        return NextResponse.json(disputes, { status: 200 });
    } catch {
        return NextResponse.json({ error: "No se pudo actualizar la disputa" }, { status: 500 });
    }
}