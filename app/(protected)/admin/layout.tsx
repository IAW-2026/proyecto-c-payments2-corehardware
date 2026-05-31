'use client'

import SideNav from '@/components/ui/side-nav'
import { Home, LayoutDashboard } from 'lucide-react'


const tabs = [
    { label: 'Home', href: '/admin', icon: Home },
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
]


export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col md:flex-row h-screen">
            <SideNav tabs={tabs} />
            <main className="flex-1 overflow-y-auto p-6">
                {children}
            </main>
        </div>
    )
}