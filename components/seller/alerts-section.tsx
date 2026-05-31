import { auth } from '@clerk/nextjs/server'
import { getSellerDashboardSummary } from '@/lib/query/seller'
import { Notification } from '@/components/ui/notification'


export async function SellerAlertsSection() {
    const { userId } = await auth()
    const resumen = await getSellerDashboardSummary(userId!)

    if (resumen.disputasActivas === 0) return null

    return (
        <div className="space-y-2">
            <Notification variant="warning">
                {`Tenés ${resumen.disputasActivas} disputa${resumen.disputasActivas > 1 ? 's' : ''} sin resolver.`}
            </Notification>
        </div>
    )
}