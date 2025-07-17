"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Loader2 } from "lucide-react"

interface AdminGuardProps {
  children: React.ReactNode
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter()
  const { isAuthenticated, user, loading } = useAuth()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push("/login")
        return
      }
      if (user && user.role !== "ADMIN") {
        router.push("/")
        return
      }
      setChecked(true)
    }
  }, [isAuthenticated, user, loading, router])

  if (loading || !checked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-pink-600 mx-auto mb-4" />
          <p className="text-gray-600">Verificando permissões...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user || user.role !== "ADMIN") {
    return null
  }

  return <>{children}</>
} 