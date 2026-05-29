import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const checkoutOrderSchema = z.object({
    id: z.union([z.string(), z.number()]), 
    fecha: z.iso.datetime(),
    comprador_id: z.string(),
    vendedor_id: z.string(),
    monto: z.number().positive("El monto debe ser mayor a 0"),
    productos: z.array(z.any()).min(1, "Debe incluir al menos un producto"),
});

export async function POST(req: NextRequest) {
    try {
        // ***************************************************************************************************************************************************
        // En la etapa 3 se usar al token de Clerk para esto

        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ message: "No autorizado" }, { status: 401 });
        }

        // ***************************************************************************************************************************************************

        const json = await req.json();
        const result = checkoutOrderSchema.safeParse(json);

        if (!result.success) {
            return NextResponse.json(
                { message: "Datos inválidos", errors: result.error.format() },
                { status: 400 }
            );
        }

        const body = result.data;

        const pago = await prisma.pago.create({
            data: {
                sellerClerkUserId: body.vendedor_id,
                buyerClerkUserId: userId,
                formaDePago: "",
                estado: "pendiente",
                pedidoId: String(body.id),
                fecha: new Date(body.fecha),
                descripcion: "Pago por el pedido " + String(body.id),
                monto: body.monto,
            },
        });

        return NextResponse.json(
            {
                id: pago.id,
                forma_de_pago: pago.formaDePago,
                estado: pago.estado,
                pedido_id: Number(pago.pedidoId),
                fecha: pago.fecha,
                descripcion: pago.descripcion,
                monto: Number(pago.monto),
            },
            { status: 201 }
        );

    } catch (error) {
        console.error("Error en Checkout API:", error);

        return NextResponse.json(
            { message: "Error interno del servidor" },
            { status: 500 }
        );
    }
}