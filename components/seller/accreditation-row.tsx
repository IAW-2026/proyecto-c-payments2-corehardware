import { formatFecha, formatMonto } from '@/lib/formatters'
import { Accreditation, AccreditationStatus } from '@/types/accreditation'
import { Badge } from '@/components/ui/badge'

const statusVariant: Record<AccreditationStatus, React.ComponentProps<typeof Badge>['variant']> = {
    pendiente:  'warning',
    acreditado: 'accent',
    rechazado:  'danger',
    en_proceso: 'default',
}

const statusLabel: Record<AccreditationStatus, string> = {
    pendiente:  'Pendiente',
    acreditado: 'Acreditado',
    rechazado:  'Rechazado',
    en_proceso: 'En proceso',
}

export function AccreditationRow({ accreditation }: { accreditation: Accreditation }) {
    return (
        <tr className="border-b border-neutral-100 dark:border-neutral-800/60 last:border-0 hover:bg-neutral-50 dark:hover:bg-neutral-800/20 transition-colors">
            {/* Fecha — solo desktop */}
            <td className="hidden md:table-cell px-4 py-3.5 font-mono text-xs text-neutral-400 whitespace-nowrap">
                {formatFecha(accreditation.fecha)}
            </td>
            {/* Descripción */}
            <td className="px-4 py-3.5">
                <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{accreditation.descripcion}</p>
                <p className="text-xs text-neutral-400 md:hidden mt-0.5">{formatFecha(accreditation.fecha)}</p>
            </td>
            {/* Comprador — solo desktop */}
            <td className="hidden md:table-cell px-4 py-3.5 text-sm text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                {accreditation.comprador}
            </td>
            {/* Monto */}
            <td className="px-4 py-3.5 font-mono text-sm font-semibold text-neutral-900 dark:text-neutral-100 whitespace-nowrap">
                {formatMonto(accreditation.monto)}
            </td>
            {/* Estado */}
            <td className="px-4 py-3.5">
                <div className="flex items-center justify-end">
                    <Badge variant={statusVariant[accreditation.estado]}>
                        {statusLabel[accreditation.estado]}
                    </Badge>
                </div>
            </td>
        </tr>
    )
}