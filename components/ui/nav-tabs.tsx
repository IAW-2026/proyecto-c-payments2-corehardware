import { HTMLAttributes } from 'react'
 
export function StatusBlock({ title, description, className = '', ...props }: HTMLAttributes<HTMLDivElement> & { title: string, description: string }) {
    return (
        <div
            className={`p-4 bg-green-100 dark:bg-green-500/10 border border-green-100 dark:border-green-500/10 rounded-lg flex gap-3 items-start ${className}`}
            {...props}
        >
            <div className="w-2 h-2 rounded-full bg-green-600 dark:bg-green-500 mt-1.5 animate-pulse shrink-0" />
            <div className="text-xs space-y-1">
                <p className="font-semibold text-green-800 dark:text-green-500">{title}</p>
                <p className="text-neutral-600 dark:text-neutral-400">{description}</p>
            </div>
        </div>
    )
}
 
export function TabItemActive({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={`flex-1 md:flex-none text-sm md:text-lg font-medium text-neutral-900 dark:text-neutral-100 bg-neutral-100 dark:bg-neutral-900 border-b-2 md:border-b-0 md:border-l-2 border-green-500 px-3 py-2 ${className}`}
            {...props}
        />
    )
}

export function TabItem({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={`flex-1 md:flex-none text-sm md:text-lg text-neutral-600 dark:text-neutral-400 border-b-2 md:border-b-0 md:border-l-2 border-transparent hover:bg-neutral-100 dark:hover:bg-neutral-900 hover:text-neutral-900 dark:hover:text-neutral-100 active:bg-neutral-200 dark:active:bg-neutral-800 px-3 py-2 transition-colors cursor-pointer ${className}`}
            {...props}
        />
    )
}