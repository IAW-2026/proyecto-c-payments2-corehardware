'use client'

import { useState } from 'react'
import { Payment } from '@/types/payments'
import { PaymentRow } from '@/components/buyer/payment-row'
import { PaymentModal } from '@/components/buyer/payment-modal'
import { TabButton } from '@/components/ui/tab-button'


type Tab = 'pendientes' | 'realizados'

export default function PaymentsPage() {
    const [tab, setTab] = useState<Tab>('pendientes')
    const [pagoActivo, setPagoActivo] = useState<Payment | null>(null)

    const lista = tab === 'pendientes' ? pagosPendientes : pagosRealizados

    return (
        <div className="max-w-6xl mx-auto space-y-6">

            {/* Encabezado */}
            <div>
                <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">Pagos</h1>
                <p className="text-sm text-neutral-500 dark:text-neutral-500 mt-0.5">
                    Revisá tus pagos pendientes y el historial de transacciones.
                </p>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-neutral-200 dark:border-neutral-800">
                <TabButton active={tab === 'pendientes'} onClick={() => setTab('pendientes')}>
                    Pendientes
                    {pagosPendientes.length > 0 && (
                        <span className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 text-xs font-mono">
                            {pagosPendientes.length}
                        </span>
                    )}
                </TabButton>
                <TabButton active={tab === 'realizados'} onClick={() => setTab('realizados')}>
                    Realizados
                </TabButton>
            </div>

            {/* Tabla */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
                <table className="w-full">
                    <thead className="hidden md:table-header-group border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/80">
                        <tr>
                            {['Fecha', 'Descripción', 'Forma de pago', 'Monto', 'Estado'].map((h) => (
                                <th key={h} className={`px-4 py-2.5 text-xs font-mono text-neutral-400 dark:text-neutral-400 font-normal text-left`}>
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {lista.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="py-16 text-center text-sm text-neutral-400 dark:text-neutral-600">
                                    No hay pagos {tab === 'pendientes' ? 'pendientes' : 'realizados'}.
                                </td>
                            </tr>
                        ) : (
                            lista.map((p) => (
                                <PaymentRow
                                    key={p.id}
                                    payment={p}
                                    onPagar={tab === 'pendientes' ? setPagoActivo : undefined}
                                />
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            {/* Modal */}
            {pagoActivo && (
                <PaymentModal
                    payment={pagoActivo}
                    onClose={() => setPagoActivo(null)}
                />
            )}
        </div>


    )
}



// ─── Mock Data ────────────────────────────────────────────────────────────────

const pagosRealizados: Payment[] = [
    { id: 1, pedidoId: 1012, fecha: '2025-05-10', descripcion: 'Pedido #1012', monto: 184500, formaPago: 'Tarjeta de crédito', estado: 'acreditado' },
    { id: 2, pedidoId: 1008, fecha: '2025-04-28', descripcion: 'Pedido #1008', monto: 76200, formaPago: 'Tarjeta de débito', estado: 'acreditado' },
    { id: 3, pedidoId: 1003, fecha: '2025-04-10', descripcion: 'Pedido #1003', monto: 312000, formaPago: 'Tarjeta de crédito', estado: 'rechazado' },
]

const pagosPendientes: Payment[] = [
    { id: 4, pedidoId: 1015, fecha: '2025-05-22', descripcion: 'Pedido #1015', monto: 95800, formaPago: '', estado: 'pendiente' },
    { id: 5, pedidoId: 1014, fecha: '2025-05-20', descripcion: 'Pedido #1014', monto: 210000, formaPago: '', estado: 'pendiente' },
]
