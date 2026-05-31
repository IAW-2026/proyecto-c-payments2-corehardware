import { NextRequest, NextResponse } from 'next/server'


const sellers: Record<string, {
    id: string
    cuit: string
    razon_social: string
    direccion: string
    mail: string
    celular: string
    condicion_iva: string
}> = {
    'user_3EAcoW6AOEJ5BIIlOLh3aQYty3u': {
        id: 'user_3EAcoW6AOEJ5BIIlOLh3aQYty3u',
        cuit: '30-71234567-8',
        razon_social: 'Comercial del Sur S.R.L.',
        direccion: 'Belgrano 890, Bahía Blanca',
        mail: 'seller1+clerk_test@example.com',
        celular: '+54 291 456-7890',
        condicion_iva: 'Responsable Inscripto',
    },
    'user_3EPivAYys776DSPXS1hM2lT3zw5': {
        id: 'user_3EPivAYys776DSPXS1hM2lT3zw5',
        cuit: '30-65432198-7',
        razon_social: 'Norte Distribuciones S.A.',
        direccion: 'Mitre 321, Córdoba',
        mail: 'seller2+clerk_test@example.com',
        celular: '+54 351 321-6540',
        condicion_iva: 'Responsable Inscripto',
    },
}


export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const seller = sellers[id];
    
    if (!seller) return NextResponse.json({ message: 'Vendedor no encontrado' }, { status: 404 });
    
    return NextResponse.json(seller);
}