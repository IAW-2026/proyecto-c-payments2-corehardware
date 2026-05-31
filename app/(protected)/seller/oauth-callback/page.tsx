import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function MercadoPagoCallbackPage({
    searchParams,
}: {
    searchParams: Promise<{ code?: string }>
}) {
    const { userId } = await auth();
    const { code } = await searchParams;

    // 1. Verificaciones básicas
    if (!userId) redirect("/sign-in");
    if (!code) redirect("/error?message=codigo_no_presente");

    try {
        // 2. Intercambio de código por token (mismo POST que tenías)
        const response = await fetch('https://api.mercadopago.com/oauth/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
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
            console.error("Error en intercambio MP:", data);
            redirect("/error?message=error_mercado_pago");
        }

        // 3. Persistencia en DB (mismo upsert)
        await prisma.credencialVendedor.upsert({
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

        // 4. Redirección final al éxito
        redirect("/seller/authorization");

    } catch (error) {
        console.error("Error crítico en Callback:", error);
        throw error;
    }
}