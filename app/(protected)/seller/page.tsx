import { auth } from '@clerk/nextjs/server'
import { CreditCard, MessageSquareWarning, TrendingUp } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Notification } from '@/components/ui/notification'
import { SummaryCard } from '@/components/ui/summary-card'
import { formatFecha, formatMonto } from '@/lib/formatters'
import { getSellerDashboardSummary, getSellerActividadReciente } from '@/lib/query'

const badgeVariant: Record<string, React.ComponentProps<typeof Badge>['variant']> = {
    pendiente:  'warning',
    en_proceso: 'default',
    acreditado: 'accent',
    rechazado:  'danger',
    reembolsada:'accent',
    repuesta:   'accent',
    rechazada:  'danger',
}
 
const badgeLabel: Record<string, string> = {
    pendiente:   'Pendiente',
    en_proceso:  'En proceso',
    acreditado:  'Acreditado',
    rechazado:   'Rechazado',
    reembolsada: 'Reembolsada',
    repuesta:    'Repuesta',
    rechazada:   'Rechazada',
}

export default async function SellerHomePage() {
    const { userId } = await auth()
    
    // Usamos las queries optimizadas que ya definiste
    const [resumen, actividadRaw] = await Promise.all([
        getSellerDashboardSummary(userId!),
        getSellerActividadReciente(userId!),
    ])

    const alertas: { id: number; mensaje: string; variant: 'warning' | 'danger' }[] = []

    // Usamos el resultado directo de la query de resumen
    if (resumen.disputasActivas > 0) {
        alertas.push({ 
            id: 1, 
            mensaje: `Tenés ${resumen.disputasActivas} disputa${resumen.disputasActivas > 1 ? 's' : ''} sin resolver.`, 
            variant: 'warning' 
        })
    }

    // Mapeamos los datos de la actividad reciente optimizada
    const actividad = [
        ...actividadRaw.acreditaciones.map(a => ({
            id: a.id,
            tipo: 'acreditacion' as const,
            descripcion: a.descripcion ?? `Pedido ${a.pedidoId}`,
            fecha: a.fecha,
            estado: a.estado,
            monto: Number(a.monto),
        })),
        ...actividadRaw.disputas.map(d => ({
            id: d.id,
            tipo: 'disputa' as const,
            descripcion: d.descripcion ?? 'Disputa',
            fecha: d.fechaDeInicio,
            estado: d.estado,
            monto: d.pago ? Number(d.pago.monto) : 0,
        })),
    ].sort((a, b) => b.fecha.getTime() - a.fecha.getTime())

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div>
                <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">Inicio</h1>
                <p className="text-sm text-neutral-500 mt-0.5">Resumen de tu actividad.</p>
            </div>
 
            {alertas.length > 0 && (
                <div className="space-y-2">
                    {alertas.map((a) => (
                        <Notification key={a.id} variant={a.variant}>{a.mensaje}</Notification>
                    ))}
                </div>
            )}
 
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <SummaryCard
                    icon={CreditCard}
                    label="Acreditaciones pendientes"
                    value={`${resumen.acreditacionesPendientes.cantidad} · ${formatMonto(resumen.acreditacionesPendientes.monto)}`}
                    accent={resumen.acreditacionesPendientes.cantidad > 0}
                />
                <SummaryCard
                    icon={MessageSquareWarning}
                    label="Disputas activas"
                    value={resumen.disputasActivas}
                    accent={resumen.disputasActivas > 0}
                />
                <SummaryCard
                    icon={TrendingUp}
                    label="Total acreditado este mes"
                    value={formatMonto(resumen.totalAcreditadoMes)}
                />
            </div>
 
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
                                        <Badge variant={a.tipo === 'acreditacion' ? 'default' : 'warning'}>
                                            {a.tipo === 'acreditacion' ? 'Acreditación' : 'Disputa'}
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