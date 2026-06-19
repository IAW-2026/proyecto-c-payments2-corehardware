'use server';

import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';


export async function processPaymentOrder(
    pagoId: string,
    submitData: {
        total_amount: string;
        payment_method_id: string;
        token: string;
        installments: number;
        email: string;
    }
): Promise<{ success: boolean; orderId: string; error: string }> {
    try {
        const pago = await prisma.pago.findUnique({
            where: { id: pagoId },
        });

        if (!pago) return { success: false, orderId: '', error: "Pago no encontrado" };

        const credencial = await prisma.credencialVendedor.findUnique({
            where: { clerkUserId: pago.sellerClerkUserId },
            select: { accessToken: true }
        });

        if (!credencial?.accessToken) return { success: false, orderId: '', error: "Vendedor no autorizado" };


        const idempotencyKey = crypto.randomUUID();
        const formattedAmount = Number(submitData.total_amount).toFixed(2);

        const orderBody = {
            external_reference: pagoId,
            type: "online",
            processing_mode: "automatic",
            total_amount: formattedAmount,
            payer: { email: submitData.email },
            transactions: {
                payments: [{
                    amount: formattedAmount,
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
            await prisma.pago.update({
                where: { id: pagoId },
                data: { estado: "rechazado" },
            });
            await onPaymentRejected(pago.pedidoId);
            return { success: false, orderId: '', error: data.message || 'Error en MP' };
        }

        revalidatePath('/buyer/payments')
        return { success: true, orderId: data.id, error: '' };
    } catch {
        return { success: false, orderId: '', error: 'Error interno' };
    }
}


export async function onPaymentRejected(pedidoId: string) {
    await fetch(`${process.env.BUYER_API_URL}/api/orders/${pedidoId}/status`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            'x-api-key': process.env.BUYER_API_KEY!,
        },
        body: JSON.stringify({ estado: "PAGO_RECHAZADO" }),
    });
}


export async function onPaymentApproved(pagoId: string) {
    console.log(`[onPaymentApproved] Iniciando para pagoId: ${pagoId}`);

    const pago = await prisma.pago.findUnique({
        where: { id: pagoId },
        select: { pedidoId: true, buyerId: true, sellerId: true, fecha: true, monto: true },
    });

    if (!pago) {
        console.error(`[onPaymentApproved] Pago no encontrado: ${pagoId}`);
        throw new Error(`Pago no encontrado: ${pagoId}`);
    }

    console.log(`[onPaymentApproved] Pago encontrado:`, JSON.stringify(pago));

    const orderRes = await fetch(`${process.env.BUYER_API_URL}/api/orders/${pago.pedidoId}`, {
        headers: { 'x-api-key': process.env.BUYER_API_KEY! },
    });

    console.log(`[onPaymentApproved] GET order ${pago.pedidoId} → status ${orderRes.status}`);

    if (!orderRes.ok) {
        const body = await orderRes.text();
        console.error(`[onPaymentApproved] Error al obtener orden. Status: ${orderRes.status}, Body: ${body}`);
        throw new Error(`Error al obtener orden: ${orderRes.status}`);
    }

    const order = await orderRes.json();
    console.log(`[onPaymentApproved] Orden obtenida:`, JSON.stringify(order));

    const salePayload = {
        id: pagoId,
        fecha: pago.fecha,
        comprador_id: pago.buyerId,
        vendedor_id: pago.sellerId,
        productos: order.productos,
        monto: Number(pago.monto),
    };
    console.log(`[onPaymentApproved] POST sale payload:`, JSON.stringify(salePayload));

    const saleRes = await fetch(`${process.env.SELLER_API_URL}/api/sale`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'x-api-key': process.env.SELLER_API_KEY!,
        },
        body: JSON.stringify(salePayload),
    });

    console.log(`[onPaymentApproved] POST sale → status ${saleRes.status}`);

    if (!saleRes.ok) {
        const body = await saleRes.text();
        console.error(`[onPaymentApproved] Error al crear venta. Status: ${saleRes.status}, Body: ${body}`);
        throw new Error(`Error al crear venta: ${saleRes.status}`);
    }

    console.log(`[onPaymentApproved] Venta creada OK. Actualizando estado del pedido...`);

    const statusRes = await fetch(`${process.env.BUYER_API_URL}/api/orders/${pago.pedidoId}/status`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            'x-api-key': process.env.BUYER_API_KEY!,
        },
        body: JSON.stringify({ estado: "PAGO_APROBADO" }),
    });

    console.log(`[onPaymentApproved] PUT status → status ${statusRes.status}`);

    if (!statusRes.ok) {
        const body = await statusRes.text();
        console.error(`[onPaymentApproved] Error al actualizar estado. Status: ${statusRes.status}, Body: ${body}`);
        throw new Error(`Error al actualizar estado: ${statusRes.status}`);
    }

    console.log(`[onPaymentApproved] Flujo completado OK para pagoId: ${pagoId}`);
}