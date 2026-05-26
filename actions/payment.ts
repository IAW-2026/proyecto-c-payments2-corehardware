'use server';

import crypto from 'crypto';
import { prisma } from '@/lib/prisma'; // Asegúrate de tener esta importación

export async function procesarOrdenPagoPro(
    pagoId: string, 
    submitData: {
        total_amount: string;
        payment_method_id: string;
        token: string;
        installments: number;
        email: string;
    }
) {
    try {
        const idempotencyKey = crypto.randomUUID();
        const montoFormateado = Number(submitData.total_amount).toFixed(2);

        const orderBody = {
            external_reference: pagoId, // ID REAL DE TU DB
            type: "online",
            processing_mode: "automatic",
            total_amount: montoFormateado,
            payer: { email: submitData.email },
            transactions: {
                payments: [{
                    amount: montoFormateado,
                    payment_method: {
                        id: submitData.payment_method_id,
                        type: "credit_card",
                        token: submitData.token,
                        installments: submitData.installments,
                    },
                }],
            },
        };

        const response = await fetch('https://api.mercadopago.com/v1/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Idempotency-Key': idempotencyKey,
                'Authorization': `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
            },
            body: JSON.stringify(orderBody),
        });

        const data = await response.json();

        if (!response.ok) {
            return { success: false, error: data.message || 'Error en MP' };
        }

        return { success: true, orderId: data.id };
    } catch (error) {
        return { success: false, error: 'Error interno' };
    }
}