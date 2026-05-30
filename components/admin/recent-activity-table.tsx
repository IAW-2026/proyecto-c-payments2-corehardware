import { Badge } from '@/components/ui/badge'
import { formatFecha, formatMonto } from '@/lib/formatters'

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

export function RecentActivityTable({ actividad }: { actividad: any[] }) {
    return (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
            <table className="w-full">
                <tbody>
                    {actividad.map((a) => (
                        <tr
                            key={`${a.tipo}-${a.id}`}
                            className="border-b border-neutral-100 dark:border-neutral-800/60 last:border-0 hover:bg-neutral-50 dark:hover:bg-neutral-800/20 transition-colors"
                        >
                            <td className="px-4 py-3.5">
                                <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                                    {a.descripcion ?? `Pedido ${a.pedidoId}`}
                                </p>
                                <p className="text-xs text-neutral-400 mt-0.5 font-mono">
                                    {formatFecha(a.fecha)}
                                </p>
                            </td>
                            <td className="px-4 py-3.5">
                                <Badge variant={a.tipo === 'pago' ? 'default' : 'warning'} className="font-mono">
                                    {a.tipo === 'pago' ? 'Pago' : 'Disputa'}
                                </Badge>
                            </td>
                            <td className="px-4 py-3.5 font-mono text-sm font-semibold text-neutral-900 dark:text-neutral-100 whitespace-nowrap hidden sm:table-cell">
                                {formatMonto(Number(a.monto))}
                            </td>
                            <td className="px-4 py-3.5 text-right">
                                <Badge variant={badgeVariant[a.estado]}>
                                    {badgeLabel[a.estado]}
                                </Badge>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}