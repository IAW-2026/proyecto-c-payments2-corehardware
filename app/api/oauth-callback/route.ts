import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ message: "No autorizado" }, { status: 401 });
        }

        const code = req.nextUrl.searchParams.get('code');
        if (!code) {
            return NextResponse.json({ message: "Código no presente" }, { status: 400 });
        }

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
            // Esto retorna el error específico de Mercado Pago (ej: invalid_client)
            return NextResponse.json({ 
                message: "Error de Mercado Pago", 
                details: data 
            }, { status: response.status });
        }

        // Si llega aquí, Mercado Pago respondió OK. Intentamos guardar en DB.
        try {
            const credencial = await prisma.credencialVendedor.upsert({
                where: { mercadoPagoUserId: BigInt(data.user_id) },
                update: {
                    clerkUserId: userId,
                    accessToken: data.access_token,
                    refreshToken: data.refresh_token,
                    expiresIn: data.expires_in,
                    publicKey: data.public_key,
                },
                create: {
                    clerkUserId: userId,
                    vendedorId: userId,
                    mercadoPagoUserId: BigInt(data.user_id),
                    accessToken: data.access_token,
                    refreshToken: data.refresh_token,
                    expiresIn: data.expires_in,
                    publicKey: data.public_key,
                },
            });
            return NextResponse.json({ success: true, user_id: credencial.mercadoPagoUserId.toString() });
        } catch (dbError) {
            return NextResponse.json({ 
                message: "Error en base de datos (Prisma)", 
                error: dbError instanceof Error ? dbError.message : String(dbError) 
            }, { status: 500 });
        }

    } catch (error) {
        console.error("Error crítico en Callback API:", error);
        return NextResponse.json(
            { 
                message: "Error interno inesperado", 
                error: error instanceof Error ? error.message : String(error) 
            },
            { status: 500 }
        );
    }
}