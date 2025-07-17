"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ShoppingBag, CreditCard, Truck, Loader2 } from "lucide-react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { useCartItems } from "@/lib/cartService"
import { formatCurrency, getImageUrl } from "@/lib/utils"
import api from "@/axios"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, XCircle } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

export default function CompraForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { data: cartData, isLoading: cartLoading } = useCartItems()
  
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    endereco: "",
    cidade: "",
    cep: "",
    numeroCartao: "",
    validade: "",
    cvv: "",
    senha: "",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("CREDIT_CARD")
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null)
  const [paymentMessage, setPaymentMessage] = useState<string>("")
  const [wantsToRegister, setWantsToRegister] = useState(false)
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)

  // Dados do carrinho
  const cartItems = cartData?.items || []
  const subtotal = cartData?.total || 0
  const shippingCost = 15.0 // Frete fixo
  const total = subtotal + shippingCost

  // Dados do produto vindos da URL (para compras diretas)
  const productData = {
    title: searchParams.get("title") || "Produto",
    price: searchParams.get("price") || "R$ 0,00",
    image: searchParams.get("image") || "/placeholder.svg",
    description: searchParams.get("description") || "",
    size: searchParams.get("size") || "",
  }

  // Verificar se veio do carrinho ou compra direta
  const isFromCart = cartItems.length > 0

  // Verificar se usuário está logado
  useEffect(() => {
    const checkUserLogin = async () => {
      const token = localStorage.getItem("token")
      console.log("Token encontrado no localStorage:", token ? "Sim" : "Não")
      
      if (token) {
        try {
          console.log("Fazendo requisição para /auth/me...")
          const userResponse = await api.get("/auth/me")
          console.log("Resposta da API:", userResponse.data)
          
          // Verificar se a resposta tem dados válidos
          if (userResponse.data) {
            const user = userResponse.data
            setCurrentUser(user)
            setIsUserLoggedIn(true)
            // Preencher dados do usuário logado
            setFormData(prev => ({
              ...prev,
              nome: user.name || "",
              email: user.email || "",
            }))
            console.log("Usuário logado com sucesso:", user.name)
          } else {
            console.log("Resposta da API não contém dados do usuário")
            localStorage.removeItem("token")
            setIsUserLoggedIn(false)
            setCurrentUser(null)
          }
        } catch (error: any) {
          console.log("Erro na verificação do token:", error.response?.data || error.message)
          localStorage.removeItem("token")
          setIsUserLoggedIn(false)
          setCurrentUser(null)
        }
      }
    }
    
    checkUserLogin()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    if (error) setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")
    setPaymentStatus(null)
    setPaymentMessage("")
    
    try {
      if (isFromCart && cartItems.length === 0) {
        setError("Seu carrinho está vazio!")
        setLoading(false)
        return
      }

      let userId = ""
      let userToken = localStorage.getItem("token") || ""

      // Se usuário está logado, usar dados existentes
      if (isUserLoggedIn && currentUser) {
        userId = currentUser.id
      } else if (wantsToRegister) {
        // Criar novo usuário se escolheu se registrar
        if (!formData.senha) {
          setError("Por favor, digite uma senha para se registrar")
          setLoading(false)
          return
        }

        const userData = {
          name: formData.nome,
          email: formData.email,
          password: formData.senha,
          role: "USER"
        }

        const userResponse = await api.post("/auth/register", userData)
        
        // Verificar se o registro foi bem-sucedido
        if (userResponse.data && userResponse.data.user) {
          userId = userResponse.data.user.id
          
          // Fazer login automático
          const loginResponse = await api.post("/auth/login", {
            email: formData.email,
            password: formData.senha
          })
          
          userToken = loginResponse.data.token || ""
          localStorage.setItem("token", userToken)
          setIsUserLoggedIn(true)
          setCurrentUser(userResponse.data.user)
        } else {
          throw new Error("Erro ao criar usuário: dados inválidos")
        }
      } else {
        // Compra sem registro - criar usuário temporário ou usar dados sem login
        // Para simplificar, vamos criar um pedido sem usuário específico
        userId = "guest"
      }

      // Criar endereço apenas se tiver token (usuário logado ou registrado)
      let addressId = null
      if (userToken) {
        const addressData = {
          street: formData.endereco,
          city: formData.cidade,
          state: "SP", // Estado padrão
          zipCode: formData.cep,
          phone: formData.telefone,
          isDefault: true
        }

        const addressResponse = await api.post("/addresses", addressData, {
          headers: { Authorization: `Bearer ${userToken}` }
        })
        addressId = addressResponse.data.address.id
      }

      // Preparar itens do pedido
      let orderItems = []
      
      if (isFromCart) {
        // Usar itens do carrinho
        orderItems = cartItems.map((item: any) => ({
          productId: item.product.id,
          variantId: item.variant?.id || null,
          quantity: item.quantity,
          price: item.product.price
        }))
      } else {
        // Criar item fictício para compra direta
        const price = parseFloat(productData.price.replace("R$ ", "").replace(",", "."))
        orderItems = [{
          productId: "produto-ficticio",
          variantId: null,
          quantity: 1,
          price: price
        }]
      }

      // Criar pedido
      const orderData = {
        userId: userId === "guest" ? null : userId,
        status: "PENDING",
        items: orderItems,
        customerInfo: userId === "guest" ? {
          name: formData.nome,
          email: formData.email,
          phone: formData.telefone,
          address: formData.endereco,
          city: formData.cidade,
          zipCode: formData.cep
        } : null
      }

      const headers = userToken ? { Authorization: `Bearer ${userToken}` } : {}
      const orderResponse = await api.post("/orders/admin", orderData, { headers })
      const orderId = orderResponse.data.order?.id || orderResponse.data.id

      // Criar pagamento
      const paymentRes = await api.post(`/orders/admin/${orderId}/payment`, {
        orderId,
        method: paymentMethod,
        amount: total
      }, { headers })
      const paymentId = paymentRes.data.payment.id

      // Processar pagamento (simulação)
      const processRes = await api.post(`/orders/admin/payment/${paymentId}/process`, {}, { headers })
      setPaymentStatus(processRes.data.payment.status)
      setPaymentMessage(processRes.data.message)
      setSuccess("Compra realizada com sucesso! Pedido criado.")
      
      // Limpar carrinho se veio do carrinho
      if (isFromCart && userToken) {
        try {
          await api.delete("/cart", {
            headers: { Authorization: `Bearer ${userToken}` }
          })
        } catch (error) {
          console.log("Erro ao limpar carrinho:", error)
        }
      }

      // Redirecionar após 2 segundos
      setTimeout(() => {
        router.push("/")
      }, 2000)

    } catch (error: any) {
      console.error("Erro na compra:", error)
      setError(error.response?.data?.error || "Erro ao processar a compra")
    } finally {
      setLoading(false)
    }
  }

  if (cartLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-pink-600" />
          <p className="text-gray-600">Carregando dados do carrinho...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Formulário de Compra */}
          <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center space-y-4">
              <Button
                onClick={() => router.push(isFromCart ? "/carrinho" : "/")}
                className="flex items-center space-x-2 text-white transition-colors bg-pink-600 backdrop-blur-sm rounded-lg px-3 py-2  mb-4"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {isFromCart ? "Voltar ao carrinho" : "Voltar à loja"}
                </span>
              </Button>
              <div className="flex items-center justify-center space-x-3 mb-4">
              <img src="imagens/logo-loja.png" alt="logo-loja" className="w-[80px] h-[60px] rounded-md"/>
              </div>
              <CardTitle className="text-2xl font-bold text-gray-800" style={{ fontFamily: "Playfair Display, serif" }}>
                Finalizar Compra
              </CardTitle>
              <CardDescription className="text-gray-600">
                {isUserLoggedIn 
                  ? "Complete seus dados para finalizar a compra" 
                  : "Complete seus dados para finalizar a compra"
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Status do usuário */}
                {isUserLoggedIn && currentUser && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-green-800 text-sm font-medium">
                      ✅ Você está logado como: {currentUser.name || "Usuário"}
                    </p>
                  </div>
                )}

                {/* Opção de registro (apenas se não estiver logado) */}
                {!isUserLoggedIn && (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="register"
                        checked={wantsToRegister}
                        onCheckedChange={(checked) => setWantsToRegister(checked as boolean)}
                      />
                      <Label htmlFor="register" className="text-sm font-medium text-gray-700">
                        Quero criar uma conta para acompanhar meus pedidos
                      </Label>
                    </div>
                    {wantsToRegister && (
                      <div className="space-y-2">
                        <Label htmlFor="senha" className="text-sm font-semibold text-gray-700">
                          Senha
                        </Label>
                        <Input
                          id="senha"
                          name="senha"
                          type="password"
                          placeholder="Digite sua senha"
                          value={formData.senha}
                          onChange={handleChange}
                          required={wantsToRegister}
                          className="border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Dados Pessoais */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Dados Pessoais</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nome" className="text-sm font-semibold text-gray-700">
                        Nome completo
                      </Label>
                      <Input
                        id="nome"
                        name="nome"
                        type="text"
                        placeholder="Digite seu nome completo"
                        value={formData.nome}
                        onChange={handleChange}
                        required
                        className="border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                        E-mail
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Digite seu e-mail"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telefone" className="text-sm font-semibold text-gray-700">
                      Telefone
                    </Label>
                    <Input
                      id="telefone"
                      name="telefone"
                      type="tel"
                      placeholder="Digite seu telefone"
                      value={formData.telefone}
                      onChange={handleChange}
                      required
                      className="border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                    />
                  </div>
                </div>

                {/* Endereço */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Endereço de Entrega</h3>
                  <div className="space-y-2">
                    <Label htmlFor="endereco" className="text-sm font-semibold text-gray-700">
                      Endereço completo
                    </Label>
                    <Input
                      id="endereco"
                      name="endereco"
                      type="text"
                      placeholder="Rua, número, bairro"
                      value={formData.endereco}
                      onChange={handleChange}
                      required
                      className="border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cidade" className="text-sm font-semibold text-gray-700">
                        Cidade
                      </Label>
                      <Input
                        id="cidade"
                        name="cidade"
                        type="text"
                        placeholder="Digite sua cidade"
                        value={formData.cidade}
                        onChange={handleChange}
                        required
                        className="border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cep" className="text-sm font-semibold text-gray-700">
                        CEP
                      </Label>
                      <Input
                        id="cep"
                        name="cep"
                        type="text"
                        placeholder="00000-000"
                        value={formData.cep}
                        onChange={handleChange}
                        required
                        className="border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Dados do Cartão */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Dados do Cartão
                  </h3>
                  <div className="space-y-2">
                    <Label htmlFor="numeroCartao" className="text-sm font-semibold text-gray-700">
                      Número do cartão
                    </Label>
                    <Input
                      id="numeroCartao"
                      name="numeroCartao"
                      type="text"
                      placeholder="0000 0000 0000 0000"
                      value={formData.numeroCartao}
                      onChange={handleChange}
                      required
                      className="border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="validade" className="text-sm font-semibold text-gray-700">
                        Validade
                      </Label>
                      <Input
                        id="validade"
                        name="validade"
                        type="text"
                        placeholder="MM/AA"
                        value={formData.validade}
                        onChange={handleChange}
                        required
                        className="border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv" className="text-sm font-semibold text-gray-700">
                        CVV
                      </Label>
                      <Input
                        id="cvv"
                        name="cvv"
                        type="text"
                        placeholder="123"
                        value={formData.cvv}
                        onChange={handleChange}
                        required
                        className="border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Seleção de método de pagamento */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Método de Pagamento
                  </h3>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger className="border-gray-300 focus:border-pink-500 focus:ring-pink-500">
                      <SelectValue placeholder="Selecione o método de pagamento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CREDIT_CARD">Cartão de Crédito</SelectItem>
                      <SelectItem value="DEBIT_CARD">Cartão de Débito</SelectItem>
                      <SelectItem value="PIX">Pix</SelectItem>
                      <SelectItem value="BANK_TRANSFER">Transferência Bancária</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Mensagens de erro/sucesso */}
                {error && (
                  <div className="text-red-600 text-sm font-semibold text-center bg-red-50 p-3 rounded-lg">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="text-green-600 text-sm font-semibold text-center bg-green-50 p-3 rounded-lg">
                    {success}
                  </div>
                )}

                {/* Mensagens de status do pagamento */}
                {paymentStatus && (
                  <div className={`text-center p-3 rounded-lg font-semibold ${paymentStatus === "APPROVED" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
                    {paymentStatus === "APPROVED" ? (
                      <span className="flex items-center justify-center gap-2"><CheckCircle className="h-5 w-5" /> {paymentMessage}</span>
                    ) : (
                      <span className="flex items-center justify-center gap-2"><XCircle className="h-5 w-5" /> {paymentMessage}</span>
                    )}
                  </div>
                )}

                <Button
                  type="submit"
                  style={{ backgroundColor: '#811B2D' }}
                  className="w-full hover:bg-pink-700 text-white font-semibold py-3"
                  disabled={(isFromCart && cartItems.length === 0) || loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    isFromCart && cartItems.length === 0 ? "Carrinho vazio" : "Finalizar Compra"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Resumo da Compra */}
          <div className="space-y-6">
            <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Resumo da Compra
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isFromCart ? (
                  // Resumo do carrinho
                  <>
                    {/* Itens do carrinho */}
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {cartItems.map((item: any) => (
                        <div key={item.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                          <img
                            src={getImageUrl(item.product.imageUrl)}
                            alt={item.product.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800 text-sm">{item.product.name}</h4>
                            {item.variant && (
                              <p className="text-xs text-gray-600">Tamanho: {item.variant.size}</p>
                            )}
                            <p className="text-xs text-gray-600">Qtd: {item.quantity}</p>
                            <p className="font-bold text-pink-600 text-sm">
                              {formatCurrency(item.product.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Custos */}
                    <div className="space-y-2 border-t pt-4">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal:</span>
                        <span>{formatCurrency(subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Frete:</span>
                        <span>{formatCurrency(shippingCost)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg border-t pt-2">
                        <span>Total:</span>
                        <span className="text-pink-600">{formatCurrency(total)}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  // Resumo de compra direta
                  <>
                    {/* Produto */}
                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <img
                        src={productData.image}
                        alt={productData.title}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{productData.title}</h4>
                        <p className="text-sm text-gray-600">{productData.description}</p>
                        {productData.size && (
                          <p className="text-sm text-gray-600">Tamanho: {productData.size}</p>
                        )}
                        <p className="font-bold text-pink-600 text-lg">{productData.price}</p>
                      </div>
                    </div>

                    {/* Custos */}
                    <div className="space-y-2 border-t pt-4">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal:</span>
                        <span>{productData.price}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Frete:</span>
                        <span>R$ 15,00</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg border-t pt-2">
                        <span>Total:</span>
                        <span className="text-pink-600">{productData.price}</span>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
