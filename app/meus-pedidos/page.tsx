"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import { useAuth } from "@/hooks/use-auth"
import { useUserOrders } from "@/lib/orderService"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Package, Calendar, DollarSign, Eye, ShoppingBag } from "lucide-react"
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

export default function MeusPedidosPage() {
  console.log('=== MeusPedidosPage - Componente renderizado ===')
  
  const router = useRouter()
  const { isAuthenticated, user, loading } = useAuth()
  const { data: ordersData, isLoading, error } = useUserOrders()
  const [filteredOrders, setFilteredOrders] = useState<any[]>([])

  console.log('MeusPedidosPage - isAuthenticated:', isAuthenticated)
  console.log('MeusPedidosPage - user:', user)
  console.log('MeusPedidosPage - loading:', loading)

  useEffect(() => {
    console.log('MeusPedidosPage useEffect - isAuthenticated:', isAuthenticated)
    
    if (!loading && !isAuthenticated) {
      console.log('MeusPedidosPage - Redirecionando para login')
      router.push('/login')
      return
    }

    if (ordersData) {
      console.log('MeusPedidosPage - ordersData:', ordersData)
      // O backend já retorna apenas os pedidos do usuário logado
      const userOrders = ordersData.orders || ordersData || []
      setFilteredOrders(userOrders)
    }
  }, [isAuthenticated, ordersData, router, loading])

  if (!isAuthenticated && !loading) {
    console.log('MeusPedidosPage - Usuário não autenticado, retornando null')
    return null
  }

  if (loading) {
    console.log('MeusPedidosPage - Carregando autenticação...')
    return (
      <div className="min-h-screen">
        <Header />
        <main className="pt-8">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-800 mb-4">Carregando...</h1>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="pt-8">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-8">
              <Skeleton className="h-8 w-64 mx-auto mb-4" />
              <Skeleton className="h-4 w-96 mx-auto" />
            </div>
            <div className="grid gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-48 mb-2" />
                    <Skeleton className="h-4 w-32" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-20 w-full mb-4" />
                    <Skeleton className="h-8 w-24" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="pt-8">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-800 mb-4">Erro ao carregar pedidos</h1>
              <p className="text-gray-600">Tente novamente mais tarde.</p>
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
          <div className="text-center mb-8">
            <h1 
              className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Meus <span className="text-pink-600">Pedidos</span>
            </h1>
            <p className="text-lg text-gray-600">
              Acompanhe o status de suas compras
            </p>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Nenhum pedido encontrado</h2>
              <p className="text-gray-600 mb-6">
                Você ainda não fez nenhuma compra. Que tal começar a explorar nossos produtos?
              </p>
              <Button 
                onClick={() => router.push('/')}
                style={{ backgroundColor: '#811B2D' }}
                className="hover:bg-pink-700"
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                Ir às Compras
              </Button>
            </div>
          ) : (
            <div className="grid gap-6">
              {filteredOrders.map((order) => (
                <Card key={order.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          Pedido #{order.orderNumber || order.id.slice(-8)}
                        </CardTitle>
                        <CardDescription className="flex items-center space-x-4 mt-2">
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                          </span>
                          <span className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-1" />
                            {formatCurrency(order.total)}
                          </span>
                        </CardDescription>
                      </div>
                      <Badge className={getStatusColor(order.status)}>
                        {translateStatus(order.status)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {order.items?.map((item: any) => (
                        <div key={item.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                          <img
                            src={getImageUrl(item.product?.imageUrl || '/placeholder.svg')}
                            alt={item.product?.name || 'Produto'}
                            className="w-16 h-16 object-cover rounded-md"
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder.svg'
                            }}
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800">
                              {item.product?.name || 'Produto não encontrado'}
                            </h4>
                            <p className="text-sm text-gray-600">
                              Quantidade: {item.quantity} | Preço: {formatCurrency(item.price)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Total do Pedido</p>
                          <p className="text-xl font-bold text-gray-800">
                            {formatCurrency(order.total)}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => router.push(`/pedido/${order.id}`)}
                          className="border-pink-300 text-pink-600 hover:bg-pink-50"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Detalhes
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
} 