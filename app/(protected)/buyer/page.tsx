'use client'
 
import { CreditCard, MessageSquareWarning, Package } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { formatFecha, formatMonto } from '@/lib/formatters'
import { SummaryCard } from '@/components/buyer/summary-card'
import { AlertBanner } from '@/components/buyer/alert-banner'


const badgeVariant: Record<string, React.ComponentProps<typeof Badge>['variant']> = {
    pendiente:   'warning',
    acreditado:  'accent',
    rechazado:   'danger',
    reembolsada: 'accent',
    repuesta:    'accent',
    rechazada:   'danger',
}
 
const badgeLabel: Record<string, string> = {
    pendiente:   'Pendiente',
    acreditado:  'Acreditado',
    rechazado:   'Rechazado',
    reembolsada: 'Reembolsada',
    repuesta:    'Repuesta',
    rechazada:   'Rechazada',
}
 

export default function BuyerHomePage() {
    return (
        <div className="max-w-6xl mx-auto space-y-8">
 
            {/* Encabezado */}
            <div>
                <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">Inicio</h1>
                <p className="text-sm text-neutral-500 mt-0.5">Resumen de tu actividad.</p>
            </div>
 
            {/* Alertas */}
            {alertas.length > 0 && (
                <div className="space-y-2">
                    {alertas.map((a) => <AlertBanner key={a.id} {...a} />)}
                </div>
            )}
 
            {/* Resumen */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <SummaryCard
                    icon={CreditCard}
                    label="Pagos pendientes"
                    value={resumen.pagosPendientes}
                    accent={resumen.pagosPendientes > 0}
                />
                <SummaryCard
                    icon={MessageSquareWarning}
                    label="Disputas activas"
                    value={resumen.disputasActivas}
                    accent={resumen.disputasActivas > 0}
                />
                <SummaryCard
                    icon={Package}
                    label="Último pedido"
                    value={formatMonto(resumen.ultimoPedido.monto)}
                />
            </div>
 
            {/* Actividad reciente */}
            <div className="space-y-3">
                <h2 className="text-xs font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-500">
                    Actividad reciente
                </h2>
                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
                    <table className="w-full">
                        <tbody>
                            {actividad.map((a) => (
                                <tr key={a.id} className="border-b border-neutral-100 dark:border-neutral-800/60 last:border-0 hover:bg-neutral-50 dark:hover:bg-neutral-800/20 transition-colors">
                                    <td className="px-4 py-3.5">
                                        <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{a.descripcion}</p>
                                        <p className="text-xs text-neutral-400 mt-0.5 font-mono">{formatFecha(a.fecha)}</p>
                                    </td>
                                    <td className="px-4 py-3.5 hidden md:table-cell">
                                        <Badge variant={a.tipo === 'pago' ? 'default' : 'warning'} className="font-mono">
                                            {a.tipo === 'pago' ? 'Pago' : 'Disputa'}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3.5 font-mono text-sm font-semibold text-neutral-900 dark:text-neutral-100 whitespace-nowrap hidden md:table-cell">
                                        {formatMonto(a.monto)}
                                    </td>
                                    <td className="px-4 py-3.5 text-right">
                                        <Badge variant={badgeVariant[a.estado]}>
                                            {badgeLabel[a.estado]}
                                        </Badge>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
 
        </div>
    )
}
 

const resumen = {
    pagosPendientes: 2,
    disputasActivas: 1,
    ultimoPedido: { id: 1015, fecha: '2025-05-22', monto: 95800 },
}
 
const actividad = [
    { id: 1, tipo: 'pago',    descripcion: 'Pedido #1015', fecha: '2025-05-22', estado: 'pendiente',   monto: 95800  },
    { id: 2, tipo: 'pago',    descripcion: 'Pedido #1014', fecha: '2025-05-20', estado: 'pendiente',   monto: 210000 },
    { id: 3, tipo: 'disputa', descripcion: 'Pedido #1012', fecha: '2025-05-15', estado: 'pendiente',   monto: 184500 },
    { id: 4, tipo: 'pago',    descripcion: 'Pedido #1012', fecha: '2025-05-10', estado: 'acreditado',  monto: 184500 },
]
 
const alertas = [
    { id: 1, mensaje: 'Tenés 2 pagos pendientes de completar.', tipo: 'warning' },
    { id: 2, mensaje: 'Tu disputa sobre el Pedido #1008 fue resuelta con reembolso.', tipo: 'accent' },
]