'use server';

import { cache } from 'react'
import { prisma } from "@/lib/prisma";
import { Payment } from '@/types/payments'
import { Dispute } from '@/types/dispute'
import { toPayment, toDispute } from '@/lib/mappers';
import { Prisma } from '@prisma/client';


export const fetchPendingPayments = cache(async (userId: string): Promise<Payment[]> => {
    const payments = await prisma.pago.findMany({
        where: { buyerClerkUserId: userId, estado: 'pendiente' },
        orderBy: { fecha: 'desc' },
    });
    return payments.map(toPayment);
})


export const fetchRecentDisputes = cache(async (userId: string): Promise<Dispute[]> => {
    const disputes = await prisma.disputa.findMany({
        where: { clerkUserId: userId },
        orderBy: { fechaDeInicio: 'desc' },
        take: 10,
        include: { pago: true }
    });
    return disputes.map(toDispute);
})


export async function fetchActiveDisputes(userId: string): Promise<Dispute[]> {
    const disputes = await prisma.disputa.findMany({
        where: { clerkUserId: userId, fechaDeFinalizacion: null },
        orderBy: { fechaDeInicio: 'desc' },
    });
    return disputes.map(toDispute);
}


export async function fetchRecentPayments(userId: string): Promise<Payment[]> {
    const payments = await prisma.pago.findMany({
        where: { buyerClerkUserId: userId },
        orderBy: { fecha: 'desc' },
        take: 10,
    });
    return payments.map(toPayment);
}


export async function fetchDisputablePayments(userId: string): Promise<Payment[]> {
    const existingDisputes = await prisma.disputa.findMany({
        where: { clerkUserId: userId },
        select: { pagoId: true },
    });

    const disputeToPaymentIdMap = existingDisputes.map((d) => d.pagoId);

    const payments = await prisma.pago.findMany({
        where: {
            buyerClerkUserId: userId,
            estado: { equals: 'acreditado', mode: 'insensitive' },
            id: { notIn: disputeToPaymentIdMap },
        },
        orderBy: { fecha: 'desc' },
    });

    return payments.map(toPayment);
}


export async function fetchDisputesForBuyer(
    userId: string,
    offset = 0,
    limit = 20,
    tab?: 'activas' | 'resueltas'
): Promise<{
    disputes: Dispute[]
    total: number
    amounts: Map<Dispute, string>
}> {
    const where: Prisma.DisputaWhereInput = { clerkUserId: userId };

    if (tab === 'activas') {
        where.estado = 'pendiente';
    } else if (tab === 'resueltas') {
        where.estado = { not: 'pendiente' };
    }

    const [disputes, total] = await Promise.all([
        prisma.disputa.findMany({
            where,
            orderBy: { fechaDeInicio: 'desc' },
            skip: offset,
            take: limit,
            include: { pago: true }
        }),
        prisma.disputa.count({ where })
    ]);

    const mappedDisputes = disputes.map(toDispute);

    const amounts = new Map(
        mappedDisputes.map((d) => [d, d.pago?.monto ?? '0'])
    );

    return { disputes: mappedDisputes, total, amounts };
}

export async function fetchActiveDisputesCount(userId: string): Promise<number> {
    return await prisma.disputa.count({
        where: { clerkUserId: userId, estado: 'pendiente' }
    });
}


export async function fetchPaymentsForBuyer(
    userId: string,
    offset = 0,
    limit = 20,
    tab?: 'pendientes' | 'realizados'
): Promise<{ payments: Payment[], total: number }> {
    const where: Prisma.PagoWhereInput = { buyerClerkUserId: userId };

    if (tab === 'pendientes') {
        where.estado = 'pendiente';
    } else if (tab === 'realizados') {
        where.estado = { not: 'pendiente' };
    }

    const [payments, total] = await Promise.all([
        prisma.pago.findMany({
            where,
            orderBy: { fecha: 'desc' },
            skip: offset,
            take: limit,
        }),
        prisma.pago.count({ where })
    ]);

    return { payments: payments.map(toPayment), total };
}

export async function fetchPendingPaymentsCount(userId: string): Promise<number> {
    return await prisma.pago.count({
        where: { buyerClerkUserId: userId, estado: 'pendiente' }
    });
}


export async function fetchSellerPublicKey(pagoId: string): Promise<string | null> {
    const payment = await prisma.pago.findUnique({
        where: { id: pagoId },
        select: { sellerClerkUserId: true }
    });

    if (!payment) return null;

    const credencial = await prisma.credencialVendedor.findUnique({
        where: { clerkUserId: payment.sellerClerkUserId },
        select: { publicKey: true }
    });

    return credencial?.publicKey || null;
}