import { auth } from '@clerk/nextjs/server'
import { getPagosPendientes, getDisputasRecientes } from '@/lib/query'
import { AlertBanner } from '@/components/buyer/alert-banner'


export async function AlertsSection() {
    const { userId } = await auth()
    const [pagosPendientes, disputasRecientes] = await Promise.all([
        getPagosPendientes(userId!),
        getDisputasRecientes(userId!),
    ])

    const alertas: { mensaje: string; tipo: string }[] = []

    if (pagosPendientes.length > 0) {
        alertas.push({
            mensaje: `Tenés ${pagosPendientes.length} pago${pagosPendientes.length > 1 ? 's' : ''} pendiente${pagosPendientes.length > 1 ? 's' : ''} de completar.`,
            tipo: 'warning',
        })
    }

    for (const d of disputasRecientes.filter(d => d.estado !== 'pendiente')) {
        alertas.push({
            mensaje: `Tu disputa fue resuelta con estado: ${d.estado}.`,
            tipo: 'accent',
        })
    }

    if (alertas.length === 0) return null

    return (
        <div className="space-y-2">
            {alertas.map((a, i) => <AlertBanner key={i} {...a} />)}
        </div>
    )
}