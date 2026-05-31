import { getUltimosVendedores } from '@/lib/query'
import { VendedoresTable } from '@/components/admin/vendedores-table'

export async function AdminVendedoresSection() {
    const ultimosVendedores = await getUltimosVendedores()

    const vendedores = await Promise.all(
        ultimosVendedores.map(v =>
            fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/mock/sellers/${v.clerkUserId}`, { cache: 'no-store' })
                .then(res => res.json())
                .then(data => ({ ...data, createdAt: v.createdAt }))
        )
    )

    return (
        <div className="space-y-3">
            <h2 className="text-xs font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-500">
                Últimos vendedores autorizados
            </h2>
            <VendedoresTable vendedores={vendedores} />
        </div>
    )
}