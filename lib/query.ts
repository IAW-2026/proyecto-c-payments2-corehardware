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