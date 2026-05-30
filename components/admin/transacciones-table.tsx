import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { formatMonto, formatFecha } from '@/lib/formatters'

const badgeVariant: Record<string, React.ComponentProps<typeof Badge>['variant']> = {
    pendiente:   'warning',
    acreditado:  'accent',
    rechazado:   'danger',
    reembolsada: 'accent',
    repuesta:    'accent',
    rechazada:   'danger',
}

const badgeLabel: Record<string, string> = {
    pendiente:   'Pendiente',
    acreditado:  'Acreditado',
    rechazado:   'Rechazado',
    reembolsada: 'Reembolsada',
    repuesta:    'Repuesta',
    rechazada:   'Rechazada',
}

export function TransaccionesTable({
    transacciones,
    total,
    offset,
    limit,
    searchParams,
}: {
    transacciones: any[]
    total: number
    offset: number
    limit: number
    searchParams: Record<string, string>
}) {
    const hasPrev = offset > 0
    const hasNext = offset + limit < total

    function buildHref(newOffset: number) {
        const sp = new URLSearchParams({ ...searchParams, offset: newOffset.toString() })
        return `/admin/dashboard?${sp.toString()}`
    }

    const btnBase = 'px-3 py-1 text-xs font-medium rounded-lg transition-colors border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200'
    const btnActive = 'bg-white hover:bg-neutral-100 dark:bg-neutral-900 dark:hover:bg-neutral-800'
    const btnDisabled = 'bg-neutral-100 text-neutral-400 border-neutral-200 cursor-not-allowed dark:bg-neutral-900 dark:text-neutral-600 dark:border-neutral-900/50'

    return (
        <>
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-neutral-100 dark:border-neutral-800">
                            <th className="px-4 py-3 text-left text-xs font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 font-normal">Pedido</th>
                            <th className="px-4 py-3 text-left text-xs font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 font-normal hidden md:table-cell">Vendedor</th>
                            <th className="px-4 py-3 text-left text-xs font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 font-normal hidden md:table-cell">Monto</th>
                            <th className="px-4 py-3 text-left text-xs font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 font-normal hidden sm:table-cell">Fecha</th>
                            <th className="px-4 py-3 text-left text-xs font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 font-normal hidden md:table-cell">Tipo</th>
                            <th className="px-4 py-3 text-right text-xs font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 font-normal">Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transacciones.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-4 py-10 text-center text-sm text-neutral-400 dark:text-neutral-600">
                                    Sin resultados para los filtros aplicados.
                                </td>
                            </tr>
                        ) : transacciones.map((t) => (
                            <tr
                                key={`${t.tipo}-${t.id}`}
                                className="border-b border-neutral-100 dark:border-neutral-800/60 last:border-0 hover:bg-neutral-50 dark:hover:bg-neutral-800/20 transition-colors"
                            >
                                <td className="px-4 py-3.5">
                                    <p className="text-sm font-mono font-medium text-neutral-800 dark:text-neutral-200">
                                        #{t.pedidoId}
                                    </p>
                                </td>
                                <td className="px-4 py-3.5 hidden md:table-cell">
                                    <p className="text-sm text-neutral-700 dark:text-neutral-300">{t.vendedorNombre}</p>
                                </td>
                                <td className="px-4 py-3.5 font-mono text-sm font-semibold text-neutral-900 dark:text-neutral-100 whitespace-nowrap hidden md:table-cell">
                                    {formatMonto(Number(t.monto))}
                                </td>
                                <td className="px-4 py-3.5 hidden sm:table-cell">
                                    <p className="text-xs text-neutral-400 font-mono">{formatFecha(t.fecha)}</p>
                                </td>
                                <td className="px-4 py-3.5 hidden md:table-cell">
                                    <Badge variant={t.tipo === 'pago' ? 'default' : 'warning'} className="font-mono">
                                        {t.tipo === 'pago' ? 'Pago' : 'Disputa'}
                                    </Badge>
                                </td>
                                <td className="px-4 py-3.5 text-right">
                                    <Badge variant={badgeVariant[t.estado]}>
                                        {badgeLabel[t.estado]}
                                    </Badge>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {(hasPrev || hasNext) && (
                <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-500">
                    <span className="font-mono">
                        {offset + 1}–{Math.min(offset + limit, total)} de {total}
                    </span>
                    <div className="flex items-center gap-2">
                        {hasPrev
                            ? <Link href={buildHref(Math.max(0, offset - limit))} className={`${btnBase} ${btnActive}`}>← Anterior</Link>
                            : <span className={`${btnBase} ${btnDisabled}`}>← Anterior</span>
                        }
                        {hasNext
                            ? <Link href={buildHref(offset + limit)} className={`${btnBase} ${btnActive}`}>Siguiente →</Link>
                            : <span className={`${btnBase} ${btnDisabled}`}>Siguiente →</span>
                        }
                    </div>
                </div>
            )}
        </>
    )
}