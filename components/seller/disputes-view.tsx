'use client'

import { useState, useTransition } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { TabButton } from '@/components/ui/tab-button'
import { DisputeRow } from '@/components/seller/dispute-row'
import { DisputeResolveModal } from '@/components/seller/dispute-resolve-modal'
import { Dispute, DisputeStatus } from '@/types/dispute'
import { resolveDispute } from '@/actions/disputes'
import { PaginationButton, PAGINATION_PREV_LABEL, PAGINATION_NEXT_LABEL } from '@/components/ui/pagination-button'


interface DisputesViewProps {
    initialDisputes: Dispute[]
    emailsMap: Record<string, string>
    total: number
    offset: number
    limit: number
    tab: 'pendientes' | 'resueltas'
    totalPendingGlobal: number
}


export function DisputesView({
    initialDisputes,
    emailsMap,
    total,
    offset,
    limit,
    tab,
    totalPendingGlobal
}: DisputesViewProps) {
    const router = useRouter()
    const pathname = usePathname()
    const [, startTransition] = useTransition()
    const [disputaActiva, setDisputaActiva] = useState<Dispute | null>(null)

    function switchTab(nuevaTab: 'pendientes' | 'resueltas') {
        const sp = new URLSearchParams()
        sp.set('tab', nuevaTab)
        startTransition(() => router.replace(`${pathname}?${sp.toString()}`))
    }

    function buildHref(nuevoOffset: number) {
        const sp = new URLSearchParams({ tab, offset: nuevoOffset.toString() })
        return `${pathname}?${sp.toString()}`
    }

    const hasPrev = offset > 0
    const hasNext = offset + limit < total

    async function handleResolver(id: string, estado: Exclude<DisputeStatus, 'pendiente'>) {
        await resolveDispute(id, estado)
        setDisputaActiva(null)
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div>
                <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">Disputas</h1>
                <p className="text-sm text-neutral-500 mt-0.5">
                    Revisá y resolvé las disputas abiertas por compradores.
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
                <TabButton active={tab === 'resueltas'} onClick={() => switchTab('resueltas')}>
                    Resueltas
                </TabButton>
            </div>

            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
                <table className="w-full">
                    <thead className="hidden md:table-header-group border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/80">
                        <tr>
                            {['Fecha', 'Disputa', 'Monto', 'Estado'].map((h) => (
                                <th key={h} className={`px-4 py-2.5 text-xs font-mono text-neutral-400 font-normal ${h === 'Estado' ? 'text-right' : 'text-left'}`}>
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {initialDisputes.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="py-16 text-center text-sm text-neutral-400 dark:text-neutral-600">
                                    No hay disputas {tab}.
                                </td>
                            </tr>
                        ) : (
                            initialDisputes.map((d) => (
                                <DisputeRow
                                    key={d.id}
                                    disputa={d}
                                    emailComprador={emailsMap[d.pago?.buyerClerkUserId ?? '']}
                                    onResolver={setDisputaActiva}
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

            {disputaActiva && (
                <DisputeResolveModal
                    disputa={disputaActiva}
                    onClose={() => setDisputaActiva(null)}
                    onResolver={handleResolver}
                />
            )}
        </div>
    )
}