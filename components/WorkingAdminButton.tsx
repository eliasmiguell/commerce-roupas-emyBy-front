"use client"

import { useState, useEffect } from "react"
import { Settings } from "lucide-react"
import Link from "next/link"

export default function WorkingAdminButton() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          setIsLoading(false)
          return
        }

        const response = await fetch("http://localhost:8001/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const user = await response.json()
          if (user.role === "ADMIN") {
            setIsAdmin(true)
          }
        }
      } catch (error) {
        console.error("Erro ao verificar admin:", error)
      } finally {
        setIsLoading(false)
      }
    }

    // Aguardar um pouco para garantir que a página carregou
    const timer = setTimeout(checkAdmin, 2000)
    return () => clearTimeout(timer)
  }, [])

  console.log("WorkingAdminButton - isLoading:", isLoading, "isAdmin:", isAdmin)
  
  if (isLoading || !isAdmin) {
    return null
  }

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: '#fbbf24',
        color: '#000',
        padding: '12px 16px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        zIndex: 9999,
        border: '2px solid #f59e0b',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}
    >
      <Settings size={16} />
      <Link href="/admin" style={{ color: 'inherit', textDecoration: 'none' }}>
        Painel Admin
      </Link>
    </div>
  )
} 