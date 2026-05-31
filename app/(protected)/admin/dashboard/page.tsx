import { Download } from 'lucide-react'
import { DashboardFilters } from '@/components/admin/dashboard-filters'
import { DashboardKPIs } from '@/components/admin/dashboard-kpis'
import { DashboardCharts } from '@/components/admin/dashboard-charts'
import { TransaccionesTable } from '@/components/admin/transacciones-table'
import { ButtonSecondary } from '@/components/ui/button'
import { getAdminPagos, getAdminSummary, getDisputasChartData, getPagosChartData } from '@/lib/query'

const LIMIT = 20

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

    const [summary, { pagos, total }, pagosChart, disputasChart] = await Promise.all([
        getAdminSummary(periodo),
        getAdminPagos({ offset, limit: LIMIT, estado, q, periodo }),
        getPagosChartData(periodo),
        getDisputasChartData(periodo)
    ])

    const curMonto = parseFloat(summary.current.pagosMonto)
    const prevMonto = parseFloat(summary.previous.pagosMonto)

    const resumen = {
        totalProcesado: curMonto,
        totalProcesadoDelta: prevMonto !== 0 ? ((curMonto - prevMonto) / prevMonto) * 100 : 0,
        cantidadPagos: summary.current.pagosCantidad,
        cantidadPagosDelta: summary.previous.pagosCantidad !== 0
            ? ((summary.current.pagosCantidad - summary.previous.pagosCantidad) / summary.previous.pagosCantidad) * 100
            : 0,
        tasaDisputas: summary.current.pagosCantidad > 0 ? (summary.current.disputas / summary.current.pagosCantidad) * 100 : 0,
        tasaDisputasDelta: 0,
        tasaRechazo: 0,
        tasaRechazoDelta: 0,
    }

    const mapaDias = new Map<string, { fechaObj: Date; monto: number; disputas: number }>()

    pagosChart.forEach((p) => {
        const fechaObj = new Date(p.fecha)
        const fechaKey = fechaObj.toDateString()
        const montoNum = parseFloat(p.monto) || 0

        const existente = mapaDias.get(fechaKey)
        if (existente) {
            existente.monto += montoNum
        } else {
            mapaDias.set(fechaKey, { fechaObj, monto: montoNum, disputas: 0 })
        }
    })

    disputasChart.forEach((d) => {
        const fechaObj = new Date(d.fechaDeInicio)
        const fechaKey = fechaObj.toDateString()

        const existente = mapaDias.get(fechaKey)
        if (existente) {
            existente.disputas += 1
        } else {
            mapaDias.set(fechaKey, { fechaObj, monto: 0, disputas: 1 })
        }
    })

    const grafico = Array.from(mapaDias.values())
        .sort((a, b) => a.fechaObj.getTime() - b.fechaObj.getTime())
        .map((dia) => ({
            label: dia.fechaObj.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }),
            monto: dia.monto,
            disputas: dia.disputas
        })
    )



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

            <DashboardKPIs resumen={resumen} />

            <DashboardCharts datos={grafico} />

            <div className="space-y-3">
                <h2 className="text-xs font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-500">
                    Transacciones · {total} resultado{/* {total !== 1 ? 's' : ''} */}
                </h2>
                <TransaccionesTable
                    transacciones={pagos}
                    total={total}
                    offset={offset}
                    limit={LIMIT}
                    searchParams={{ periodo, estado, q }}
                />
            </div>

        </div>
    )
}