'use server';

import { cache } from 'react'
import { prisma } from "@/lib/prisma";
import { Payment } from '@/types/payments'
import { Dispute } from '@/types/dispute'
import { toPayment, toDispute } from '@/lib/mappers';
import { Prisma } from '@prisma/client';


export const getPagosPendientes = cache(async (userId: string): Promise<Payment[]> => {
    const pagos = await prisma.pago.findMany({
        where: { buyerClerkUserId: userId, estado: 'pendiente' },
        orderBy: { fecha: 'desc' },
    });
    return pagos.map(toPayment);
})


export const getDisputasRecientes = cache(async (userId: string): Promise<Dispute[]> => {
    const disputas = await prisma.disputa.findMany({
        where: { clerkUserId: userId },
        orderBy: { fechaDeInicio: 'desc' },
        take: 10,
        include: { pago: true }
    });
    return disputas.map(toDispute);
})


export async function getDisputasActivas(userId: string): Promise<Dispute[]> {
    const disputas = await prisma.disputa.findMany({
        where: { clerkUserId: userId, fechaDeFinalizacion: null },
        orderBy: { fechaDeInicio: 'desc' },
    });
    return disputas.map(toDispute);
}


export async function getPagosRecientes(userId: string): Promise<Payment[]> {
    const pagos = await prisma.pago.findMany({
        where: { buyerClerkUserId: userId },
        orderBy: { fecha: 'desc' },
        take: 10,
    });
    return pagos.map(toPayment);
}


export async function getPagosDisputables(userId: string): Promise<Payment[]> {
    const disputasExistentes = await prisma.disputa.findMany({
        where: { clerkUserId: userId },
        select: { pagoId: true },
    });

    const pagoIdsConDisputa = disputasExistentes.map((d) => d.pagoId);

    const pagos = await prisma.pago.findMany({
        where: {
            buyerClerkUserId: userId,
            estado: { equals: 'acreditado', mode: 'insensitive' },
            id: { notIn: pagoIdsConDisputa },
        },
        orderBy: { fecha: 'desc' },
    });

    return pagos.map(toPayment);
}


export async function getDisputasBuyer(
    userId: string,
    offset = 0,
    limit = 20,
    tab?: 'activas' | 'resueltas'
): Promise<{
    disputas: Dispute[]
    total: number
    montos: Map<Dispute, string>
}> {
    const where: Prisma.DisputaWhereInput = { clerkUserId: userId };

    if (tab === 'activas') {
        where.estado = 'pendiente';
    } else if (tab === 'resueltas') {
        where.estado = { not: 'pendiente' };
    }

    const [disputas, total] = await Promise.all([
        prisma.disputa.findMany({
            where,
            orderBy: { fechaDeInicio: 'desc' },
            skip: offset,
            take: limit,
            include: { pago: true }
        }),
        prisma.disputa.count({ where })
    ]);

    const disputasMapeadas = disputas.map(toDispute);

    const montos = new Map(
        disputasMapeadas.map((d) => [d, d.pago?.monto ?? '0'])
    );

    return { disputas: disputasMapeadas, total, montos };
}

export async function getCountDisputasActivas(userId: string): Promise<number> {
    return await prisma.disputa.count({
        where: { clerkUserId: userId, estado: 'pendiente' }
    });
}


export async function getPagos(
    userId: string,
    offset = 0,
    limit = 20,
    tab?: 'pendientes' | 'realizados'
): Promise<{ pagos: Payment[], total: number }> {
    const where: Prisma.PagoWhereInput = { buyerClerkUserId: userId };

    if (tab === 'pendientes') {
        where.estado = 'pendiente';
    } else if (tab === 'realizados') {
        where.estado = { not: 'pendiente' };
    }

    const [pagos, total] = await Promise.all([
        prisma.pago.findMany({
            where,
            orderBy: { fecha: 'desc' },
            skip: offset,
            take: limit,
        }),
        prisma.pago.count({ where })
    ]);

    return { pagos: pagos.map(toPayment), total };
}

export async function getCountPendientes(userId: string): Promise<number> {
    return await prisma.pago.count({
        where: { buyerClerkUserId: userId, estado: 'pendiente' }
    });
}


export async function getVendedorPublicKey(pagoId: string): Promise<string | null> {
    const pago = await prisma.pago.findUnique({
        where: { id: pagoId },
        select: { sellerClerkUserId: true }
    });

    if (!pago) return null;

    const credencial = await prisma.credencialVendedor.findUnique({
        where: { clerkUserId: pago.sellerClerkUserId },
        select: { publicKey: true }
    });

    return credencial?.publicKey || null;
}