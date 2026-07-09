import { DashboardFilters } from '@/components/admin/dashboard-filters'
import { DashboardKPIs } from '@/components/admin/dashboard-kpis'
import { DashboardCharts } from '@/components/admin/dashboard-charts'
import { TransactionsTable } from '@/components/admin/transactions-table'
import { fetchPaymentsForAdmin, fetchAdminDashboardSummary, fetchDisputesChartData, fetchPaymentsChartData } from '@/lib/query/admin'
import { ITEMS_PER_PAGE } from '@/lib/constants'


const PERIODOS = ['Últimos 7 días', 'Últimos 30 días', 'Este mes', 'Mes anterior'] as const
type Periodo = typeof PERIODOS[number]


export default async function AdminDashboardPage({
    searchParams,
}: {
    searchParams: Promise<{
        periodo?: string
        estado?: string
        q?: string
        offset?: string
    }>
}) {
    const params = await searchParams;

    const periodo = (PERIODOS.includes(params.periodo as Periodo) ? params.periodo : PERIODOS[1]) as Periodo
    const estado = params.estado ?? 'todos'
    const q = params.q ?? ''
    const offset = Math.max(0, parseInt(params.offset ?? '0', 10))

    const [summary, { payments, total }, pagosChart, disputasChart] = await Promise.all([
        fetchAdminDashboardSummary(periodo),
        fetchPaymentsForAdmin({ offset, limit: ITEMS_PER_PAGE, estado, q, periodo }),
        fetchPaymentsChartData(periodo),
        fetchDisputesChartData(periodo)
    ])

    const curAmount = parseFloat(summary.current.paymentsAmount)
    const prevAmount = parseFloat(summary.previous.paymentsAmount)

    const disputesRatioCur = summary.current.paymentsQuantity > 0 ? (summary.current.disputes / summary.current.paymentsQuantity) * 100 : 0
    const disputesRatioPrev = summary.previous.paymentsQuantity > 0 ? (summary.previous.disputes / summary.previous.paymentsQuantity) * 100 : 0

    const rejectionRatioCur = summary.current.paymentsQuantity > 0 ? (summary.current.rejected / summary.current.paymentsQuantity) * 100 : 0
    const rejectionRatioPrev = summary.previous.paymentsQuantity > 0 ? (summary.previous.rejected / summary.previous.paymentsQuantity) * 100 : 0

    const kpis = {
        totalProcessed: curAmount,
        totalProcessedDelta: prevAmount !== 0 ? ((curAmount - prevAmount) / prevAmount) * 100 : 0,
        paymentsQuantity: summary.current.paymentsQuantity,
        paymentsQuantityDelta: summary.previous.paymentsQuantity !== 0
            ? ((summary.current.paymentsQuantity - summary.previous.paymentsQuantity) / summary.previous.paymentsQuantity) * 100
            : summary.current.paymentsQuantity > 0 ? 100 : 0,
        disputesRatio: disputesRatioCur,
        disputesRatioDelta: disputesRatioCur - disputesRatioPrev,
        rejectionRatio: rejectionRatioCur,
        rejectionRatioDelta: rejectionRatioCur - rejectionRatioPrev,
    }

    const daysMap = new Map<string, { date: Date; monto: number; disputas: number }>()

    pagosChart.forEach((p) => {
        const date = new Date(p.fecha)
        const dateKey = date.toDateString()
        const amountNumber = parseFloat(p.monto) || 0

        const existentDate = daysMap.get(dateKey)
        if (existentDate) {
            existentDate.monto += amountNumber
        } else {
            daysMap.set(dateKey, { date, monto: amountNumber, disputas: 0 })
        }
    })

    disputasChart.forEach((d) => {
        const date = new Date(d.fechaDeInicio)
        const dateKey = date.toDateString()

        const existentDate = daysMap.get(dateKey)
        if (existentDate) {
            existentDate.disputas += 1
        } else {
            daysMap.set(dateKey, { date, monto: 0, disputas: 1 })
        }
    })

    const grafico = Array.from(daysMap.values())
        .sort((a, b) => a.date.getTime() - b.date.getTime())
        .map((dia) => ({
            label: dia.date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }),
            monto: dia.monto,
            disputas: dia.disputas
        })
        )

    const sellersIds = Array.from(new Set(payments.map(p => p.sellerId)))
    const nombresVendedores = await Promise.all(
        sellersIds.map(id =>
            fetch(`${process.env.SELLER_API_URL}/api/sellers/${id}`, {
                cache: 'no-store',
                headers: {
                    'x-api-key': process.env.SELLER_API_KEY!,
                },
            })
                .then(res => res.json())
                .then(data => [id, data.razon_social as string])
        )
    )
    const sellersMap = Object.fromEntries(nombresVendedores)

    return (
        <div className="max-w-6xl mx-auto space-y-8">

            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">Dashboard</h1>
                    <p className="text-sm text-neutral-500 mt-0.5">Análisis de pagos y disputas.</p>
                </div>
            </div>

            <DashboardFilters
                periodos={[...PERIODOS]}
                periodo={periodo}
                estado={estado}
                q={q}
            />

            <DashboardKPIs kpis={kpis} />

            <DashboardCharts datos={grafico} />

            <div className="space-y-3">
                <h2 className="text-xs font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-500">
                    Transacciones · {total} resultado{total !== 1 ? 's' : ''}
                </h2>
                <TransactionsTable
                    transactions={payments}
                    total={total}
                    offset={offset}
                    limit={ITEMS_PER_PAGE}
                    searchParams={{ periodo, estado, q }}
                    sellersMap={sellersMap}
                />
            </div>

        </div>
    )
}