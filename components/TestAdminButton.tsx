"use client"

import { useState, useEffect } from "react"
import { Settings } from "lucide-react"
import Link from "next/link"

export default function TestAdminButton() {
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    // Simplesmente mostrar o botão após 2 segundos para teste
    const timer = setTimeout(() => {
      console.log("TestAdminButton: Mostrando botão de teste")
      setShowButton(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (!showButton) {
    console.log("TestAdminButton: Botão não visível ainda")
    return null
  }

  console.log("TestAdminButton: Renderizando botão")

  return (
    <div className="fixed bottom-6 left-6 z-50 bg-red-500 text-white p-4 rounded-lg shadow-lg">
      <Link href="/admin" className="flex items-center space-x-2">
        <Settings className="h-6 w-6" />
        <span>Teste Admin</span>
      </Link>
    </div>
  )
} 