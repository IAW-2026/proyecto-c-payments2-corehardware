import { useState } from 'react';
import { Payment } from '@/types/payments';
import MercadoPagoBrick from '@/components/buyer/mercado-pago-brick';
import { processPaymentOrder } from '@/actions/payment';
import { ICardPaymentFormData, ICardPaymentBrickPayer } from '@mercadopago/sdk-react/esm/bricks/cardPayment/type';
import { ButtonSecondary } from '@/components/ui/button'


export function PaymentModal({ payment, publicKey, onClose }: { payment: Payment; publicKey: string; onClose: () => void }) {
    const [status, setStatus] = useState<'paying' | 'success' | 'error'>('paying');
    const [errorMsg, setErrorMsg] = useState('');

    const handlePayment = async (formData: ICardPaymentFormData<ICardPaymentBrickPayer>) => {
        return await processPaymentOrder(payment.id, {
            total_amount: String(formData.transaction_amount),
            payment_method_id: formData.payment_method_id,
            token: formData.token,
            installments: Number(formData.installments),
            email: formData.payer?.email || '',
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-lg bg-white dark:bg-neutral-900 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xl">

                {status === 'paying' ? (
                    <>
                        <h2 className="text-lg font-bold mb-4 dark:text-white">Pagar {payment.descripcion}</h2>

                        <MercadoPagoBrick
                            amount={Number(payment.monto)}
                            publicKey={publicKey}
                            onSubmit={handlePayment}
                            onSuccess={(id) => {
                                console.log("Pago exitoso:", id);
                                setStatus('success');
                            }}
                            onError={(err) => {
                                setErrorMsg(err);
                                setStatus('error');
                            }}
                        />

                        <button
                            onClick={onClose}
                            className="mt-4 w-full text-sm text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300"
                        >
                            Cancelar
                        </button>
                    </>
                ) : status === 'success' ? (
                    <div className="text-center py-6">
                        <div className="text-emerald-500 text-4xl mb-4">✓</div>
                        <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-1">¡Pago recibido!</h2>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">La transacción se ha procesado correctamente.</p>
                        <div className="flex justify-end">
                            <ButtonSecondary onClick={onClose}>
                                Aceptar
                            </ButtonSecondary>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-6">
                        <div className="text-red-500 text-4xl mb-4">✕</div>
                        <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-1">Error al procesar el pago</h2>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">{errorMsg}</p>
                        <div className="flex justify-end">
                            <ButtonSecondary onClick={onClose}>
                                Cerrar
                            </ButtonSecondary>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}