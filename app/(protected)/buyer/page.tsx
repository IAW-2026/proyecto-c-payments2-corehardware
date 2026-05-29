import { auth } from '@clerk/nextjs/server'
import { CreditCard, MessageSquareWarning, Package } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { formatFecha, formatMonto } from '@/lib/formatters'
import { SummaryCard } from '@/components/ui/summary-card'
import { AlertBanner } from '@/components/buyer/alert-banner'
import { getDisputasActivas, getDisputasRecientes, getPagosPendientes, getPagosRecientes } from '@/lib/query'


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


export default async function BuyerHomePage() {
    const { userId } = await auth()

    const [pagosPendientes, disputasActivas, pagosRecientes, disputasRecientes] = await Promise.all([
        getPagosPendientes(userId!),
        getDisputasActivas(userId!),
        getPagosRecientes(userId!),
        getDisputasRecientes(userId!),
    ])

    const ultimoPedido = pagosRecientes[0] ?? null

    const alertas: { id: string; mensaje: string; tipo: string }[] = []

    if (pagosPendientes.length > 0)
        alertas.push({
            id: 'pagos',
            mensaje: `Tenés ${pagosPendientes.length} pago${pagosPendientes.length > 1 ? 's' : ''} pendiente${pagosPendientes.length > 1 ? 's' : ''} de completar.`,
            tipo: 'warning',
        })

    const disputaResuelta = disputasRecientes.find(d => d.fechaDeFinalizacion && d.estado === 'reembolsada')
    if (disputaResuelta)
        alertas.push({
            id: disputaResuelta.id,
            mensaje: 'Tu disputa fue resuelta con reembolso.',
            tipo: 'accent',
        })

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
            monto: 0,
        })),
    ].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())


    return (
        <div className="max-w-6xl mx-auto space-y-8">

            {/* Encabezado */}
            <div>
                <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">Inicio</h1>
                <p className="text-sm text-neutral-500 mt-0.5">Resumen de tu actividad.</p>
            </div>

            {/* Alertas */}
            {alertas.length > 0 && (
                <div className="space-y-2">
                    {alertas.map((a) => <AlertBanner key={a.id} {...a} />)}
                </div>
            )}

            {/* Resumen */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <SummaryCard
                    icon={CreditCard}
                    label="Pagos pendientes"
                    value={pagosPendientes.length}
                    accent={pagosPendientes.length > 0}
                />
                <SummaryCard
                    icon={MessageSquareWarning}
                    label="Disputas activas"
                    value={disputasActivas.length}
                    accent={disputasActivas.length > 0}
                />
                <SummaryCard
                    icon={Package}
                    label="Último pedido"
                    value={ultimoPedido ? formatMonto(Number(ultimoPedido.monto)) : '-'}
                />
            </div>

            {/* Actividad reciente */}
            <div className="space-y-3">
                <h2 className="text-xs font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-500">
                    Actividad reciente
                </h2>
                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
                    <table className="w-full">
                        <tbody>
                            {actividad.map((a) => (
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
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    )
}