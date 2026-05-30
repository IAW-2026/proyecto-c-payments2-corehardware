'use client'

import { useState } from 'react'
import { TabButton } from '@/components/ui/tab-button'
import { DisputeRow } from '@/components/seller/dispute-row'
import { DisputeResolveModal } from '@/components/seller/dispute-resolve-modal'
import { Dispute, DisputeStatus } from '@/types/dispute'
import { Prisma } from '@prisma/client'

type DisputeTab = 'pendientes' | 'resueltas'
type ResolutionStatus = Exclude<DisputeStatus, 'pendiente'>

export default function SellerDisputasPage() {
    const [tab, setTab] = useState<DisputeTab>('pendientes')
    const [disputaActiva, setDisputaActiva] = useState<Dispute | null>(null)
    const [lista, setLista] = useState<Dispute[]>(disputas)

    const pendientes = lista.filter((d) => d.estado === 'pendiente')
    const resueltas  = lista.filter((d) => d.estado !== 'pendiente')
    const items = tab === 'pendientes' ? pendientes : resueltas

    function handleResolver(id: string, estado: ResolutionStatus) {
        setLista((prev) => prev.map((d) => d.id === id ? { ...d, estado } : d))
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6">

            {/* Encabezado */}
            <div>
                <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">Disputas</h1>
                <p className="text-sm text-neutral-500 mt-0.5">
                    Revisá y resolvé las disputas abiertas por compradores.
                </p>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-neutral-200 dark:border-neutral-800">
                <TabButton active={tab === 'pendientes'} onClick={() => setTab('pendientes')}>
                    Pendientes
                    {pendientes.length > 0 && (
                        <span className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 text-xs font-mono">
                            {pendientes.length}
                        </span>
                    )}
                </TabButton>
                <TabButton active={tab === 'resueltas'} onClick={() => setTab('resueltas')}>
                    Resueltas
                </TabButton>
            </div>

            {/* Tabla */}
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
                        {items.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="py-16 text-center text-sm text-neutral-400 dark:text-neutral-600">
                                    No hay disputas {tab === 'pendientes' ? 'pendientes' : 'resueltas'}.
                                </td>
                            </tr>
                        ) : (
                            items.map((d) => (
                                <DisputeRow key={d.id} disputa={d} onResolver={setDisputaActiva} />
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
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

// ─── Mock Data ────────────────────────────────────────────────────────────────

const disputas: Dispute[] = [
    { id: '1', clerkUserId: '1', pedidoId:'', pagoId:'', fechaDeInicio: new Date('2025-05-22'), fechaDeFinalizacion: null, descripcion: 'Recibi un producto dañado, la caja llegó golpeada y el item no funciona.',   estado: 'pendiente'},
    { id: '2', clerkUserId: '1', pedidoId:'', pagoId:'', fechaDeInicio: new Date('2025-05-20'), fechaDeFinalizacion: null, descripcion: 'El producto recibido no coincide con el que pedí, es un modelo diferente.',    estado: 'pendiente'},
    { id: '3', clerkUserId: '1', pedidoId:'', pagoId:'', fechaDeInicio: new Date('2025-05-10'), fechaDeFinalizacion: null, descripcion: 'El paquete nunca llegó a la dirección indicada.',                  estado: 'rechazada' },
    { id: '4', clerkUserId: '1', pedidoId:'', pagoId:'', fechaDeInicio: new Date('2025-04-28'), fechaDeFinalizacion: null, descripcion: 'El producto llegó pero era una unidad de reposición diferente a la solicitada.',   estado: 'repuesta'},
]