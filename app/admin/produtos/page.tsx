"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, Search, Edit, Trash2, Eye, EyeOff } from "lucide-react"
import Link from "next/link"

interface Product {
  id: string
  name: string
  description: string
  price: number
  imageUrl: string
  isActive: boolean
  category: {
    id: string
    name: string
  }
  variants: Array<{
    id: string
    size: string
    color: string
    stock: number
  }>
  createdAt: string
}

export default function ProdutosPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/login")
        return
      }

      const res = await fetch("http://localhost:8001/api/products/admin", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        if (res.status === 401) {
          router.push("/login")
          return
        }
        throw new Error("Erro ao buscar produtos")
      }

      const data = await res.json()
      setProducts(data.products || data)
    } catch (error) {
      setError("Erro ao carregar produtos")
    } finally {
      setLoading(false)
    }
  }

  const toggleProductStatus = async (productId: string, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`http://localhost:8001/api/products/${productId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          isActive: !currentStatus,
        }),
      })

      if (res.ok) {
        setProducts(prev =>
          prev.map(product =>
            product.id === productId
              ? { ...product, isActive: !currentStatus }
              : product
          )
        )
      }
    } catch (error) {
      setError("Erro ao atualizar status do produto")
    }
  }

  const deleteProduct = async (productId: string) => {
    if (!confirm("Tem certeza que deseja excluir este produto?")) {
      return
    }

    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`http://localhost:8001/api/products/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (res.ok) {
        setProducts(prev => prev.filter(product => product.id !== productId))
      } else {
        setError("Erro ao excluir produto")
      }
    } catch (error) {
      setError("Erro ao excluir produto")
    }
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Carregando produtos...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href="/admin" className="inline-flex items-center text-pink-600 hover:text-pink-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Painel
          </Link>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className="text-3xl font-bold text-gray-800">Gerenciar Produtos</h1>
            <Link href="/admin/produtos/novo">
              <Button className="bg-pink-600 hover:bg-pink-700">
                <Plus className="h-4 w-4 mr-2" />
                Novo Produto
              </Button>
            </Link>
          </div>
        </div>

        {/* Barra de pesquisa */}
        <Card className="mb-6 border-pink-200">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar produtos por nome ou categoria..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-300 focus:border-pink-500 focus:ring-pink-500"
              />
            </div>
          </CardContent>
        </Card>

        {/* Mensagem de erro */}
        {error && (
          <div className="mb-6 text-red-600 text-sm font-semibold text-center bg-red-50 p-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Lista de produtos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="border-pink-200 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg text-gray-800 line-clamp-2">
                      {product.name}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-600">
                      {product.category.name}
                    </CardDescription>
                  </div>
                  <Badge
                    variant={product.isActive ? "default" : "secondary"}
                    className={product.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                  >
                    {product.isActive ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Imagem do produto */}
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      Sem imagem
                    </div>
                  )}
                </div>

                {/* Informações do produto */}
                <div className="space-y-2">
                  <p className="text-lg font-bold text-pink-600">
                    {formatPrice(product.price)}
                  </p>
                  {product.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {product.description}
                    </p>
                  )}
                  <p className="text-xs text-gray-500">
                    Criado em: {formatDate(product.createdAt)}
                  </p>
                </div>

                {/* Variantes */}
                {product.variants.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-gray-700">Variantes:</p>
                    <div className="flex flex-wrap gap-1">
                      {product.variants.slice(0, 3).map((variant) => (
                        <Badge key={variant.id} variant="outline" className="text-xs">
                          {variant.size} - {variant.color} ({variant.stock})
                        </Badge>
                      ))}
                      {product.variants.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{product.variants.length - 3} mais
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Ações */}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleProductStatus(product.id, product.isActive)}
                    className="flex-1 border-pink-300 text-pink-700 hover:bg-pink-50"
                  >
                    {product.isActive ? (
                      <>
                        <EyeOff className="h-3 w-3 mr-1" />
                        Desativar
                      </>
                    ) : (
                      <>
                        <Eye className="h-3 w-3 mr-1" />
                        Ativar
                      </>
                    )}
                  </Button>
                  <Link href={`/admin/produtos/${product.id}/editar`}>
                    <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-50">
                      <Edit className="h-3 w-3" />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteProduct(product.id)}
                    className="border-red-300 text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mensagem quando não há produtos */}
        {filteredProducts.length === 0 && !loading && (
          <Card className="border-pink-200">
            <CardContent className="p-8 text-center">
              <p className="text-gray-600 mb-4">
                {searchTerm ? "Nenhum produto encontrado para sua busca." : "Nenhum produto cadastrado ainda."}
              </p>
              {!searchTerm && (
                <Link href="/admin/produtos/novo">
                  <Button className="bg-pink-600 hover:bg-pink-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Primeiro Produto
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
} 