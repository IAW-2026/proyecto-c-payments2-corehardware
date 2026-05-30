export type AdminDashboardSummary = {
    pagosHoy: { 
        cantidad: number; 
        monto: number 
    };
    pendientes: number;
    disputasActivas: number;
    vendedoresActivos: number;
};