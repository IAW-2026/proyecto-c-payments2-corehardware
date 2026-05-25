import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";


// 1. Definimos el esquema de validación con Zod
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
        // 2. Control de Autenticación Primero (Falla rápido)
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ message: "No autorizado" }, { status: 401 });
        }

        // 3. Validación del Body con Zod
        const json = await req.json();
        const result = checkoutOrderSchema.safeParse(json);

        if (!result.success) {
            // Retorna los errores específicos de validación (qué campo falló y por qué)
            return NextResponse.json(
                { message: "Datos inválidos", errors: result.error.format() },
                { status: 400 }
            );
        }

        const body = result.data;

        // 4. Operación en Base de Datos (con Prisma)
        const pago = await prisma.pago.create({
            data: {
                clerkUserId: userId,
                formaDePago: "",
                estado: "PENDIENTE",
                pedidoId: String(body.id),
                fecha: new Date(body.fecha),
                descripcion: null,
                monto: body.monto,
            },
        });

        // 5. Respuesta limpia
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