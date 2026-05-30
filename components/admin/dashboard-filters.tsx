'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useTransition } from 'react'
import { Select } from '@/components/ui/select'
import { Input } from '@/components/ui/input'

const TIPOS   = ['todos', 'pagos', 'disputas']
const ESTADOS = ['todos', 'pendiente', 'acreditado', 'rechazado', 'reembolsado']

const tipoLabel: Record<string, string> = {
    todos:     'Todos los tipos',
    pagos:     'Pagos',
    disputas:  'Disputas',
}

const estadoLabel: Record<string, string> = {
    todos:        'Todos los estados',
    pendiente:    'Pendiente',
    acreditado:   'Acreditado',
    rechazado:    'Rechazado',
    reembolsado:  'Reembolsado',
}

export function DashboardFilters({
    periodos,
    periodo,
    tipo,
    estado,
    q,
}: {
    periodos: string[]
    periodo: string
    tipo: string
    estado: string
    q: string
}) {
    const router   = useRouter()
    const pathname = usePathname()
    const [, startTransition] = useTransition()

    function update(params: Record<string, string>) {
        const sp = new URLSearchParams({ periodo, tipo, estado, q, ...params })
        // Al cambiar cualquier filtro que no sea offset, reseteamos al inicio
        if (!('offset' in params)) sp.delete('offset')
        startTransition(() => router.replace(`${pathname}?${sp.toString()}`))
    }

    return (
        <div className="flex flex-wrap gap-3 items-center">
            <div className="w-40">
                <Select
                    value={periodo}
                    onChange={(v) => update({ periodo: v })}
                    options={periodos}
                />
            </div>
            <div className="w-36">
                <Select
                    value={tipoLabel[tipo] ?? tipo}
                    onChange={(v) => update({ tipo: Object.keys(tipoLabel).find(k => tipoLabel[k] === v) ?? v })}
                    options={TIPOS.map(t => tipoLabel[t])}
                />
            </div>
            <div className="w-44">
                <Select
                    value={estadoLabel[estado] ?? estado}
                    onChange={(v) => update({ estado: Object.keys(estadoLabel).find(k => estadoLabel[k] === v) ?? v })}
                    options={ESTADOS.map(e => estadoLabel[e])}
                />
            </div>
            <div className="flex-1 min-w-[180px] max-w-xs">
                <Input
                    placeholder="Buscar pedido o vendedor…"
                    defaultValue={q}
                    onChange={(e) => update({ q: e.target.value })}
                />
            </div>
        </div>
    )
}