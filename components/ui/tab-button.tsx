import { ButtonHTMLAttributes } from 'react'
 

interface TabButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    active?: boolean
}

 
export function TabButton({ active = false, className = '', ...props }: TabButtonProps) {
    return (
        <button
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
                active
                    ? 'border-green-500 text-neutral-900 dark:text-neutral-100'
                    : 'border-transparent text-neutral-500 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
            } ${className}`}
            {...props}
        />
    )
}