'use client'

import { useRouter } from 'next/navigation'
import { ButtonSecondary } from '@/components/ui/button'

export function NotFoundView() {
    const router = useRouter()
    return (
        <div className="relative flex flex-1 items-center justify-center overflow-hidden py-12 px-4 min-h-full">
            <div aria-hidden className="pointer-events-none absolute inset-0">
                <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
                    <defs>
                        <pattern id="nf-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#nf-grid)" className="text-neutral-400 dark:text-neutral-600" opacity="0.3" />
                </svg>
                <div className="absolute inset-0 bg-gradient-to-b from-neutral-50 via-transparent to-neutral-50 dark:from-neutral-950 dark:via-transparent dark:to-neutral-950" />
                <div className="absolute inset-0 bg-gradient-to-r from-neutral-50 via-transparent to-neutral-50 dark:from-neutral-950 dark:via-transparent dark:to-neutral-950" />
            </div>
            <div className="relative z-10 flex flex-col items-center text-center gap-4">
                <p className="text-xs font-mono text-green-600 dark:text-green-500 uppercase tracking-widest">404</p>
                <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">Página no encontrada</h1>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-xs">
                    La dirección que ingresaste no existe o fue movida.
                </p>
                <ButtonSecondary className="mt-2" onClick={() => router.push('/')}>
                    Volver al inicio
                </ButtonSecondary>
            </div>
        </div>
    )
}