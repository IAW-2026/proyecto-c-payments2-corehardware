import { auth } from '@clerk/nextjs/server'
import { getAcreditacionesSeller } from '@/lib/query'
import { AccreditationsView } from '@/components/seller/accreditations-view'


async function getNombreComprador(id: string): Promise<string> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/mock/buyers/${id}`);
    
    if (!res.ok) return "Usuario no encontrado";
    
    const data = await res.json();
    return `${data.nombre} ${data.apellido}`;
}

export default async function SellerAcreditacionesPage() {
    const { userId } = await auth()
    
    const acreditaciones = await getAcreditacionesSeller(userId!)

    // Obtenemos IDs únicos y resolvemos nombres en el servidor
    const ids = Array.from(new Set(acreditaciones.map(a => a.buyerClerkUserId)))
    const nombres = await Promise.all(ids.map(id => getNombreComprador(id)))
    const mapaNombres = Object.fromEntries(
        ids.map((id, index) => [id, nombres[index]])
    )

    return <AccreditationsView acreditaciones={acreditaciones} mapaNombres={mapaNombres} />
}

