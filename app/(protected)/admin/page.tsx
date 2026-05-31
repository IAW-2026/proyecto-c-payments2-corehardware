import { Suspense } from 'react'
import { AdminSummarySection } from '@/components/admin/summary-section'
import { AdminActivitySection } from '@/components/admin/activity-section'
import { AdminVendedoresSection } from '@/components/admin/vendedores-section'
import { SummarySkeleton, ActivitySkeleton, VendedoresSkeleton } from '@/components/skeletons'

export default function AdminHomePage() {
    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div>
                <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">Inicio</h1>
                <p className="text-sm text-neutral-500 mt-0.5">Estado general del sistema.</p>
            </div>

            <Suspense fallback={<SummarySkeleton columns={4} />}>
                <AdminSummarySection />
            </Suspense>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Suspense fallback={<ActivitySkeleton />}>
                    <AdminActivitySection />
                </Suspense>
                <Suspense fallback={<VendedoresSkeleton />}>
                    <AdminVendedoresSection />
                </Suspense>
            </div>
        </div>
    )
}