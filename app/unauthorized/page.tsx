import { SignOutButton } from '@clerk/nextjs'
import { ShieldAlert } from 'lucide-react'

export default function UnauthorizedPage() {
    return (
        <main className="min-h-screen flex items-center justify-center px-6">
            <div className="relative z-10 w-full max-w-md flex flex-col gap-6">
                <div className="text-center">
                    <p className="text-xs font-mono text-green-600 dark:text-green-500 uppercase tracking-widest mb-2">
                        CoreHardware
                    </p>
                    <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 mb-2">
                        Acceso denegado
                    </h1>
                </div>

                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-8 flex flex-col items-center gap-4">
                    <div className="w-8 h-8 rounded-lg bg-green-600/10 dark:bg-green-500/10 flex items-center justify-center">
                        <ShieldAlert className="w-4 h-4 text-green-600 dark:text-green-500" strokeWidth={1.75} />
                    </div>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed text-center">
                        El acceso a esta plataforma no está habilitado para tu cuenta. Por favor, cerrá sesión e ingresá con una cuenta autorizada.
                    </p>
                </div>

                <SignOutButton redirectUrl="/">
                    <button className="inline-flex items-center justify-center w-full px-5 py-2.5 bg-green-600 hover:bg-green-500 dark:bg-green-500 dark:hover:bg-green-400 text-white dark:text-neutral-950 font-medium text-sm rounded-lg transition-colors active:scale-[0.98]">
                        Cerrar sesión
                    </button>
                </SignOutButton>
            </div>
        </main>
    )
}