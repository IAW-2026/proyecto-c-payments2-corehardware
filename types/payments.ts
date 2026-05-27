import { Pago } from '@prisma/client'

export type PaymentStatus = 'pendiente' | 'acreditado' | 'rechazado' | 'en_proceso' | 'cancelado' | 'reembolsado' | 'contracargo'
 
export type Payment = Omit<Pago, 'estado' | 'monto'> & {
    estado: PaymentStatus
    monto: string
}