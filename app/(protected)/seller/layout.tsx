'use client'

import SideNav from '@/components/ui/side-nav'
import { CircleDollarSign, Home, MessageSquareWarning, ShieldCheck } from 'lucide-react'


const tabs = [
    { label: 'Home', href: '/seller', icon: Home },
    { label: 'Acreditaciones', href: '/seller/accreditations', icon: CircleDollarSign },
    { label: 'Disputas', href: '/seller/disputes', icon: MessageSquareWarning },
    { label: 'Autorización', href: '/seller/authorization', icon: ShieldCheck },
]


export default function SellerLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col md:flex-row h-screen">
            <SideNav tabs={tabs} />
            <main className="flex-1 overflow-y-auto p-6">
                {children}
            </main>
        </div>
    )
}