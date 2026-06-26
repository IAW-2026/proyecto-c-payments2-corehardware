import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'


// ── Cuentas EXISTENTES ────────────────────────────────────────────────────────
const BUYERS = {
    buyer1: { clerkId: 'user_3FKfOSysGCxZhOAaOY4FhmKeTE4', id: 'cmqkcwvhu0000h0tvzxrv201u' },
    // Inventadas
    buyer2: { clerkId: 'user_8PQmNRdLvJtXaB2cWsYz9KhFgE5', id: 'cmr1ax9bk0001h2qqzlmvp3xt' },
    buyer3: { clerkId: 'user_5VHnCdKpMwEfGj7rTsOu4AbYiX1', id: 'cmr1ax9bk0002h2qqzlmvp3xu' },
}

const SELLERS = {
    seller1: { clerkId: 'user_3FKejpiVCZOvNA8H8yODqd2Dge2', id: 'cmqkc8b1r000084wvh0lvibw3' },
    // Inventadas
    seller2: { clerkId: 'user_7ZTwBsNqLxPmYc3dUeVk6FjRoA8', id: 'cmr1ax9bk0003h2qqzlmvp3xv' },
    seller3: { clerkId: 'user_2GEpRhCvDnFkJt8yMsXb5WiOuQ9', id: 'cmr1ax9bk0004h2qqzlmvp3xw' },
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function daysAgo(n: number) {
    const d = new Date()
    d.setDate(d.getDate() - n)
    return d
}

async function seed() {
    'use server'

    await prisma.disputa.deleteMany()
    await prisma.pago.deleteMany()

    // ── PAGOS ─────────────────────────────────────────────────────────────────
    const pagos = await prisma.pago.createManyAndReturn({
        data: [
            // ── buyer1 / seller1 (cuentas reales) ────────────────────────────
            {
                buyerId: BUYERS.buyer1.id,
                sellerId: SELLERS.seller1.id,
                buyerClerkUserId: BUYERS.buyer1.clerkId,
                sellerClerkUserId: SELLERS.seller1.clerkId,
                formaDePago: 'tarjeta_credito',
                estado: 'acreditado',
                pedidoId: 'cmr2pa0001abcdefgh00000001',
                fecha: daysAgo(90),
                descripcion: 'Pago por el pedido cmr2pa0001abcdefgh00000001',
                monto: 350.00,
            },
            {
                buyerId: BUYERS.buyer1.id,
                sellerId: SELLERS.seller1.id,
                buyerClerkUserId: BUYERS.buyer1.clerkId,
                sellerClerkUserId: SELLERS.seller1.clerkId,
                formaDePago: 'transferencia',
                estado: 'acreditado',
                pedidoId: 'cmr2pa0002abcdefgh00000002',
                fecha: daysAgo(87),
                descripcion: 'Pago por el pedido cmr2pa0002abcdefgh00000002',
                monto: 780.50,
            },
            {
                buyerId: BUYERS.buyer1.id,
                sellerId: SELLERS.seller1.id,
                buyerClerkUserId: BUYERS.buyer1.clerkId,
                sellerClerkUserId: SELLERS.seller1.clerkId,
                formaDePago: 'tarjeta_debito',
                estado: 'rechazado',
                pedidoId: 'cmr2pa0003abcdefgh00000003',
                fecha: daysAgo(83),
                descripcion: 'Pago por el pedido cmr2pa0003abcdefgh00000003',
                monto: 210.00,
            },
            {
                buyerId: BUYERS.buyer1.id,
                sellerId: SELLERS.seller1.id,
                buyerClerkUserId: BUYERS.buyer1.clerkId,
                sellerClerkUserId: SELLERS.seller1.clerkId,
                formaDePago: 'tarjeta_credito',
                estado: 'pendiente',
                pedidoId: 'cmr2pa0004abcdefgh00000004',
                fecha: daysAgo(79),
                descripcion: 'Pago por el pedido cmr2pa0004abcdefgh00000004',
                monto: 640.75,
            },
            {
                buyerId: BUYERS.buyer1.id,
                sellerId: SELLERS.seller1.id,
                buyerClerkUserId: BUYERS.buyer1.clerkId,
                sellerClerkUserId: SELLERS.seller1.clerkId,
                formaDePago: 'transferencia',
                estado: 'acreditado',
                pedidoId: 'cmr2pa0005abcdefgh00000005',
                fecha: daysAgo(75),
                descripcion: 'Pago por el pedido cmr2pa0005abcdefgh00000005',
                monto: 480.00,
            },
            {
                buyerId: BUYERS.buyer1.id,
                sellerId: SELLERS.seller1.id,
                buyerClerkUserId: BUYERS.buyer1.clerkId,
                sellerClerkUserId: SELLERS.seller1.clerkId,
                formaDePago: 'tarjeta_credito',
                estado: 'acreditado',
                pedidoId: 'cmr2pa0006abcdefgh00000006',
                fecha: daysAgo(70),
                descripcion: 'Pago por el pedido cmr2pa0006abcdefgh00000006',
                monto: 920.25,
            },
            {
                buyerId: BUYERS.buyer1.id,
                sellerId: SELLERS.seller1.id,
                buyerClerkUserId: BUYERS.buyer1.clerkId,
                sellerClerkUserId: SELLERS.seller1.clerkId,
                formaDePago: 'transferencia',
                estado: 'pendiente',
                pedidoId: 'cmr2pa0007abcdefgh00000007',
                fecha: daysAgo(65),
                descripcion: 'Pago por el pedido cmr2pa0007abcdefgh00000007',
                monto: 175.00,
            },
            {
                buyerId: BUYERS.buyer1.id,
                sellerId: SELLERS.seller1.id,
                buyerClerkUserId: BUYERS.buyer1.clerkId,
                sellerClerkUserId: SELLERS.seller1.clerkId,
                formaDePago: 'tarjeta_credito',
                estado: 'acreditado',
                pedidoId: 'cmr2pa0008abcdefgh00000008',
                fecha: daysAgo(58),
                descripcion: 'Pago por el pedido cmr2pa0008abcdefgh00000008',
                monto: 830.00,
            },
            {
                buyerId: BUYERS.buyer1.id,
                sellerId: SELLERS.seller1.id,
                buyerClerkUserId: BUYERS.buyer1.clerkId,
                sellerClerkUserId: SELLERS.seller1.clerkId,
                formaDePago: 'tarjeta_credito',
                estado: 'acreditado',
                pedidoId: 'cmr2pa0009abcdefgh00000009',
                fecha: daysAgo(50),
                descripcion: 'Pago por el pedido cmr2pa0009abcdefgh00000009',
                monto: 270.00,
            },

            // ── buyer2 / seller1 (buyer inventado, seller real) ───────────────
            {
                buyerId: BUYERS.buyer2.id,
                sellerId: SELLERS.seller1.id,
                buyerClerkUserId: BUYERS.buyer2.clerkId,
                sellerClerkUserId: SELLERS.seller1.clerkId,
                formaDePago: 'tarjeta_credito',
                estado: 'acreditado',
                pedidoId: 'cmr2pa0010abcdefgh00000010',
                fecha: daysAgo(88),
                descripcion: 'Pago por el pedido cmr2pa0010abcdefgh00000010',
                monto: 1200.00,
            },
            {
                buyerId: BUYERS.buyer2.id,
                sellerId: SELLERS.seller1.id,
                buyerClerkUserId: BUYERS.buyer2.clerkId,
                sellerClerkUserId: SELLERS.seller1.clerkId,
                formaDePago: 'transferencia',
                estado: 'rechazado',
                pedidoId: 'cmr2pa0011abcdefgh00000011',
                fecha: daysAgo(82),
                descripcion: 'Pago por el pedido cmr2pa0011abcdefgh00000011',
                monto: 540.00,
            },
            {
                buyerId: BUYERS.buyer2.id,
                sellerId: SELLERS.seller1.id,
                buyerClerkUserId: BUYERS.buyer2.clerkId,
                sellerClerkUserId: SELLERS.seller1.clerkId,
                formaDePago: 'tarjeta_debito',
                estado: 'acreditado',
                pedidoId: 'cmr2pa0012abcdefgh00000012',
                fecha: daysAgo(74),
                descripcion: 'Pago por el pedido cmr2pa0012abcdefgh00000012',
                monto: 3200.50,
            },
            {
                buyerId: BUYERS.buyer2.id,
                sellerId: SELLERS.seller1.id,
                buyerClerkUserId: BUYERS.buyer2.clerkId,
                sellerClerkUserId: SELLERS.seller1.clerkId,
                formaDePago: 'tarjeta_credito',
                estado: 'pendiente',
                pedidoId: 'cmr2pa0013abcdefgh00000013',
                fecha: daysAgo(60),
                descripcion: 'Pago por el pedido cmr2pa0013abcdefgh00000013',
                monto: 2780.00,
            },
            {
                buyerId: BUYERS.buyer2.id,
                sellerId: SELLERS.seller1.id,
                buyerClerkUserId: BUYERS.buyer2.clerkId,
                sellerClerkUserId: SELLERS.seller1.clerkId,
                formaDePago: 'transferencia',
                estado: 'acreditado',
                pedidoId: 'cmr2pa0014abcdefgh00000014',
                fecha: daysAgo(45),
                descripcion: 'Pago por el pedido cmr2pa0014abcdefgh00000014',
                monto: 390.00,
            },
            {
                buyerId: BUYERS.buyer2.id,
                sellerId: SELLERS.seller1.id,
                buyerClerkUserId: BUYERS.buyer2.clerkId,
                sellerClerkUserId: SELLERS.seller1.clerkId,
                formaDePago: 'tarjeta_credito',
                estado: 'acreditado',
                pedidoId: 'cmr2pa0015abcdefgh00000015',
                fecha: daysAgo(30),
                descripcion: 'Pago por el pedido cmr2pa0015abcdefgh00000015',
                monto: 155.00,
            },

            // ── buyer1 / seller2 (seller inventado) ──────────────────────────
            {
                buyerId: BUYERS.buyer1.id,
                sellerId: SELLERS.seller2.id,
                buyerClerkUserId: BUYERS.buyer1.clerkId,
                sellerClerkUserId: SELLERS.seller2.clerkId,
                formaDePago: 'tarjeta_credito',
                estado: 'acreditado',
                pedidoId: 'cmr2pa0016abcdefgh00000016',
                fecha: daysAgo(85),
                descripcion: 'Pago por el pedido cmr2pa0016abcdefgh00000016',
                monto: 4500.00,
            },
            {
                buyerId: BUYERS.buyer1.id,
                sellerId: SELLERS.seller2.id,
                buyerClerkUserId: BUYERS.buyer1.clerkId,
                sellerClerkUserId: SELLERS.seller2.clerkId,
                formaDePago: 'transferencia',
                estado: 'acreditado',
                pedidoId: 'cmr2pa0017abcdefgh00000017',
                fecha: daysAgo(78),
                descripcion: 'Pago por el pedido cmr2pa0017abcdefgh00000017',
                monto: 620.00,
            },
            {
                buyerId: BUYERS.buyer1.id,
                sellerId: SELLERS.seller2.id,
                buyerClerkUserId: BUYERS.buyer1.clerkId,
                sellerClerkUserId: SELLERS.seller2.clerkId,
                formaDePago: 'tarjeta_debito',
                estado: 'rechazado',
                pedidoId: 'cmr2pa0018abcdefgh00000018',
                fecha: daysAgo(68),
                descripcion: 'Pago por el pedido cmr2pa0018abcdefgh00000018',
                monto: 310.00,
            },
            {
                buyerId: BUYERS.buyer1.id,
                sellerId: SELLERS.seller2.id,
                buyerClerkUserId: BUYERS.buyer1.clerkId,
                sellerClerkUserId: SELLERS.seller2.clerkId,
                formaDePago: 'tarjeta_credito',
                estado: 'pendiente',
                pedidoId: 'cmr2pa0019abcdefgh00000019',
                fecha: daysAgo(40),
                descripcion: 'Pago por el pedido cmr2pa0019abcdefgh00000019',
                monto: 185.00,
            },

            // ── buyer3 / seller2 (ambos inventados) ──────────────────────────
            {
                buyerId: BUYERS.buyer3.id,
                sellerId: SELLERS.seller2.id,
                buyerClerkUserId: BUYERS.buyer3.clerkId,
                sellerClerkUserId: SELLERS.seller2.clerkId,
                formaDePago: 'transferencia',
                estado: 'acreditado',
                pedidoId: 'cmr2pa0020abcdefgh00000020',
                fecha: daysAgo(89),
                descripcion: 'Pago por el pedido cmr2pa0020abcdefgh00000020',
                monto: 18500.00,
            },
            {
                buyerId: BUYERS.buyer3.id,
                sellerId: SELLERS.seller2.id,
                buyerClerkUserId: BUYERS.buyer3.clerkId,
                sellerClerkUserId: SELLERS.seller2.clerkId,
                formaDePago: 'tarjeta_credito',
                estado: 'acreditado',
                pedidoId: 'cmr2pa0021abcdefgh00000021',
                fecha: daysAgo(80),
                descripcion: 'Pago por el pedido cmr2pa0021abcdefgh00000021',
                monto: 760.00,
            },
            {
                buyerId: BUYERS.buyer3.id,
                sellerId: SELLERS.seller2.id,
                buyerClerkUserId: BUYERS.buyer3.clerkId,
                sellerClerkUserId: SELLERS.seller2.clerkId,
                formaDePago: 'tarjeta_debito',
                estado: 'pendiente',
                pedidoId: 'cmr2pa0022abcdefgh00000022',
                fecha: daysAgo(66),
                descripcion: 'Pago por el pedido cmr2pa0022abcdefgh00000022',
                monto: 410.00,
            },
            {
                buyerId: BUYERS.buyer3.id,
                sellerId: SELLERS.seller2.id,
                buyerClerkUserId: BUYERS.buyer3.clerkId,
                sellerClerkUserId: SELLERS.seller2.clerkId,
                formaDePago: 'transferencia',
                estado: 'acreditado',
                pedidoId: 'cmr2pa0023abcdefgh00000023',
                fecha: daysAgo(52),
                descripcion: 'Pago por el pedido cmr2pa0023abcdefgh00000023',
                monto: 220.00,
            },

            // ── buyer3 / seller3 (ambos inventados) ──────────────────────────
            {
                buyerId: BUYERS.buyer3.id,
                sellerId: SELLERS.seller3.id,
                buyerClerkUserId: BUYERS.buyer3.clerkId,
                sellerClerkUserId: SELLERS.seller3.clerkId,
                formaDePago: 'tarjeta_credito',
                estado: 'acreditado',
                pedidoId: 'cmr2pa0024abcdefgh00000024',
                fecha: daysAgo(86),
                descripcion: 'Pago por el pedido cmr2pa0024abcdefgh00000024',
                monto: 870.00,
            },
            {
                buyerId: BUYERS.buyer3.id,
                sellerId: SELLERS.seller3.id,
                buyerClerkUserId: BUYERS.buyer3.clerkId,
                sellerClerkUserId: SELLERS.seller3.clerkId,
                formaDePago: 'transferencia',
                estado: 'rechazado',
                pedidoId: 'cmr2pa0025abcdefgh00000025',
                fecha: daysAgo(77),
                descripcion: 'Pago por el pedido cmr2pa0025abcdefgh00000025',
                monto: 450.00,
            },
            {
                buyerId: BUYERS.buyer3.id,
                sellerId: SELLERS.seller3.id,
                buyerClerkUserId: BUYERS.buyer3.clerkId,
                sellerClerkUserId: SELLERS.seller3.clerkId,
                formaDePago: 'tarjeta_debito',
                estado: 'acreditado',
                pedidoId: 'cmr2pa0026abcdefgh00000026',
                fecha: daysAgo(62),
                descripcion: 'Pago por el pedido cmr2pa0026abcdefgh00000026',
                monto: 1350.00,
            },
            {
                buyerId: BUYERS.buyer3.id,
                sellerId: SELLERS.seller3.id,
                buyerClerkUserId: BUYERS.buyer3.clerkId,
                sellerClerkUserId: SELLERS.seller3.clerkId,
                formaDePago: 'tarjeta_credito',
                estado: 'pendiente',
                pedidoId: 'cmr2pa0027abcdefgh00000027',
                fecha: daysAgo(35),
                descripcion: 'Pago por el pedido cmr2pa0027abcdefgh00000027',
                monto: 980.00,
            },

            // ── buyer2 / seller3 (ambos inventados) ──────────────────────────
            {
                buyerId: BUYERS.buyer2.id,
                sellerId: SELLERS.seller3.id,
                buyerClerkUserId: BUYERS.buyer2.clerkId,
                sellerClerkUserId: SELLERS.seller3.clerkId,
                formaDePago: 'tarjeta_credito',
                estado: 'acreditado',
                pedidoId: 'cmr2pa0028abcdefgh00000028',
                fecha: daysAgo(84),
                descripcion: 'Pago por el pedido cmr2pa0028abcdefgh00000028',
                monto: 1100.00,
            },
            {
                buyerId: BUYERS.buyer2.id,
                sellerId: SELLERS.seller3.id,
                buyerClerkUserId: BUYERS.buyer2.clerkId,
                sellerClerkUserId: SELLERS.seller3.clerkId,
                formaDePago: 'transferencia',
                estado: 'acreditado',
                pedidoId: 'cmr2pa0029abcdefgh00000029',
                fecha: daysAgo(72),
                descripcion: 'Pago por el pedido cmr2pa0029abcdefgh00000029',
                monto: 2300.00,
            },
            {
                buyerId: BUYERS.buyer2.id,
                sellerId: SELLERS.seller3.id,
                buyerClerkUserId: BUYERS.buyer2.clerkId,
                sellerClerkUserId: SELLERS.seller3.clerkId,
                formaDePago: 'tarjeta_debito',
                estado: 'pendiente',
                pedidoId: 'cmr2pa0030abcdefgh00000030',
                fecha: daysAgo(55),
                descripcion: 'Pago por el pedido cmr2pa0030abcdefgh00000030',
                monto: 890.00,
            },
            {
                buyerId: BUYERS.buyer2.id,
                sellerId: SELLERS.seller3.id,
                buyerClerkUserId: BUYERS.buyer2.clerkId,
                sellerClerkUserId: SELLERS.seller3.clerkId,
                formaDePago: 'tarjeta_credito',
                estado: 'acreditado',
                pedidoId: 'cmr2pa0031abcdefgh00000031',
                fecha: daysAgo(20),
                descripcion: 'Pago por el pedido cmr2pa0031abcdefgh00000031',
                monto: 3150.00,
            },
            {
                buyerId: BUYERS.buyer2.id,
                sellerId: SELLERS.seller3.id,
                buyerClerkUserId: BUYERS.buyer2.clerkId,
                sellerClerkUserId: SELLERS.seller3.clerkId,
                formaDePago: 'transferencia',
                estado: 'acreditado',
                pedidoId: 'cmr2pa0032abcdefgh00000032',
                fecha: daysAgo(8),
                descripcion: 'Pago por el pedido cmr2pa0032abcdefgh00000032',
                monto: 560.00,
            },
            {
                buyerId: BUYERS.buyer1.id,
                sellerId: SELLERS.seller3.id,
                buyerClerkUserId: BUYERS.buyer1.clerkId,
                sellerClerkUserId: SELLERS.seller3.clerkId,
                formaDePago: 'tarjeta_credito',
                estado: 'acreditado',
                pedidoId: 'cmr2pa0033abcdefgh00000033',
                fecha: daysAgo(15),
                descripcion: 'Pago por el pedido cmr2pa0033abcdefgh00000033',
                monto: 4200.00,
            },
            {
                buyerId: BUYERS.buyer1.id,
                sellerId: SELLERS.seller3.id,
                buyerClerkUserId: BUYERS.buyer1.clerkId,
                sellerClerkUserId: SELLERS.seller3.clerkId,
                formaDePago: 'transferencia',
                estado: 'rechazado',
                pedidoId: 'cmr2pa0034abcdefgh00000034',
                fecha: daysAgo(5),
                descripcion: 'Pago por el pedido cmr2pa0034abcdefgh00000034',
                monto: 1780.00,
            },
        ],
    })

    // ── DISPUTAS ──────────────────────────────────────────────────────────────
    // Solo sobre pagos acreditado o pendiente, nunca rechazado.
    const find = (pedidoId: string) => pagos.find(p => p.pedidoId === pedidoId)!

    await prisma.disputa.createMany({
        data: [
            {
                clerkUserId: BUYERS.buyer1.clerkId,
                pedidoId: 'cmr2pa0001abcdefgh00000001',
                pagoId: find('cmr2pa0001abcdefgh00000001').id,
                fechaDeInicio: daysAgo(85),
                fechaDeFinalizacion: daysAgo(78),
                estado: 'reembolsada',
                descripcion: 'El producto nunca fue entregado.',
            },
            {
                clerkUserId: BUYERS.buyer1.clerkId,
                pedidoId: 'cmr2pa0005abcdefgh00000005',
                pagoId: find('cmr2pa0005abcdefgh00000005').id,
                fechaDeInicio: daysAgo(70),
                fechaDeFinalizacion: daysAgo(62),
                estado: 'rechazada',
                descripcion: 'El producto llegó dañado.',
            },
            {
                clerkUserId: BUYERS.buyer2.clerkId,
                pedidoId: 'cmr2pa0010abcdefgh00000010',
                pagoId: find('cmr2pa0010abcdefgh00000010').id,
                fechaDeInicio: daysAgo(83),
                fechaDeFinalizacion: daysAgo(74),
                estado: 'reembolsada',
                descripcion: 'El producto recibido no corresponde al publicado en el pedido.',
            },
            {
                clerkUserId: BUYERS.buyer2.clerkId,
                pedidoId: 'cmr2pa0012abcdefgh00000012',
                pagoId: find('cmr2pa0012abcdefgh00000012').id,
                fechaDeInicio: daysAgo(70),
                fechaDeFinalizacion: daysAgo(61),
                estado: 'reembolsada',
                descripcion: 'El producto llegó dañado, acordé la devolución con el vendedor.',
            },
            {
                clerkUserId: BUYERS.buyer2.clerkId,
                pedidoId: 'cmr2pa0013abcdefgh00000013',
                pagoId: find('cmr2pa0013abcdefgh00000013').id,
                fechaDeInicio: daysAgo(57),
                estado: 'pendiente',
                descripcion: 'El producto nunca fue entregado.',
            },
            {
                clerkUserId: BUYERS.buyer1.clerkId,
                pedidoId: 'cmr2pa0016abcdefgh00000016',
                pagoId: find('cmr2pa0016abcdefgh00000016').id,
                fechaDeInicio: daysAgo(80),
                fechaDeFinalizacion: daysAgo(70),
                estado: 'reembolsada',
                descripcion: 'El producto llegó con daños visibles y no funciona.',
            },
            {
                clerkUserId: BUYERS.buyer3.clerkId,
                pedidoId: 'cmr2pa0021abcdefgh00000021',
                pagoId: find('cmr2pa0021abcdefgh00000021').id,
                fechaDeInicio: daysAgo(76),
                estado: 'pendiente',
                descripcion: 'El producto recibido no corresponde al publicado en el pedido.',
            },
            {
                clerkUserId: BUYERS.buyer3.clerkId,
                pedidoId: 'cmr2pa0026abcdefgh00000026',
                pagoId: find('cmr2pa0026abcdefgh00000026').id,
                fechaDeInicio: daysAgo(58),
                fechaDeFinalizacion: daysAgo(48),
                estado: 'reembolsada',
                descripcion: 'El producto llegó dañado, acordé la devolución con el vendedor.',
            },
            {
                clerkUserId: BUYERS.buyer2.clerkId,
                pedidoId: 'cmr2pa0029abcdefgh00000029',
                pagoId: find('cmr2pa0029abcdefgh00000029').id,
                fechaDeInicio: daysAgo(68),
                fechaDeFinalizacion: daysAgo(60),
                estado: 'rechazada',
                descripcion: 'El producto nunca fue entregado.',
            },
            {
                clerkUserId: BUYERS.buyer1.clerkId,
                pedidoId: 'cmr2pa0033abcdefgh00000033',
                pagoId: find('cmr2pa0033abcdefgh00000033').id,
                fechaDeInicio: daysAgo(12),
                estado: 'pendiente',
                descripcion: 'El producto recibido no corresponde al publicado en el pedido.',
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