import { auth } from '@clerk/nextjs/server'
import { CreditCard, MessageSquareWarning, TrendingUp } from 'lucide-react'
import { fetchSellerDashboardSummary } from '@/lib/query/seller'
import { SummaryCard } from '@/components/ui/summary-card'
import { formatAmount } from '@/lib/formatters'


export async function SummarySection() {
    const { userId } = await auth()
    const resumen = await fetchSellerDashboardSummary(userId!)

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <SummaryCard
                icon={CreditCard}
                label="Acreditaciones pendientes"
                value={`${resumen.pendingAccreditations.quantity} · ${formatAmount(resumen.pendingAccreditations.amount)}`}
                accent={resumen.pendingAccreditations.quantity > 0}
            />
            <SummaryCard
                icon={MessageSquareWarning}
                label="Disputas activas"
                value={resumen.activeDisputes}
                accent={resumen.activeDisputes > 0}
            />
            <SummaryCard
                icon={TrendingUp}
                label="Total acreditado este mes"
                value={formatAmount(resumen.totalAccreditedInMonth)}
            />
        </div>
    )
}