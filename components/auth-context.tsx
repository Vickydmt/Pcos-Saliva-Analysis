"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import {
  type User,
  type AuthState,
  getAuthState,
  login as authLogin,
  logout as authLogout,
  register as authRegister,
} from "@/lib/auth"

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => { success: boolean; error?: string }
  register: (email: string, password: string, name: string) => { success: boolean; error?: string }
  logout: () => void
}

const defaultAuthContext: AuthContextType = {
  user: null,
  isAuthenticated: false,
  login: () => ({ success: false, error: "Not initialized" }),
  register: () => ({ success: false, error: "Not initialized" }),
  logout: () => {},
}

const AuthContext = createContext<AuthContextType>(defaultAuthContext)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({ user: null, isAuthenticated: false })

  useEffect(() => {
    setAuthState(getAuthState())
  }, [])

  const login = (email: string, password: string) => {
    const result = authLogin(email, password)
    if (result.success && result.user) {
      setAuthState({ user: result.user, isAuthenticated: true })
    }
    return { success: result.success, error: result.error }
  }

  const register = (email: string, password: string, name: string) => {
    const result = authRegister(email, password, name)
    if (result.success && result.user) {
      setAuthState({ user: result.user, isAuthenticated: true })
    }
    return { success: result.success, error: result.error }
  }

  const logout = () => {
    authLogout()
    setAuthState({ user: null, isAuthenticated: false })
  }

  return <AuthContext.Provider value={{ ...authState, login, register, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
