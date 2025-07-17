"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Package, Users, ShoppingCart, BarChart3 } from "lucide-react"
import Link from "next/link"
import { API_ENDPOINTS } from "@/lib/config"

interface User {
  id: string
  name: string
  email: string
  role: "ADMIN" | "CUSTOMER"
}

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          router.push("/login")
          return
        }

        const res = await fetch(API_ENDPOINTS.ME, {
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

        setUser(userData)
      } catch (error) {
        router.push("/login")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Carregando...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Painel Administrativo</h1>
          <p className="text-gray-600">Bem-vindo, {user.name}!</p>
        </div>

        {/* Cards de navegação */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link href="/admin/produtos">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-pink-200">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <Package className="h-8 w-8 text-pink-600" />
                  <CardTitle className="text-lg">Produtos</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>Gerenciar produtos da loja</CardDescription>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/categorias">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-pink-200">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <BarChart3 className="h-8 w-8 text-pink-600" />
                  <CardTitle className="text-lg">Categorias</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>Gerenciar categorias</CardDescription>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/usuarios">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-pink-200">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <Users className="h-8 w-8 text-pink-600" />
                  <CardTitle className="text-lg">Usuários</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>Gerenciar usuários</CardDescription>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/pedidos">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-pink-200">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <ShoppingCart className="h-8 w-8 text-pink-600" />
                  <CardTitle className="text-lg">Pedidos</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>Visualizar pedidos</CardDescription>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Ações rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-pink-200">
            <CardHeader>
              <CardTitle className="text-xl">Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/admin/produtos/novo">
                <Button className="w-full bg-pink-600 hover:bg-pink-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Novo Produto
                </Button>
              </Link>
              <Link href="/admin/categorias/novo">
                <Button variant="outline" className="w-full border-pink-300 text-pink-700 hover:bg-pink-50">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Nova Categoria
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-pink-200">
            <CardHeader>
              <CardTitle className="text-xl">Voltar à Loja</CardTitle>
            </CardHeader>
            <CardContent>
              <Link href="/">
                <Button variant="outline" className="w-full">
                  Ir para a Loja
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 