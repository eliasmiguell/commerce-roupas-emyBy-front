"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Loader2 } from "lucide-react"

interface PublicRouteProps {
  children: React.ReactNode
  redirectTo?: string
}

export default function PublicRoute({ children, redirectTo = "/" }: PublicRouteProps) {
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
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  // Se estiver autenticado, redirecionar
  if (isAuthenticated) {
    if (typeof window !== "undefined") {
      window.location.href = redirectTo
    }
    return null
  }

  // Se não estiver autenticado, mostrar o conteúdo
  return <>{children}</>
} 