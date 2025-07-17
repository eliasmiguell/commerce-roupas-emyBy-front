"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Package } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import api from "@/axios"

const statusOptions = [
  { value: "PENDING", label: "Pendente" },
  { value: "PROCESSING", label: "Processando" },
  { value: "SHIPPED", label: "Enviado" },
  { value: "DELIVERED", label: "Entregue" },
  { value: "CANCELLED", label: "Cancelado" },
]

export default function EditarPedidoPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [pedido, setPedido] = useState<any>(null)
  const [status, setStatus] = useState("")

  const orderId = params.id as string

  useEffect(() => {
    const fetchPedido = async () => {
      try {
        const response = await api.get(`/orders/admin/${orderId}`)
        const order = response.data.order || response.data
        setPedido(order)
        setStatus(order.status || "PENDING")
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")

    try {
      await api.put(`/orders/admin/${orderId}`, { status })
      toast({
        title: "Pedido atualizado",
        description: "Status do pedido atualizado com sucesso!",
      })
      setTimeout(() => {
        router.push(`/admin/pedidos/${orderId}`)
      }, 1500)
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao atualizar pedido")
      toast({
        title: "Erro",
        description: err.response?.data?.error || "Erro ao atualizar pedido",
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href={`/admin/pedidos/${orderId}`} className="inline-flex items-center text-pink-600 hover:text-pink-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Pedido
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">Editar Pedido</h1>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-800">Status do Pedido</CardTitle>
            <CardDescription>Altere o status do pedido</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Status *</label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="border-gray-300 focus:border-pink-500 focus:ring-pink-500">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {error && (
                <div className="text-red-600 text-sm font-semibold text-center bg-red-50 p-3 rounded-lg">
                  {error}
                </div>
              )}

              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-pink-600 hover:bg-pink-700 text-white font-semibold"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Salvar Alterações
                    </>
                  )}
                </Button>
                <Link href={`/admin/pedidos/${orderId}`}>
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