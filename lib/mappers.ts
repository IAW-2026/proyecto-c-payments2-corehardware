import { Disputa as PrismaDisputa, Pago as PrismaPago } from '@prisma/client';
import { Dispute, DisputeStatus } from '@/types/dispute';
import { Payment, PaymentStatus } from '@/types/payments';


export const toPayment = (pago: PrismaPago): Payment => ({
    ...pago,
    estado: pago.estado as PaymentStatus,
    monto: pago.monto.toString(),
});

export const toDispute = (
    disputa: PrismaDisputa & { pago?: PrismaPago | null }
): Dispute => ({
    ...disputa,
    estado: disputa.estado as DisputeStatus,
    pago: disputa.pago ? toPayment(disputa.pago) : undefined,
});