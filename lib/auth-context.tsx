'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export type UserRole = 'rider' | 'shop_owner' | 'mtb_company'

export interface UserProfile {
  id: string
  fullName: string
  username: string
  email: string
  role: UserRole
  avatarUrl?: string
}

interface AuthContextType {
  user: UserProfile | null
  login: (email: string, role?: UserRole, fullName?: string) => void
  signup: (fullName: string, username: string, email: string, role: UserRole) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  signup: () => {},
  logout: () => {},
})

const DEFAULT_USER: UserProfile = {
  id: 'demo-user-123',
  fullName: 'Pasang Sherpa',
  username: 'pasang_rider',
  email: 'pasang@mtbhub.np',
  role: 'rider',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200'
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)

  useEffect(() => {
    // Check localStorage for saved user session or initialize with default
    const saved = localStorage.getItem('chakra_user')
    if (saved) {
      try {
        setUser(JSON.parse(saved))
      } catch (e) {
        setUser(DEFAULT_USER)
      }
    } else {
      setUser(DEFAULT_USER)
      localStorage.setItem('chakra_user', JSON.stringify(DEFAULT_USER))
    }
  }, [])

  const login = (email: string, role: UserRole = 'rider', fullName: string = 'Demo User') => {
    const newUser: UserProfile = {
      id: 'user-' + Date.now(),
      fullName: fullName || email.split('@')[0],
      username: email.split('@')[0],
      email,
      role,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200'
    }
    setUser(newUser)
    localStorage.setItem('chakra_user', JSON.stringify(newUser))
  }

  const signup = (fullName: string, username: string, email: string, role: UserRole) => {
    const newUser: UserProfile = {
      id: 'user-' + Date.now(),
      fullName,
      username,
      email,
      role,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200'
    }
    setUser(newUser)
    localStorage.setItem('chakra_user', JSON.stringify(newUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('chakra_user')
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
