import { auth } from '@clerk/nextjs/server'
import { CreditCard, MessageSquareWarning, TrendingUp } from 'lucide-react'
import { getSellerDashboardSummary } from '@/lib/query/seller'
import { SummaryCard } from '@/components/ui/summary-card'
import { formatMonto } from '@/lib/formatters'


export async function SellerSummarySection() {
    const { userId } = await auth()
    const resumen = await getSellerDashboardSummary(userId!)

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <SummaryCard
                icon={CreditCard}
                label="Acreditaciones pendientes"
                value={`${resumen.acreditacionesPendientes.cantidad} · ${formatMonto(resumen.acreditacionesPendientes.monto)}`}
                accent={resumen.acreditacionesPendientes.cantidad > 0}
            />
            <SummaryCard
                icon={MessageSquareWarning}
                label="Disputas activas"
                value={resumen.disputasActivas}
                accent={resumen.disputasActivas > 0}
            />
            <SummaryCard
                icon={TrendingUp}
                label="Total acreditado este mes"
                value={formatMonto(resumen.totalAcreditadoMes)}
            />
        </div>
    )
}