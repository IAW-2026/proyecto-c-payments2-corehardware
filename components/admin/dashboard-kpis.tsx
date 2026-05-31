import { TrendingUp, TrendingDown } from 'lucide-react'
import { formatMonto } from '@/lib/formatters'


function Delta({ value, suffix = '%', invertir = false }: { value: number; suffix?: string; invertir?: boolean }) {
    const sube = value >= 0
    const esBueno = invertir ? !sube : sube
    const Icon = sube ? TrendingUp : TrendingDown
    const esNeutro = value === 0

    return (
        <span className={`flex items-center gap-1 text-xs font-mono mt-0.5 ${
            esNeutro 
                ? 'text-neutral-400 dark:text-neutral-500' 
                : esBueno ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-400'
        }`}>
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
                <Delta value={resumen.tasaDisputasDelta} invertir />
            </div>
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5">
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Tasa de rechazo</p>
                <p className="text-lg font-bold font-mono text-neutral-900 dark:text-neutral-100 leading-tight mt-1">
                    {resumen.tasaRechazo.toFixed(1)}%
                </p>
                <Delta value={resumen.tasaRechazoDelta} invertir />
            </div>
        </div>
    )
}