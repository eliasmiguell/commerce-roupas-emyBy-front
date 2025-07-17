"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestAdminButton() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const testLogin = async () => {
    setLoading(true)
    setMessage("")
    
    try {
      const response = await fetch("http://localhost:8001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "admin@emy-by.com",
          password: "admin123"
        })
      })

      const data = await response.json()
      
      if (response.ok) {
        localStorage.setItem("token", data.token)
        setMessage(`Login realizado! Token: ${data.token.slice(0, 20)}...`)
      } else {
        setMessage(`Erro: ${data.error}`)
      }
    } catch (err) {
      setMessage(`Erro de conexão: ${err}`)
    } finally {
      setLoading(false)
    }
  }

  const testAPI = async () => {
    setLoading(true)
    setMessage("")
    
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        setMessage("Nenhum token encontrado. Faça login primeiro.")
        return
      }

      const response = await fetch("http://localhost:8001/api/users", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })

      const data = await response.json()
      
      if (response.ok) {
        setMessage(`API funcionando! ${data.users?.length || 0} usuários encontrados`)
      } else {
        setMessage(`Erro API: ${data.error}`)
      }
    } catch (err) {
      setMessage(`Erro de conexão: ${err}`)
    } finally {
      setLoading(false)
    }
  }

  const clearToken = () => {
    localStorage.removeItem("token")
    setMessage("Token removido!")
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <Card className="w-80 bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="text-sm">Teste Admin</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button 
            onClick={testLogin} 
            disabled={loading}
            size="sm"
            className="w-full"
          >
            {loading ? "Testando..." : "Login Admin"}
          </Button>
          
          <Button 
            onClick={testAPI} 
            disabled={loading}
            size="sm"
            variant="outline"
            className="w-full"
          >
            Testar API
          </Button>

          <Button 
            onClick={clearToken} 
            size="sm"
            variant="destructive"
            className="w-full"
          >
            Limpar Token
          </Button>

          {message && (
            <div className="text-xs p-2 bg-gray-50 rounded">
              {message}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 