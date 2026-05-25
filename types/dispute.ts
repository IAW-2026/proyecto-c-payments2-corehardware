type DisputeStatus = 'pendiente' | 'reembolsada' | 'repuesta' | 'rechazada'
 
type Dispute = {
    id: number
    pedidoId: number
    fecha: string
    descripcion: string
    contacto: string
    estado: DisputeStatus
    monto: number
}