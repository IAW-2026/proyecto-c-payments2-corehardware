import { auth } from '@clerk/nextjs/server'
import { CreditCard, MessageSquareWarning, Package } from 'lucide-react'
import { fetchPendingPayments, fetchActiveDisputes, fetchRecentPayments } from '@/lib/query/buyer'
import { SummaryCard } from '@/components/ui/summary-card'
import { formatAmount } from '@/lib/formatters'


export async function SummarySection() {
    const { userId } = await auth()
    const [pagosPendientes, disputasActivas, pagosRecientes] = await Promise.all([
        fetchPendingPayments(userId!),
        fetchActiveDisputes(userId!),
        fetchRecentPayments(userId!),
    ])

    const ultimoPedido = pagosRecientes[0] ?? null

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <SummaryCard
                icon={CreditCard}
                label="Pagos pendientes"
                value={pagosPendientes.length}
                accent={pagosPendientes.length > 0}
            />
            <SummaryCard
                icon={MessageSquareWarning}
                label="Disputas activas"
                value={disputasActivas.length}
                accent={disputasActivas.length > 0}
            />
            <SummaryCard
                icon={Package}
                label="Último pedido"
                value={ultimoPedido ? formatAmount(Number(ultimoPedido.monto)) : '-'}
            />
        </div>
    )
}