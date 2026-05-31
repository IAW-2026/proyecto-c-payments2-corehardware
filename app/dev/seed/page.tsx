import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'


const BUYERS = {
    buyer1: 'user_3EAcu0oi7IdFgIhhIqNFO7bxmM2',
    buyer2: 'user_3EPiqm1dQiYgSxU3wI5SspkHOpy',
}

const SELLERS = {
    seller1: 'user_3EAcoW6AOEJ5BIIlOLh3aQYty3u',
    seller2: 'user_3EPivAYys776DSPXS1hM2lT3zw5',
}

async function seed() {
    'use server'

    await prisma.disputa.deleteMany()
    await prisma.pago.deleteMany()

    const pagos = await prisma.pago.createManyAndReturn({
        data: [
            {
                buyerClerkUserId: BUYERS.buyer1,
                sellerClerkUserId: SELLERS.seller1,
                formaDePago: 'tarjeta_credito',
                estado: 'pendiente',
                pedidoId: 'order_001',
                fecha: new Date('2026-04-17'),
                descripcion: 'Pedido order_001',
                monto: 350.00,
            },
            {
                buyerClerkUserId: BUYERS.buyer1,
                sellerClerkUserId: SELLERS.seller1,
                formaDePago: 'transferencia',
                estado: 'acreditado',
                pedidoId: 'order_002',
                fecha: new Date('2026-04-21'),
                descripcion: 'Pedido order_002',
                monto: 780.50,
            },
            {
                buyerClerkUserId: BUYERS.buyer1,
                sellerClerkUserId: SELLERS.seller2,
                formaDePago: 'tarjeta_debito',
                estado: 'rechazado',
                pedidoId: 'order_003',
                fecha: new Date('2026-04-25'),
                descripcion: 'Pedido order_003',
                monto: 210.00,
            },
            {
                buyerClerkUserId: BUYERS.buyer2,
                sellerClerkUserId: SELLERS.seller1,
                formaDePago: 'tarjeta_credito',
                estado: 'pendiente',
                pedidoId: 'order_004',
                fecha: new Date('2026-04-28'),
                descripcion: 'Pedido order_004',
                monto: 640.75,
            },
            {
                buyerClerkUserId: BUYERS.buyer2,
                sellerClerkUserId: SELLERS.seller2,
                formaDePago: 'transferencia',
                estado: 'acreditado',
                pedidoId: 'order_005',
                fecha: new Date('2026-05-03'),
                descripcion: 'Pedido order_005',
                monto: 480.00,
            },
            {
                buyerClerkUserId: BUYERS.buyer2,
                sellerClerkUserId: SELLERS.seller2,
                formaDePago: 'tarjeta_credito',
                estado: 'acreditado',
                pedidoId: 'order_006',
                fecha: new Date('2026-05-10'),
                descripcion: 'Pedido order_006',
                monto: 920.25,
            },
            {
                buyerClerkUserId: BUYERS.buyer1,
                sellerClerkUserId: SELLERS.seller1,
                formaDePago: 'transferencia',
                estado: 'pendiente',
                pedidoId: 'order_007',
                fecha: new Date('2026-05-18'),
                descripcion: 'Pedido order_007',
                monto: 175.00,
            },
            {
                buyerClerkUserId: BUYERS.buyer2,
                sellerClerkUserId: SELLERS.seller1,
                formaDePago: 'tarjeta_credito',
                estado: 'acreditado',
                pedidoId: 'order_008',
                fecha: new Date('2026-05-26'),
                descripcion: 'Pedido order_008',
                monto: 830.00,
            },
        ],
    })

    const pagoOrder002 = pagos.find(p => p.pedidoId === 'order_002')!
    const pagoOrder004 = pagos.find(p => p.pedidoId === 'order_004')!
    const pagoOrder005 = pagos.find(p => p.pedidoId === 'order_005')!

    await prisma.disputa.createMany({
        data: [
            {
                clerkUserId: BUYERS.buyer1,
                pedidoId: 'order_002',
                pagoId: pagoOrder002.id,
                fechaDeInicio: new Date('2026-04-23'),
                fechaDeFinalizacion: new Date('2026-04-27'),
                estado: 'reembolsada',
                descripcion: 'Producto no recibido',
            },
            {
                clerkUserId: BUYERS.buyer2,
                pedidoId: 'order_005',
                pagoId: pagoOrder005.id,
                fechaDeInicio: new Date('2026-05-05'),
                estado: 'pendiente',
                descripcion: 'Monto incorrecto cobrado',
            },
            {
                clerkUserId: BUYERS.buyer2,
                pedidoId: 'order_004',
                pagoId: pagoOrder004.id,
                fechaDeInicio: new Date('2026-05-01'),
                estado: 'pendiente',
                descripcion: 'Producto dañado al llegar',
            },
        ],
    })

    revalidatePath('/', 'layout')
}

async function purgarCredenciales() {
    'use server'
    await prisma.credencialVendedor.deleteMany()
    revalidatePath('/', 'layout')
}


export default function SeedPage() {
    return (
        <div className="max-w-xl mx-auto py-16 px-6 space-y-6">
            <div>
                <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">Dev Seed</h1>
                <p className="text-sm text-neutral-500 mt-0.5">Purga la base de datos e inserta datos de testing.</p>
            </div>
            <div className="flex gap-3">
                <form action={seed}>
                    <button type="submit" className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-sm font-medium rounded-lg transition-colors">
                        Purgar e insertar
                    </button>
                </form>
                <form action={purgarCredenciales}>
                    <button type="submit" className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-medium rounded-lg transition-colors">
                        Purgar credenciales
                    </button>
                </form>
            </div>
        </div>
    )
}