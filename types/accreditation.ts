export type AccreditationStatus = 'pendiente' | 'acreditado' | 'rechazado' | 'en_proceso'

export type Accreditation = {
    id: number
    pedidoId: number
    fecha: string
    descripcion: string
    comprador: string
    monto: number
    estado: AccreditationStatus
}