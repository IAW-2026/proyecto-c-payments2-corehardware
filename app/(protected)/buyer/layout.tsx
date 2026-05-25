import SideNav from '@/components/ui/side-nav'

const tabs = [
    { label: 'Home', href: '/buyer' },
    { label: 'Pagos', href: '/buyer/payments' },
    { label: 'Disputas', href: '/buyer/disputes' },
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