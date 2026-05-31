'use server'

import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { DisputeStatus } from '@/types/dispute'


export async function createDispute(pagoId: string, descripcion: string) {
    const { userId } = await auth()

    const pago = await prisma.pago.findUnique({
        where: { id: pagoId },
        select: { pedidoId: true }
    })

    if (!pago) {
        throw new Error('Pago no encontrado')
    }

    await prisma.disputa.create({
        data: {
            clerkUserId: userId!,
            pagoId,
            pedidoId: pago.pedidoId,
            fechaDeInicio: new Date(),
            descripcion,
            estado: 'pendiente',
        },
    })
    revalidatePath('/buyer/disputes')
}


export async function resolveDispute(disputeId: string, newState: DisputeStatus) {
    if (newState === 'pendiente') {
        throw new Error('El estado no puede ser pendiente al resolver.')
    }

    await prisma.disputa.update({
        where: { id: disputeId },
        data: {
            estado: newState,
            fechaDeFinalizacion: new Date(),
        },
    })
    
    revalidatePath('/seller/disputes')
}