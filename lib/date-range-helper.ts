import { DateRange } from "@/types/date-range";


export function getRange(periodo: string): DateRange {
    const now = new Date();
    
    let start = new Date(now);
    let end = new Date(now);

    switch (periodo) {
        case 'Últimos 7 días':
            start.setDate(now.getDate() - 7);
            break;
        case 'Este mes':
            start = new Date(now.getFullYear(), now.getMonth(), 1);
            break;
        case 'Mes anterior':
            start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            end = new Date(now.getFullYear(), now.getMonth(), 0);
            break;
        case 'Últimos 30 días':
        default:
            start.setDate(now.getDate() - 30);
            break;
    }

    const duration = end.getTime() - start.getTime();
    const prevEnd = new Date(start.getTime());
    const prevStart = new Date(prevEnd.getTime() - duration);

    return { start, end, prevStart, prevEnd };
}