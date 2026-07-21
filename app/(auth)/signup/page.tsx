'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useAuth, UserRole } from '@/lib/auth-context'
import { User, Store, Compass, CheckCircle2 } from 'lucide-react'

export default function SignupPage() {
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<UserRole>('rider')
  const { signup } = useAuth()
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullName || !email) return
    signup(fullName, username || email.split('@')[0], email, role)
    router.push('/community')
  }

  return (
    <div className="container py-12 max-w-lg mx-auto px-4">
      <div className="bg-white p-8 rounded-2xl border shadow-sm">
        <h1 className="text-3xl font-black tracking-tight text-zinc-900">Join Chakra Nepal</h1>
        <p className="text-sm text-zinc-500 mt-1">Select your account type to get started.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {/* Role Selection */}
          <div>
            <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider block mb-2">Account Type</label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setRole('rider')}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${role === 'rider' ? 'border-orange-600 bg-orange-50 text-orange-950 ring-2 ring-orange-600/20' : 'border-zinc-200 hover:border-zinc-300'}`}
              >
                <User className={`w-5 h-5 mb-2 ${role === 'rider' ? 'text-orange-600' : 'text-zinc-400'}`} />
                <div>
                  <div className="font-bold text-xs">Rider</div>
                  <div className="text-[10px] text-zinc-500">Ride & Share</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRole('shop_owner')}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${role === 'shop_owner' ? 'border-amber-600 bg-amber-50 text-amber-950 ring-2 ring-amber-600/20' : 'border-zinc-200 hover:border-zinc-300'}`}
              >
                <Store className={`w-5 h-5 mb-2 ${role === 'shop_owner' ? 'text-amber-600' : 'text-zinc-400'}`} />
                <div>
                  <div className="font-bold text-xs">Shop Owner</div>
                  <div className="text-[10px] text-zinc-500">Sell & Repair</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRole('mtb_company')}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${role === 'mtb_company' ? 'border-purple-600 bg-purple-50 text-purple-950 ring-2 ring-purple-600/20' : 'border-zinc-200 hover:border-zinc-300'}`}
              >
                <Compass className={`w-5 h-5 mb-2 ${role === 'mtb_company' ? 'text-purple-600' : 'text-zinc-400'}`} />
                <div>
                  <div className="font-bold text-xs">MTB Company</div>
                  <div className="text-[10px] text-zinc-500">Create Tours</div>
                </div>
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-700 block mb-1">Full Name</label>
            <Input 
              placeholder="e.g. Pasang Sherpa" 
              value={fullName} 
              onChange={e => setFullName(e.target.value)} 
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-700 block mb-1">Username</label>
            <Input 
              placeholder="e.g. pasang_mtb" 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
            />
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-700 block mb-1">Email Address</label>
            <Input 
              placeholder="your@email.com" 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-700 block mb-1">Password</label>
            <Input 
              placeholder="••••••••" 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required
            />
          </div>

          <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 font-bold py-6 text-base rounded-xl">
            Create Account
          </Button>
        </form>

        <div className="text-xs text-center mt-6 text-zinc-500">
          Already have an account? <Link href="/login" className="font-bold text-orange-600 hover:underline">Log in</Link>
        </div>
      </div>
    </div>
  )
}
