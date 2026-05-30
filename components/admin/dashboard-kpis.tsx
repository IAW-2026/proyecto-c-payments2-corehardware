import { TrendingUp, TrendingDown } from 'lucide-react'
import { formatMonto } from '@/lib/formatters'

function Delta({ value, suffix = '%' }: { value: number; suffix?: string }) {
    const sube = value >= 0
    const Icon = sube ? TrendingUp : TrendingDown
    return (
        <span className={`flex items-center gap-1 text-xs font-mono mt-0.5 ${sube ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-400'}`}>
            <Icon className="w-3 h-3" strokeWidth={2} />
            {sube ? '+' : ''}{value.toFixed(1)}{suffix} vs período ant.
        </span>
    )
}

export function DashboardKPIs({ resumen }: { resumen: any }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5">
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Total procesado</p>
                <p className="text-lg font-bold font-mono text-neutral-900 dark:text-neutral-100 leading-tight mt-1">
                    {formatMonto(resumen.totalProcesado)}
                </p>
                <Delta value={resumen.totalProcesadoDelta} />
            </div>
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5">
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Pagos totales</p>
                <p className="text-lg font-bold font-mono text-neutral-900 dark:text-neutral-100 leading-tight mt-1">
                    {resumen.cantidadPagos}
                </p>
                <Delta value={resumen.cantidadPagosDelta} suffix=" pagos" />
            </div>
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5">
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Tasa de disputas</p>
                <p className="text-lg font-bold font-mono text-neutral-900 dark:text-neutral-100 leading-tight mt-1">
                    {resumen.tasaDisputas.toFixed(1)}%
                </p>
                <Delta value={resumen.tasaDisputasDelta} />
            </div>
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5">
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Tasa de rechazo</p>
                <p className="text-lg font-bold font-mono text-neutral-900 dark:text-neutral-100 leading-tight mt-1">
                    {resumen.tasaRechazo.toFixed(1)}%
                </p>
                <Delta value={resumen.tasaRechazoDelta} />
            </div>
        </div>
    )
}