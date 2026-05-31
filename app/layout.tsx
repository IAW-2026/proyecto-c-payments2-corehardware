import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'CoreHardware Payments',
    description: 'Plataforma de pagos CoreHardware',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="es" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
            <body className="min-h-full flex flex-col bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100 transition-colors duration-200">
                <ClerkProvider signInUrl="/sign-in" signUpUrl="/sign-up">
                    {children}
                </ClerkProvider>
            </body>
        </html>
    )
}