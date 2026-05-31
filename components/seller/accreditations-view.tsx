'use client'

import { useTransition } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Payment } from '@/types/payments'
import { AccreditationRow } from '@/components/seller/accreditation-row'
import { TabButton } from '@/components/ui/tab-button'
import { PaginationButton, PAGINATION_PREV_LABEL, PAGINATION_NEXT_LABEL } from '@/components/ui/pagination-button'


interface AcreditationsViewProps {
    initialAcreditaciones: Payment[]
    mapaNombres: Record<string, string>
    total: number
    offset: number
    limit: number
    tab: 'pendientes' | 'acreditados'
    totalPendientesAbsoluto: number
}

export function AccreditationsView({ 
    initialAcreditaciones, 
    mapaNombres, 
    total, 
    offset, 
    limit, 
    tab, 
    totalPendientesAbsoluto 
}: AcreditationsViewProps) {
    const router = useRouter()
    const pathname = usePathname()
    const [, startTransition] = useTransition()

    function switchTab(nuevaTab: 'pendientes' | 'acreditados') {
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

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Encabezado */}
            <div>
                <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">Acreditaciones</h1>
                <p className="text-sm text-neutral-500 dark:text-neutral-500 mt-0.5">
                    Historial de pagos acreditados a tu cuenta.
                </p>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-neutral-200 dark:border-neutral-800">
                <TabButton active={tab === 'pendientes'} onClick={() => switchTab('pendientes')}>
                    Pendientes
                    {totalPendientesAbsoluto > 0 && (
                        <span className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 text-xs font-mono">
                            {totalPendientesAbsoluto}
                        </span>
                    )}
                </TabButton>
                <TabButton active={tab === 'acreditados'} onClick={() => switchTab('acreditados')}>
                    Acreditados
                </TabButton>
            </div>

            {/* Tabla */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
                <table className="w-full">
                    <thead className="hidden md:table-header-group border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/80">
                        <tr>
                            {['Fecha', 'Pedido', 'Comprador', 'Monto', 'Estado'].map((h) => (
                                <th key={h} className="px-4 py-2.5 text-xs font-mono text-neutral-400 font-normal text-left">
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {initialAcreditaciones.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="py-16 text-center text-sm text-neutral-400 dark:text-neutral-600">
                                    No hay acreditaciones {tab}.
                                </td>
                            </tr>
                        ) : (
                            initialAcreditaciones.map((a) => (
                                <AccreditationRow 
                                    key={a.id} 
                                    accreditation={a} 
                                    nombreComprador={mapaNombres[a.buyerClerkUserId]} 
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

        </div>
    )
}