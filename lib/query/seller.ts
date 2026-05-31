'use server';

import { cache } from 'react'
import { prisma } from "@/lib/prisma";
import { Payment } from '@/types/payments'
import { Dispute } from '@/types/dispute'
import { toPayment, toDispute } from '@/lib/mappers';
import { Prisma } from '@prisma/client';


export async function getAcreditacionesSeller(
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

    const [pagosRaw, total] = await Promise.all([
        prisma.pago.findMany({
            where,
            orderBy: { fecha: 'desc' },
            skip: offset,
            take: limit,
        }),
        prisma.pago.count({ where })
    ]);

    return { acreditaciones: pagosRaw.map(toPayment), total };
}


export async function getCountAcreditacionesSellerPendientes(sellerId: string): Promise<number> {
    return await prisma.pago.count({
        where: {
            sellerClerkUserId: sellerId,
            estado: { in: ['pendiente', 'en_proceso'] }
        }
    });
}


export async function getDisputasSeller(
    sellerId: string,
    offset = 0,
    limit = 20,
    tab?: 'pendientes' | 'resueltas'
): Promise<{ disputas: Dispute[], total: number }> {
    const where: Prisma.DisputaWhereInput = { pago: { sellerClerkUserId: sellerId } };

    if (tab === 'pendientes') {
        where.estado = 'pendiente';
    } else if (tab === 'resueltas') {
        where.estado = { not: 'pendiente' };
    }

    const [disputasRaw, total] = await Promise.all([
        prisma.disputa.findMany({
            where,
            include: { pago: true },
            orderBy: { fechaDeInicio: 'desc' },
            skip: offset,
            take: limit,
        }),
        prisma.disputa.count({ where })
    ]);

    return { disputas: disputasRaw.map(toDispute), total };
}


export async function getCountDisputasSellerPendientes(sellerId: string): Promise<number> {
    return await prisma.disputa.count({
        where: { estado: 'pendiente', pago: { sellerClerkUserId: sellerId } }
    });
}


export const getSellerDashboardSummary = cache(async (sellerId: string) => {
    const inicioMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

    const [pendientes, disputasActivas, acreditadoMes] = await Promise.all([
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
                fecha: { gte: inicioMes }
            },
            _sum: { monto: true }
        })
    ]);

    return {
        acreditacionesPendientes: {
            cantidad: pendientes._count.id,
            monto: Number(pendientes._sum.monto ?? 0)
        },
        disputasActivas: disputasActivas,
        totalAcreditadoMes: Number(acreditadoMes._sum.monto ?? 0)
    };
})


export async function getSellerActividadReciente(sellerId: string) {
    const [acreditaciones, disputas] = await Promise.all([
        prisma.pago.findMany({ where: { sellerClerkUserId: sellerId }, orderBy: { fecha: 'desc' }, take: 10 }),
        prisma.disputa.findMany({
            where: { pago: { sellerClerkUserId: sellerId } },
            orderBy: { fechaDeInicio: 'desc' },
            take: 10,
            include: { pago: true }
        })
    ]);

    return {
        acreditaciones: acreditaciones.map(toPayment),
        disputas: disputas.map(toDispute)
    };
}


export async function getIsSellerAuthorized(userId: string): Promise<boolean> {
    const credencial = await prisma.credencialVendedor.findUnique({
        where: { clerkUserId: userId },
        select: { id: true }
    });
    return !!credencial;
}