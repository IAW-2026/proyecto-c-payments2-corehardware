'use client'

import { formatMonto } from "@/lib/formatters"
import { useState } from "react"
import { ButtonClose, ButtonPrimary, ButtonSecondary } from "../ui/button"
import { Payment } from '@/types/payments'
import { createDisputa } from "@/actions/disputes"

type ModalState = 'form' | 'success'

export function NewDisputeModal({
    onClose,
    pagosDisputables,
}: {
    onClose: () => void
    pagosDisputables: Payment[]
}) {
    const [estado, setEstado] = useState<ModalState>('form')
    const [pagoId, setPagoId] = useState('')
    const [descripcion, setDescripcion] = useState('')

    async function handleSubmit() {
        if (!pagoId || !descripcion.trim()) return
        await createDisputa(pagoId, descripcion)
        setEstado('success')
    }

    if (estado === 'success') {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-sm">
                <div className="w-full max-w-md bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden">
                    <div className="px-5 py-8 text-center space-y-3">
                        <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Disputa iniciada</p>
                        <p className="text-xs text-neutral-500">Tu queja fue registrada. Nos pondremos en contacto a la brevedad.</p>
                    </div>
                    <div className="px-5 pb-5">
                        <ButtonPrimary className="w-full" onClick={onClose}>Aceptar</ButtonPrimary>
                    </div>
                </div>
            </div>
        )
    }

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
                            value={pagoId}
                            onChange={(e) => setPagoId(e.target.value)}
                            className="w-full px-3 py-2 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-lg text-sm text-neutral-800 dark:text-neutral-200 focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/10 dark:focus:border-green-500 dark:focus:ring-green-500/10 transition-all"
                        >
                            <option value="">Seleccioná un pedido</option>
                            {pagosDisputables.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.descripcion ?? `Pedido #${p.pedidoId}`} · {formatMonto(Number(p.monto))}
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

                    {/* Aviso contacto */}
                    <p className="text-xs text-neutral-400">
                        Al iniciar la disputa aceptás compartir tu mail y teléfono con el vendedor para facilitar la resolución.
                    </p>

                </div>

                {/* Footer */}
                <div className="px-5 pb-5 flex gap-2">
                    <ButtonSecondary onClick={onClose} className="flex-1">Cancelar</ButtonSecondary>
                    <ButtonPrimary onClick={handleSubmit} className="flex-1" disabled={!pagoId || !descripcion.trim()}>
                        Iniciar disputa
                    </ButtonPrimary>
                </div>

            </div>
        </div>
    )
}