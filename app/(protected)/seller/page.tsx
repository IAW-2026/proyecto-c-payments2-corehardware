import { Suspense } from 'react'
import { SellerAlertsSection } from '@/components/seller/alerts-section'
import { SellerSummarySection } from '@/components/seller/summary-section'
import { SellerActivitySection } from '@/components/seller/activity-section'
import { AlertsSkeleton, SummarySkeleton, ActivitySkeleton } from '@/components/skeletons'

export default function SellerHomePage() {
    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div>
                <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">Inicio</h1>
                <p className="text-sm text-neutral-500 mt-0.5">Resumen de tu actividad.</p>
            </div>

            <Suspense fallback={<AlertsSkeleton />}>
                <SellerAlertsSection />
            </Suspense>

            <Suspense fallback={<SummarySkeleton />}>
                <SellerSummarySection />
            </Suspense>

            <Suspense fallback={<ActivitySkeleton />}>
                <SellerActivitySection />
            </Suspense>
        </div>
    )
}