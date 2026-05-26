import { Prisma } from "@prisma/client"

export function formatMonto(n: Prisma.Decimal | number) {
    const value = n instanceof Prisma.Decimal ? n.toNumber() : n
    return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
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