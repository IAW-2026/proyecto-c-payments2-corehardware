'use client'

import { useState, useTransition } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Payment } from '@/types/payments'
import { PaymentRow } from '@/components/buyer/payment-row'
import { PaymentModal } from '@/components/buyer/payment-modal'
import { TabButton } from '@/components/ui/tab-button'
import { fetchSellerPublicKey } from '@/lib/query/buyer'
import { PAGINATION_NEXT_LABEL, PAGINATION_PREV_LABEL, PaginationButton } from '@/components/ui/pagination-button'
import { ButtonSecondary } from '../ui/button'


interface PaymentsViewProps {
    initialPagos: Payment[]
    total: number
    offset: number
    limit: number
    tab: 'pendientes' | 'realizados'
    totalPendingGlobal: number
}


export function PaymentsView({
    initialPagos,
    total,
    offset,
    limit,
    tab,
    totalPendingGlobal
}: PaymentsViewProps) {
    const router = useRouter()
    const pathname = usePathname()
    const [, startTransition] = useTransition()
    const [pagoActivo, setPagoActivo] = useState<{ payment: Payment, publicKey: string } | null>(null);
    const [vendedorNoAutenticado, setVendedorNoAutenticado] = useState(false);

    const handleAbrirPago = async (payment: Payment) => {
        const publicKey = await fetchSellerPublicKey(payment.id);
        if (publicKey) {
            setPagoActivo({ payment, publicKey });
        } else {
            setVendedorNoAutenticado(true);
        }
    }

    function switchTab(nuevaTab: 'pendientes' | 'realizados') {
        const sp = new URLSearchParams()
        sp.set('tab', nuevaTab)
        sp.delete('offset')
        startTransition(() => router.replace(`${pathname}?${sp.toString()}`))
    }

    function buildHref(nuevoOffset: number) {
        const sp = new URLSearchParams({ tab, offset: nuevoOffset.toString() })
        return `${pathname}?${sp.toString()}`
    }

    const hasPrev = offset > 0
    const hasNext = offset + limit < total

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div>
                <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">Pagos</h1>
                <p className="text-sm text-neutral-500 dark:text-neutral-500 mt-0.5">
                    Revisá tus pagos pendientes y el historial de transacciones.
                </p>
            </div>

            <div className="flex border-b border-neutral-200 dark:border-neutral-800">
                <TabButton active={tab === 'pendientes'} onClick={() => switchTab('pendientes')}>
                    Pendientes
                    {totalPendingGlobal > 0 && (
                        <span className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 text-xs font-mono">
                            {totalPendingGlobal}
                        </span>
                    )}
                </TabButton>
                <TabButton active={tab === 'realizados'} onClick={() => switchTab('realizados')}>
                    Realizados
                </TabButton>
            </div>

            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
                <table className="w-full">
                    <thead className="hidden md:table-header-group border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/80">
                        <tr>
                            {['Fecha', 'Descripción', 'Forma de pago', 'Monto', 'Estado'].map((h) => (
                                <th key={h} className="px-4 py-2.5 text-xs font-mono text-neutral-400 dark:text-neutral-400 font-normal text-left">
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {initialPagos.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="py-16 text-center text-sm text-neutral-400 dark:text-neutral-600">
                                    No hay pagos {tab === 'pendientes' ? 'pendientes' : 'realizados'}.
                                </td>
                            </tr>
                        ) : (
                            initialPagos.map((p) => (
                                <PaymentRow
                                    key={p.id}
                                    payment={p}
                                    onPagar={tab === 'pendientes' ? (p) => handleAbrirPago(p) : undefined}
                                />
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {(hasPrev || hasNext) && (
                <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-500">
                    <span className="font-mono">
                        {offset + 1}–{Math.min(offset + limit, total)} de {total}
                    </span>
                    <div className="flex items-center gap-2">
                        <PaginationButton
                            href={buildHref(Math.max(0, offset - limit))}
                            disabled={!hasPrev}
                        >
                            {PAGINATION_PREV_LABEL}
                        </PaginationButton>

                        <PaginationButton
                            href={buildHref(offset + limit)}
                            disabled={!hasNext}
                        >
                            {PAGINATION_NEXT_LABEL}
                        </PaginationButton>
                    </div>
                </div>
            )}

            {pagoActivo && (
                <PaymentModal
                    payment={pagoActivo.payment}
                    publicKey={pagoActivo.publicKey}
                    onClose={() => setPagoActivo(null)}
                />
            )}

            {vendedorNoAutenticado && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl p-6 max-w-sm w-full mx-4 space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-full bg-amber-500/15 flex items-center justify-center">
                                <span className="text-amber-500 text-base">⚠</span>
                            </div>
                            <div>
                                <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                                    Vendedor no autenticado
                                </h2>
                                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                                    El vendedor aún no completó su configuración de cobros. Por favor, reintentá en otro momento.
                                </p>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <ButtonSecondary onClick={() => setVendedorNoAutenticado(false)}>
                                Aceptar
                            </ButtonSecondary>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}