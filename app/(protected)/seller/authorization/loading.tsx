export default function Loading() {
    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="space-y-1">
                <div className="h-7 w-32 rounded bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
                <div className="h-4 w-80 rounded bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
            </div>
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-8 max-w-lg space-y-6">
                <div className="space-y-2">
                    <div className="h-4 w-64 rounded bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
                    <div className="space-y-1.5">
                        <div className="h-3.5 w-full rounded bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
                        <div className="h-3.5 w-full rounded bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
                        <div className="h-3.5 w-3/4 rounded bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
                    </div>
                </div>
                <div className="space-y-2">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center gap-2.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-neutral-200 dark:bg-neutral-700 flex-shrink-0" />
                            <div className="h-3.5 rounded bg-neutral-100 dark:bg-neutral-800 animate-pulse" style={{ width: `${[75, 65, 85][i]}%` }} />
                        </div>
                    ))}
                </div>
                <div className="h-10 w-52 rounded-lg bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
            </div>
        </div>
    )
}