import { fetchLatestSellers } from '@/lib/query/admin'
import { SellersTable } from '@/components/admin/sellers-table'


export async function SellersSection() {
    const ultimosVendedores = await fetchLatestSellers()

    const sellers = (await Promise.all(
        ultimosVendedores.map(v =>
            fetch(`${process.env.SELLER_API_URL}/api/sellers/${v.vendedorId}`, {
                cache: 'no-store',
                headers: {
                    'x-api-key': process.env.SELLER_API_KEY!,
                },
            })
                .then(res => res.ok ? res.json().then(data => ({ ...data, createdAt: v.createdAt })) : null)
        )
    )).filter(Boolean)

    return (
        <div className="space-y-3">
            <h2 className="text-xs font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-500">
                Últimos vendedores autorizados
            </h2>
            <SellersTable sellers={sellers} />
        </div>
    )
}