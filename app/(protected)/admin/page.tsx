import { CreditCard, MessageSquareWarning, Users, Activity } from 'lucide-react'
import { SummaryCard } from '@/components/ui/summary-card'
import { RecentActivityTable } from '@/components/admin/recent-activity-table'
import { VendedoresTable } from '@/components/admin/vendedores-table'
import { formatMonto } from '@/lib/formatters'
import { getAdminDashboardSummary, getAdminActividadReciente, getUltimosVendedores } from '@/lib/query'


export default async function AdminHomePage() {
    const [resumen, actividadData, ultimosVendedores] = await Promise.all([
        getAdminDashboardSummary(),
        getAdminActividadReciente(),
        getUltimosVendedores()
    ])

    const vendedores = await Promise.all(
        ultimosVendedores.map(v => 
            fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/mock/sellers/${v.clerkUserId}`, { cache: 'no-store' })
                .then(res => res.json())
                .then(data => ({ ...data, createdAt: v.createdAt }))
        )
    )

    const actividad = [
        ...actividadData.pagos.map(p => ({ 
            ...p, 
            tipo: 'pago' as const, 
            fecha: p.fecha 
        })),
        ...actividadData.disputas.map(d => ({ 
            ...d, 
            tipo: 'disputa' as const, 
            fecha: d.fechaDeInicio 
        }))
    ].sort((a, b) => b.fecha.getTime() - a.fecha.getTime())

    
    return (
        <div className="max-w-6xl mx-auto space-y-8">

            <div>
                <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">Inicio</h1>
                <p className="text-sm text-neutral-500 mt-0.5">Estado general del sistema.</p>
            </div>

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
                />
                <SummaryCard
                    icon={MessageSquareWarning}
                    label="Disputas activas"
                    value={resumen.disputasActivas}
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
                        Últimos vendedores autorizados
                    </h2>
                    <VendedoresTable vendedores={vendedores} />
                </div>
            </div>

        </div>
    )
}