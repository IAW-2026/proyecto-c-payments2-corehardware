import { formatFecha, formatMonto } from "@/lib/formatters";
import { Badge } from "../ui/badge";

const estadoVariant: Record<DisputeStatus, React.ComponentProps<typeof Badge>['variant']> = {
    pendiente:   'warning',
    reembolsada: 'accent',
    rechazada:   'danger',
    repuesta: 'accent',  
}


const estadoLabel: Record<DisputeStatus, string> = {
    pendiente:   'Pendiente',
    reembolsada: 'Reembolsada',
    rechazada:   'Rechazada',
    repuesta: 'Repuesta',
}

export function DisputeRow({ disputa }: { disputa: Dispute }) {
    return (
        <tr className="border-b border-neutral-100 dark:border-neutral-800/60 last:border-0 hover:bg-neutral-50 dark:hover:bg-neutral-800/20 transition-colors">
            <td className="hidden md:table-cell px-4 py-3.5 font-mono text-xs text-neutral-400 whitespace-nowrap">
                {formatFecha(disputa.fecha)}
            </td>
            <td className="px-4 py-3.5">
                <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">Pedido #{disputa.pedidoId}</p>
                <p className="text-xs text-neutral-400 mt-0.5 md:hidden">{formatFecha(disputa.fecha)}</p>
                <p className="text-xs text-neutral-400 mt-0.5 line-clamp-1">{disputa.descripcion}</p>
            </td>
            <td className="hidden md:table-cell px-4 py-3.5 font-mono text-sm font-semibold text-neutral-900 dark:text-neutral-100 whitespace-nowrap">
                {formatMonto(disputa.monto)}
            </td>
            <td className="px-4 py-3.5 text-right">
                <Badge variant={estadoVariant[disputa.estado]}>
                    {estadoLabel[disputa.estado]}
                </Badge>
            </td>
        </tr>
    )
}