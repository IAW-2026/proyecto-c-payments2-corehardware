'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export async function redirectToMercadoPago() {
    const state = crypto.randomUUID();
    
    (await cookies()).set('mp_auth_state', state, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 600,
    });

    const authUrl = new URL('https://auth.mercadopago.com/authorization');
    authUrl.searchParams.append('client_id', process.env.MERCADOPAGO_CLIENT_ID!);
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('platform_id', 'mp');
    authUrl.searchParams.append('state', state);
    authUrl.searchParams.append('redirect_uri', process.env.MERCADOPAGO_REDIRECT_URI!);

    redirect(authUrl.toString());
}


