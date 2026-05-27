import { formatMonto } from "@/lib/formatters"
import { useState } from "react"
import { Input } from "../ui/input"
import { ButtonClose, ButtonPrimary, ButtonSecondary } from "../ui/button"
import { Payment } from "@/types/payments"
import { Prisma } from "@prisma/client"


// Pagos realizados y cobrados disponibles para disputar
const pagosDisputables: Payment[] = [
    { id: '1', buyerClerkUserId: '1', sellerClerkUserId: '1', pedidoId: '1012', fecha: new Date('2025-05-10'), descripcion: 'Pedido #1012', monto: '184500', formaDePago: 'Tarjeta de crédito', estado: 'acreditado' },
    { id: '2', buyerClerkUserId: '1', sellerClerkUserId: '1', pedidoId: '1008', fecha: new Date('2025-04-28'), descripcion: 'Pedido #1008', monto: '76200', formaDePago: 'Tarjeta de débito', estado: 'acreditado' },
]

export function NewDisputeModal({ onClose }: { onClose: () => void }) {
    const [pedidoId, setPedidoId] = useState('')
    const [descripcion, setDescripcion] = useState('')
    const [contacto, setContacto] = useState('')

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-sm">
            <div className="w-full max-w-md bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 dark:border-neutral-800">
                    <div>
                        <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Nueva disputa</h2>
                        <p className="text-xs text-neutral-500 mt-0.5">Completá los datos para iniciar una queja.</p>
                    </div>
                    <ButtonClose onClick={onClose} />
                </div>

                {/* Form */}
                <div className="px-5 py-5 space-y-4">

                    {/* Pedido */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-neutral-400">Pedido</label>
                        <select
                            value={pedidoId}
                            onChange={(e) => setPedidoId(e.target.value)}
                            className="w-full px-3 py-2 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-lg text-sm text-neutral-800 dark:text-neutral-200 focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/10 dark:focus:border-green-500 dark:focus:ring-green-500/10 transition-all"
                        >
                            <option value="">Seleccioná un pedido</option>
                            {pagosDisputables.map((p) => (
                                <option key={p.pedidoId} value={p.pedidoId}>
                                    {p.descripcion} · {formatMonto(p.monto)}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Descripción */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-neutral-400">Descripción del problema</label>
                        <textarea
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            rows={4}
                            placeholder="Describí el problema con el mayor detalle posible..."
                            className="w-full px-3 py-2 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-lg text-sm text-neutral-800 dark:text-neutral-200 placeholder:text-neutral-400 dark:placeholder:text-neutral-700 focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/10 dark:focus:border-green-500 dark:focus:ring-green-500/10 transition-all resize-none"
                        />
                    </div>

                    {/* Contacto */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-neutral-400">Medio de contacto</label>
                        <Input
                            value={contacto}
                            onChange={(e) => setContacto(e.target.value)}
                            type="text"
                            placeholder="Email o teléfono"
                        />
                    </div>

                </div>

                {/* Footer */}
                <div className="px-5 pb-5 flex gap-2">
                    <ButtonSecondary onClick={onClose} className="flex-1">Cancelar</ButtonSecondary>
                    <ButtonPrimary className="flex-1">Iniciar disputa</ButtonPrimary>
                </div>

            </div>
        </div>
    )
}