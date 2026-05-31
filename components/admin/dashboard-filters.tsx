'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useTransition, useState, useEffect } from 'react'
import { Select } from '@/components/ui/select'
import { Input } from '@/components/ui/input'


const TIPOS = ['todos', 'pagos', 'disputas']
const ESTADOS = ['todos', 'pendiente', 'acreditado', 'rechazado', 'reembolsado']

const estadoLabel: Record<string, string> = {
    todos: 'Todos los estados',
    pendiente: 'Pendiente',
    acreditado: 'Acreditado',
    rechazado: 'Rechazado',
    reembolsado: 'Reembolsado',
}


export function DashboardFilters({
    periodos,
    periodo,
    estado,
    q,
}: {
    periodos: string[]
    periodo: string
    estado: string
    q: string
}) {
    const router = useRouter()
    const pathname = usePathname()
    const [, startTransition] = useTransition()
    const [searchQuery, setSearchQuery] = useState(q ?? '')

    function update(params: Record<string, string>) {
        const nuevoEstado = { periodo, estado, q, ...params }
        const sp = new URLSearchParams()

        if (nuevoEstado.periodo) {
            sp.set('periodo', nuevoEstado.periodo)
        }
        if (nuevoEstado.estado && nuevoEstado.estado !== 'todos') {
            sp.set('estado', nuevoEstado.estado)
        }
        if (nuevoEstado.q && nuevoEstado.q.trim() !== '') {
            sp.set('q', nuevoEstado.q.trim())
        }

        if ('offset' in params) {
            if (params.offset !== '0') sp.set('offset', params.offset)
        } else {
            sp.delete('offset')
        }

        const searchString = sp.toString()
        const query = searchString ? `?${searchString}` : ''

        startTransition(() => router.replace(`${pathname}${query}`))
    }

    useEffect(() => {
        if (searchQuery === q) return

        const timer = setTimeout(() => {
            update({ q: searchQuery })
        }, 300)

        return () => clearTimeout(timer)
    }, [searchQuery, q])

    return (
        <div className="flex flex-wrap gap-3 items-center">
            <div className="w-40">
                <Select
                    value={periodo}
                    onChange={(v) => update({ periodo: v })}
                    options={periodos}
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
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
        </div>
    )
}