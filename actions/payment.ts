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
        // 1. Obtener el sellerClerkUserId asociado al pago
        const pago = await prisma.pago.findUnique({
            where: { id: pagoId },
            select: { sellerClerkUserId: true }
        });

        if (!pago) return { success: false, error: "Pago no encontrado" };

        // 2. Obtener el accessToken del vendedor
        const credencial = await prisma.credencialVendedor.findUnique({
            where: { clerkUserId: pago.sellerClerkUserId },
            select: { accessToken: true }
        });

        if (!credencial?.accessToken) return { success: false, error: "Credenciales no configuradas" };


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
                'Authorization': `Bearer ${credencial.accessToken}`,
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


export async function getPagos() {
    try {
        const pagos = await prisma.pago.findMany({
            orderBy: { fecha: 'desc' }
        });

        // Transformamos decimales de Prisma a strings o números para que el cliente los entienda
        return pagos.map(p => ({
            ...p,
            monto: p.monto.toString()
        }));
    } catch (error) {
        console.error("Error al obtener pagos:", error);
        return [];
    }
}


export async function getVendedorPublicKey(pagoId: string) {
    // 1. Obtener el sellerClerkUserId del pago
    const pago = await prisma.pago.findUnique({
        where: { id: pagoId },
        select: { sellerClerkUserId: true }
    });

    if (!pago) return null;

    // 2. Buscar la credencial usando el sellerClerkUserId como vendedorId
    const credencial = await prisma.credencialVendedor.findUnique({
        where: { clerkUserId: pago.sellerClerkUserId },
        select: { publicKey: true }
    });

    return credencial?.publicKey || null;
}