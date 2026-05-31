import { fetchLatestSellers } from '@/lib/query/admin'
import { SellersTable } from '@/components/admin/sellers-table'


export async function SellersSection() {
    const ultimosVendedores = await fetchLatestSellers()

    const sellers = await Promise.all(
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
            <SellersTable sellers={sellers} />
        </div>
    )
}