'use client'

import { useState } from 'react'
import { Accreditation } from '@/types/accreditation'
import { AccreditationRow } from '@/components/seller/accreditation-row'
import { TabButton } from '@/components/ui/tab-button'

type Tab = 'pendientes' | 'acreditados'

export default function SellerAcreditacionesPage() {
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
                                <AccreditationRow key={a.id} accreditation={a} />
                            ))
                        )}
                    </tbody>
                </table>
            </div>

        </div>
    )
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const acreditaciones: Accreditation[] = [
    { id: 1, pedidoId: 1015, fecha: '2025-05-22', descripcion: 'Pedido #1015', comprador: 'Juan Pérez',     monto: 95800,  estado: 'pendiente'  },
    { id: 2, pedidoId: 1014, fecha: '2025-05-20', descripcion: 'Pedido #1014', comprador: 'María López',    monto: 210000, estado: 'en_proceso' },
    { id: 3, pedidoId: 1012, fecha: '2025-05-10', descripcion: 'Pedido #1012', comprador: 'Carlos Ruiz',    monto: 184500, estado: 'acreditado' },
    { id: 4, pedidoId: 1008, fecha: '2025-04-28', descripcion: 'Pedido #1008', comprador: 'Ana Gómez',      monto: 76200,  estado: 'acreditado' },
    { id: 5, pedidoId: 1003, fecha: '2025-04-10', descripcion: 'Pedido #1003', comprador: 'Luis Fernández', monto: 312000, estado: 'rechazado'  },
]