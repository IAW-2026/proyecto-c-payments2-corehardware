import { KPIsSkeleton, ActivitySkeleton } from '@/components/skeletons'

export default function Loading() {
    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="space-y-1">
                <div className="h-7 w-28 rounded bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
                <div className="h-4 w-48 rounded bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
            </div>
            <div className="flex flex-wrap gap-3">
                <div className="h-9 w-40 rounded-lg bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
                <div className="h-9 w-44 rounded-lg bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
                <div className="h-9 w-48 rounded-lg bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
            </div>
            <KPIsSkeleton />
            <div className="h-64 rounded-xl bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
            <ActivitySkeleton />
        </div>
    )
}