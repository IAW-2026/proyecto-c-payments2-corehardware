'use client'

import SideNav from '@/components/ui/side-nav'
import { Home, CreditCard, MessageSquareWarning } from 'lucide-react'


const tabs = [
    { label: 'Home', href: '/buyer', icon: Home },
    { label: 'Pagos', href: '/buyer/payments', icon: CreditCard },
    { label: 'Disputas', href: '/buyer/disputes', icon: MessageSquareWarning },
]


export default function BuyerLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col md:flex-row h-screen">
            <SideNav tabs={tabs} />
            <main className="flex-1 overflow-y-auto p-6">
                {children}
            </main>
        </div>
    )
}