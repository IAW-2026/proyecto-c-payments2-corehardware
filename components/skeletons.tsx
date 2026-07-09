export function AlertsSkeleton() {
    return (
        <div className="h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
    )
}

export function SummarySkeleton({ columns = 3 }: { columns?: number }) {
    return (
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${columns} gap-3`}>
            {[...Array(columns)].map((_, i) => (
                <div key={i} className="h-24 rounded-xl bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
            ))}
        </div>
    )
}

export function ActivitySkeleton() {
    return (
        <div className="space-y-3">
            <div className="h-3.5 w-32 rounded bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4 px-4 py-3.5 border-b border-neutral-100 dark:border-neutral-800 last:border-0">
                        <div className="flex-1 space-y-1.5">
                            <div className="h-3.5 w-48 rounded bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
                            <div className="h-3 w-24 rounded bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
                        </div>
                        <div className="h-5 w-14 rounded-full bg-neutral-100 dark:bg-neutral-800 animate-pulse hidden md:block" />
                        <div className="h-3.5 w-20 rounded bg-neutral-100 dark:bg-neutral-800 animate-pulse hidden md:block" />
                        <div className="h-5 w-16 rounded-full bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
                    </div>
                ))}
            </div>
        </div>
    )
}

export function KPIsSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 space-y-2">
                    <div className="h-3 w-24 rounded bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
                    <div className="h-6 w-32 rounded bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
                    <div className="h-3 w-28 rounded bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
                </div>
            ))}
        </div>
    )
}

export function VendedoresSkeleton() {
    return (
        <div className="space-y-3">
            <div className="h-3.5 w-48 rounded bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between px-4 py-3.5 border-b border-neutral-100 dark:border-neutral-800 last:border-0">
                        <div className="space-y-1.5">
                            <div className="h-3.5 w-36 rounded bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
                            <div className="h-3 w-24 rounded bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
                        </div>
                        <div className="h-3 w-20 rounded bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
                    </div>
                ))}
            </div>
        </div>
    )
}