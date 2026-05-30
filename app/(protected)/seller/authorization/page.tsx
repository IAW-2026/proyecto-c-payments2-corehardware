import { auth } from '@clerk/nextjs/server'
import { ButtonPrimary } from '@/components/ui/button'
import { redirectToMercadoPago } from '@/actions/seller-auth'
import { getIsSellerAuthorized } from '@/lib/query'
import { CheckCircle2 } from 'lucide-react'


export default async function SellerAuthorizationPage() {
    const { userId } = await auth()
    const isAuthorized = await getIsSellerAuthorized(userId!)
    
    return (
        <div className="max-w-6xl mx-auto space-y-8">
 
            {/* Encabezado */}
            <div>
                <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">Autorización</h1>
                <p className="text-sm text-neutral-500 mt-0.5">Conectá tu cuenta de MercadoPago para recibir pagos.</p>
            </div>
 
            {/* Panel */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-8 max-w-lg space-y-6">
 
                <div className="space-y-2">
                    <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                        ¿Por qué necesitás autorizar tu cuenta?
                    </h2>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                        Para que CoreHardware Payments pueda acreditar los cobros directamente en tu cuenta de MercadoPago, necesitamos que autorices el acceso una sola vez. Este proceso es seguro y lo maneja MercadoPago directamente.
                    </p>
                </div>
 
                <ul className="space-y-2">
                    {[
                        'Recibí los pagos de tus ventas automáticamente.',
                        'Autorizás una sola vez, podés revocar cuando quieras.',
                        'El proceso de autorización es gestionado íntegramente por MercadoPago.',
                    ].map((item) => (
                        <li key={item} className="flex items-start gap-2.5 text-sm text-neutral-600 dark:text-neutral-400">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
                            {item}
                        </li>
                    ))}
                </ul>
                
                {isAuthorized ? (
                    <div className="flex items-center gap-2 text-sm font-medium text-green-600 dark:text-green-500 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                        <CheckCircle2 className="w-5 h-5" />
                        Ya estás autorizado
                    </div>
                ) : (
                    <form action={redirectToMercadoPago}>
                        <ButtonPrimary type="submit">
                            Autorizar con MercadoPago
                        </ButtonPrimary>
                    </form>
                )}
 
            </div>
 
        </div>
    )
}
 