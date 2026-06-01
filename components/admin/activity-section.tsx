import { fetchAdminRecentActivity } from '@/lib/query/admin'
import { RecentActivityTable } from '@/components/admin/recent-activity-table'


export async function AdminActivitySection() {
    const actividadData = await fetchAdminRecentActivity()

    const actividad = [
        ...actividadData.payments.map(p => ({ ...p, tipo: 'pago' as const, fecha: p.fecha })),
        ...actividadData.disputes.map(d => ({ ...d, tipo: 'disputa' as const, fecha: d.fechaDeInicio })),
    ].sort((a, b) => b.fecha.getTime() - a.fecha.getTime())

    return (
        <div className="space-y-3">
            <h2 className="text-xs font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-500">
                Actividad reciente
            </h2>
            <RecentActivityTable actividad={actividad} />
        </div>
    )
}