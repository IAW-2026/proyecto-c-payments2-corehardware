import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";


export default async function MercadoPagoCallbackPage({
    searchParams,
}: {
    searchParams: Promise<{ code?: string }>
}) {
    const { userId, getToken } = await auth();
    const { code } = await searchParams;

    if (!userId) redirect("/sign-in");
    if (!code) redirect("/error?message=codigo_no_presente");

    try {
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

        const token = await getToken();
        const vendedorRes = await fetch(`${process.env.SELLER_API_URL}/api/seller`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        const vendedor = await vendedorRes.json();

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
                vendedorId: vendedor.id,
                mercadoPagoUserId: BigInt(data.user_id),
                accessToken: data.access_token,
                refreshToken: data.refresh_token,
                expiresIn: data.expires_in,
                publicKey: data.public_key,
            },
        });

        redirect("/seller/authorization");

    } catch (error) {
        console.error("Error crítico en Callback:", error);
        throw error;
    }
}