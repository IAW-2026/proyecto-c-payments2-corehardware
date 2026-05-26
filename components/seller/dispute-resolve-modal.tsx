import { ButtonClose, ButtonDanger, ButtonMuted, ButtonSecondary } from '@/components/ui/button'
import { Dispute, DisputeStatus } from '@/types/dispute';

type ResolutionStatus = Exclude<DisputeStatus, 'pendiente'>

const opciones: { estado: ResolutionStatus; label: string }[] = [
    { estado: 'reembolsada', label: 'Reembolsar' },
    { estado: 'repuesta',    label: 'Reponer'     },
    { estado: 'rechazada',   label: 'Rechazar'    },
]

export function DisputeResolveModal({ disputa, onClose, onResolver }: {
    disputa: Dispute
    onClose: () => void
    onResolver: (id: string, estado: ResolutionStatus) => void
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-sm">
            <div className="w-full max-w-md bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 dark:border-neutral-800">
                    <div>
                        <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Resolver disputa</h2>
                        <p className="text-xs text-neutral-500 mt-0.5">Pago #{disputa.pagoId}</p>
                    </div>
                    <ButtonClose onClick={onClose} />
                </div>

                {/* Body */}
                <div className="px-5 py-5 space-y-4">

                    {/* Detalle */}
                    <div className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 space-y-1">
                        <p className="text-sm text-neutral-700 dark:text-neutral-300">{disputa.descripcion}</p>
                        <p className="text-xs font-mono text-neutral-500 mt-1">{disputa.contacto}</p>
                    </div>

                    {/* Opciones */}
                    <div className="space-y-2">
                        <p className="text-xs font-mono text-neutral-400 uppercase tracking-wider">Resolución</p>
                        <div className="flex flex-col gap-2">
                            {opciones.map(({ estado, label }) => (
                                estado === 'rechazada'
                                    ? <ButtonDanger key={estado} className="w-full" onClick={() => { onResolver(disputa.id, estado); onClose() }}>{label}</ButtonDanger>
                                    : <ButtonMuted  key={estado} className="w-full" onClick={() => { onResolver(disputa.id, estado); onClose() }}>{label}</ButtonMuted>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div className="px-5 pb-5">
                    <ButtonSecondary className="w-full" onClick={onClose}>Cancelar</ButtonSecondary>
                </div>

            </div>
        </div>
    )
}