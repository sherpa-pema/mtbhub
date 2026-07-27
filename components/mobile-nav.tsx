'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MessageSquare, Map, Calendar, Store, ShoppingBag, Compass, Trophy } from 'lucide-react'

export function MobileNav() {
  const pathname = usePathname()

  const navItems = [
    { label: 'Feed', href: '/community', icon: MessageSquare },
    { label: 'Trails', href: '/trails', icon: Map },
    { label: 'Events', href: '/events', icon: Calendar },
    { label: 'Shops', href: '/directory', icon: Store },
    { label: 'Market', href: '/marketplace', icon: ShoppingBag },
    { label: 'Tours', href: '/tours', icon: Compass },
    { label: 'HoF', href: '/hall-of-fame', icon: Trophy },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white/95 backdrop-blur border-t border-zinc-200 shadow-lg px-2 py-1.5 flex items-center justify-around">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href || (item.href !== '/community' && pathname.startsWith(item.href))
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all ${
              isActive ? 'text-orange-600 font-bold scale-105' : 'text-zinc-500 hover:text-zinc-900 font-medium'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
            <span className="text-[10px] leading-tight">{item.label}</span>
          </Link>
        )
      })}
    </div>
  )
}
