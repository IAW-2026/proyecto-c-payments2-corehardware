import { formatMonto } from "@/lib/formatters"
import { Payment } from "@/types/payments"
import { CreditCard, X, Lock } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { ButtonPrimary } from "@/components/ui/button"
 
export function PaymentModal({ payment, onClose }: { payment: Payment; onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-sm">
            <div className="w-full max-w-md bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden">
 
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 dark:border-neutral-800">
                    <div>
                        <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                            Pagar {payment.descripcion}
                        </h2>
                        <p className="text-xs font-mono text-neutral-500 mt-0.5">
                            Total: {formatMonto(payment.monto)}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
 
                {/* Form */}
                <div className="px-5 py-5 space-y-4">
 
                    {/* Número de tarjeta */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-neutral-400">Número de tarjeta</label>
                        <div className="relative">
                            <Input
                                id="form-checkout__cardNumber"
                                type="text"
                                placeholder="1234 5678 9012 3456"
                                className="pr-10 font-mono"
                            />
                            <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                        </div>
                    </div>
 
                    {/* Vencimiento + CVV */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-neutral-400">Vencimiento</label>
                            <Input
                                id="form-checkout__expirationDate"
                                type="text"
                                placeholder="MM/AA"
                                className="font-mono"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-neutral-400">Código de seguridad</label>
                            <Input
                                id="form-checkout__securityCode"
                                type="text"
                                placeholder="CVV"
                                className="font-mono"
                            />
                        </div>
                    </div>
 
                    {/* Nombre del titular */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-neutral-400">Nombre del titular</label>
                        <Input
                            id="form-checkout__cardholderName"
                            type="text"
                            placeholder="Como figura en la tarjeta"
                        />
                    </div>
 
                    {/* Banco emisor */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-neutral-400">Banco emisor</label>
                        <select
                            id="form-checkout__issuer"
                            className="w-full px-3 py-2 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-lg text-sm text-neutral-800 dark:text-neutral-200 focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/10 dark:focus:border-green-500 dark:focus:ring-green-500/10 transition-all"
                        />
                    </div>
 
                    {/* Cuotas */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-neutral-400">Cuotas</label>
                        <select
                            id="form-checkout__installments"
                            className="w-full px-3 py-2 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-lg text-sm text-neutral-800 dark:text-neutral-200 focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/10 dark:focus:border-green-500 dark:focus:ring-green-500/10 transition-all"
                        />
                    </div>
 
                    {/* Tipo y número de documento */}
                    <div className="grid grid-cols-[auto_1fr] gap-3">
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-neutral-400">Tipo</label>
                            <select
                                id="form-checkout__identificationType"
                                className="w-full px-3 py-2 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-lg text-sm text-neutral-800 dark:text-neutral-200 focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/10 dark:focus:border-green-500 dark:focus:ring-green-500/10 transition-all"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-neutral-400">Número de documento</label>
                            <Input
                                id="form-checkout__identificationNumber"
                                type="text"
                                placeholder="Número"
                                className="font-mono"
                            />
                        </div>
                    </div>
 
                    {/* Email */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-neutral-400">Email</label>
                        <Input
                            id="form-checkout__cardholderEmail"
                            type="email"
                            placeholder="tu@email.com"
                        />
                    </div>
 
                </div>
 
                {/* Footer */}
                <div className="px-5 pb-5 space-y-3">
                    <ButtonPrimary type="submit" className="w-full flex items-center justify-center gap-2 py-2.5">
                        <Lock className="w-3.5 h-3.5" />
                        Confirmar pago · {formatMonto(payment.monto)}
                    </ButtonPrimary>
                    <p className="text-center text-xs text-neutral-400 dark:text-neutral-600 font-mono">
                        Procesado de forma segura por MercadoPago
                    </p>
                </div>
 
            </div>
        </div>
    )
}