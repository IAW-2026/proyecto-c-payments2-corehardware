import SideNav from '@/components/ui/side-nav'

const tabs = [
    { label: 'Home', href: '/seller' },
    { label: 'Acreditaciones', href: '/seller/acreditaciones' },
    { label: 'Disputas', href: '/seller/disputas' },
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