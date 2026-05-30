'use client'

import { useState } from 'react'
import { Payment } from '@/types/payments'
import { PaymentRow } from '@/components/buyer/payment-row'
import { PaymentModal } from '@/components/buyer/payment-modal'
import { TabButton } from '@/components/ui/tab-button'
import { getVendedorPublicKey } from '@/lib/query'

interface PaymentsViewProps {
    initialPagos: Payment[]
}

export function PaymentsView({ initialPagos }: PaymentsViewProps) {
    const [tab, setTab] = useState<'pendientes' | 'realizados'>('pendientes')
    const [pagoActivo, setPagoActivo] = useState<{ payment: any, publicKey: string } | null>(null)
    
    // Los pagos ahora vienen de props, no de un fetch interno
    const pagos = initialPagos

    const handleAbrirPago = async (payment: any) => {
        const publicKey = await getVendedorPublicKey(payment.id);
        if (publicKey) {
            setPagoActivo({ payment, publicKey });
        }
    }

    const pagosPendientes = pagos.filter(p =>
        p.estado?.toString().trim().toLowerCase() === 'pendiente'
    )

    const pagosRealizados = pagos.filter(p =>
        p.estado?.toString().trim().toLowerCase() !== 'pendiente'
    )

    const lista = tab === 'pendientes' ? pagosPendientes : pagosRealizados

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div>
                <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">Pagos</h1>
                <p className="text-sm text-neutral-500 dark:text-neutral-500 mt-0.5">
                    Revisá tus pagos pendientes y el historial de transacciones.
                </p>
            </div>

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
                                    onPagar={tab === 'pendientes' ? (p) => handleAbrirPago(p) : undefined}
                                />
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {pagoActivo && (
                <PaymentModal
                    payment={pagoActivo.payment}
                    publicKey={pagoActivo.publicKey}
                    onClose={() => setPagoActivo(null)}
                />
            )}
        </div>
    )
}