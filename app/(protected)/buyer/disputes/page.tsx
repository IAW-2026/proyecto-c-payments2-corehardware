'use client'
 
import { useState } from 'react'
import { TabButton } from '@/components/ui/tab-button'
import { ButtonPrimary } from '@/components/ui/button'
import { DisputeRow } from '@/components/buyer/dispute-row'
import { NewDisputeModal } from '@/components/buyer/dispute-modal'
import { Dispute } from '@/types/dispute'
  

type DisputeTab = 'activas' | 'resueltas'
 

export default function DisputesPage() {
    const [tab, setTab] = useState<DisputeTab>('activas')
    const [modalAbierto, setModalAbierto] = useState(false)
 
    const activas  = disputas.filter((d) => d.estado === 'pendiente')
    const resueltas = disputas.filter((d) => d.estado !== 'pendiente')
    const lista = tab === 'activas' ? activas : resueltas
 
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
                <TabButton active={tab === 'activas'} onClick={() => setTab('activas')}>
                    Activas
                    {activas.length > 0 && (
                        <span className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 text-xs font-mono">
                            {activas.length}
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
                            {['Fecha', 'Descripción', 'Monto', 'Estado'].map((h) => (
                                <th key={h} className={`px-4 py-2.5 text-xs font-mono text-neutral-400 dark:text-neutral-400 font-normal ${h === 'Estado' ? 'text-right' : 'text-left'}`}>
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {lista.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="py-16 text-center text-sm text-neutral-400 dark:text-neutral-600">
                                    No hay disputas {tab === 'activas' ? 'activas' : 'resueltas'}.
                                </td>
                            </tr>
                        ) : (
                            lista.map((d) => <DisputeRow key={d.id} disputa={d} />)
                        )}
                    </tbody>
                </table>
            </div>
 
            {/* Modal */}
            {modalAbierto && <NewDisputeModal onClose={() => setModalAbierto(false)} />}
 
        </div>
    )
}


const disputas: Dispute[] = [
    { id: '1', clerkUserId: '1', pagoId: '1012', fechaDeInicio: new Date('2025-05-15'), fechaDeFinalizacion: null, descripcion: 'Recibi un producto dañado, la caja llegó golpeada y el item no funciona.', contacto: 'juan@email.com', estado: 'pendiente'},
    { id: '2', clerkUserId: '1', pagoId: '1008', fechaDeInicio: new Date('2025-04-30'), fechaDeFinalizacion: null, descripcion: 'El producto recibido no coincide con el que pedí, es un modelo diferente.', contacto: '+54 9 11 1234-5678', estado: 'reembolsada'},
    { id: '3', clerkUserId: '1', pagoId: '1003', fechaDeInicio: new Date('2025-04-12'), fechaDeFinalizacion: null, descripcion: 'El paquete nunca llegó a la dirección indicada.', contacto: 'juan@email.com', estado: 'rechazada'},
    { id: '4', clerkUserId: '1', pagoId: '1009', fechaDeInicio: new Date('2025-04-20'), fechaDeFinalizacion: null, descripcion: 'El producto llegó pero era una unidad de reposición diferente a la solicitada.', contacto: 'juan@email.com', estado: 'repuesta'},
]
