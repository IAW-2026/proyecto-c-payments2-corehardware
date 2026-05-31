import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'


export const PAGINATION_PREV_LABEL = (
    <div className="flex items-center gap-1">
        <ChevronLeft className="h-4 w-4 stroke-[1.5]" />
        <span>Anterior</span>
    </div>
)

export const PAGINATION_NEXT_LABEL = (
    <div className="flex items-center gap-1">
        <span>Siguiente</span>
        <ChevronRight className="h-4 w-4 stroke-[1.5]" />
    </div>
)

interface PaginationButtonProps {
    href: string
    disabled: boolean
    children: React.ReactNode
}


export function PaginationButton({ href, disabled, children }: PaginationButtonProps) {
    const className = `px-3 py-1 text-xs font-medium rounded-lg border transition-colors ${
        disabled
            ? 'bg-neutral-100 text-neutral-400 border-neutral-200 cursor-not-allowed dark:bg-neutral-900 dark:text-neutral-600 dark:border-neutral-900/50'
            : 'bg-white hover:bg-neutral-100 border-neutral-200 text-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:border-neutral-800 dark:text-neutral-200'
    }`

    if (disabled) {
        return <span className={className}>{children}</span>
    }

    return (
        <Link href={href} className={className}>
            {children}
        </Link>
    )
}