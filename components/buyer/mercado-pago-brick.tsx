'use client';

import { initMercadoPago, CardPayment } from '@mercadopago/sdk-react';
import { useState, useEffect } from 'react';
import { getCustomVariables } from '@/lib/mp-style';

interface Props {
    amount: number;
    publicKey: string;
    onSubmit: (formData: any) => Promise<any>;
    onSuccess: (orderId: string) => void;
    onError: (error: string) => void;
}

export default function MercadoPagoBrick({ amount, publicKey, onSubmit, onSuccess, onError }: Props) {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        initMercadoPago(publicKey);
    }, []);

    useEffect(() => {
        const media = window.matchMedia('(prefers-color-scheme: dark)');
        const update = () => setIsDark(media.matches);
        update();
        media.addEventListener('change', update);
        return () => media.removeEventListener('change', update);
    }, []);

    return (
        <div className="w-full">
            <style>{`
                #cardPaymentBrick_container {
                    --secondary-color: ${isDark ? '#0a0a0a' : '#ffffff'} !important;
                }
            `}</style>

            <CardPayment
                initialization={{ amount }}
                onSubmit={async (formData) => {
                    try {
                        const res = await onSubmit(formData);
                        if (res.success) onSuccess(res.orderId);
                        else onError(res.error);
                    } catch (e) {
                        onError("Error de comunicación.");
                    }
                }}
                onError={(err) => onError(err.message)}
                customization={{
                    visual: {
                        style: { customVariables: getCustomVariables(isDark) }
                    }
                }}
            />
        </div>
    );
}