'use server';

import { prisma } from "./prisma";
import { Payment } from '@/types/payments'
import { Dispute } from '@/types/dispute'
import { toPayment, toDispute } from '@/lib/mappers';
import { AdminDashboardSummary, AdminHomeSummary } from "@/types/admin-summaries";
import { getRange } from "@/lib/date-range-helper";


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
    const where: any = { clerkUserId: userId };

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
    const where: any = { buyerClerkUserId: userId };

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


export async function getIsSellerAuthorized(userId: string): Promise<boolean> {
    const credencial = await prisma.credencialVendedor.findUnique({
        where: { clerkUserId: userId },
        select: { id: true }
    });
    return !!credencial;
}


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
        const [pagos, disputas] = await Promise.all([
            prisma.pago.aggregate({
                where: { fecha: { gte: s, lte: e } },
                _sum: { monto: true },
                _count: { id: true }
            }),
            prisma.disputa.count({ where: { fechaDeInicio: { gte: s, lte: e } } })
        ]);
        
        return { 
            pagosMonto: pagos._sum.monto?.toString() ?? "0",
            pagosCantidad: pagos._count.id,
            disputas
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


// 3. getAdminPagos: Implementación real de la tabla
export async function getAdminPagos(params: { 
    offset: number, 
    limit: number, 
    estado: string, 
    q: string,
    periodo: string // ← Nuevo parámetro
}): Promise<{ pagos: Payment[], total: number }> {
    const where: any = {};
    
    // 2. Traemos las fechas límites usando la función que ya tenés en tu archivo
    const { start, end } = getRange(params.periodo);
    where.fecha = { gte: start, lte: end }; // ← Filtramos por el rango de fechas

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