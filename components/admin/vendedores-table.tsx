import { Badge } from '@/components/ui/badge'

const badgeVariant: Record<string, React.ComponentProps<typeof Badge>['variant']> = {
    activo:         'accent',
    expira_pronto:  'warning',
    sin_credencial: 'danger',
}

const badgeLabel: Record<string, string> = {
    activo:         'Activo',
    expira_pronto:  'Expira pronto',
    sin_credencial: 'Sin credencial',
}

export function VendedoresTable({ vendedores }: { vendedores: any[] }) {
    return (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
            <table className="w-full">
                <tbody>
                    {vendedores.map((v) => (
                        <tr
                            key={v.clerkUserId}
                            className="border-b border-neutral-100 dark:border-neutral-800/60 last:border-0 hover:bg-neutral-50 dark:hover:bg-neutral-800/20 transition-colors"
                        >
                            <td className="px-4 py-3.5">
                                <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                                    {v.nombre}
                                </p>
                                <p className="text-xs text-neutral-400 mt-0.5 font-mono">
                                    MP #{v.mercadoPagoUserId.toString()}
                                </p>
                            </td>
                            <td className="px-4 py-3.5 text-right">
                                <Badge variant={badgeVariant[v.estado]}>
                                    {badgeLabel[v.estado]}
                                </Badge>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}