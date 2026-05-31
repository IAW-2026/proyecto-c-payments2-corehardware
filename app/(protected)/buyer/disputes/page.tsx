import { auth } from '@clerk/nextjs/server'
import { getDisputasBuyer, getPagosDisputables, getCountDisputasActivas } from '@/lib/query'
import { DisputesView } from '@/components/buyer/disputes-view'
import { ITEMS_PER_PAGE } from '@/lib/constants'

export default async function DisputesPage({
    searchParams,
}: {
    searchParams: Promise<{ tab?: string; offset?: string }>
}) {
    const { userId } = await auth()
    const params = await searchParams

    const tab = params.tab === 'resueltas' ? 'resueltas' : 'activas'
    const offset = Math.max(0, parseInt(params.offset ?? '0', 10))

    const [{ disputas, total, montos }, pagosDisputables, totalActivas] = await Promise.all([
        getDisputasBuyer(userId!, offset, ITEMS_PER_PAGE, tab),
        getPagosDisputables(userId!),
        getCountDisputasActivas(userId!)
    ])

    return (
        <DisputesView 
            disputas={disputas} 
            montos={montos} 
            pagosDisputables={pagosDisputables}
            total={total}
            offset={offset}
            limit={ITEMS_PER_PAGE}
            tab={tab}
            totalActivas={totalActivas}
        />
    )
}