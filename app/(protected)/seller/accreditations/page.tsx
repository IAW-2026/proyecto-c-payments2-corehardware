import { auth } from '@clerk/nextjs/server'
import { getAcreditacionesSeller, getCountAcreditacionesSellerPendientes } from '@/lib/query/seller'
import { AccreditationsView } from '@/components/seller/accreditations-view'
import { ITEMS_PER_PAGE } from '@/lib/constants';


async function getNombreComprador(id: string): Promise<string> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/mock/buyers/${id}`);
    
    if (!res.ok) return "Usuario no encontrado";
    
    const data = await res.json();
    return `${data.nombre} ${data.apellido}`;
}


export default async function SellerAcreditacionesPage({
    searchParams,
}: {
    searchParams: Promise<{ tab?: string; offset?: string }>
}) {
    const { userId } = await auth()
    const params = await searchParams
    
    const tab = params.tab === 'acreditados' ? 'acreditados' : 'pendientes'
    const offset = Math.max(0, parseInt(params.offset ?? '0', 10))

    const [{ acreditaciones, total }, totalPendientes] = await Promise.all([
        getAcreditacionesSeller(userId!, offset, ITEMS_PER_PAGE, tab),
        getCountAcreditacionesSellerPendientes(userId!)
    ])

    const ids = Array.from(new Set(acreditaciones.map(a => a.buyerClerkUserId)))
    const nombres = await Promise.all(ids.map(id => getNombreComprador(id)))
    const mapaNombres = Object.fromEntries(ids.map((id, index) => [id, nombres[index]]))

    return (
        <AccreditationsView 
            initialAcreditaciones={acreditaciones}
            mapaNombres={mapaNombres}
            total={total}
            offset={offset}
            limit={ITEMS_PER_PAGE}
            tab={tab}
            totalPendientesAbsoluto={totalPendientes}
        />
    )
}

