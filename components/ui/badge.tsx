import { HTMLAttributes } from 'react'
 
type BadgeVariant = 'default' | 'accent' | 'mono' | 'warning' | 'danger'
 
interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: BadgeVariant
}
 
const variantClasses: Record<BadgeVariant, string> = {
    default: 'bg-white text-neutral-700 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700',
    accent:  'bg-green-100 text-green-800 border-green-200 dark:bg-green-500/10 dark:text-green-500 dark:border-green-500/20',
    mono:    'bg-neutral-200 text-neutral-600 border-transparent dark:bg-neutral-950 dark:text-neutral-400',
    warning: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
    danger:  'bg-red-100 text-red-800 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20',
}
 
export function Badge({ variant = 'default', className = '', ...props }: BadgeProps) {
    return (
        <span
            className={`px-2 py-0.5 text-xs font-medium rounded border ${variantClasses[variant]} ${className}`}
            {...props}
        />
    )
}
 