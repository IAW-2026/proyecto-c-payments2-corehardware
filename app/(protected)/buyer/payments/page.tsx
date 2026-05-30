import { auth } from '@clerk/nextjs/server'
import { getPagos } from '@/lib/query'
import { PaymentsView } from '@/components/buyer/payments-view'

export default async function PaymentsPage() {
    const { userId } = await auth()
    
    // Obtenemos los datos en el servidor
    const pagos = await getPagos(userId!)

    // Pasamos los datos al componente intermedio que gestiona la interactividad
    return <PaymentsView initialPagos={pagos} />
}