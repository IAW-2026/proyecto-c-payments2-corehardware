export type PaymentStatus = 'pendiente' | 'acreditado' | 'rechazado' | 'en_proceso'
 
export type Payment = {
    id: number
    pedidoId: number
    fecha: string
    descripcion: string
    monto: number
    formaPago: string
    estado: PaymentStatus
}