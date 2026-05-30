import { formatFecha, formatMonto } from '@/lib/formatters'
import { Badge } from '@/components/ui/badge'
import { ButtonPrimary } from '@/components/ui/button'
import { Dispute, DisputeStatus } from '@/types/dispute'

const estadoVariant: Record<DisputeStatus, React.ComponentProps<typeof Badge>['variant']> = {
    pendiente:   'warning',
    reembolsada: 'accent',
    rechazada:   'danger',
    repuesta:    'accent',
}

const estadoLabel: Record<DisputeStatus, string> = {
    pendiente:   'Pendiente',
    reembolsada: 'Reembolsada',
    rechazada:   'Rechazada',
    repuesta:    'Repuesta',
}

export function DisputeRow({ disputa, onResolver }: { disputa: Dispute; onResolver?: (d: Dispute) => void }) {
    return (
        <tr className="border-b border-neutral-100 dark:border-neutral-800/60 last:border-0 hover:bg-neutral-50 dark:hover:bg-neutral-800/20 transition-colors">
            <td className="hidden md:table-cell px-4 py-3.5 font-mono text-xs text-neutral-400 whitespace-nowrap">
                {formatFecha(disputa.fechaDeInicio)}
            </td>
            <td className="px-4 py-3.5">
                <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">Pago #{disputa.pagoId}</p>
                <p className="text-xs text-neutral-400 mt-0.5 md:hidden">{formatFecha(disputa.fechaDeInicio)}</p>
                <p className="text-xs text-neutral-400 mt-0.5 line-clamp-1">{disputa.descripcion}</p>
                <p className="text-xs font-mono text-neutral-500 dark:text-neutral-500 mt-0.5">Contacto placeholder</p>
            </td>
            <td className="hidden md:table-cell px-4 py-3.5 font-mono text-sm font-semibold text-neutral-900 dark:text-neutral-100 whitespace-nowrap">
                {'hardcoded' + formatMonto(12345)}
            </td>
            <td className="px-4 py-3.5">
                <div className="flex items-center justify-end gap-2">
                    <Badge variant={estadoVariant[disputa.estado]}>
                        {estadoLabel[disputa.estado]}
                    </Badge>
                    {disputa.estado === 'pendiente' && onResolver && (
                        <ButtonPrimary onClick={() => onResolver(disputa)} className="py-1 text-xs">
                            Resolver
                        </ButtonPrimary>
                    )}
                </div>
            </td>
        </tr>
    )
}