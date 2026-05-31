export type AdminHomeSummary = {
    paymentsToday: { 
        quantity: number; 
        amount: number 
    };
    pending: number;
    activeDisputes: number;
    activeSellers: number;
};


export type AdminDashboardSummary = {
    current: {
        paymentsAmount: string;
        paymentsQuantity: number;
        disputes: number;
        rejected: number
    };
    previous: {
        paymentsAmount: string;
        paymentsQuantity: number;
        disputes: number;
        rejected: number
    };
};