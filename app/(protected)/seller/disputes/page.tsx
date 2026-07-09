import { auth } from '@clerk/nextjs/server'
import { fetchPendingDisputesCount, fetchSellerDisputes } from '@/lib/query/seller'
import { DisputesView } from '@/components/seller/disputes-view'
import { ITEMS_PER_PAGE } from '@/lib/constants'


async function getBuyerMail(id: string): Promise<string> {
    const res = await fetch(`${process.env.BUYER_API_URL}/api/buyers/${id}`, {
        headers: {
            'X-API-Key': process.env.BUYER_API_KEY!,
        },
    });
    if (!res.ok) return "No disponible"
    const data = await res.json()
    return data.mail
}


export default async function SellerDisputesPage({
    searchParams,
}: {
    searchParams: Promise<{ tab?: string; offset?: string }>
}) {
    const { userId } = await auth()
    const params = await searchParams

    const tab = params.tab === 'resueltas' ? 'resueltas' : 'pendientes'
    const offset = Math.max(0, parseInt(params.offset ?? '0', 10))

    const [{ disputes, total }, totalPendientes] = await Promise.all([
        fetchSellerDisputes(userId!, offset, ITEMS_PER_PAGE, tab),
        fetchPendingDisputesCount(userId!)
    ])

    const ids = Array.from(new Set(disputes.map(d => d.pago?.buyerId).filter(Boolean) as string[]))
    const emails = await Promise.all(ids.map(id => getBuyerMail(id)))
    const mapaEmails = Object.fromEntries(ids.map((id, index) => [id, emails[index]]))

    return (
        <DisputesView
            initialDisputes={disputes}
            emailsMap={mapaEmails}
            total={total}
            offset={offset}
            limit={ITEMS_PER_PAGE}
            tab={tab}
            totalPendingGlobal={totalPendientes}
        />
    )
}