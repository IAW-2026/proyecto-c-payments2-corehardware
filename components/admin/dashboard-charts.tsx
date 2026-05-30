'use client'

import { useState } from 'react'
import {
    AreaChart, Area,
    BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { TabButton } from '@/components/ui/tab-button'
import { formatMonto } from '@/lib/formatters'

function CustomTooltip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null
    return (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 py-2 text-xs shadow-sm">
            <p className="font-mono text-neutral-500 mb-1">{label}</p>
            {payload.map((p: any) => (
                <p key={p.dataKey} style={{ color: p.color }} className="font-mono">
                    {p.name}: {p.dataKey === 'monto' ? formatMonto(p.value) : p.value}
                </p>
            ))}
        </div>
    )
}

export function DashboardCharts({ datos }: { datos: any[] }) {
    const [tab, setTab] = useState<'volumen' | 'disputas'>('volumen')

    return (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-1 border-b border-neutral-100 dark:border-neutral-800 -mx-5 px-5 pb-0">
                <TabButton active={tab === 'volumen'} onClick={() => setTab('volumen')}>
                    Volumen de pagos
                </TabButton>
                <TabButton active={tab === 'disputas'} onClick={() => setTab('disputas')}>
                    Disputas por día
                </TabButton>
            </div>

            <div className="h-52 pt-2">
                {tab === 'volumen' ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={datos} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="gradPagos" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%"  stopColor="#16a34a" stopOpacity={0.15} />
                                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid stroke="currentColor" strokeOpacity={0.06} vertical={false} />
                            <XAxis
                                dataKey="label"
                                tick={{ fontSize: 11, fontFamily: 'monospace', fill: 'currentColor', opacity: 0.4 }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                tick={{ fontSize: 11, fontFamily: 'monospace', fill: 'currentColor', opacity: 0.4 }}
                                axisLine={false}
                                tickLine={false}
                                width={56}
                                tickFormatter={(v) => formatMonto(v)}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Area
                                type="monotone"
                                dataKey="monto"
                                name="Monto"
                                stroke="#16a34a"
                                strokeWidth={1.5}
                                fill="url(#gradPagos)"
                                dot={false}
                                activeDot={{ r: 4, strokeWidth: 0, fill: '#16a34a' }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={datos} margin={{ top: 4, right: 4, left: 0, bottom: 0 }} barSize={8}>
                            <CartesianGrid stroke="currentColor" strokeOpacity={0.06} vertical={false} />
                            <XAxis
                                dataKey="label"
                                tick={{ fontSize: 11, fontFamily: 'monospace', fill: 'currentColor', opacity: 0.4 }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                tick={{ fontSize: 11, fontFamily: 'monospace', fill: 'currentColor', opacity: 0.4 }}
                                axisLine={false}
                                tickLine={false}
                                width={30}
                                allowDecimals={false}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar
                                dataKey="disputas"
                                name="Disputas"
                                fill="#f59e0b"
                                opacity={0.8}
                                radius={[3, 3, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    )
}