'use server'

import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createDisputa(pagoId: string, descripcion: string) {
    const { userId } = await auth()
    await prisma.disputa.create({
        data: {
            clerkUserId: userId!,
            pagoId,
            fechaDeInicio: new Date(),
            descripcion,
            estado: 'pendiente',
        },
    })
    revalidatePath('/buyer/disputes')
}