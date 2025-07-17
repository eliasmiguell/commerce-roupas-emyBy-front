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
      setIsAuthenticated(authState.isAuthenticated)
      setUser(authState.user)
      setLoading(false)
    }

    checkAuth()

    // Listener para mudanças no localStorage
    const handleStorageChange = () => {
      checkAuth()
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const login = (token: string, userData: any) => {
    saveAuthData(token, userData)
    setIsAuthenticated(true)
    setUser(userData)
    router.push('/')
  }

  const logout = () => {
    logoutAuth()
    setIsAuthenticated(false)
    setUser(null)
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