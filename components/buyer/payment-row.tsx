import { formatFecha, formatMonto } from "@/lib/formatters"
import { Payment, PaymentStatus } from "@/types/payments"
import { Badge } from "@/components/ui/badge"
import { ButtonPrimary } from "@/components/ui/button"


const statusVariant: Record<PaymentStatus, React.ComponentProps<typeof Badge>['variant']> = {
    pendiente:   'warning',
    acreditado:  'accent',
    rechazado:   'danger',
    en_proceso:  'default',
    cancelado:   'default',
    reembolsado: 'default',
    contracargo: 'danger',
}

const statusLabel: Record<PaymentStatus, string> = {
    pendiente:   'Pendiente',
    acreditado:  'Acreditado',
    rechazado:   'Rechazado',
    en_proceso:  'En proceso',
    cancelado:   'Cancelado',
    reembolsado: 'Reembolsado',
    contracargo: 'Contracargo',
}


export function PaymentRow({ payment, onPagar }: { payment: Payment; onPagar?: (p: Payment) => void }) {
    const estado = payment.estado as PaymentStatus;

    return (
        <tr className="border-b border-neutral-100 dark:border-neutral-800/60 last:border-0 hover:bg-neutral-50 dark:hover:bg-neutral-800/20 transition-colors">
            {/* Fecha — solo desktop */}
            <td className="hidden md:table-cell px-4 py-3.5 font-mono text-xs text-neutral-400 whitespace-nowrap">
                {formatFecha(payment.fecha)}
            </td>
            {/* Descripción */}
            <td className="px-4 py-3.5">
                <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                    {payment.descripcion ?? 'Sin descripción'}
                </p>
                <p className="text-xs text-neutral-400 md:hidden mt-0.5">{formatFecha(payment.fecha)}</p>
            </td>
            {/* Forma de pago — solo desktop */}
            <td className="hidden md:table-cell px-4 py-3.5 text-xs text-neutral-400 whitespace-nowrap">
                {payment.formaDePago || '—'}
            </td>
            {/* Monto */}
            <td className="px-4 py-3.5 font-mono text-sm font-semibold text-neutral-900 dark:text-neutral-100 whitespace-nowrap">
                {formatMonto(payment.monto)}
            </td>
            {/* Estado / Acción */}
            <td className="px-4 py-3.5">
                <div className="flex items-center justify-end gap-2">
                    <Badge variant={statusVariant[estado]}>
                        {statusLabel[estado]}
                    </Badge>
                    {estado === 'pendiente' && onPagar && (
                        <ButtonPrimary onClick={() => onPagar(payment)} className="py-1 text-xs">
                            Pagar
                        </ButtonPrimary>
                    )}
                </div>
            </td>
        </tr>
    )
}