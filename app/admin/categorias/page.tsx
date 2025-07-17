"use client"

import { useState, useEffect } from "react"
import { getCategorias, deleteCategoria } from "@/lib/categoriaService"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Edit, Trash2, Eye } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function AdminCategoriasPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoriasData, setCategoriasData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<any>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<any>(null)
  const [deleting, setDeleting] = useState(false)
  
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        console.log('Executando fetch de categorias...')
        const result = await getCategorias()
        console.log('Resultado do fetch categorias:', result)
        setCategoriasData(result)
      } catch (err) {
        console.error('Erro no fetch categorias:', err)
        setError(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategorias()
  }, [])

  const categorias = Array.isArray(categoriasData) ? categoriasData : []

  const filteredCategorias = categorias.filter((categoria: any) =>
    categoria.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    categoria.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleEdit = (id: string) => {
    router.push(`/admin/categorias/editar/${id}`)
  }

  const handleView = (id: string) => {
    router.push(`/admin/categorias/${id}`)
  }

  const handleDelete = (categoria: any) => {
    setCategoryToDelete(categoria)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!categoryToDelete) return

    setDeleting(true)
    try {
      await deleteCategoria(categoryToDelete.id)
      toast({
        title: "Categoria excluída",
        description: `${categoryToDelete.name} foi excluída com sucesso.`,
      })
      
      // Recarregar a lista
      const result = await getCategorias()
      setCategoriasData(result)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao excluir categoria. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setDeleting(false)
      setDeleteDialogOpen(false)
      setCategoryToDelete(null)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-pink-600" />
          <span className="ml-2">Carregando categorias...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-bold text-red-600 mb-2">Erro ao carregar categorias</h2>
            <p className="text-gray-600 mb-4">Tente novamente mais tarde.</p>
            <Button onClick={() => window.location.reload()}>
              Tentar Novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Gerenciar Categorias</h1>
          <p className="text-gray-600">Visualize e gerencie todas as categorias da loja</p>
        </div>
        <Link href="/admin/categorias/novo">
          <Button className="bg-pink-600 hover:bg-pink-700">
            <Plus className="h-4 w-4 mr-2" />
            Nova Categoria
          </Button>
        </Link>
      </div>

      {/* Barra de pesquisa */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar categorias..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
        />
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-pink-600">{categorias.length}</div>
            <div className="text-sm text-gray-600">Total de Categorias</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {categorias.filter((c: any) => c.slug).length}
            </div>
            <div className="text-sm text-gray-600">Com Slug</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {categorias.filter((c: any) => c.imageUrl).length}
            </div>
            <div className="text-sm text-gray-600">Com Imagem</div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de categorias */}
      {filteredCategorias.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {searchTerm ? "Nenhuma categoria encontrada" : "Nenhuma categoria cadastrada"}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm 
                ? "Tente ajustar os termos de busca" 
                : "Comece criando sua primeira categoria"
              }
            </p>
            {!searchTerm && (
              <Link href="/admin/categorias/novo">
                <Button className="bg-pink-600 hover:bg-pink-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeira Categoria
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategorias.map((categoria: any) => (
            <Card key={categoria.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{categoria.name}</CardTitle>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {categoria.description}
                </p>
                {categoria.slug && (
                  <p className="text-xs text-gray-500">
                    Slug: {categoria.slug}
                  </p>
                )}
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-500">
                    Criada em: {new Date(categoria.createdAt).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleView(categoria.id)}
                    className="flex-1"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Ver
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(categoria.id)}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(categoria)}
                    className="flex-1 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Excluir
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog de confirmação de exclusão */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a categoria "{categoryToDelete?.name}"? 
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Excluindo...
                </>
              ) : (
                "Excluir"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 