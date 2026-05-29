import { Disputa } from '@prisma/client'

export type DisputeStatus = 'pendiente' | 'reembolsada' | 'repuesta' | 'rechazada'

export type Dispute = Omit<Disputa, 'estado'> & {
    estado: DisputeStatus
}