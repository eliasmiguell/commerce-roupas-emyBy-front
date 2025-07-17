"use client"

import { useState, useEffect } from "react"
import { Settings } from "lucide-react"
import Link from "next/link"
import { API_ENDPOINTS } from "@/lib/config"

export default function FinalAdminButton() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        // Aguardar um pouco para garantir que a página carregou
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const token = localStorage.getItem("token")
        console.log("FinalAdminButton: Token encontrado:", !!token)
        
        if (!token) {
          setIsLoading(false)
          return
        }

        console.log("FinalAdminButton: Fazendo requisição para verificar admin...")
        
        const response = await fetch(API_ENDPOINTS.ME, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        })

        console.log("FinalAdminButton: Status da resposta:", response.status)

        if (response.ok) {
          const userData = await response.json()
          console.log("FinalAdminButton: Dados do usuário:", userData)
          
          if (userData.role === "ADMIN") {
            console.log("FinalAdminButton: Usuário é admin!")
            setIsAdmin(true)
          } else {
            console.log("FinalAdminButton: Usuário não é admin")
          }
        } else {
          console.log("FinalAdminButton: Erro na resposta:", response.statusText)
        }
      } catch (error) {
        console.error("FinalAdminButton: Erro ao verificar admin:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAdminStatus()
  }, [])

  console.log("FinalAdminButton - isLoading:", isLoading, "isAdmin:", isAdmin)

  if (isLoading) {
    return (
      <div 
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: '#6b7280',
          color: 'white',
          padding: '10px',
          borderRadius: '5px',
          zIndex: 10000,
          fontSize: '12px'
        }}
      >
        Verificando admin...
      </div>
    )
  }

  if (!isAdmin) {
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
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        zIndex: 10000,
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