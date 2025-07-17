"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export default function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Aguardar o componente montar no cliente
  if (!mounted) {
    return null
  }

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-pink-600 mx-auto mb-4" />
          <p className="text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    )
  }

  // Se não estiver autenticado, mostrar fallback ou redirecionar
  if (!isAuthenticated) {
    if (fallback) {
      return <>{fallback}</>
    }
    
    // Redirecionar para login
    if (typeof window !== "undefined") {
      window.location.href = "/login"
    }
    return null
  }

  // Se estiver autenticado, mostrar o conteúdo
  return <>{children}</>
} 