import { auth } from '@clerk/nextjs/server'
import { fetchDisputesForBuyer, fetchDisputablePayments, fetchActiveDisputesCount } from '@/lib/query/buyer'
import { DisputesView } from '@/components/buyer/disputes-view'
import { ITEMS_PER_PAGE } from '@/lib/constants'


export default async function BuyerDisputesPage({
    searchParams,
}: {
    searchParams: Promise<{ tab?: string; offset?: string }>
}) {
    const { userId } = await auth()
    const params = await searchParams

    const tab = params.tab === 'resueltas' ? 'resueltas' : 'activas'
    const offset = Math.max(0, parseInt(params.offset ?? '0', 10))

    const [{ disputes, total, amounts }, pagosDisputables, totalActivas] = await Promise.all([
        fetchDisputesForBuyer(userId!, offset, ITEMS_PER_PAGE, tab),
        fetchDisputablePayments(userId!),
        fetchActiveDisputesCount(userId!)
    ])

    return (
        <DisputesView 
            disputes={disputes} 
            amounts={amounts} 
            disputablePayments={pagosDisputables}
            total={total}
            offset={offset}
            limit={ITEMS_PER_PAGE}
            tab={tab}
            totalActivas={totalActivas}
        />
    )
}