"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Header from "@/components/header"
import { useAuth } from "@/hooks/use-auth"
import { useOrder } from "@/lib/orderService"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, Package, Calendar, DollarSign, MapPin, Phone, Mail, Truck } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { getImageUrl } from "@/lib/utils"

// Função para obter a cor do status
const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'confirmed':
      return 'bg-blue-100 text-blue-800'
    case 'processing':
      return 'bg-purple-100 text-purple-800'
    case 'shipped':
      return 'bg-orange-100 text-orange-800'
    case 'delivered':
      return 'bg-green-100 text-green-800'
    case 'cancelled':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// Função para traduzir o status
const translateStatus = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'Pendente'
    case 'confirmed':
      return 'Confirmado'
    case 'processing':
      return 'Processando'
    case 'shipped':
      return 'Enviado'
    case 'delivered':
      return 'Entregue'
    case 'cancelled':
      return 'Cancelado'
    default:
      return status
  }
}

// Função para obter ícone do status
const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return '⏳'
    case 'confirmed':
      return '✅'
    case 'processing':
      return '⚙️'
    case 'shipped':
      return '📦'
    case 'delivered':
      return '🎉'
    case 'cancelled':
      return '❌'
    default:
      return '📋'
  }
}

export default function PedidoDetalhesPage() {
  const router = useRouter()
  const params = useParams()
  const { isAuthenticated, user } = useAuth()
  const orderId = params.id as string
  const { data: orderData, isLoading, error } = useOrder(orderId)

  console.log('=== PedidoDetalhesPage ===')
  console.log('orderId:', orderId)
  console.log('isAuthenticated:', isAuthenticated)
  console.log('orderData:', orderData)
  console.log('isLoading:', isLoading)
  console.log('error:', error)

  useEffect(() => {
    console.log('PedidoDetalhesPage useEffect - isAuthenticated:', isAuthenticated)
    // Remover o redirecionamento automático para login
    // if (!isAuthenticated) {
    //   console.log('PedidoDetalhesPage - Redirecionando para login')
    //   router.push('/login')
    //   return
    // }
  }, [isAuthenticated, router])

  // Remover a verificação que retorna null
  // if (!isAuthenticated) {
  //   return null
  // }

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="pt-8">
          <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
              <Skeleton className="h-8 w-32 mb-4" />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-48 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full mb-4" />
                  <Skeleton className="h-8 w-24" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-32 mb-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-32 w-full" />
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    console.log('PedidoDetalhesPage - Erro:', error)
    return (
      <div className="min-h-screen">
        <Header />
        <main className="pt-8">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-800 mb-4">Erro ao carregar pedido</h1>
              <p className="text-gray-600 mb-6">Ocorreu um erro ao carregar os detalhes do pedido.</p>
              <Button 
                onClick={() => router.push('/meus-pedidos')}
                style={{ backgroundColor: '#811B2D' }}
                className="hover:bg-pink-700"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar aos Meus Pedidos
              </Button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!orderData) {
    console.log('PedidoDetalhesPage - orderData é null/undefined')
    return (
      <div className="min-h-screen">
        <Header />
        <main className="pt-8">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-800 mb-4">Pedido não encontrado</h1>
              <p className="text-gray-600 mb-6">O pedido que você está procurando não existe ou não foi encontrado.</p>
              <Button 
                onClick={() => router.push('/meus-pedidos')}
                style={{ backgroundColor: '#811B2D' }}
                className="hover:bg-pink-700"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar aos Meus Pedidos
              </Button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // A API pode retornar o pedido diretamente ou dentro de um objeto
  const order = orderData?.order || orderData
  
  console.log('PedidoDetalhesPage - order:', order)
  console.log('PedidoDetalhesPage - order.orderItems:', order?.orderItems)
  console.log('PedidoDetalhesPage - order.items:', order?.items)
  
  // Verificar se o pedido existe
  if (!order) {
    console.log('PedidoDetalhesPage - order é null/undefined')
    return (
      <div className="min-h-screen">
        <Header />
        <main className="pt-8">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-800 mb-4">Pedido não encontrado</h1>
              <p className="text-gray-600 mb-6">O pedido que você está procurando não existe ou não foi encontrado.</p>
              <Button 
                onClick={() => router.push('/meus-pedidos')}
                style={{ backgroundColor: '#811B2D' }}
                className="hover:bg-pink-700"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar aos Meus Pedidos
              </Button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-8">
        <div className="container mx-auto px-4 py-8">
          {/* Botão Voltar */}
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => router.push('/meus-pedidos')}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar aos Meus Pedidos
            </Button>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Informações do Pedido */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl">
                        Pedido #{order.orderNumber || order.id?.slice(-8) || 'N/A'}
                      </CardTitle>
                      <CardDescription className="flex items-center space-x-4 mt-2">
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString('pt-BR') : 'Data não disponível'}
                        </span>
                        <span className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1" />
                          {formatCurrency(order.total || 0)}
                        </span>
                      </CardDescription>
                    </div>
                    <Badge className={`${getStatusColor(order.status || 'pending')} text-lg px-4 py-2`}>
                      <span className="mr-2">{getStatusIcon(order.status || 'pending')}</span>
                      {translateStatus(order.status || 'pending')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Produtos do Pedido</h3>
                    {(order.orderItems || order.items || []).length > 0 ? (
                      (order.orderItems || order.items || []).map((item: any) => (
                        <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                          <img
                            src={getImageUrl(item.product?.imageUrl || '/placeholder.svg')}
                            alt={item.product?.name || 'Produto'}
                            className="w-20 h-20 object-cover rounded-md"
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder.svg'
                            }}
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800">
                              {item.product?.name || 'Produto não encontrado'}
                            </h4>
                            <p className="text-sm text-gray-600">
                              Quantidade: {item.quantity}
                            </p>
                            <p className="text-sm text-gray-600">
                              Preço unitário: {formatCurrency(item.price)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-800">
                              {formatCurrency(item.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-600">Nenhum produto encontrado neste pedido.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar com informações adicionais */}
            <div className="space-y-6">
              {/* Resumo do Pedido */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Resumo do Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-semibold">{formatCurrency(order.total || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Frete:</span>
                    <span className="font-semibold">R$ 15,00</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold">Total:</span>
                      <span className="text-lg font-bold text-pink-600">
                        {formatCurrency(order.total + 15)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Informações de Entrega */}
              {order.address && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <MapPin className="h-5 w-5 mr-2" />
                      Endereço de Entrega
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <p className="font-semibold">{order.address.street}, {order.address.number}</p>
                      {order.address.complement && (
                        <p className="text-gray-600">{order.address.complement}</p>
                      )}
                      <p className="text-gray-600">{order.address.neighborhood}</p>
                      <p className="text-gray-600">
                        {order.address.city} - {order.address.state}
                      </p>
                      <p className="text-gray-600">CEP: {order.address.zipCode}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Informações do Cliente */}
              {order.user && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Package className="h-5 w-5 mr-2" />
                      Informações do Cliente
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <p className="font-semibold">{order.user.name}</p>
                      <p className="text-gray-600 flex items-center">
                        <Mail className="h-4 w-4 mr-1" />
                        {order.user.email}
                      </p>
                      {order.user.phone && (
                        <p className="text-gray-600 flex items-center">
                          <Phone className="h-4 w-4 mr-1" />
                          {order.user.phone}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Status do Pedido */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Truck className="h-5 w-5 mr-2" />
                    Status do Pedido
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(order.status).replace('bg-', 'bg-').replace('text-', '')}`}></div>
                      <span className="font-semibold">{translateStatus(order.status)}</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Última atualização: {new Date(order.updatedAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 