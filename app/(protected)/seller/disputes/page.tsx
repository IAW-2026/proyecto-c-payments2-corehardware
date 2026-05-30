import { auth } from '@clerk/nextjs/server'
import { getDisputasSeller } from '@/lib/query'
import { SellerDisputasView } from '@/components/seller/disputes-view'

async function getEmailComprador(id: string): Promise<string> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/mock/buyers/${id}`)
    if (!res.ok) return "No disponible"
    const data = await res.json()
    return data.mail
}

export default async function SellerDisputasPage() {
    const { userId } = await auth()
    const disputas = await getDisputasSeller(userId!)

    const ids = Array.from(new Set(disputas.map(d => d.pago?.buyerClerkUserId).filter(Boolean) as string[]))
    const emails = await Promise.all(ids.map(id => getEmailComprador(id)))
    const mapaEmails = Object.fromEntries(
        ids.map((id, index) => [id, emails[index]])
    )

    return <SellerDisputasView initialDisputas={disputas} mapaEmails={mapaEmails} />
}