import { CreditCard, MessageSquareWarning, Users, Activity } from 'lucide-react'
import { SummaryCard } from '@/components/ui/summary-card'
import { Notification } from '@/components/ui/notification'
import { RecentActivityTable } from '@/components/admin/recent-activity-table'
import { VendedoresTable } from '@/components/admin/vendedores-table'
import { formatMonto } from '@/lib/formatters'

export default async function AdminHomePage() {
    // TODO: reemplazar con datos reales
    const resumen = {
        pagosHoy: { cantidad: 0, monto: 0 },
        pendientes: 0,
        disputasActivas: 0,
        disputasCriticas: 0,
        vendedoresActivos: 0,
    }
    const actividad: any[] = []
    const vendedores: any[] = []

    const alertas = [
        resumen.disputasCriticas > 0 && {
            mensaje: `${resumen.disputasCriticas} disputa${resumen.disputasCriticas > 1 ? 's' : ''} sin resolver con más de 72 hs.`,
            variant: 'danger' as const,
        },
        resumen.pendientes > 0 && {
            mensaje: `${resumen.pendientes} pago${resumen.pendientes > 1 ? 's' : ''} pendiente${resumen.pendientes > 1 ? 's' : ''} de acreditar.`,
            variant: 'warning' as const,
        },
        vendedores.some(v => v.estado === 'expira_pronto') && {
            mensaje: 'Hay vendedores con credencial próxima a vencer.',
            variant: 'warning' as const,
        },
    ].filter(Boolean) as { mensaje: string; variant: 'warning' | 'danger' }[]

    return (
        <div className="max-w-6xl mx-auto space-y-8">

            <div>
                <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">Inicio</h1>
                <p className="text-sm text-neutral-500 mt-0.5">Estado general del sistema.</p>
            </div>

            {alertas.length > 0 && (
                <div className="space-y-2">
                    {alertas.map((a, i) => (
                        <Notification key={i} variant={a.variant}>{a.mensaje}</Notification>
                    ))}
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <SummaryCard
                    icon={CreditCard}
                    label="Pagos hoy"
                    value={`${resumen.pagosHoy.cantidad} · ${formatMonto(resumen.pagosHoy.monto)}`}
                />
                <SummaryCard
                    icon={Activity}
                    label="Pendientes de acreditar"
                    value={resumen.pendientes}
                    accent={resumen.pendientes > 0}
                />
                <SummaryCard
                    icon={MessageSquareWarning}
                    label="Disputas activas"
                    value={resumen.disputasActivas}
                    accent={resumen.disputasActivas > 0}
                />
                <SummaryCard
                    icon={Users}
                    label="Vendedores activos"
                    value={resumen.vendedoresActivos}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-3">
                    <h2 className="text-xs font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-500">
                        Actividad reciente
                    </h2>
                    <RecentActivityTable actividad={actividad} />
                </div>
                <div className="space-y-3">
                    <h2 className="text-xs font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-500">
                        Credenciales de vendedores
                    </h2>
                    <VendedoresTable vendedores={vendedores} />
                </div>
            </div>

        </div>
    )
}