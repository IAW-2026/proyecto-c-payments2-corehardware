'use server';

import { prisma } from "@/lib/prisma";
import { Payment } from '@/types/payments'
import { Dispute } from '@/types/dispute'
import { toPayment, toDispute } from '@/lib/mappers';
import { AdminDashboardSummary, AdminHomeSummary } from "@/types/admin-summaries";
import { getRange } from "@/lib/date-range-helper";


export async function getAdminHomeSummary(): Promise<AdminHomeSummary> {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const [pagosHoy, pendientes, disputasActivas, vendedoresActivos] = await Promise.all([
        prisma.pago.findMany({ where: { fecha: { gte: hoy } } }),
        prisma.pago.count({ where: { estado: 'pendiente' } }),
        prisma.disputa.count({ where: { estado: 'pendiente' } }),
        prisma.credencialVendedor.count()
    ]);

    return {
        pagosHoy: {
            cantidad: pagosHoy.length,
            monto: pagosHoy.reduce((acc, p) => acc + Number(p.monto), 0)
        },
        pendientes,
        disputasActivas,
        vendedoresActivos,
    };
}


export async function getAdminActividadReciente(): Promise<{
    pagos: Payment[];
    disputas: Dispute[];
}> {
    const [pagos, disputas] = await Promise.all([
        prisma.pago.findMany({ orderBy: { fecha: 'desc' }, take: 10 }),
        prisma.disputa.findMany({
            orderBy: { fechaDeInicio: 'desc' },
            take: 10,
            include: { pago: true }
        })
    ]);

    return {
        pagos: pagos.map(toPayment),
        disputas: disputas.map(toDispute)
    };
}


export async function getUltimosVendedores() {
    return await prisma.credencialVendedor.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: {
            clerkUserId: true,
            createdAt: true
        }
    });
}


export async function getAdminSummary(periodo: string): Promise<AdminDashboardSummary> {
    const { start, end, prevStart, prevEnd } = getRange(periodo);

    const fetchData = async (s: Date, e: Date) => {
        const [pagos, disputas, rechazados] = await Promise.all([
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
            pagosMonto: pagos._sum.monto?.toString() ?? "0",
            pagosCantidad: pagos._count.id,
            disputas,
            rechazados
        };
    };

    const [current, previous] = await Promise.all([
        fetchData(start, end),
        fetchData(prevStart, prevEnd)
    ]);

    return { current, previous };
}


export async function getPagosChartData(periodo: string): Promise<Payment[]> {
    const { start, end } = getRange(periodo);
    const pagos = await prisma.pago.findMany({
        where: { fecha: { gte: start, lte: end } }
    });
    return pagos.map(toPayment);
}


export async function getDisputasChartData(periodo: string): Promise<Dispute[]> {
    const { start, end } = getRange(periodo);
    const disputas = await prisma.disputa.findMany({
        where: { fechaDeInicio: { gte: start, lte: end } }
    });
    return disputas.map(toDispute);
}


export async function getAdminPagos(params: {
    offset: number,
    limit: number,
    estado: string,
    q: string,
    periodo: string
}): Promise<{ pagos: Payment[], total: number }> {
    const where: any = {};

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

    const [pagos, total] = await Promise.all([
        prisma.pago.findMany({
            where,
            orderBy: { fecha: 'desc' },
            skip: params.offset,
            take: params.limit,
        }),
        prisma.pago.count({ where })
    ]);

    return { pagos: pagos.map(toPayment), total };
}