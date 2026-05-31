'use client'

import { useState } from 'react'
import {
    AreaChart, Area,
    BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { TabButton } from '@/components/ui/tab-button'
import { formatAmount } from '@/lib/formatters'


interface TooltipPayload {
    dataKey: string;
    name: string;
    value: number;
    color: string;
}

function CustomTooltip({ active, payload, label }: { active?: boolean, payload?: TooltipPayload[], label?: string }) {
    if (!active || !payload?.length) return null
    return (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 py-2 text-xs shadow-sm">
            <p className="font-mono text-neutral-500 mb-1">{label}</p>
            {payload.map((p: TooltipPayload) => (
                <p key={p.dataKey} style={{ color: p.color }} className="font-mono">
                    {p.name}: {p.dataKey === 'monto' ? formatAmount(p.value) : p.value}
                </p>
            ))}
        </div>
    )
}

interface ChartData {
    label: string;
    monto: number;
    disputas: number;
}


export function DashboardCharts({ datos }: { datos: ChartData[] }) {
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

            <div style={{ width: '100%', height: 208 }}>
                {tab === 'volumen' ? (
                    <ResponsiveContainer width="100%" height={200}>
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
                                tickFormatter={(v) => formatAmount(v)}
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
                    <ResponsiveContainer width="100%" height={200}>
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
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
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