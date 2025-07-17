"use client"

import { useState, useEffect } from "react"
import { Settings, Crown } from "lucide-react"
import Link from "next/link"
import { API_ENDPOINTS } from "@/lib/config"

export default function FloatingAdminButton() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          console.log("FloatingAdminButton: Nenhum token encontrado")
          return
        }

        console.log("FloatingAdminButton: Verificando status de admin...")
        
        const res = await fetch(API_ENDPOINTS.ME, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) {
          console.log("FloatingAdminButton: Resposta não ok:", res.status)
          return
        }

        const userData = await res.json()
        console.log("FloatingAdminButton: Dados do usuário:", userData)
        
        if (userData.role === "ADMIN") {
          console.log("FloatingAdminButton: Usuário é admin, mostrando botão")
          setIsAdmin(true)
          // Mostrar o botão imediatamente
          setIsVisible(true)
        } else {
          console.log("FloatingAdminButton: Usuário não é admin")
        }
      } catch (error) {
        console.error("FloatingAdminButton: Erro ao verificar status de admin:", error)
      }
    }

    // Aguardar um pouco antes de verificar
    const timer = setTimeout(checkAdminStatus, 1000)
    
    return () => clearTimeout(timer)
  }, [])

  console.log("FloatingAdminButton - isAdmin:", isAdmin, "isVisible:", isVisible)
  
  if (!isAdmin || !isVisible) {
    console.log("FloatingAdminButton: Não renderizando botão")
    return null
  }

  console.log("FloatingAdminButton: Renderizando botão")
  
  return (
    <div className="fixed bottom-6 right-6 z-[9999] bg-yellow-500 text-black p-4 rounded-lg shadow-lg border-2 border-yellow-600">
      <Link
        href="/admin"
        className="flex items-center space-x-2 font-bold"
      >
        <Settings className="h-6 w-6" />
        <span>Painel Admin</span>
      </Link>
    </div>
  )
} 