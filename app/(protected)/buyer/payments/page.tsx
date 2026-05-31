import { auth } from '@clerk/nextjs/server'
import { fetchPaymentsForBuyer, fetchPendingPaymentsCount } from '@/lib/query/buyer'
import { PaymentsView } from '@/components/buyer/payments-view'
import { ITEMS_PER_PAGE } from '@/lib/constants'


export default async function BuyerPaymentsPage({
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
    
    const [{ payments, total }, totalPending] = await Promise.all([
        fetchPaymentsForBuyer(userId!, offset, ITEMS_PER_PAGE, tab),
        fetchPendingPaymentsCount(userId!)
    ])

    return (
        <PaymentsView 
            initialPagos={payments} 
            total={total}
            offset={offset}
            limit={ITEMS_PER_PAGE}
            tab={tab}
            totalPendingGlobal={totalPending}
        />
    )
}