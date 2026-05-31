import { auth } from '@clerk/nextjs/server'
import { getPagosRecientes, getDisputasRecientes } from '@/lib/query'
import { Badge } from '@/components/ui/badge'
import { formatFecha, formatMonto } from '@/lib/formatters'

const badgeVariant: Record<string, React.ComponentProps<typeof Badge>['variant']> = {
    pendiente: 'warning',
    acreditado: 'accent',
    rechazado: 'danger',
    reembolsada: 'accent',
    repuesta: 'accent',
    rechazada: 'danger',
}

const badgeLabel: Record<string, string> = {
    pendiente: 'Pendiente',
    acreditado: 'Acreditado',
    rechazado: 'Rechazado',
    reembolsada: 'Reembolsada',
    repuesta: 'Repuesta',
    rechazada: 'Rechazada',
}

export async function ActivitySection() {
    const { userId } = await auth()
    const [pagosRecientes, disputasRecientes] = await Promise.all([
        getPagosRecientes(userId!),
        getDisputasRecientes(userId!),
    ])

    const actividad = [
        ...pagosRecientes.map(p => ({
            id: p.id,
            tipo: 'pago' as const,
            descripcion: p.descripcion ?? `Pedido ${p.pedidoId}`,
            fecha: p.fecha.toISOString(),
            estado: p.estado,
            monto: Number(p.monto),
        })),
        ...disputasRecientes.map(d => ({
            id: d.id,
            tipo: 'disputa' as const,
            descripcion: d.descripcion ?? 'Disputa',
            fecha: d.fechaDeInicio.toISOString(),
            estado: d.estado,
            monto: d.pago ? Number(d.pago.monto) : 0,
        })),
    ].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())

    return (
        <div className="space-y-3">
            <h2 className="text-xs font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-500">
                Actividad reciente
            </h2>
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
                <table className="w-full">
                    <tbody>
                        {actividad.length === 0 ? (
                            <tr>
                                <td className="py-16 text-center text-sm text-neutral-400 dark:text-neutral-600">
                                    Sin actividad reciente.
                                </td>
                            </tr>
                        ) : (
                            actividad.map((a) => (
                                <tr key={a.id} className="border-b border-neutral-100 dark:border-neutral-800/60 last:border-0 hover:bg-neutral-50 dark:hover:bg-neutral-800/20 transition-colors">
                                    <td className="px-4 py-3.5">
                                        <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{a.descripcion}</p>
                                        <p className="text-xs text-neutral-400 mt-0.5 font-mono">{formatFecha(a.fecha)}</p>
                                    </td>
                                    <td className="px-4 py-3.5 hidden md:table-cell">
                                        <Badge variant={a.tipo === 'pago' ? 'default' : 'warning'} className="font-mono">
                                            {a.tipo === 'pago' ? 'Pago' : 'Disputa'}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3.5 font-mono text-sm font-semibold text-neutral-900 dark:text-neutral-100 whitespace-nowrap hidden md:table-cell">
                                        {formatMonto(a.monto)}
                                    </td>
                                    <td className="px-4 py-3.5 text-right">
                                        <Badge variant={badgeVariant[a.estado]}>
                                            {badgeLabel[a.estado]}
                                        </Badge>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}