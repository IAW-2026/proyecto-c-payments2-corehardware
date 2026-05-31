import { auth } from '@clerk/nextjs/server'
import { getCountDisputasSellerPendientes, getDisputasSeller } from '@/lib/query'
import { SellerDisputasView } from '@/components/seller/disputes-view'
import { ITEMS_PER_PAGE } from '@/lib/constants'

async function getEmailComprador(id: string): Promise<string> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/mock/buyers/${id}`)
    if (!res.ok) return "No disponible"
    const data = await res.json()
    return data.mail
}

export default async function SellerDisputasPage({
    searchParams,
}: {
    searchParams: Promise<{ tab?: string; offset?: string }>
}) {
    const { userId } = await auth()
    const params = await searchParams
    
    const tab = params.tab === 'resueltas' ? 'resueltas' : 'pendientes'
    const offset = Math.max(0, parseInt(params.offset ?? '0', 10))

    const [{ disputas, total }, totalPendientes] = await Promise.all([
        getDisputasSeller(userId!, offset, ITEMS_PER_PAGE, tab),
        getCountDisputasSellerPendientes(userId!)
    ])

    const ids = Array.from(new Set(disputas.map(d => d.pago?.buyerClerkUserId).filter(Boolean) as string[]))
    const emails = await Promise.all(ids.map(id => getEmailComprador(id)))
    const mapaEmails = Object.fromEntries(ids.map((id, index) => [id, emails[index]]))

    return (
        <SellerDisputasView 
            initialDisputas={disputas} 
            mapaEmails={mapaEmails}
            total={total}
            offset={offset}
            limit={ITEMS_PER_PAGE}
            tab={tab}
            totalPendientesAbsoluto={totalPendientes}
        />
    )
}