'use client'

import { usePathname } from 'next/navigation'
import { TabItem, TabItemActive } from '@/components/ui/nav-tabs'

type Tab = { label: string; href: string }

export default function SideNav({ tabs }: { tabs: Tab[] }) {
    const pathname = usePathname()
    return (
        <nav className="flex md:flex-col justify-around md:justify-start md:w-44 md:h-screen md:sticky md:top-0 md:shrink-0 border-b md:border-b-0 md:border-r
                border-neutral-200 dark:border-neutral-900 bg-neutral-100/50 dark:bg-neutral-900/30 px-4 md:px-4 md:py-6 gap-1 overflow-x-auto md:overflow-x-visible">
            {tabs.map(({ label, href }) => {
                const Tab = pathname === href ? TabItemActive : TabItem
                return <Tab key={href}>{label}</Tab>
            })}
        </nav>
    )
}