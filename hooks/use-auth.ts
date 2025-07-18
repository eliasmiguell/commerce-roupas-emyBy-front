"use client"

import { useState, useEffect } from "react"
import { getAuthState, saveAuthData, logout as logoutAuth, User } from "@/lib/auth"
import { useRouter } from "next/navigation"

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      const authState = getAuthState()
      console.log('useAuth - checkAuth chamado, authState:', authState)
      setIsAuthenticated(authState.isAuthenticated)
      setUser(authState.user)
      setLoading(false)
    }

    checkAuth()

    // Listener para mudanças no localStorage
    const handleStorageChange = () => {
      console.log('useAuth - Storage change detectado')
      checkAuth()
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const login = (token: string, userData: any) => {
    console.log('useAuth - Login chamado com token:', token ? 'presente' : 'ausente')
    console.log('useAuth - User data:', userData)
    saveAuthData(token, userData)
    setIsAuthenticated(true)
    setUser(userData)
    console.log('useAuth - Redirecionando para página inicial')
    // Redirecionar para a página inicial após login
    router.push('/')
  }

  const logout = () => {
    logoutAuth()
    setIsAuthenticated(false)
    setUser(null)
    // Redirecionar para login após logout
    router.push('/login')
  }

  return {
    isAuthenticated,
    user,
    loading,
    login,
    logout
  }
} 