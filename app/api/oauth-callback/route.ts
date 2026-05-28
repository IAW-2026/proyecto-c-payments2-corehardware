import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        // Obtención de usuario vía Clerk (siguiendo tu ejemplo)
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ message: "No autorizado" }, { status: 401 });
        }

        // Extracción del código de la URL
        const code = req.nextUrl.searchParams.get('code');
        if (!code) {
            return NextResponse.json({ message: "Código no presente" }, { status: 400 });
        }

        // Petición POST según requisitos de Mercado Pago
        const response = await fetch('https://api.mercadopago.com/oauth/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                client_id: process.env.MERCADOPAGO_CLIENT_ID,
                client_secret: process.env.MERCADOPAGO_CLIENT_SECRET,
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: process.env.MERCADOPAGO_REDIRECT_URI,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(data, { status: response.status });
        }

        // Persistencia en base de datos usando tu esquema y modelo
        const credencial = await prisma.credencialVendedor.upsert({
            where: { mercadoPagoUserId: BigInt(data.user_id) },
            update: {
                clerkUserId: userId,
                accessToken: data.access_token,
                refreshToken: data.refresh_token,
                expiresIn: data.expires_in,
            },
            create: {
                clerkUserId: userId,
                vendedorId: userId,
                mercadoPagoUserId: BigInt(data.user_id),
                accessToken: data.access_token,
                refreshToken: data.refresh_token,
                expiresIn: data.expires_in,
            },
        });

        return NextResponse.json({ success: true, user_id: credencial.mercadoPagoUserId });

    } catch (error) {
        console.error("Error en Callback API:", error);
        return NextResponse.json(
            { message: "Error interno del servidor" },
            { status: 500 }
        );
    }
}