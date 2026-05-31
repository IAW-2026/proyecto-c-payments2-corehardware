import { auth } from '@clerk/nextjs/server'
import { getPagos, getCountPendientes } from '@/lib/query'
import { PaymentsView } from '@/components/buyer/payments-view'
import { ITEMS_PER_PAGE } from '@/lib/constants'

export default async function PaymentsPage({
    searchParams,
}: {
    searchParams: Promise<{
        tab?: string
        offset?: string
    }>
}) {
    const { userId } = await auth()
    const params = await searchParams

    const tab = params.tab === 'realizados' ? 'realizados' : 'pendientes'
    const offset = Math.max(0, parseInt(params.offset ?? '0', 10))
    
    // Desestructuramos { pagos, total } directamente de la respuesta
    const [{ pagos, total }, totalPendientes] = await Promise.all([
        getPagos(userId!, offset, ITEMS_PER_PAGE, tab),
        getCountPendientes(userId!)
    ])

    // Pasamos todas las propiedades necesarias al componente de cliente
    return (
        <PaymentsView 
            initialPagos={pagos} 
            total={total}
            offset={offset}
            limit={ITEMS_PER_PAGE}
            tab={tab}
            totalPendientesAbsoluto={totalPendientes}
        />
    )
}