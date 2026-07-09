import Link from 'next/link'
import { UserButton } from '@clerk/nextjs'


export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <header className="border-b border-neutral-200 dark:border-neutral-900 flex justify-between items-center p-4 gap-4 h-16">
                <Link href="/" className="pl-4 flex items-baseline gap-0.5">
                    <span className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">CoreHardware</span>
                    <span className="text-base sm:text-lg font-normal text-green-600 dark:text-green-500">Payments</span>
                </Link>
                <UserButton />
            </header>
            {children}
        </>
    )
}