import { Download } from 'lucide-react'
import { DashboardFilters } from '@/components/admin/dashboard-filters'
import { DashboardKPIs } from '@/components/admin/dashboard-kpis'
import { DashboardCharts } from '@/components/admin/dashboard-charts'
import { TransaccionesTable } from '@/components/admin/transacciones-table'
import { ButtonSecondary } from '@/components/ui/button'

const LIMIT = 20

const PERIODOS = ['Últimos 7 días', 'Últimos 30 días', 'Este mes', 'Mes anterior'] as const
type Periodo = typeof PERIODOS[number]

export default async function AdminDashboardPage({
    searchParams,
}: {
    searchParams: {
        periodo?: string
        tipo?: string
        estado?: string
        q?: string
        offset?: string
    }
}) {
    const periodo = (PERIODOS.includes(searchParams.periodo as Periodo) ? searchParams.periodo : PERIODOS[1]) as Periodo
    const tipo    = searchParams.tipo   ?? 'todos'
    const estado  = searchParams.estado ?? 'todos'
    const q       = searchParams.q      ?? ''
    const offset  = Math.max(0, parseInt(searchParams.offset ?? '0', 10))

    // TODO: reemplazar con datos reales
    const resumen = {
        totalProcesado: 0,
        totalProcesadoDelta: 0,
        cantidadPagos: 0,
        cantidadPagosDelta: 0,
        tasaDisputas: 0,
        tasaDisputasDelta: 0,
        tasaRechazo: 0,
        tasaRechazoDelta: 0,
    }
    const grafico: any[] = []
    const transacciones: any[] = []
    const total = 0

    return (
        <div className="max-w-6xl mx-auto space-y-8">

            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">Dashboard</h1>
                    <p className="text-sm text-neutral-500 mt-0.5">Análisis de pagos y disputas.</p>
                </div>
                <ButtonSecondary className="flex items-center gap-2 shrink-0">
                    <Download className="w-4 h-4" />
                    Exportar CSV
                </ButtonSecondary>
            </div>

            <DashboardFilters
                periodos={[...PERIODOS]}
                periodo={periodo}
                tipo={tipo}
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
                    transacciones={transacciones}
                    total={total}
                    offset={offset}
                    limit={LIMIT}
                    searchParams={{ periodo, tipo, estado, q }}
                />
            </div>

        </div>
    )
}