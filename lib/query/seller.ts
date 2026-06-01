'use server';

import { cache } from 'react'
import { prisma } from "@/lib/prisma";
import { Payment } from '@/types/payments'
import { Dispute } from '@/types/dispute'
import { toPayment, toDispute } from '@/lib/mappers';
import { Prisma } from '@prisma/client';


export async function fetchSellerAccreditations(
    sellerId: string,
    offset = 0,
    limit = 20,
    tab?: 'pendientes' | 'acreditados'
): Promise<{ acreditaciones: Payment[], total: number }> {
    const where: Prisma.PagoWhereInput = { sellerClerkUserId: sellerId };

    if (tab === 'pendientes') {
        where.estado = { in: ['pendiente', 'en_proceso'] };
    } else if (tab === 'acreditados') {
        where.estado = { in: ['acreditado', 'rechazado'] };
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

    return { acreditaciones: payments.map(toPayment), total };
}


export async function fetchPendingAccreditationsCount(sellerId: string): Promise<number> {
    return await prisma.pago.count({
        where: {
            sellerClerkUserId: sellerId,
            estado: { in: ['pendiente', 'en_proceso'] }
        }
    });
}


export async function fetchSellerDisputes(
    sellerId: string,
    offset = 0,
    limit = 20,
    tab?: 'pendientes' | 'resueltas'
): Promise<{ disputes: Dispute[], total: number }> {
    const where: Prisma.DisputaWhereInput = { pago: { sellerClerkUserId: sellerId } };

    if (tab === 'pendientes') {
        where.estado = 'pendiente';
    } else if (tab === 'resueltas') {
        where.estado = { not: 'pendiente' };
    }

    const [disputes, total] = await Promise.all([
        prisma.disputa.findMany({
            where,
            include: { pago: true },
            orderBy: { fechaDeInicio: 'desc' },
            skip: offset,
            take: limit,
        }),
        prisma.disputa.count({ where })
    ]);

    return { disputes: disputes.map(toDispute), total };
}


export async function fetchPendingDisputesCount(sellerId: string): Promise<number> {
    return await prisma.disputa.count({
        where: { estado: 'pendiente', pago: { sellerClerkUserId: sellerId } }
    });
}


export const fetchSellerDashboardSummary = cache(async (sellerId: string) => {
    const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

    const [pending, activeDisputes, accreditedInMonth] = await Promise.all([
        prisma.pago.aggregate({
            where: { sellerClerkUserId: sellerId, estado: 'pendiente' },
            _count: { id: true },
            _sum: { monto: true }
        }),
        prisma.disputa.count({
            where: { pago: { sellerClerkUserId: sellerId }, estado: 'pendiente' }
        }),
        prisma.pago.aggregate({
            where: {
                sellerClerkUserId: sellerId,
                estado: 'acreditado',
                fecha: { gte: monthStart }
            },
            _sum: { monto: true }
        })
    ]);

    return {
        pendingAccreditations: {
            quantity: pending._count.id,
            amount: Number(pending._sum.monto ?? 0)
        },
        activeDisputes: activeDisputes,
        totalAccreditedInMonth: Number(accreditedInMonth._sum.monto ?? 0)
    };
})


export async function fetchSellerRecentActivity(sellerId: string) {
    const [accreditations, disputes] = await Promise.all([
        prisma.pago.findMany({ where: { sellerClerkUserId: sellerId }, orderBy: { fecha: 'desc' }, take: 10 }),
        prisma.disputa.findMany({
            where: { pago: { sellerClerkUserId: sellerId } },
            orderBy: { fechaDeInicio: 'desc' },
            take: 10,
            include: { pago: true }
        })
    ]);

    return {
        accreditations: accreditations.map(toPayment),
        disputes: disputes.map(toDispute)
    };
}


export async function fetchIsSellerAuthorized(userId: string): Promise<boolean> {
    const authorized = await prisma.credencialVendedor.findUnique({
        where: { clerkUserId: userId },
        select: { id: true }
    });
    return !!authorized;
}