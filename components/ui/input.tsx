import { InputHTMLAttributes } from 'react'
 
export function Input({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            className={`w-full px-3 py-2 text-sm rounded-lg transition-all bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 placeholder:text-neutral-400 dark:placeholder:text-neutral-700 focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/10 dark:focus:border-green-500 dark:focus:ring-green-500/10 ${className}`}
            {...props}
        />
    )
}
 