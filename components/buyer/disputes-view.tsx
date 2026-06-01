'use client'

import { useState, useTransition } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { TabButton } from '@/components/ui/tab-button'
import { ButtonPrimary } from '@/components/ui/button'
import { DisputeRow } from '@/components/buyer/dispute-row'
import { DisputeModal } from '@/components/buyer/dispute-modal'
import { Dispute } from '@/types/dispute'
import { Payment } from '@/types/payments'
import { PAGINATION_NEXT_LABEL, PAGINATION_PREV_LABEL, PaginationButton } from '@/components/ui/pagination-button'


interface DisputesViewProps {
    disputes: Dispute[]
    amounts: Map<Dispute, string>
    disputablePayments: Payment[]
    total: number
    offset: number
    limit: number
    tab: 'activas' | 'resueltas'
    totalActivas: number
}


export function DisputesView({
    disputes,
    amounts,
    disputablePayments,
    total,
    offset,
    limit,
    tab,
    totalActivas,
}: DisputesViewProps) {
    const router = useRouter()
    const pathname = usePathname()
    const [, startTransition] = useTransition()
    const [modalAbierto, setModalAbierto] = useState(false)


    function switchTab(nuevaTab: 'activas' | 'resueltas') {
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

            {/* Encabezado */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">Disputas</h1>
                    <p className="text-sm text-neutral-500 mt-0.5">
                        Gestioná tus quejas sobre pedidos cobrados.
                    </p>
                </div>
                <ButtonPrimary onClick={() => setModalAbierto(true)}>
                    Nueva disputa
                </ButtonPrimary>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-neutral-200 dark:border-neutral-800">
                <TabButton active={tab === 'activas'} onClick={() => switchTab('activas')}>
                    Activas
                    {totalActivas > 0 && (
                        <span className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 text-xs font-mono">
                            {totalActivas}
                        </span>
                    )}
                </TabButton>
                <TabButton active={tab === 'resueltas'} onClick={() => switchTab('resueltas')}>
                    Resueltas
                </TabButton>
            </div>

            {/* Tabla */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
                <table className="w-full">
                    <thead className="hidden md:table-header-group border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/80">
                        <tr>
                            {['Fecha', 'Descripción', 'Monto', 'Estado'].map((h) => (
                                <th key={h} className={`px-4 py-2.5 text-xs font-mono text-neutral-400 dark:text-neutral-400 font-normal ${h === 'Estado' ? 'text-right' : 'text-left'}`}>
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {disputes.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="py-16 text-center text-sm text-neutral-400 dark:text-neutral-600">
                                    No hay disputes {tab === 'activas' ? 'activas' : 'resueltas'}.
                                </td>
                            </tr>
                        ) : (
                            disputes.map((d) => (
                                <DisputeRow key={d.id} disputa={d} monto={amounts.get(d) ?? '0'} />
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

            {/* Modal */}
            {modalAbierto && (
                <DisputeModal
                    onClose={() => setModalAbierto(false)}
                    disputablePayments={disputablePayments}
                />
            )}

        </div>
    )
}