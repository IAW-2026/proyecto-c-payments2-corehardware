'use server'

import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createDisputa(pagoId: string, descripcion: string) {
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