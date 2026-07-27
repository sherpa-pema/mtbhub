'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Mountain, User, LogOut, Store, Compass, Calendar, ShoppingBag, Map, MessageSquare, Trophy } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

export function SiteHeader() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case 'shop_owner':
        return <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded font-semibold border border-amber-300">Shop Owner</span>
      case 'mtb_company':
        return <span className="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded font-semibold border border-purple-300">MTB Company</span>
      default:
        return <span className="bg-orange-100 text-orange-800 text-xs px-2 py-0.5 rounded font-semibold border border-orange-300">Rider</span>
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-6">
          <Link href="/community" className="flex items-center gap-2.5 font-black text-xl tracking-tight">
            <div className="h-9 w-9 rounded-full bg-orange-600 flex items-center justify-center text-white shadow-md shadow-orange-600/30">
              <Mountain className="h-5 w-5" />
            </div>
            <span>CHAKRA <span className="text-xs font-normal text-zinc-400">NEPAL</span></span>
          </Link>

          <nav className="hidden lg:flex items-center gap-5 text-sm font-medium">
            <Link 
              href="/community" 
              className={`flex items-center gap-1.5 py-1 px-3 rounded-full transition-all ${pathname === '/community' ? 'bg-orange-600 text-white font-semibold' : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'}`}
            >
              <MessageSquare className="w-4 h-4" /> Community
            </Link>
            <Link 
              href="/trails" 
              className={`flex items-center gap-1.5 py-1 px-3 rounded-full transition-all ${pathname.startsWith('/trails') ? 'bg-orange-600 text-white font-semibold' : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'}`}
            >
              <Map className="w-4 h-4" /> Trails
            </Link>
            <Link 
              href="/events" 
              className={`flex items-center gap-1.5 py-1 px-3 rounded-full transition-all ${pathname.startsWith('/events') ? 'bg-orange-600 text-white font-semibold' : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'}`}
            >
              <Calendar className="w-4 h-4" /> Events
            </Link>
            <Link 
              href="/directory" 
              className={`flex items-center gap-1.5 py-1 px-3 rounded-full transition-all ${pathname.startsWith('/directory') ? 'bg-orange-600 text-white font-semibold' : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'}`}
            >
              <Store className="w-4 h-4" /> Shops
            </Link>
            <Link 
              href="/marketplace" 
              className={`flex items-center gap-1.5 py-1 px-3 rounded-full transition-all ${pathname.startsWith('/marketplace') ? 'bg-orange-600 text-white font-semibold' : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'}`}
            >
              <ShoppingBag className="w-4 h-4" /> Marketplace
            </Link>
            <Link 
              href="/tours" 
              className={`flex items-center gap-1.5 py-1 px-3 rounded-full transition-all ${pathname.startsWith('/tours') ? 'bg-orange-600 text-white font-semibold' : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'}`}
            >
              <Compass className="w-4 h-4" /> Tours
            </Link>
            <Link 
              href="/hall-of-fame" 
              className={`flex items-center gap-1.5 py-1 px-3 rounded-full transition-all ${pathname.startsWith('/hall-of-fame') ? 'bg-orange-600 text-white font-semibold' : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'}`}
            >
              <Trophy className="w-4 h-4" /> HoF
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3 bg-zinc-50 border p-1.5 pl-3 rounded-full">
              <div className="flex flex-col text-right hidden sm:flex">
                <span className="text-xs font-bold leading-tight text-zinc-900">{user.fullName}</span>
                <div className="mt-0.5">{getRoleBadge(user.role)}</div>
              </div>
              <img 
                src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200'} 
                alt={user.fullName} 
                className="w-8 h-8 rounded-full object-cover border border-zinc-200"
              />
              <Button variant="ghost" size="icon" onClick={logout} title="Sign Out" className="h-8 w-8 text-zinc-500 hover:text-red-600">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login"><Button variant="ghost" size="sm">Login</Button></Link>
              <Link href="/signup"><Button size="sm" className="bg-orange-600 hover:bg-orange-700">Join Community</Button></Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
