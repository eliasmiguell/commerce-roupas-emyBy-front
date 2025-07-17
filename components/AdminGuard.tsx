"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface AdminGuardProps {
  children: React.ReactNode
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          router.push("/login")
          return
        }

        const res = await fetch("https://emy-backend.onrender.com/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) {
          router.push("/login")
          return
        }

        const userData = await res.json()
        if (userData.role !== "ADMIN") {
          router.push("/")
          return
        }

        setIsAdmin(true)
      } catch (error) {
        console.error("Erro ao verificar status de admin:", error)
        router.push("/login")
      } finally {
        setLoading(false)
      }
    }

    checkAdminStatus()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Verificando permissões...</div>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return <>{children}</>
} 