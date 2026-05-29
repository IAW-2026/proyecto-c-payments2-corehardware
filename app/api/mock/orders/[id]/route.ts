import { NextRequest, NextResponse } from 'next/server'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
    return NextResponse.json({
        id: params.id,
        fecha: '2025-05-22',
        comprador_id: 1,
        vendedor_id: 1,
        productos: ['prod_01', 'prod_02'],
        monto: '95800.00',
        estado: 'pendiente',
        envio_id: null,
    })
}