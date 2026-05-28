import { Prisma } from "@prisma/client"

export function formatMonto(n: Prisma.Decimal | number | string) {
    // Si es string, lo convertimos a número para el formato. 
    // Como el string viene de nuestro toString() de Prisma, es seguro.
    const value = typeof n === 'string' ? parseFloat(n) : 
                  n instanceof Prisma.Decimal ? n.toNumber() : n
                  
    return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        // Ojo: si cambias a 0, pierdes los centavos. Si los quieres, usa 2.
        maximumFractionDigits: 0, 
    }).format(value)
}

export function formatFecha(date: Date | string) {
    const value = date instanceof Date ? date : new Date(date)
    return value.toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    })
}