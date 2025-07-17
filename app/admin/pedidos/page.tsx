"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Edit, Trash2, Eye, Package, Calendar, DollarSign, User } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import api from "@/axios"
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

export default function AdminPedidosPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [pedidosData, setPedidosData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<any>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [orderToDelete, setOrderToDelete] = useState<any>(null)
  const [deleting, setDeleting] = useState(false)
  
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        console.log('Executando fetch de pedidos...')
        const response = await api.get('/orders/admin/all')
        console.log('Resposta da API pedidos:', response.data)
        setPedidosData(response.data)
      } catch (err) {
        console.error('Erro no fetch de pedidos:', err)
        setError(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPedidos()
  }, [])

  const pedidos = pedidosData?.orders || []

  const filteredPedidos = pedidos.filter((pedido: any) =>
    pedido.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pedido.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pedido.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleEdit = (id: string) => {
    router.push(`/admin/pedidos/editar/${id}`)
  }

  const handleView = (id: string) => {
    router.push(`/admin/pedidos/${id}`)
  }

  const handleDelete = async (pedido: any) => {
    setOrderToDelete(pedido)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!orderToDelete) return

    setDeleting(true)
    try {
      await api.delete(`/orders/admin/${orderToDelete.id}`)
      toast({
        title: "Pedido excluído",
        description: `Pedido #${orderToDelete.id?.slice(-8)} foi excluído com sucesso.`,
      })
      
      // Recarregar a lista
      const response = await api.get('/orders/admin/all')
      setPedidosData(response.data)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao excluir pedido. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setDeleting(false)
      setDeleteDialogOpen(false)
      setOrderToDelete(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800'
      case 'processing':
      case 'processando':
        return 'bg-blue-100 text-blue-800'
      case 'shipped':
      case 'enviado':
        return 'bg-purple-100 text-purple-800'
      case 'delivered':
      case 'entregue':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
      case 'cancelado':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'Pendente'
      case 'processing':
        return 'Processando'
      case 'shipped':
        return 'Enviado'
      case 'delivered':
        return 'Entregue'
      case 'cancelled':
        return 'Cancelado'
      default:
        return status || 'Desconhecido'
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-pink-600" />
          <span className="ml-2">Carregando pedidos...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-bold text-red-600 mb-2">Erro ao carregar pedidos</h2>
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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Gerenciar Pedidos</h1>
          <p className="text-gray-600">Visualize e gerencie todos os pedidos da loja</p>
        </div>
        <Link href="/admin/pedidos/novo">
          <Button className="bg-pink-600 hover:bg-pink-700">
            <Plus className="h-4 w-4 mr-2" />
            Novo Pedido
          </Button>
        </Link>
      </div>

      {/* Barra de pesquisa */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar pedidos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
        />
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-pink-600">{pedidos.length}</div>
            <div className="text-sm text-gray-600">Total de Pedidos</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {pedidos.filter((p: any) => p.status?.toLowerCase() === 'pending').length}
            </div>
            <div className="text-sm text-gray-600">Pendentes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {pedidos.filter((p: any) => p.status?.toLowerCase() === 'delivered').length}
            </div>
            <div className="text-sm text-gray-600">Entregues</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              R$ {pedidos.reduce((total: number, p: any) => total + (Number(p.total) || 0), 0).toFixed(2).replace('.', ',')}
            </div>
            <div className="text-sm text-gray-600">Valor Total</div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de pedidos */}
      {filteredPedidos.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {searchTerm ? "Nenhum pedido encontrado" : "Nenhum pedido cadastrado"}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm 
                ? "Tente ajustar os termos de busca" 
                : "Os pedidos aparecerão aqui quando os clientes fizerem compras"
              }
            </p>
            {!searchTerm && (
              <Link href="/admin/pedidos/novo">
                <Button className="bg-pink-600 hover:bg-pink-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Pedido Manual
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPedidos.map((pedido: any) => (
            <Card key={pedido.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Package className="h-5 w-5 text-pink-600" />
                    <CardTitle className="text-lg">Pedido #{pedido.id?.slice(-8)}</CardTitle>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(pedido.status)}`}>
                    {getStatusText(pedido.status)}
                  </span>
                </div>
                {pedido.user && (
                  <p className="text-sm text-gray-600 flex items-center">
                    <User className="h-3 w-3 mr-1" />
                    {pedido.user.name || pedido.user.email}
                  </p>
                )}
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total:</span>
                    <span className="text-lg font-bold text-pink-600 flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" />
                      R$ {Number(pedido.total || 0).toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                  {pedido.createdAt && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Data:</span>
                      <span className="text-xs text-gray-500 flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(pedido.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  )}
                  {pedido.items && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Itens:</span>
                      <span className="text-xs text-gray-500">
                        {pedido.items.length} produto(s)
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleView(pedido.id)}
                    className="flex-1"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Ver
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(pedido.id)}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(pedido)}
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
              Tem certeza que deseja excluir o pedido #{orderToDelete?.id?.slice(-8)}? 
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