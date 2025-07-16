"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

export default function SimpleAdminButton() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    console.log("SimpleAdminButton: Componente montado")
    
    const timer = setTimeout(() => {
      console.log("SimpleAdminButton: Mostrando botão")
      setShow(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  if (!show) {
    console.log("SimpleAdminButton: Não mostrando ainda")
    return null
  }

  console.log("SimpleAdminButton: Renderizando")

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: 'red',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        zIndex: 10000,
        fontSize: '16px',
        fontWeight: 'bold'
      }}
    >
      <Link href="/admin" style={{ color: 'white', textDecoration: 'none' }}>
        ADMIN
      </Link>
    </div>
  )
} 