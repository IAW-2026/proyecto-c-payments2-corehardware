export function AlertBanner({ mensaje, tipo }: { mensaje: string; tipo: string }) {
    const isWarning = tipo === 'warning'
    return (
        <div className={`flex items-start gap-3 px-4 py-3 rounded-lg border ${
            isWarning
                ? 'bg-amber-500/5 border-amber-500/20'
                : 'bg-green-500/5 border-green-500/20'
        }`}>
            <span className={`mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0 ${isWarning ? 'bg-amber-500' : 'bg-green-500'}`} />
            <p className={`text-xs ${isWarning ? 'text-amber-700 dark:text-amber-400' : 'text-green-700 dark:text-green-400'}`}>
                {mensaje}
            </p>
        </div>
    )
}