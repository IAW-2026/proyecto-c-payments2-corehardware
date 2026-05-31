import Link from 'next/link'
import { SignInButton } from '@clerk/nextjs'
import { ButtonPrimary, ButtonSecondary } from '@/components/ui/button'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <header className="border-b border-neutral-200 dark:border-neutral-900 flex justify-between items-center p-4 gap-4 h-16">
                <Link href="/" className="pl-4 flex items-baseline gap-0.5">
                    <span className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">CoreHardware</span>
                    <span className="text-base sm:text-lg font-normal text-green-600 dark:text-green-500">Payments</span>
                </Link>
                <div className="flex items-center gap-2">
                    <SignInButton>
                        <ButtonSecondary>Sign In</ButtonSecondary>
                    </SignInButton>
                    <Link href="/sign-up">
                        <ButtonPrimary>Sign Up</ButtonPrimary>
                    </Link>
                </div>
            </header>
            <div className="relative flex flex-1 items-center justify-center overflow-hidden py-12 px-4">
                <div aria-hidden className="pointer-events-none absolute inset-0">
                    <svg
                        className="absolute inset-0 w-full h-full"
                        xmlns="http://www.w3.org/2000/svg"
                        preserveAspectRatio="xMidYMid slice"
                    >
                        <defs>
                            <pattern id="auth-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
                            </pattern>
                        </defs>
                        <rect
                            width="100%" height="100%"
                            fill="url(#auth-grid)"
                            className="text-neutral-400 dark:text-neutral-600"
                            opacity="0.3"
                        />
                    </svg>
                    <div className="absolute inset-0 bg-gradient-to-b from-neutral-50 via-transparent to-neutral-50 dark:from-neutral-950 dark:via-transparent dark:to-neutral-950" />
                    <div className="absolute inset-0 bg-gradient-to-r from-neutral-50 via-transparent to-neutral-50 dark:from-neutral-950 dark:via-transparent dark:to-neutral-950" />
                </div>
                <div className="relative z-10">
                    {children}
                </div>
            </div>
        </>
    )
}