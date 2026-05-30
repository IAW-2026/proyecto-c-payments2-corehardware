'use server';

import { prisma } from "./prisma";
import { Payment } from '@/types/payments'
import { Dispute } from '@/types/dispute'
import { toPayment, toDispute } from '@/lib/mappers';


export async function getPagosPendientes(userId: string): Promise<Payment[]> {
    const pagos = await prisma.pago.findMany({
        where: { buyerClerkUserId: userId, estado: 'pendiente' },
        orderBy: { fecha: 'desc' },
    });
    return pagos.map(toPayment);
}

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

export async function getDisputasRecientes(userId: string): Promise<Dispute[]> {
    const disputas = await prisma.disputa.findMany({
        where: { clerkUserId: userId },
        orderBy: { fechaDeInicio: 'desc' },
        take: 10,
        include: { pago: true }
    });
    return disputas.map(toDispute);
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

export async function getDisputasBuyer(userId: string): Promise<{
    disputas: Dispute[]
    montos: Map<Dispute, string>
}> {
    const disputas = await prisma.disputa.findMany({
        where: { clerkUserId: userId },
        orderBy: { fechaDeInicio: 'desc' },
        include: { pago: true } 
    });

    const disputasConPago = disputas.map(toDispute);

    const montos = new Map(
        disputasConPago.map((d) => [d, d.pago?.monto ?? '0'])
    );

    return { disputas: disputasConPago, montos };
}

export async function getPagos(userId: string): Promise<Payment[]> {
    const pagos = await prisma.pago.findMany({
        where: { buyerClerkUserId: userId },
        orderBy: { fecha: 'desc' },
    });

    return pagos.map(toPayment);
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


export async function getAcreditacionesSeller(sellerId: string): Promise<Payment[]> {
    const pagos = await prisma.pago.findMany({
        where: { sellerClerkUserId: sellerId },
        orderBy: { fecha: 'desc' },
    });
    
    return pagos.map(toPayment);
}

export async function getDisputasSeller(sellerId: string): Promise<Dispute[]> {
    const disputas = await prisma.disputa.findMany({
        where: {
            pago: {
                sellerClerkUserId: sellerId
            }
        },
        include: { pago: true },
        orderBy: { fechaDeInicio: 'desc' },
    });
    return disputas.map(toDispute);
}


export async function getSellerDashboardSummary(sellerId: string) {
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
}

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