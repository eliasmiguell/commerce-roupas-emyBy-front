"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, User, Mail, Calendar, Phone, MapPin, ShoppingBag, Package } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import api from "@/axios"

export default function VisualizarUsuarioPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [usuario, setUsuario] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const userId = params.id as string

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const response = await api.get(`/users/${userId}`)
        setUsuario(response.data.user || response.data)
      } catch (err) {
        setError("Erro ao carregar usuário")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchUsuario()
    }
  }, [userId])

  const handleEdit = () => {
    router.push(`/admin/usuarios/editar/${userId}`)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-pink-600" />
          <span className="ml-2">Carregando usuário...</span>
        </div>
      </div>
    )
  }

  if (error || !usuario) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-bold text-red-600 mb-2">Usuário não encontrado</h2>
            <p className="text-gray-600 mb-4">{error || "O usuário solicitado não existe."}</p>
            <Link href="/admin/usuarios">
              <Button>Voltar aos Usuários</Button>
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
        <Link href="/admin/usuarios" className="inline-flex items-center text-pink-600 hover:text-pink-700 mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar aos Usuários
        </Link>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{usuario.name || 'Nome não informado'}</h1>
            <p className="text-gray-600">Detalhes do usuário</p>
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
        {/* Informações do usuário */}
        <div className="space-y-6">
          {/* Informações básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Informações Básicas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Nome</label>
                <p className="text-lg font-semibold">{usuario.name || 'Não informado'}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <p className="text-gray-700 flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  {usuario.email}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Telefone</label>
                <p className="text-gray-700 flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  {usuario.phone || 'Não informado'}
                </p>
              </div>

                                <div>
                    <label className="text-sm font-medium text-gray-600">Função</label>
                    <div className="mt-1">
                      <Badge variant={usuario.role === 'ADMIN' ? 'default' : 'secondary'}>
                        {usuario.role === 'ADMIN' ? 'Administrador' : 'Cliente'}
                      </Badge>
                    </div>
                  </div>
            </CardContent>
          </Card>

          {/* Endereço */}
          {usuario.addresses && usuario.addresses.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Endereço
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                                  {usuario.addresses.map((address: any, index: number) => (
                    <div key={address.id} className="space-y-2">
                      {index > 0 && <hr className="my-4" />}
                      <div>
                        <label className="text-sm font-medium text-gray-600">Rua</label>
                        <p className="text-gray-700">{address.street || 'Não informado'}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-600">Número</label>
                          <p className="text-gray-700">{address.number || 'Não informado'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Complemento</label>
                          <p className="text-gray-700">{address.complement || 'Não informado'}</p>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Bairro</label>
                        <p className="text-gray-700">{address.neighborhood || 'Não informado'}</p>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-600">Cidade</label>
                          <p className="text-gray-700">{address.city || 'Não informado'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Estado</label>
                          <p className="text-gray-700">{address.state || 'Não informado'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">CEP</label>
                          <p className="text-gray-700">{address.zipCode || 'Não informado'}</p>
                        </div>
                      </div>
                    </div>
                  ))}
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
                <label className="text-sm font-medium text-gray-600">Cadastrado em</label>
                <p className="text-gray-700">
                  {usuario.createdAt ? new Date(usuario.createdAt).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  }) : 'Não informado'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Última atualização</label>
                <p className="text-gray-700">
                  {usuario.updatedAt ? new Date(usuario.updatedAt).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  }) : 'Não informado'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Histórico de pedidos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ShoppingBag className="h-5 w-5 mr-2" />
              Histórico de Pedidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {usuario.orders && usuario.orders.length > 0 ? (
              <div className="space-y-3">
                {usuario.orders.map((order: any) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">Pedido #{order.id.slice(-8)}</p>
                      <p className="text-sm text-gray-600">
                        R$ {Number(order.total).toFixed(2).replace('.', ',')}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <Badge variant={
                      order.status === 'completed' ? 'default' : 
                      order.status === 'pending' ? 'secondary' : 
                      'destructive'
                    }>
                      {order.status === 'completed' ? 'Concluído' : 
                       order.status === 'pending' ? 'Pendente' : 
                       order.status === 'cancelled' ? 'Cancelado' : order.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Nenhum pedido encontrado</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 