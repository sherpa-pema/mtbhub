'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useAuth, UserRole } from '@/lib/auth-context'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<UserRole>('rider')
  const { login } = useAuth()
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    login(email || 'rider@mtbhub.np', role)
    router.push('/community')
  }

  return (
    <div className="container py-16 max-w-md mx-auto px-4">
      <div className="bg-white p-8 rounded-2xl border shadow-sm">
        <h1 className="text-3xl font-black tracking-tight text-zinc-900">Welcome Back</h1>
        <p className="text-sm text-zinc-500 mt-1">Sign in to your Chakra Nepal account.</p>

        <form onSubmit={handleLogin} className="mt-8 space-y-4">
          <div>
            <label className="text-xs font-bold text-zinc-700 block mb-1">Select Role to Demo</label>
            <select
              value={role}
              onChange={e => setRole(e.target.value as UserRole)}
              className="w-full h-10 px-3 rounded-md border border-zinc-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-600/20"
            >
              <option value="rider">Rider (General User)</option>
              <option value="shop_owner">Shop Owner</option>
              <option value="mtb_company">MTB Company (Tour Operator)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-700 block mb-1">Email</label>
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
            Login
          </Button>
        </form>

        <div className="text-xs text-center mt-6 text-zinc-500">
          Don't have an account? <Link href="/signup" className="font-bold text-orange-600 hover:underline">Sign up</Link>
        </div>
      </div>
    </div>
  )
}
