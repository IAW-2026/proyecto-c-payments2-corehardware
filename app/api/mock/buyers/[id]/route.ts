import { NextRequest, NextResponse } from 'next/server'

const buyers: Record<string, {
    id: string
    dni: number
    cuil_cuit: string
    apellido: string
    nombre: string
    direccion: string
    mail: string
    celular: string
    condicion_iva: string
}> = {
    'user_3EAcu0oi7IdFgIhhIqNFO7bxmM2': {
        id: 'user_3EAcu0oi7IdFgIhhIqNFO7bxmM2',
        dni: 12345678,
        cuil_cuit: '20-12345678-9',
        apellido: 'García',
        nombre: 'Juan',
        direccion: 'Av. Corrientes 1234, CABA',
        mail: 'buyer1+clerk_test@example.com',
        celular: '+54 11 1234-5678',
        condicion_iva: 'Consumidor Final',
    },
    'user_3EPiqm1dQiYgSxU3wI5SspkHOpy': {
        id: 'user_3EPiqm1dQiYgSxU3wI5SspkHOpy',
        dni: 87654321,
        cuil_cuit: '27-87654321-4',
        apellido: 'López',
        nombre: 'María',
        direccion: 'San Martín 567, Rosario',
        mail: 'buyer2+clerk_test@example.com',
        celular: '+54 341 987-6543',
        condicion_iva: 'Monotributista',
    },
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
    const buyer = buyers[params.id]
    if (!buyer) return NextResponse.json({ message: 'Comprador no encontrado' }, { status: 404 })
    return NextResponse.json(buyer)
}