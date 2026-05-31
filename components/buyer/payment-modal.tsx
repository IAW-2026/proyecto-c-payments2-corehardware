import { useState } from 'react';
import { Payment } from '@/types/payments';
import MercadoPagoBrick from '@/components/buyer/mercado-pago-brick';
import { procesarOrdenPagoPro } from '@/actions/payment';
import { ICardPaymentFormData, ICardPaymentBrickPayer } from '@mercadopago/sdk-react/esm/bricks/cardPayment/type';


export function PaymentModal({ payment, publicKey, onClose }: { payment: Payment; publicKey: string; onClose: () => void }) {
    const [status, setStatus] = useState<'paying' | 'success'>('paying');
    
    const handlePayment = async (formData: ICardPaymentFormData<ICardPaymentBrickPayer>) => {
        return await procesarOrdenPagoPro(payment.id, {
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
                            onError={(err) => alert(`Error: ${err}`)}
                        />

                        <button 
                            onClick={onClose}
                            className="mt-4 w-full text-sm text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300"
                        >
                            Cancelar
                        </button>
                    </>
                ) : (
                    <div className="text-center py-6">
                        <div className="text-emerald-500 text-4xl mb-4">✓</div>
                        <h2 className="text-xl font-bold dark:text-white mb-2">¡Pago recibido!</h2>
                        <p className="text-sm text-neutral-500 mb-6">La transacción se ha procesado correctamente.</p>
                        <button 
                            onClick={onClose}
                            className="w-full py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg font-medium"
                        >
                            Aceptar
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}