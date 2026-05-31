import { CreditCard, MessageSquareWarning, Users, Activity } from 'lucide-react'
import { SummaryCard } from '@/components/ui/summary-card'
import { formatAmount } from '@/lib/formatters'
import { fetchAdminHomeSummary } from '@/lib/query/admin'


export async function SummarySection() {
    const resumen = await fetchAdminHomeSummary()

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <SummaryCard
                icon={CreditCard}
                label="Pagos hoy"
                value={`${resumen.paymentsToday.quantity} · ${formatAmount(resumen.paymentsToday.amount)}`}
            />
            <SummaryCard
                icon={Activity}
                label="Pendientes de acreditar"
                value={resumen.pending}
            />
            <SummaryCard
                icon={MessageSquareWarning}
                label="Disputas activas"
                value={resumen.activeDisputes}
            />
            <SummaryCard
                icon={Users}
                label="Vendedores activos"
                value={resumen.activeSellers}
            />
        </div>
    )
}