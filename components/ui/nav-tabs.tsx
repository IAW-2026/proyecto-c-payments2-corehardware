import Link from 'next/link'
import { AnchorHTMLAttributes } from 'react'
import { LinkProps } from 'next/link'
 
type tabProps = AnchorHTMLAttributes<HTMLAnchorElement> & LinkProps


export function TabItemActive({ className = '', ...props }: tabProps) {
    return (
        <Link
            className={`flex-1 md:flex-none text-sm md:text-lg font-medium text-neutral-900 dark:text-neutral-100 bg-neutral-100 dark:bg-neutral-900 border-b-2 md:border-b-0 md:border-l-2 border-green-500 px-3 py-2 ${className}`}
            {...props}
        />
    )
}

export function TabItem({ className = '', ...props }: tabProps) {
    return (
        <Link
            className={`flex-1 md:flex-none text-sm md:text-lg text-neutral-600 dark:text-neutral-400 border-b-2 md:border-b-0 md:border-l-2 border-transparent hover:bg-neutral-100
                dark:hover:bg-neutral-900 hover:text-neutral-900 dark:hover:text-neutral-100 active:bg-neutral-200 dark:active:bg-neutral-800 px-3 py-2 transition-colors cursor-pointer ${className}`}
            {...props}
        />
    )
}