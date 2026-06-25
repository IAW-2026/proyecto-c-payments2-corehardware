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
    console.log(`[onPaymentApproved] Iniciando proceso para pagoId: ${pagoId}`);

    const pago = await prisma.pago.findUnique({
        where: { id: pagoId },
        select: { pedidoId: true, buyerId: true, sellerId: true, fecha: true, monto: true },
    });

    if (!pago) {
        console.error(`[onPaymentApproved] ERROR: Pago no encontrado en DB para ID: ${pagoId}`);
        throw new Error(`Pago no encontrado: ${pagoId}`);
    }
    console.log(`[onPaymentApproved] Pago encontrado:`, { pedidoId: pago.pedidoId, buyerId: pago.buyerId });

    // 1. Obtener orden
    console.log(`[onPaymentApproved] Consultando orden: ${pago.pedidoId} en BUYER_API`);
    const orderRes = await fetch(`${process.env.BUYER_API_URL}/api/orders/${pago.pedidoId}`, {
        headers: { 'x-api-key': process.env.BUYER_API_KEY! },
    });

    if (!orderRes.ok) {
        console.error(`[onPaymentApproved] ERROR API BUYER (GET orden): ${orderRes.status} - ${orderRes.statusText}`);
        throw new Error(`Error al obtener orden: ${orderRes.status}`);
    }

    const order = await orderRes.json();
    console.log(`[onPaymentApproved] Orden obtenida correctamente.`);

    // 2. Crear venta
    const payloadVenta = {
        id: pago.pedidoId,
        fecha: pago.fecha,
        comprador_id: pago.buyerId,
        vendedor_id: pago.sellerId,
        productos: order.productos,
        monto: Number(pago.monto),
    };
    
    console.log(`[onPaymentApproved] Enviando POST a SELLER_API...`);
    const saleRes = await fetch(`${process.env.SELLER_API_URL}/api/sale`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'x-api-key': process.env.SELLER_API_KEY!,
        },
        body: JSON.stringify(payloadVenta),
    });

    if (!saleRes.ok) {
        const errorText = await saleRes.text();
        console.error(`[onPaymentApproved] ERROR API SELLER (POST venta): ${saleRes.status} - ${errorText}`);
        throw new Error(`Error al crear venta: ${saleRes.status}`);
    }
    console.log(`[onPaymentApproved] Venta creada exitosamente en SELLER_API`);

    // 3. Actualizar estado
    console.log(`[onPaymentApproved] Actualizando estado de orden: ${pago.pedidoId} a PAGO_APROBADO`);
    const statusRes = await fetch(`${process.env.BUYER_API_URL}/api/orders/${pago.pedidoId}/status`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            'x-api-key': process.env.BUYER_API_KEY!,
        },
        body: JSON.stringify({ estado: "PAGO_APROBADO" }),
    });

    if (!statusRes.ok) {
        const errorText = await statusRes.text();
        console.error(`[onPaymentApproved] ERROR API BUYER (PUT status): ${statusRes.status} - ${errorText}`);
        throw new Error(`Error al actualizar estado: ${statusRes.status}`);
    }

    console.log(`[onPaymentApproved] Proceso completado con éxito para pagoId: ${pagoId}`);
}