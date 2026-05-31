export type AdminHomeSummary = {
    pagosHoy: { 
        cantidad: number; 
        monto: number 
    };
    pendientes: number;
    disputasActivas: number;
    vendedoresActivos: number;
};


export type AdminDashboardSummary = {
    current: {
        pagosMonto: string;
        pagosCantidad: number;
        disputas: number
    };
    previous: {
        pagosMonto: string;
        pagosCantidad: number;
        disputas: number
    };
};