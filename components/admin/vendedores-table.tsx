import { formatFecha } from '@/lib/formatters'


interface Vendedor {
    id: string;
    cuit: string;
    razon_social: string;
    direccion: string;
    mail: string;
    celular: string;
    condicion_iva: string;
    createdAt: Date;
}


export function VendedoresTable({ vendedores }: { vendedores: Vendedor[] }) {
    return (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
            <table className="w-full">
                <tbody>
                    {vendedores.map((v) => (
                        <tr
                            key={v.id}
                            className="border-b border-neutral-100 dark:border-neutral-800/60 last:border-0 hover:bg-neutral-50 dark:hover:bg-neutral-800/20 transition-colors"
                        >
                            <td className="px-4 py-3.5">
                                <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                                    {v.razon_social}
                                </p>
                                <p className="text-xs text-neutral-400 mt-0.5 font-mono">
                                    {v.cuit}
                                </p>
                            </td>
                            <td className="px-4 py-3.5 text-right text-xs text-neutral-400 font-mono whitespace-nowrap">
                                {formatFecha(v.createdAt)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}