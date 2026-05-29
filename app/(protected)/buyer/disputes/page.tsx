import { auth } from '@clerk/nextjs/server'
import { getDisputasBuyer, getPagosDisputables } from '@/lib/query'
import { DisputesView } from '@/components/buyer/disputes-view'

export default async function DisputesPage() {
    const { userId } = await auth()

    const [{ disputas, montos }, pagosDisputables] = await Promise.all([
        getDisputasBuyer(userId!),
        getPagosDisputables(userId!),
    ])

    return <DisputesView disputas={disputas} montos={montos} pagosDisputables={pagosDisputables} />
}