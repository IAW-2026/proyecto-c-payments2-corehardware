import { CreditCard, MessageSquareWarning, Users, Activity } from 'lucide-react'
import { SummaryCard } from '@/components/ui/summary-card'
import { formatMonto } from '@/lib/formatters'
import { getAdminHomeSummary } from '@/lib/query/admin'


export async function AdminSummarySection() {
    const resumen = await getAdminHomeSummary()

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <SummaryCard
                icon={CreditCard}
                label="Pagos hoy"
                value={`${resumen.pagosHoy.cantidad} · ${formatMonto(resumen.pagosHoy.monto)}`}
            />
            <SummaryCard
                icon={Activity}
                label="Pendientes de acreditar"
                value={resumen.pendientes}
            />
            <SummaryCard
                icon={MessageSquareWarning}
                label="Disputas activas"
                value={resumen.disputasActivas}
            />
            <SummaryCard
                icon={Users}
                label="Vendedores activos"
                value={resumen.vendedoresActivos}
            />
        </div>
    )
}