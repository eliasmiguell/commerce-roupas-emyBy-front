"use client"

import { useState, useEffect } from "react"
import { Settings } from "lucide-react"
import Link from "next/link"

export default function UltimateAdminButton() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [debugInfo, setDebugInfo] = useState("Iniciando...")

  useEffect(() => {
    console.log("UltimateAdminButton: Componente montado")
    setDebugInfo("Componente montado")

    const checkAdminStatus = async () => {
      try {
        setDebugInfo("Aguardando carregamento...")
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        const token = localStorage.getItem("token")
        console.log("UltimateAdminButton: Token:", token ? "Encontrado" : "Não encontrado")
        setDebugInfo(`Token: ${token ? "Encontrado" : "Não encontrado"}`)
        
        if (!token) {
          setIsLoading(false)
          setDebugInfo("Sem token - não é admin")
          return
        }

        setDebugInfo("Verificando admin...")
        console.log("UltimateAdminButton: Verificando admin...")
        
        const response = await fetch("http://localhost:8001/api/auth/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        })

        console.log("UltimateAdminButton: Status:", response.status)
        setDebugInfo(`Status: ${response.status}`)

        if (response.ok) {
          const userData = await response.json()
          console.log("UltimateAdminButton: User data:", userData)
          setDebugInfo(`Role: ${userData.role}`)
          
          if (userData.role === "ADMIN") {
            console.log("UltimateAdminButton: É ADMIN!")
            setIsAdmin(true)
            setDebugInfo("É ADMIN!")
          } else {
            console.log("UltimateAdminButton: Não é admin")
            setDebugInfo("Não é admin")
          }
        } else {
          const errorText = await response.text()
          console.log("UltimateAdminButton: Erro na resposta:", errorText)
          setDebugInfo(`Erro: ${response.status}`)
        }
             } catch (error) {
         console.error("UltimateAdminButton: Erro:", error)
         setDebugInfo(`Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
      } finally {
        setIsLoading(false)
      }
    }

    checkAdminStatus()
  }, [])

  console.log("UltimateAdminButton - isLoading:", isLoading, "isAdmin:", isAdmin, "debugInfo:", debugInfo)

  // Sempre mostrar o botão de debug
  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: isAdmin ? '#fbbf24' : '#ef4444',
        color: isAdmin ? '#000' : 'white',
        padding: '12px 16px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        zIndex: 10000,
        border: `2px solid ${isAdmin ? '#f59e0b' : '#dc2626'}`,
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        minWidth: '150px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Settings size={14} />
        <span>{isAdmin ? 'Painel Admin' : 'Debug Admin'}</span>
      </div>
      <div style={{ fontSize: '10px', opacity: 0.8 }}>
        {isLoading ? 'Carregando...' : debugInfo}
      </div>
      {isAdmin && (
        <Link href="/admin" style={{ color: 'inherit', textDecoration: 'none', fontSize: '10px' }}>
          Clique aqui
        </Link>
      )}
    </div>
  )
} 