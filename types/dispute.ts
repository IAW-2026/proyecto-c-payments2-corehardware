import { Disputa } from '@prisma/client'
import { Payment } from '@/types/payments'


export type DisputeStatus = 'pendiente' | 'reembolsada' | 'repuesta' | 'rechazada'

export type Dispute = Omit<Disputa, 'estado' | 'pago'> & {
    estado: DisputeStatus
    pago?: Payment
}