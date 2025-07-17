"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { getCategoria } from "@/lib/categoriaService"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Tag, Calendar, Package } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

export default function VisualizarCategoriaPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [categoria, setCategoria] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const categoryId = params.id as string

  useEffect(() => {
    const fetchCategoria = async () => {
      try {
        const data = await getCategoria(categoryId)
        setCategoria(data.category || data)
      } catch (err) {
        setError("Erro ao carregar categoria")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (categoryId) {
      fetchCategoria()
    }
  }, [categoryId])

  const handleEdit = () => {
    router.push(`/admin/categorias/editar/${categoryId}`)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-pink-600" />
          <span className="ml-2">Carregando categoria...</span>
        </div>
      </div>
    )
  }

  if (error || !categoria) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-bold text-red-600 mb-2">Categoria não encontrada</h2>
            <p className="text-gray-600 mb-4">{error || "A categoria solicitada não existe."}</p>
            <Link href="/admin/categorias">
              <Button>Voltar às Categorias</Button>
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
        <Link href="/admin/categorias" className="inline-flex items-center text-pink-600 hover:text-pink-700 mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar às Categorias
        </Link>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{categoria.name}</h1>
            <p className="text-gray-600">Detalhes da categoria</p>
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
        {/* Informações da categoria */}
        <div className="space-y-6">
          {/* Informações básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Tag className="h-5 w-5 mr-2" />
                Informações Básicas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Nome</label>
                <p className="text-lg font-semibold">{categoria.name}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Slug</label>
                <p className="text-gray-700 font-mono bg-gray-100 px-2 py-1 rounded">
                  {categoria.slug || "Não definido"}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Descrição</label>
                <p className="text-gray-700">{categoria.description || "Sem descrição"}</p>
              </div>
            </CardContent>
          </Card>

          {/* Estatísticas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Estatísticas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-pink-50 rounded-lg">
                  <div className="text-2xl font-bold text-pink-600">
                    {categoria._count?.products || 0}
                  </div>
                  <div className="text-sm text-gray-600">Produtos</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {categoria.imageUrl ? "Sim" : "Não"}
                  </div>
                  <div className="text-sm text-gray-600">Tem Imagem</div>
                </div>
              </div>
            </CardContent>
          </Card>

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
                <label className="text-sm font-medium text-gray-600">Criada em</label>
                <p className="text-gray-700">
                  {new Date(categoria.createdAt).toLocaleDateString('pt-BR', {
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
                  {new Date(categoria.updatedAt).toLocaleDateString('pt-BR', {
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

        {/* Lista de produtos da categoria */}
        <Card>
          <CardHeader>
            <CardTitle>Produtos desta Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            {categoria.products && categoria.products.length > 0 ? (
              <div className="space-y-3">
                {categoria.products.map((product: any) => (
                  <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-600">
                        R$ {Number(product.price).toFixed(2).replace('.', ',')}
                      </p>
                    </div>
                    <Badge variant={product.isActive ? "default" : "secondary"}>
                      {product.isActive ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Nenhum produto nesta categoria</p>
                <Link href="/admin/produtos/novo">
                  <Button variant="outline" className="mt-2">
                    Criar Produto
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 