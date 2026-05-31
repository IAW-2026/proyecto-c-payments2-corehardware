import Link from 'next/link'
import { ShoppingCart, Store } from 'lucide-react'
import { ButtonPrimary } from '@/components/ui/button'


const roles = [
    {
        icon: ShoppingCart,
        title: 'Comprador',
        description: 'Accedé al portal de pedidos y seguimiento de pagos.',
        href: 'https://github.com/IAW-2026/proyecto-c-buyer2-corehardware',
        Button: ButtonPrimary,
    },
    {
        icon: Store,
        title: 'Vendedor',
        description: 'Publicá productos y gestioná tu historial de cobros.',
        href: 'https://github.com/IAW-2026/proyecto-c-seller2-corehardware',
        Button: ButtonPrimary,
    },
]


export default function SignUpRolePage() {
    return (
        <div className="relative z-10 w-full max-w-md flex flex-col gap-6">
            <div className="text-center">
                <p className="text-xs font-mono text-green-600 dark:text-green-500 uppercase tracking-widest mb-2">
                    Crear cuenta
                </p>
                <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 mb-2">
                    ¿Cómo vas a usar CoreHardware?
                </h1>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Elegí el tipo de cuenta que mejor se adapta a vos.
                </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {roles.map(({ icon: Icon, title, description, href, Button }) => (
                    <Link
                        key={title}
                        href={href}
                        className="group flex flex-col gap-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-green-600/40 dark:hover:border-green-500/30 rounded-xl p-5 transition-colors"
                    >
                        <div className="w-8 h-8 rounded-lg bg-green-600/10 dark:bg-green-500/10 flex items-center justify-center">
                            <Icon className="w-4 h-4 text-green-600 dark:text-green-500" strokeWidth={1.75} />
                        </div>
                        <div>
                            <p className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 mb-1">{title}</p>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">{description}</p>
                        </div>
                        <Button className="w-full mt-auto">{title}</Button>
                    </Link>
                ))}
            </div>

            <p className="text-center text-xs text-neutral-500 dark:text-neutral-400">
                ¿Ya tenés cuenta?{' '}
                <Link href="/sign-in" className="text-green-600 dark:text-green-500 hover:underline">
                    Iniciá sesión
                </Link>
            </p>
        </div>
    )
}