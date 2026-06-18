import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import * as jose from 'jose';


const JWKS = jose.createRemoteJWKSet(
    new URL(`${process.env.CLERK_FRONTEND_API_URL}/.well-known/jwks.json`)
);


export async function verifyToken(token: string) {
    const { payload } = await jose.jwtVerify(token, JWKS, {
        issuer: process.env.CLERK_FRONTEND_API_URL,
    });
    return payload;
}


const checkoutOrderSchema = z.object({
    id: z.string(),
    fecha: z.iso.datetime(),
    comprador_id: z.string(),
    vendedor_id: z.string(),
    monto: z.number().positive("El monto debe ser mayor a 0"),
    productos: z.array(z.string()).min(1, "Debe incluir al menos un producto"),
});


export async function POST(req: NextRequest) {
    try {
        const bearer = req.headers.get('Authorization') ?? '';
        const token = bearer.replace('Bearer ', '');

        if (!token) {
            return NextResponse.json({ message: "No autorizado" }, { status: 401 });
        }

        const { sub: userId } = await verifyToken(token);

        if (!userId) {
            return NextResponse.json({ message: "No autorizado" }, { status: 401 });
        }

        const json = await req.json();
        const result = checkoutOrderSchema.safeParse(json);

        if (!result.success) {
            return NextResponse.json(
                { message: "Datos inválidos", errors: result.error.issues },
                { status: 400 }
            );
        }

        const body = result.data;

        const pago = await prisma.pago.create({
            data: {
                sellerClerkUserId: body.vendedor_id,
                buyerClerkUserId: body.comprador_id,
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