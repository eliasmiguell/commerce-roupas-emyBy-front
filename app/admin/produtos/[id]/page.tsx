"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { getProduto } from "@/lib/produtoService"
import { getImageUrl } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Trash2, Package, Tag, Calendar, DollarSign } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

export default function VisualizarProdutoPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [produto, setProduto] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const productId = params.id as string

  useEffect(() => {
    const fetchProduto = async () => {
      try {
        const data = await getProduto(productId)
        setProduto(data.product || data)
      } catch (err) {
        setError("Erro ao carregar produto")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (productId) {
      fetchProduto()
    }
  }, [productId])

  const handleEdit = () => {
    router.push(`/admin/produtos/editar/${productId}`)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-pink-600" />
          <span className="ml-2">Carregando produto...</span>
        </div>
      </div>
    )
  }

  if (error || !produto) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-bold text-red-600 mb-2">Produto não encontrado</h2>
            <p className="text-gray-600 mb-4">{error || "O produto solicitado não existe."}</p>
            <Link href="/admin/produtos">
              <Button>Voltar aos Produtos</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <Link href="/admin/produtos" className="inline-flex items-center text-pink-600 hover:text-pink-700 mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar aos Produtos
        </Link>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{produto.name}</h1>
            <p className="text-gray-600">Detalhes do produto</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleEdit} variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Imagem do produto */}
        <Card>
          <CardHeader>
            <CardTitle>Imagem do Produto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={getImageUrl(produto.imageUrl)}
                alt={produto.name}
                className="w-full h-full object-cover"
              />
            </div>
          </CardContent>
        </Card>

        {/* Informações do produto */}
        <div className="space-y-6">
          {/* Informações básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Informações Básicas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Nome</label>
                <p className="text-lg font-semibold">{produto.name}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Descrição</label>
                <p className="text-gray-700">{produto.description || "Sem descrição"}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Preço</label>
                <p className="text-2xl font-bold text-pink-600 flex items-center">
                  <DollarSign className="h-5 w-5 mr-1" />
                  R$ {Number(produto.price).toFixed(2).replace('.', ',')}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Status</label>
                <div className="mt-1">
                  <Badge variant={produto.isActive ? "default" : "secondary"}>
                    {produto.isActive ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Categoria */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Tag className="h-5 w-5 mr-2" />
                Categoria
              </CardTitle>
            </CardHeader>
            <CardContent>
              {produto.category ? (
                <div>
                  <p className="font-semibold">{produto.category.name}</p>
                  <p className="text-sm text-gray-600">{produto.category.description}</p>
                </div>
              ) : (
                <p className="text-gray-500">Categoria não definida</p>
              )}
            </CardContent>
          </Card>

          {/* Variantes */}
          {produto.variants && produto.variants.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Variantes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {produto.variants.map((variant: any, index: number) => (
                    <div key={variant.id || index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <span className="font-medium">Tamanho: {variant.size}</span>
                        {variant.color && (
                          <span className="ml-2 text-gray-600">Cor: {variant.color}</span>
                        )}
                      </div>
                      <Badge variant="outline">Estoque: {variant.stock}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Datas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Datas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <label className="text-sm font-medium text-gray-600">Criado em</label>
                <p className="text-gray-700">
                  {new Date(produto.createdAt).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Última atualização</label>
                <p className="text-gray-700">
                  {new Date(produto.updatedAt).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 