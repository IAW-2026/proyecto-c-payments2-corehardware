export function SummaryCard({ icon: Icon, label, value, accent }: {
    icon: React.ElementType
    label: string
    value: string | number
    accent?: boolean
}) {
    return (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 flex items-center gap-4">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${accent ? 'bg-amber-500/10' : 'bg-green-600/10 dark:bg-green-500/10'}`}>
                <Icon className={`w-4 h-4 ${accent ? 'text-amber-600 dark:text-amber-400' : 'text-green-600 dark:text-green-500'}`} strokeWidth={1.75} />
            </div>
            <div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">{label}</p>
                <p className="text-lg font-bold font-mono text-neutral-900 dark:text-neutral-100 leading-tight">{value}</p>
            </div>
        </div>
    )
}