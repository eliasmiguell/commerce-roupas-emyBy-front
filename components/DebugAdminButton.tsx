"use client"

import { useState, useEffect } from "react"
import { Settings } from "lucide-react"
import Link from "next/link"

export default function DebugAdminButton() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    console.log("DebugAdminButton: Componente montado")
    
    // Mostrar o botão após 3 segundos, independente de ser admin
    const timer = setTimeout(() => {
      console.log("DebugAdminButton: Mostrando botão de debug")
      setShow(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  if (!show) {
    console.log("DebugAdminButton: Aguardando para mostrar...")
    return null
  }

  console.log("DebugAdminButton: Renderizando botão de debug")

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        backgroundColor: '#ef4444',
        color: 'white',
        padding: '15px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        zIndex: 10000,
        border: '3px solid #dc2626',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}
    >
      <Settings size={20} />
      <Link href="/admin" style={{ color: 'white', textDecoration: 'none' }}>
        DEBUG ADMIN
      </Link>
    </div>
  )
} 