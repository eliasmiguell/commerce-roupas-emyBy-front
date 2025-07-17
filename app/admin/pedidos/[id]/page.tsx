"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Package, Calendar, DollarSign, User, MapPin } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import api from "@/axios"

export default function DetalhesPedidoPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [pedido, setPedido] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const orderId = params.id as string

  useEffect(() => {
    const fetchPedido = async () => {
      try {
        const response = await api.get(`/orders/admin/${orderId}`)
        setPedido(response.data.order || response.data)
      } catch (err) {
        setError("Erro ao carregar pedido")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (orderId) {
      fetchPedido()
    }
  }, [orderId])

  const handleEdit = () => {
    router.push(`/admin/pedidos/editar/${orderId}`)
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'processing': return 'bg-blue-100 text-blue-800'
      case 'shipped': return 'bg-purple-100 text-purple-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'Pendente'
      case 'processing': return 'Processando'
      case 'shipped': return 'Enviado'
      case 'delivered': return 'Entregue'
      case 'cancelled': return 'Cancelado'
      default: return status || 'Desconhecido'
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-pink-600" />
          <span className="ml-2">Carregando pedido...</span>
        </div>
      </div>
    )
  }

  if (error || !pedido) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-bold text-red-600 mb-2">Pedido não encontrado</h2>
            <p className="text-gray-600 mb-4">{error || "O pedido solicitado não existe."}</p>
            <Link href="/admin/pedidos">
              <Button>Voltar aos Pedidos</Button>
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
        <Link href="/admin/pedidos" className="inline-flex items-center text-pink-600 hover:text-pink-700 mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar aos Pedidos
        </Link>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Pedido #{pedido.id?.slice(-8)}</h1>
            <p className="text-gray-600">Detalhes do pedido</p>
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
        {/* Informações do pedido */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Informações do Pedido
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Status</label>
                <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getStatusColor(pedido.status)}`}>
                  {getStatusText(pedido.status)}
                </span>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Total</label>
                <p className="text-lg font-semibold text-pink-600 flex items-center">
                  <DollarSign className="h-4 w-4 mr-1" />
                  R$ {Number(pedido.total || 0).toFixed(2).replace('.', ',')}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Data</label>
                <p className="text-gray-700 flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  {pedido.createdAt ? new Date(pedido.createdAt).toLocaleDateString('pt-BR', {
                    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
                  }) : 'Não informado'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Usuário */}
          {pedido.user && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Usuário
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <label className="text-sm font-medium text-gray-600">Nome</label>
                  <p className="text-gray-700">{pedido.user.name || 'Não informado'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-gray-700">{pedido.user.email || 'Não informado'}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Endereço */}
          {pedido.address && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Endereço de Entrega
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <label className="text-sm font-medium text-gray-600">Rua</label>
                  <p className="text-gray-700">{pedido.address.street || 'Não informado'}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Número</label>
                    <p className="text-gray-700">{pedido.address.number || 'Não informado'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Complemento</label>
                    <p className="text-gray-700">{pedido.address.complement || 'Não informado'}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Bairro</label>
                  <p className="text-gray-700">{pedido.address.neighborhood || 'Não informado'}</p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Cidade</label>
                    <p className="text-gray-700">{pedido.address.city || 'Não informado'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Estado</label>
                    <p className="text-gray-700">{pedido.address.state || 'Não informado'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">CEP</label>
                    <p className="text-gray-700">{pedido.address.zipCode || 'Não informado'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Itens do pedido */}
        <Card>
          <CardHeader>
            <CardTitle>Itens do Pedido</CardTitle>
          </CardHeader>
          <CardContent>
            {pedido.items && pedido.items.length > 0 ? (
              <div className="space-y-3">
                {pedido.items.map((item: any) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{item.product?.name || 'Produto'}</p>
                      <p className="text-sm text-gray-600">
                        Quantidade: {item.quantity} | R$ {Number(item.price).toFixed(2).replace('.', ',')}
                      </p>
                    </div>
                    <Badge variant="secondary">
                      {item.variant?.size ? `Tam: ${item.variant.size}` : ''} {item.variant?.color ? `Cor: ${item.variant.color}` : ''}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Nenhum item neste pedido</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 