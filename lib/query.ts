import { prisma } from "./prisma";
import { Payment, PaymentStatus } from '@/types/payments'
import { Dispute, DisputeStatus } from '@/types/dispute'


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

export async function getPagosDisputables(userId: string): Promise<Payment[]> {
    const disputasExistentes = await prisma.disputa.findMany({
        where: { clerkUserId: userId },
        select: { pagoId: true },
    })

    const pagoIdsConDisputa = disputasExistentes.map((d) => d.pagoId)

    const pagos = await prisma.pago.findMany({
        where: {
            buyerClerkUserId: userId,
            estado: { equals: 'acreditado', mode: 'insensitive' },
            id: { notIn: pagoIdsConDisputa },
        },
        orderBy: { fecha: 'desc' },
    })

    return pagos.map((p) => ({
        ...p,
        monto: p.monto.toString(),
        estado: p.estado as PaymentStatus,
    }))
}

export async function getDisputasBuyer(userId: string): Promise<{
    disputas: Dispute[]
    montos: Map<Dispute, string>
}> {
    const disputas = await prisma.disputa.findMany({
        where: { clerkUserId: userId },
        orderBy: { fechaDeInicio: 'desc' },
    })

    const pagos = await prisma.pago.findMany({
        where: { id: { in: disputas.map((d) => d.pagoId) } },
    })

    const pagosPorId = Object.fromEntries(pagos.map((p) => [p.id, p]))

    const disputasConEstado = disputas.map((d) => ({
        ...d,
        estado: d.estado as DisputeStatus,
    }))

    const montos = new Map(
        disputasConEstado.map((d) => [d, pagosPorId[d.pagoId]?.monto.toString() ?? '0'])
    )

    return { disputas: disputasConEstado, montos }
}