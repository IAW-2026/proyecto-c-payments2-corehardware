import { Badge } from '@/components/ui/badge'
import { formatMonto, formatFecha } from '@/lib/formatters'
import { Payment } from '@/types/payments'
import { PAGINATION_NEXT_LABEL, PAGINATION_PREV_LABEL, PaginationButton } from '../ui/pagination-button'


const badgeVariant: Record<string, React.ComponentProps<typeof Badge>['variant']> = {
    pendiente:   'warning',
    acreditado:  'accent',
    rechazado:   'danger',
    reembolsado: 'accent',
    en_proceso:  'warning',
    cancelado:   'danger',
    contracargo: 'danger',
}

const badgeLabel: Record<string, string> = {
    pendiente:   'Pendiente',
    acreditado:  'Acreditado',
    rechazado:   'Rechazado',
    reembolsado: 'Reembolsado',
    en_proceso:  'En proceso',
    cancelado:   'Cancelado',
    contracargo: 'Contracargo',
}


export function TransaccionesTable({
    transacciones,
    total,
    offset,
    limit,
    searchParams,
    mapaVendedores,
}: {
    transacciones: Payment[]
    total: number
    offset: number
    limit: number
    searchParams: Record<string, string>
    mapaVendedores: Record<string, string>
}) {
    const hasPrev = offset > 0
    const hasNext = offset + limit < total

    function buildHref(newOffset: number) {
        const sp = new URLSearchParams({ ...searchParams, offset: newOffset.toString() })
        return `/admin/dashboard?${sp.toString()}`
    }

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
                            <th className="px-4 py-3 text-right text-xs font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 font-normal">Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transacciones.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-4 py-10 text-center text-sm text-neutral-400 dark:text-neutral-600">
                                    Sin resultados para los filtros aplicados.
                                </td>
                            </tr>
                        ) : transacciones.map((t) => (
                            <tr
                                key={t.id}
                                className="border-b border-neutral-100 dark:border-neutral-800/60 last:border-0 hover:bg-neutral-50 dark:hover:bg-neutral-800/20 transition-colors"
                            >
                                <td className="px-4 py-3.5">
                                    <p className="text-sm font-mono font-medium text-neutral-800 dark:text-neutral-200">
                                        #{t.pedidoId}
                                    </p>
                                </td>
                                <td className="px-4 py-3.5 hidden md:table-cell">
                                    <p className="text-sm text-neutral-700 dark:text-neutral-300">{mapaVendedores[t.sellerClerkUserId] ?? t.sellerClerkUserId}</p>
                                </td>
                                <td className="px-4 py-3.5 font-mono text-sm font-semibold text-neutral-900 dark:text-neutral-100 whitespace-nowrap hidden md:table-cell">
                                    {formatMonto(Number(t.monto))}
                                </td>
                                <td className="px-4 py-3.5 hidden sm:table-cell">
                                    <p className="text-xs text-neutral-400 font-mono">{formatFecha(t.fecha)}</p>
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
                        <PaginationButton 
                            href={buildHref(Math.max(0, offset - limit))} 
                            disabled={!hasPrev}
                        >
                            {PAGINATION_PREV_LABEL}
                        </PaginationButton>
                        
                        <PaginationButton 
                            href={buildHref(offset + limit)} 
                            disabled={!hasNext}
                        >
                            {PAGINATION_NEXT_LABEL}
                        </PaginationButton>
                    </div>
                </div>
            )}
        </>
    )
}