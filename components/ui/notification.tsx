import { HTMLAttributes } from 'react'


type NotificationVariant = 'accent' | 'warning' | 'danger'

interface NotificationProps extends HTMLAttributes<HTMLDivElement> {
    variant?: NotificationVariant
}

const variantClasses: Record<NotificationVariant, { container: string; dot: string; text: string }> = {
    accent:  { container: 'bg-green-500/10 border-green-500/10',  dot: 'bg-green-600 dark:bg-green-500',  text: 'text-green-800 dark:text-green-500' },
    warning: { container: 'bg-amber-500/10 border-amber-500/10',  dot: 'bg-amber-600 dark:bg-amber-400',  text: 'text-amber-800 dark:text-amber-400' },
    danger:  { container: 'bg-red-500/10 border-red-500/10',      dot: 'bg-red-600 dark:bg-red-400',      text: 'text-red-800 dark:text-red-400' },
}


export function Notification({ variant = 'accent', className = '', children, ...props }: NotificationProps) {
    const { container, dot, text } = variantClasses[variant]
    return (
        <div className={`p-4 border rounded-lg flex gap-3 items-start ${container} ${className}`} {...props}>
            <div className={`w-2 h-2 rounded-full mt-1.5 animate-pulse flex-shrink-0 ${dot}`} />
            <p className={`text-xs ${text}`}>{children}</p>
        </div>
    )
}