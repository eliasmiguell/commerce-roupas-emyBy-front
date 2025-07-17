"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save, Plus, X, Package, User, ShoppingCart } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import api from "@/axios"

interface User {
  id: string
  name: string
  email: string
}

interface Product {
  id: string
  name: string
  price: number
  variants: any[]
}

interface OrderItem {
  productId: string
  variantId?: string
  quantity: number
  price: number
  product?: Product
  variant?: any
}

export default function NovoPedidoPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  
  const [users, setUsers] = useState<User[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [selectedUserId, setSelectedUserId] = useState("")
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [status, setStatus] = useState("PENDING")

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [usersRes, productsRes] = await Promise.all([
          api.get('/users'),
          api.get('/products')
        ])
        setUsers(usersRes.data.users || [])
        setProducts(productsRes.data.products || productsRes.data || [])
      } catch (err) {
        setError("Erro ao carregar dados")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const addItem = () => {
    setOrderItems(prev => [...prev, {
      productId: "",
      variantId: "none",
      quantity: 1,
      price: 0
    }])
  }

  const removeItem = (index: number) => {
    setOrderItems(prev => prev.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, field: keyof OrderItem, value: any) => {
    setOrderItems(prev => prev.map((item, i) => {
      if (i === index) {
        const updatedItem = { ...item, [field]: value }
        
        // Se mudou o produto, recalcular preço
        if (field === 'productId') {
          const product = products.find(p => p.id === value)
          if (product) {
            updatedItem.price = product.price
            updatedItem.product = product
          }
        }
        
        return updatedItem
      }
      return item
    }))
  }

  const calculateTotal = () => {
    return orderItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedUserId) {
      toast({
        title: "Erro",
        description: "Selecione um usuário",
        variant: "destructive",
      })
      return
    }

    if (orderItems.length === 0) {
      toast({
        title: "Erro",
        description: "Adicione pelo menos um item ao pedido",
        variant: "destructive",
      })
      return
    }

    setSaving(true)
    setError("")

    try {
      const orderData = {
        userId: selectedUserId,
        status,
        items: orderItems.map(item => ({
          productId: item.productId,
          variantId: item.variantId || null,
          quantity: item.quantity,
          price: item.price
        }))
      }

      const response = await api.post('/orders/admin', orderData)
      
      toast({
        title: "Pedido criado",
        description: "Pedido foi criado com sucesso!",
      })

      setTimeout(() => {
        router.push("/admin/pedidos")
      }, 1500)
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao criar pedido")
      toast({
        title: "Erro",
        description: err.response?.data?.error || "Erro ao criar pedido",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 animate-spin text-pink-600" />
          <span className="ml-2">Carregando dados...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href="/admin/pedidos" className="inline-flex items-center text-pink-600 hover:text-pink-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar aos Pedidos
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">Novo Pedido</h1>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-800">Informações do Pedido</CardTitle>
            <CardDescription>Crie um novo pedido manualmente</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Seleção de usuário */}
              <div className="space-y-2">
                <Label htmlFor="userId" className="text-sm font-semibold text-gray-700">
                  Usuário *
                </Label>
                <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                  <SelectTrigger className="border-gray-300 focus:border-pink-500 focus:ring-pink-500">
                    <SelectValue placeholder="Selecione um usuário" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status inicial */}
              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-semibold text-gray-700">
                  Status Inicial
                </Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="border-gray-300 focus:border-pink-500 focus:ring-pink-500">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pendente</SelectItem>
                    <SelectItem value="PROCESSING">Processando</SelectItem>
                    <SelectItem value="SHIPPED">Enviado</SelectItem>
                    <SelectItem value="DELIVERED">Entregue</SelectItem>
                    <SelectItem value="CANCELLED">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Itens do pedido */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold text-gray-700">
                    Itens do Pedido
                  </Label>
                  <Button
                    type="button"
                    onClick={addItem}
                    variant="outline"
                    size="sm"
                    className="border-pink-300 text-pink-700 hover:bg-pink-50"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Adicionar Item
                  </Button>
                </div>

                {orderItems.map((item, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-4 p-4 border border-pink-200 rounded-lg">
                    <div>
                      <Label className="text-xs text-gray-600">Produto</Label>
                      <Select 
                        value={item.productId} 
                        onValueChange={(value) => updateItem(index, 'productId', value)}
                      >
                        <SelectTrigger className="border-gray-300 focus:border-pink-500 focus:ring-pink-500">
                          <SelectValue placeholder="Selecione produto" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((product) => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.name} - R$ {Number(product.price).toFixed(2).replace('.', ',')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label className="text-xs text-gray-600">Variante</Label>
                      <Select 
                        value={item.variantId || "none"} 
                        onValueChange={(value) => updateItem(index, 'variantId', value === "none" ? null : value)}
                      >
                        <SelectTrigger className="border-gray-300 focus:border-pink-500 focus:ring-pink-500">
                          <SelectValue placeholder="Selecione variante" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Sem variante</SelectItem>
                          {item.product?.variants?.map((variant: any) => (
                            <SelectItem key={variant.id} value={variant.id}>
                              {variant.size} {variant.color ? `- ${variant.color}` : ''}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label className="text-xs text-gray-600">Quantidade</Label>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                        className="border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                      />
                    </div>
                    
                    <div className="flex items-end gap-2">
                      <div className="flex-1">
                        <Label className="text-xs text-gray-600">Preço</Label>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={item.price}
                          onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value) || 0)}
                          className="border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                        />
                      </div>
                      <Button
                        type="button"
                        onClick={() => removeItem(index)}
                        variant="outline"
                        size="sm"
                        className="border-red-300 text-red-700 hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                {orderItems.length > 0 && (
                  <div className="text-right">
                    <p className="text-lg font-semibold text-pink-600">
                      Total: R$ {calculateTotal().toFixed(2).replace('.', ',')}
                    </p>
                  </div>
                )}
              </div>

              {/* Mensagens de erro */}
              {error && (
                <div className="text-red-600 text-sm font-semibold text-center bg-red-50 p-3 rounded-lg">
                  {error}
                </div>
              )}

              {/* Botões */}
              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-pink-600 hover:bg-pink-700 text-white font-semibold"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Criando...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Criar Pedido
                    </>
                  )}
                </Button>
                <Link href="/admin/pedidos">
                  <Button type="button" variant="outline" className="border-gray-300">
                    Cancelar
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 