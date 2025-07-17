"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, User, Mail, Phone, MapPin } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import api from "@/axios"

export default function EditarUsuarioPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [usuario, setUsuario] = useState<any>(null)

  const userId = params.id as string

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "user",
    address: {
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
      zipCode: "",
    }
  })

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const response = await api.get(`/users/${userId}`)
        const userData = response.data.user || response.data
        setUsuario(userData)
        setFormData({
          name: userData.name || "",
          email: userData.email || "",
          phone: userData.phone || "",
          role: userData.role === 'ADMIN' ? 'admin' : 'user',
          address: {
            street: userData.addresses?.[0]?.street || "",
            number: userData.addresses?.[0]?.number || "",
            complement: userData.addresses?.[0]?.complement || "",
            neighborhood: userData.addresses?.[0]?.neighborhood || "",
            city: userData.addresses?.[0]?.city || "",
            state: userData.addresses?.[0]?.state || "",
            zipCode: userData.addresses?.[0]?.zipCode || "",
          }
        })
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")

    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        address: formData.address
      }

      await api.put(`/users/${userId}`, updateData)

      toast({
        title: "Usuário atualizado",
        description: "Usuário foi atualizado com sucesso!",
      })

      setTimeout(() => {
        router.push(`/admin/usuarios/${userId}`)
      }, 1500)
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao atualizar usuário")
      toast({
        title: "Erro",
        description: err.response?.data?.error || "Erro ao atualizar usuário",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name.startsWith('address.')) {
      const field = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
    if (error) setError("")
  }

  const handleAddressChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value
      }
    }))
    if (error) setError("")
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href={`/admin/usuarios/${userId}`} className="inline-flex items-center text-pink-600 hover:text-pink-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Usuário
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">Editar Usuário</h1>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-800">Informações do Usuário</CardTitle>
            <CardDescription>Atualize os dados do usuário</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Informações básicas */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Informações Básicas
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
                      Nome *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Nome completo"
                      className="border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                      Email *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="email@exemplo.com"
                      className="border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">
                      Telefone
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="(11) 99999-9999"
                      className="border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-sm font-semibold text-gray-700">
                      Função *
                    </Label>
                    <Select value={formData.role} onValueChange={(value) => setFormData({...formData, role: value})}>
                      <SelectTrigger className="border-gray-300 focus:border-pink-500 focus:ring-pink-500">
                        <SelectValue placeholder="Selecione a função" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">Cliente</SelectItem>
                        <SelectItem value="admin">Administrador</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Endereço */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Endereço
                </h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="street" className="text-sm font-semibold text-gray-700">
                      Rua
                    </Label>
                    <Input
                      id="street"
                      name="address.street"
                      value={formData.address.street}
                      onChange={handleChange}
                      placeholder="Nome da rua"
                      className="border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="number" className="text-sm font-semibold text-gray-700">
                        Número
                      </Label>
                      <Input
                        id="number"
                        name="address.number"
                        value={formData.address.number}
                        onChange={handleChange}
                        placeholder="123"
                        className="border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="complement" className="text-sm font-semibold text-gray-700">
                        Complemento
                      </Label>
                      <Input
                        id="complement"
                        name="address.complement"
                        value={formData.address.complement}
                        onChange={handleChange}
                        placeholder="Apto 101"
                        className="border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="neighborhood" className="text-sm font-semibold text-gray-700">
                      Bairro
                    </Label>
                    <Input
                      id="neighborhood"
                      name="address.neighborhood"
                      value={formData.address.neighborhood}
                      onChange={handleChange}
                      placeholder="Nome do bairro"
                      className="border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-sm font-semibold text-gray-700">
                        Cidade
                      </Label>
                      <Input
                        id="city"
                        name="address.city"
                        value={formData.address.city}
                        onChange={handleChange}
                        placeholder="Nome da cidade"
                        className="border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="state" className="text-sm font-semibold text-gray-700">
                        Estado
                      </Label>
                      <Input
                        id="state"
                        name="address.state"
                        value={formData.address.state}
                        onChange={handleChange}
                        placeholder="SP"
                        className="border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="zipCode" className="text-sm font-semibold text-gray-700">
                        CEP
                      </Label>
                      <Input
                        id="zipCode"
                        name="address.zipCode"
                        value={formData.address.zipCode}
                        onChange={handleChange}
                        placeholder="01234-567"
                        className="border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                      />
                    </div>
                  </div>
                </div>
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
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Salvar Alterações
                    </>
                  )}
                </Button>
                <Link href={`/admin/usuarios/${userId}`}>
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