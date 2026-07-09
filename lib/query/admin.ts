'use server';

import { prisma } from "@/lib/prisma";
import { Payment } from '@/types/payments'
import { Dispute } from '@/types/dispute'
import { toPayment, toDispute } from '@/lib/mappers';
import { AdminDashboardSummary, AdminHomeSummary } from "@/types/admin-summaries";
import { getRange } from "@/lib/date-range-helper";
import { Prisma } from "@prisma/client";


export async function fetchAdminHomeSummary(): Promise<AdminHomeSummary> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [paymentsToday, pending, activeDisputes, activeSellers] = await Promise.all([
        prisma.pago.findMany({ where: { fecha: { gte: today } } }),
        prisma.pago.count({ where: { estado: 'pendiente' } }),
        prisma.disputa.count({ where: { estado: 'pendiente' } }),
        prisma.credencialVendedor.count()
    ]);

    return {
        paymentsToday: {
            quantity: paymentsToday.length,
            amount: paymentsToday.reduce((acc, p) => acc + Number(p.monto), 0)
        },
        pending,
        activeDisputes,
        activeSellers,
    };
}


export async function fetchAdminRecentActivity(): Promise<{
    payments: Payment[];
    disputes: Dispute[];
}> {
    const [payments, disputes] = await Promise.all([
        prisma.pago.findMany({ orderBy: { fecha: 'desc' }, take: 10 }),
        prisma.disputa.findMany({
            orderBy: { fechaDeInicio: 'desc' },
            take: 10,
            include: { pago: true }
        })
    ]);

    return {
        payments: payments.map(toPayment),
        disputes: disputes.map(toDispute)
    };
}


export async function fetchLatestSellers() {
    return await prisma.credencialVendedor.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: {
            vendedorId: true,
            createdAt: true
        }
    });
}


export async function fetchAdminDashboardSummary(periodo: string): Promise<AdminDashboardSummary> {
    const { start, end, prevStart, prevEnd } = getRange(periodo);

    const fetchData = async (s: Date, e: Date) => {
        const [payments, disputes, rejected] = await Promise.all([
            prisma.pago.aggregate({
                where: { fecha: { gte: s, lte: e } },
                _sum: { monto: true },
                _count: { id: true }
            }),
            prisma.disputa.count({
                where: {
                    pago: { fecha: { gte: s, lte: e } }
                }
            }),
            prisma.pago.count({ where: { fecha: { gte: s, lte: e }, estado: 'rechazado' } })
        ]);

        return {
            paymentsAmount: payments._sum.monto?.toString() ?? "0",
            paymentsQuantity: payments._count.id,
            disputes,
            rejected
        };
    };

    const [current, previous] = await Promise.all([
        fetchData(start, end),
        fetchData(prevStart, prevEnd)
    ]);

    return { current, previous };
}


export async function fetchPaymentsChartData(periodo: string): Promise<Payment[]> {
    const { start, end } = getRange(periodo);
    const payments = await prisma.pago.findMany({
        where: { fecha: { gte: start, lte: end } }
    });
    return payments.map(toPayment);
}


export async function fetchDisputesChartData(periodo: string): Promise<Dispute[]> {
    const { start, end } = getRange(periodo);
    const disputes = await prisma.disputa.findMany({
        where: { fechaDeInicio: { gte: start, lte: end } }
    });
    return disputes.map(toDispute);
}


export async function fetchPaymentsForAdmin(params: {
    offset: number,
    limit: number,
    estado: string,
    q: string,
    periodo: string
}): Promise<{ payments: Payment[], total: number }> {
    const where: Prisma.PagoWhereInput = {};

    const { start, end } = getRange(params.periodo);
    where.fecha = { gte: start, lte: end };

    if (params.estado && params.estado !== 'todos') {
        where.estado = params.estado;
    }

    if (params.q) {
        where.OR = [
            { pedidoId: { contains: params.q, mode: 'insensitive' } },
            { buyerClerkUserId: { contains: params.q, mode: 'insensitive' } },
            { sellerClerkUserId: { contains: params.q, mode: 'insensitive' } }
        ];
    }

    const [payments, total] = await Promise.all([
        prisma.pago.findMany({
            where,
            orderBy: { fecha: 'desc' },
            skip: params.offset,
            take: params.limit,
        }),
        prisma.pago.count({ where })
    ]);

    return { payments: payments.map(toPayment), total };
}