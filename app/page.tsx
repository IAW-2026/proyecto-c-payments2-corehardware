import Link from 'next/link'
import { ArrowRight, ShieldCheck, Clock, MessageSquareWarning } from 'lucide-react'
import { ButtonPrimary, ButtonSecondary } from '@/components/ui/button'

const pillars = [
    {
        icon: ArrowRight,
        title: 'Pagos procesados',
        description: 'Los compradores reciben pedidos y los pagos se procesan directamente en la plataforma.',
    },
    {
        icon: Clock,
        title: 'Historial de acreditaciones',
        description: 'Los vendedores reciben notificaciones al instante y acceden a su historial completo.',
    },
    {
        icon: MessageSquareWarning,
        title: 'Resolución de disputas',
        description: 'Canal dedicado para gestionar y resolver disputas de pago entre partes.',
    },
    {
        icon: ShieldCheck,
        title: 'Control administrativo',
        description: 'Panel de administración para supervisar la operación completa de la plataforma.',
    },
]

export default function LandingPage() {
    return (
        <>
            <header className="border-b border-neutral-200 dark:border-neutral-900 flex justify-between items-center p-4 gap-4 h-16">
                <Link href="/" className="pl-4 flex items-baseline gap-0.5">
                    <span className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">CoreHardware</span>
                    <span className="text-base sm:text-lg font-normal text-green-600 dark:text-green-500">Payments</span>
                </Link>
                <div className="flex items-center gap-2">
                    <Link href="/sign-in">
                        <ButtonSecondary>Sign In</ButtonSecondary>
                    </Link>
                    <Link href="/sign-up">
                        <ButtonPrimary>Sign Up</ButtonPrimary>
                    </Link>
                </div>
            </header>
            <main className="flex-1 flex flex-col">
                {/* ── Sección principal ── */}
                <section className="relative flex flex-col items-center justify-center text-center px-6 py-28 md:py-40 overflow-hidden">
                    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
                        <svg
                            className="absolute inset-0 w-full h-full"
                            xmlns="http://www.w3.org/2000/svg"
                            preserveAspectRatio="xMidYMid slice"
                        >
                            <defs>
                                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
                                </pattern>
                            </defs>
                            <rect
                                width="100%" height="100%"
                                fill="url(#grid)"
                                className="text-neutral-400 dark:text-neutral-600"
                                opacity="0.3"
                            />
                        </svg>
                        <div className="absolute inset-0 bg-gradient-to-b from-neutral-50 via-transparent to-neutral-50 dark:from-neutral-950 dark:via-transparent dark:to-neutral-950" />
                        <div className="absolute inset-0 bg-gradient-to-r from-neutral-50 via-transparent to-neutral-50 dark:from-neutral-950 dark:via-transparent dark:to-neutral-950" />
                    </div>

                    <div className="relative mb-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs font-mono text-neutral-600 dark:text-neutral-400">
                            Plataforma activa
                        </span>
                    </div>

                    <h1 className="relative max-w-2xl text-4xl md:text-6xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100 leading-[1.1] mb-5">
                        Pagos CoreHardware,{' '}
                        <br className="hidden md:block" />
                        <span className="text-green-600 dark:text-green-500">simple y seguro.</span>
                    </h1>

                    <p className="relative max-w-lg text-base md:text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed mb-10">
                        Procesá cobros, notificá acreditaciones y resolvé disputas — todo en un solo lugar.
                    </p>

                    <div className="relative flex flex-wrap items-center justify-center gap-3">
                        <Link
                            href="/sign-up"
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-500 dark:bg-green-500 dark:hover:bg-green-400 text-white dark:text-neutral-950 font-medium text-sm rounded-lg transition-colors active:scale-[0.98]"
                        >
                            Crear cuenta
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link
                            href="/sign-in"
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-neutral-200 dark:border-neutral-800 text-sm rounded-lg transition-colors active:scale-[0.98]"
                        >
                            Iniciar sesión
                        </Link>
                    </div>
                </section>

                {/* ── Pilares ── */}
                <section className="py-20 px-6 border-t border-neutral-200 dark:border-neutral-900">
                    <div className="mx-auto max-w-5xl">
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-neutral-200 dark:bg-neutral-800 rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800">
                            {pillars.map(({ icon: Icon, title, description }) => (
                                <div
                                    key={title}
                                    className="group bg-white dark:bg-neutral-900 p-6 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-colors"
                                >
                                    <div className="mb-4 inline-flex items-center justify-center w-8 h-8 rounded-lg bg-green-600/10 dark:bg-green-500/10">
                                        <Icon className="w-4 h-4 text-green-600 dark:text-green-500" strokeWidth={1.75} />
                                    </div>
                                    <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm mb-2">
                                        {title}
                                    </h3>
                                    <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                                        {description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Acceso a las otras apps ── */}
                <section className="py-20 px-6 border-t border-neutral-200 dark:border-neutral-900 bg-neutral-100/50 dark:bg-neutral-900/30">
                    <div className="mx-auto max-w-5xl">
                        <div className="mb-10 text-center">
                            <p className="text-xs font-mono text-green-600 dark:text-green-500 uppercase tracking-widest mb-2">Acceso directo</p>
                            <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                                ¿Ya tenés cuenta? Ingresá a tu plataforma.
                            </h2>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                            <Link
                                href="#"
                                className="group flex flex-col gap-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-green-600/40 dark:hover:border-green-500/30 rounded-xl p-6 transition-colors"
                            >
                                <div className="w-8 h-8 rounded-lg bg-green-600/10 dark:bg-green-500/10 flex items-center justify-center">
                                    <ArrowRight className="w-4 h-4 text-green-600 dark:text-green-500" strokeWidth={1.75} />
                                </div>
                                <div>
                                    <p className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm mb-1">App de compra</p>
                                    <p className="text-xs text-neutral-500 dark:text-neutral-400">Accedé al portal de pedidos y seguimiento de pagos.</p>
                                </div>
                                <span className="mt-auto inline-flex items-center gap-1 text-xs font-medium text-green-600 dark:text-green-500 group-hover:gap-2 transition-all">
                                    Ir a la app <ArrowRight className="w-3 h-3" />
                                </span>
                            </Link>

                            <Link
                                href="#"
                                className="group flex flex-col gap-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-green-600/40 dark:hover:border-green-500/30 rounded-xl p-6 transition-colors"
                            >
                                <div className="w-8 h-8 rounded-lg bg-green-600/10 dark:bg-green-500/10 flex items-center justify-center">
                                    <Clock className="w-4 h-4 text-green-600 dark:text-green-500" strokeWidth={1.75} />
                                </div>
                                <div>
                                    <p className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm mb-1">App de venta</p>
                                    <p className="text-xs text-neutral-500 dark:text-neutral-400">Revisá acreditaciones y gestioná tu historial de cobros.</p>
                                </div>
                                <span className="mt-auto inline-flex items-center gap-1 text-xs font-medium text-green-600 dark:text-green-500 group-hover:gap-2 transition-all">
                                    Ir a la app <ArrowRight className="w-3 h-3" />
                                </span>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* ── Contacto ── */}
                <section className="py-20 px-6 border-t border-neutral-200 dark:border-neutral-900">
                    <div className="mx-auto max-w-5xl grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <p className="text-xs font-mono text-green-600 dark:text-green-500 uppercase tracking-widest mb-3">Contacto</p>
                            <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 mb-3">
                                ¿Trabajás con nosotros?
                            </h2>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                Si sos parte del equipo de logística o necesitás acceso como shipper, contactanos directamente. El acceso a esa plataforma se gestiona de forma interna.
                            </p>
                        </div>
                        <div className="bg-neutral-100/60 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-neutral-400">Nombre</label>
                                <input
                                    type="text"
                                    placeholder="Tu nombre"
                                    className="w-full px-3 py-2 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-lg text-sm text-neutral-800 dark:text-neutral-200 placeholder:text-neutral-400 dark:placeholder:text-neutral-700 focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/10 dark:focus:border-green-500 dark:focus:ring-green-500/10 transition-all"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-neutral-400">Email</label>
                                <input
                                    type="email"
                                    placeholder="tu@email.com"
                                    className="w-full px-3 py-2 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-lg text-sm text-neutral-800 dark:text-neutral-200 placeholder:text-neutral-400 dark:placeholder:text-neutral-700 focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/10 dark:focus:border-green-500 dark:focus:ring-green-500/10 transition-all"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-neutral-400">Mensaje</label>
                                <textarea
                                    rows={3}
                                    placeholder="Contanos en qué podemos ayudarte..."
                                    className="w-full px-3 py-2 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-lg text-sm text-neutral-800 dark:text-neutral-200 placeholder:text-neutral-400 dark:placeholder:text-neutral-700 focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/10 dark:focus:border-green-500 dark:focus:ring-green-500/10 transition-all resize-none"
                                />
                            </div>
                            <button className="w-full px-4 py-2.5 bg-green-600 hover:bg-green-500 dark:bg-green-500 dark:hover:bg-green-400 text-white dark:text-neutral-950 font-medium text-sm rounded-lg transition-colors active:scale-[0.98]">
                                Enviar mensaje
                            </button>
                        </div>
                    </div>
                </section>

                {/* ── Footer ── */}
                <footer className="mt-auto border-t border-neutral-200 dark:border-neutral-900 py-6 px-6">
                    <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-2">
                        <div className="flex items-baseline gap-0.5">
                            <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">CoreHardware</span>
                            <span className="text-xs font-normal text-green-600 dark:text-green-500">Payments</span>
                        </div>
                        <p className="text-xs font-mono text-neutral-500">
                            © {new Date().getFullYear()} · Todos los derechos reservados
                        </p>
                    </div>
                </footer>

            </main>
        </>
    )
}