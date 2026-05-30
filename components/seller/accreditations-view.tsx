'use client'

import { useState } from 'react'
import { Payment } from '@/types/payments'
import { AccreditationRow } from '@/components/seller/accreditation-row'
import { TabButton } from '@/components/ui/tab-button'

type Tab = 'pendientes' | 'acreditados'

interface AcreditationsViewProps {
    acreditaciones: Payment[]
    mapaNombres: Record<string, string>
}

export function AccreditationsView({ acreditaciones, mapaNombres }: AcreditationsViewProps) {
    const [tab, setTab] = useState<Tab>('pendientes')

    const lista = acreditaciones.filter(a =>
        tab === 'pendientes'
            ? a.estado === 'pendiente' || a.estado === 'en_proceso'
            : a.estado === 'acreditado' || a.estado === 'rechazado'
    )

    const cantPendientes = acreditaciones.filter(a =>
        a.estado === 'pendiente' || a.estado === 'en_proceso'
    ).length

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
                <TabButton active={tab === 'pendientes'} onClick={() => setTab('pendientes')}>
                    Pendientes
                    {cantPendientes > 0 && (
                        <span className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 text-xs font-mono">
                            {cantPendientes}
                        </span>
                    )}
                </TabButton>
                <TabButton active={tab === 'acreditados'} onClick={() => setTab('acreditados')}>
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
                        {lista.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="py-16 text-center text-sm text-neutral-400 dark:text-neutral-600">
                                    No hay acreditaciones {tab === 'pendientes' ? 'pendientes' : 'realizadas'}.
                                </td>
                            </tr>
                        ) : (
                            lista.map((a) => (
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
        </div>
    )
}