import { auth } from '@clerk/nextjs/server'
import { fetchSellerDashboardSummary } from '@/lib/query/seller'
import { Notification } from '@/components/ui/notification'


export async function AlertsSection() {
    const { userId } = await auth()
    const resumen = await fetchSellerDashboardSummary(userId!)

    if (resumen.activeDisputes === 0) return null

    return (
        <div className="space-y-2">
            <Notification variant="warning">
                {`Tenés ${resumen.activeDisputes} disputa${resumen.activeDisputes > 1 ? 's' : ''} sin resolver.`}
            </Notification>
        </div>
    )
}