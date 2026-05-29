'use client'

import { useState, useEffect } from 'react'
import { Payment } from '@/types/payments'
import { PaymentRow } from '@/components/buyer/payment-row'
import { PaymentModal } from '@/components/buyer/payment-modal'
import { TabButton } from '@/components/ui/tab-button'
import { getPagos, getVendedorPublicKey } from '@/actions/payment'


type Tab = 'pendientes' | 'realizados'

export default function PaymentsPage() {
    const [tab, setTab] = useState<'pendientes' | 'realizados'>('pendientes')
    const [pagoActivo, setPagoActivo] = useState<{ payment: any, publicKey: string } | null>(null)
    const [pagos, setPagos] = useState<any[]>([])


    // Función intermedia:
    const handleAbrirPago = async (payment: any) => {
        const publicKey = await getVendedorPublicKey(payment.id);
        if (publicKey) {
            // Mantenemos los datos separados en lugar de incrustar la key en el objeto
            setPagoActivo({ payment, publicKey });
        }
    }

    useEffect(() => {
        async function load() {
            const data = await getPagos()
            // AQUÍ VEMOS QUÉ LLEGA REALMENTE DE LA BASE DE DATOS
            console.log("Datos recibidos de la DB:", JSON.stringify(data, null, 2))
            setPagos(data)
        }
        load()
    }, [])

    // FILTRO ROBUSTO: Normaliza el estado para asegurar la comparación
    const pagosPendientes = pagos.filter(p =>
        p.estado?.toString().trim().toLowerCase() === 'pendiente'
    )

    const pagosRealizados = pagos.filter(p =>
        p.estado?.toString().trim().toLowerCase() !== 'pendiente'
    )

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
                                    onPagar={tab === 'pendientes' ? (p) => handleAbrirPago(p) : undefined}
                                />
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            {/* Modal */}
            {pagoActivo && (
                <PaymentModal
                    payment={pagoActivo.payment} // Pasas solo el objeto Payment
                    publicKey={pagoActivo.publicKey} // Pasas la key como prop separada
                    onClose={() => setPagoActivo(null)}
                />
            )}
        </div>


    )
}



// ─── Mock Data ────────────────────────────────────────────────────────────────

const pagosRealizados: Payment[] = [
    { id: '1', buyerClerkUserId: '1', sellerClerkUserId: '1', pedidoId: '1012', fecha: new Date('2025-05-10'), descripcion: 'Pedido #1012', monto: '184500', formaDePago: 'Tarjeta de crédito', estado: 'acreditado' },
    { id: '2', buyerClerkUserId: '1', sellerClerkUserId: '1', pedidoId: '1008', fecha: new Date('2025-04-28'), descripcion: 'Pedido #1008', monto: '76200', formaDePago: 'Tarjeta de débito', estado: 'acreditado' },
    { id: '3', buyerClerkUserId: '1', sellerClerkUserId: '1', pedidoId: '1003', fecha: new Date('2025-04-10'), descripcion: 'Pedido #1003', monto: '312000', formaDePago: 'Tarjeta de crédito', estado: 'rechazado' },
]

const pagosPendientes: Payment[] = [
    { id: '4', buyerClerkUserId: '1', sellerClerkUserId: '1', pedidoId: '1015', fecha: new Date('2025-05-22'), descripcion: 'Pedido #1015', monto: '150', formaDePago: '', estado: 'pendiente' },
    { id: '5', buyerClerkUserId: '1', sellerClerkUserId: '1', pedidoId: '1014', fecha: new Date('2025-05-20'), descripcion: 'Pedido #1014', monto: '210000', formaDePago: '', estado: 'pendiente' },
]
