import { prisma } from "./prisma";

export async function getPagosPendientes(userId: string) {
    return prisma.pago.findMany({
        where: { buyerClerkUserId: userId, estado: 'pendiente' },
        orderBy: { fecha: 'desc' },
    })
}

export async function getDisputasActivas(userId: string) {
    return prisma.disputa.findMany({
        where: { clerkUserId: userId, fechaDeFinalizacion: null },
        orderBy: { fechaDeInicio: 'desc' },
    })
}

export async function getPagosRecientes(userId: string) {
    return prisma.pago.findMany({
        where: { buyerClerkUserId: userId },
        orderBy: { fecha: 'desc' },
        take: 20,
    })
}

export async function getDisputasRecientes(userId: string) {
    return prisma.disputa.findMany({
        where: { clerkUserId: userId },
        orderBy: { fechaDeInicio: 'desc' },
        take: 20,
    })
}