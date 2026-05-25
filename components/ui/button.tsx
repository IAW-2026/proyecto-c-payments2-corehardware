import { X } from 'lucide-react'
import { ButtonHTMLAttributes } from 'react'
 
const base = 'px-4 py-2 font-medium text-sm rounded-lg transition-colors active:scale-[0.98] cursor-pointer'
 
const disabledClasses = 'disabled:bg-neutral-100 disabled:text-neutral-400 disabled:border disabled:border-neutral-200 disabled:cursor-not-allowed disabled:active:scale-100 dark:disabled:bg-neutral-900 dark:disabled:text-neutral-600 dark:disabled:border-neutral-900/50'


export function ButtonPrimary({ className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            className={`${base} bg-green-600 hover:bg-green-500 text-white dark:bg-green-500 dark:hover:bg-green-400 dark:text-neutral-950 ${disabledClasses} ${className}`}
            {...props}
        />
    )
}
 

export function ButtonSecondary({ className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            className={`${base} bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-neutral-200 dark:border-neutral-800 ${className}`}
            {...props}
        />
    )
}
 

export function ButtonMuted({ className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            className={`${base} bg-green-100 text-green-800 dark:bg-green-500/10 dark:hover:bg-green-500/20 dark:text-green-500 ${className}`}
            {...props}
        />
    )
}


export function ButtonClose({ className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            className={`p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 transition-colors ${className}`}
            {...props}
        >
            <X className="w-4 h-4" />
        </button>
    )
}