"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, CreditCard, Truck, MapPin, User } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

interface ProductData {
  title: string
  price: string
  image: string
  description: string
  size?: string
}

export default function CompraForm() {
  const searchParams = useSearchParams()
  const [step, setStep] = useState(1)
  const [productData, setProductData] = useState<ProductData | null>(null)

  const [formData, setFormData] = useState({
    // Dados pessoais
    nome: "",
    email: "",
    telefone: "",
    cpf: "",

    // Endereço
    cep: "",
    endereco: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",

    // Pagamento
    formaPagamento: "pix",

    // Observações
    observacoes: "",
  })

  useEffect(() => {
    // Recuperar dados do produto da URL
    const title = searchParams.get("title")
    const price = searchParams.get("price")
    const image = searchParams.get("image")
    const description = searchParams.get("description")
    const size = searchParams.get("size")

    if (title && price) {
      setProductData({
        title,
        price,
        image: image || "/placeholder.svg?height=200&width=200",
        description: description || "",
        size: size || undefined,
      })
    }
  }, [searchParams])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (step < 3) {
      setStep(step + 1)
    } else {
      // Finalizar compra
      console.log("Finalizando compra:", { productData, formData })
      alert("Pedido realizado com sucesso! Entraremos em contato em breve.")
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const formatPrice = (price: string) => {
    return price.replace("R$", "").trim()
  }

  const calculateTotal = () => {
    if (!productData) return "0,00"
    const basePrice = Number.parseFloat(formatPrice(productData.price).replace(",", "."))
    const shipping = 15.0 // Frete fixo
    return (basePrice + shipping).toFixed(2).replace(".", ",")
  }

  if (!productData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Produto não encontrado</h2>
            <p className="text-gray-600 mb-4">Selecione um produto para continuar com a compra.</p>
            <Link href="/">
              <Button className="bg-pink-600 hover:bg-pink-700">Voltar à loja</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-pink-600 transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span>Voltar à loja</span>
          </Link>
          <h1
            className="text-2xl md:text-3xl font-bold text-gray-800"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Finalizar Compra
          </h1>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 ${step >= 1 ? "text-pink-600" : "text-gray-400"}`}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? "bg-pink-600 text-white" : "bg-gray-200"}`}
              >
                <User className="h-4 w-4" />
              </div>
              <span className="hidden sm:inline font-medium">Dados</span>
            </div>
            <div className="w-8 h-0.5 bg-gray-300"></div>
            <div className={`flex items-center space-x-2 ${step >= 2 ? "text-pink-600" : "text-gray-400"}`}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? "bg-pink-600 text-white" : "bg-gray-200"}`}
              >
                <MapPin className="h-4 w-4" />
              </div>
              <span className="hidden sm:inline font-medium">Endereço</span>
            </div>
            <div className="w-8 h-0.5 bg-gray-300"></div>
            <div className={`flex items-center space-x-2 ${step >= 3 ? "text-pink-600" : "text-gray-400"}`}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? "bg-pink-600 text-white" : "bg-gray-200"}`}
              >
                <CreditCard className="h-4 w-4" />
              </div>
              <span className="hidden sm:inline font-medium">Pagamento</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Formulário */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {step === 1 && (
                    <>
                      <User className="h-5 w-5" />
                      <span>Dados Pessoais</span>
                    </>
                  )}
                  {step === 2 && (
                    <>
                      <MapPin className="h-5 w-5" />
                      <span>Endereço de Entrega</span>
                    </>
                  )}
                  {step === 3 && (
                    <>
                      <CreditCard className="h-5 w-5" />
                      <span>Forma de Pagamento</span>
                    </>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Step 1: Dados Pessoais */}
                  {step === 1 && (
                    <>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="nome" className="text-sm font-semibold text-gray-700">
                            Nome completo *
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
                        <div>
                          <Label htmlFor="cpf" className="text-sm font-semibold text-gray-700">
                            CPF *
                          </Label>
                          <Input
                            id="cpf"
                            name="cpf"
                            type="text"
                            placeholder="000.000.000-00"
                            value={formData.cpf}
                            onChange={handleChange}
                            required
                            className="border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                          />
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                            E-mail *
                          </Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="seu@email.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                          />
                        </div>
                        <div>
                          <Label htmlFor="telefone" className="text-sm font-semibold text-gray-700">
                            Telefone *
                          </Label>
                          <Input
                            id="telefone"
                            name="telefone"
                            type="tel"
                            placeholder="(00) 00000-0000"
                            value={formData.telefone}
                            onChange={handleChange}
                            required
                            className="border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Step 2: Endereço */}
                  {step === 2 && (
                    <>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="cep" className="text-sm font-semibold text-gray-700">
                            CEP *
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
                        <div className="md:col-span-2">
                          <Label htmlFor="endereco" className="text-sm font-semibold text-gray-700">
                            Endereço *
                          </Label>
                          <Input
                            id="endereco"
                            name="endereco"
                            type="text"
                            placeholder="Rua, Avenida..."
                            value={formData.endereco}
                            onChange={handleChange}
                            required
                            className="border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                          />
                        </div>
                      </div>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="numero" className="text-sm font-semibold text-gray-700">
                            Número *
                          </Label>
                          <Input
                            id="numero"
                            name="numero"
                            type="text"
                            placeholder="123"
                            value={formData.numero}
                            onChange={handleChange}
                            required
                            className="border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label htmlFor="complemento" className="text-sm font-semibold text-gray-700">
                            Complemento
                          </Label>
                          <Input
                            id="complemento"
                            name="complemento"
                            type="text"
                            placeholder="Apto, Bloco..."
                            value={formData.complemento}
                            onChange={handleChange}
                            className="border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                          />
                        </div>
                      </div>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="bairro" className="text-sm font-semibold text-gray-700">
                            Bairro *
                          </Label>
                          <Input
                            id="bairro"
                            name="bairro"
                            type="text"
                            placeholder="Bairro"
                            value={formData.bairro}
                            onChange={handleChange}
                            required
                            className="border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                          />
                        </div>
                        <div>
                          <Label htmlFor="cidade" className="text-sm font-semibold text-gray-700">
                            Cidade *
                          </Label>
                          <Input
                            id="cidade"
                            name="cidade"
                            type="text"
                            placeholder="Cidade"
                            value={formData.cidade}
                            onChange={handleChange}
                            required
                            className="border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                          />
                        </div>
                        <div>
                          <Label htmlFor="estado" className="text-sm font-semibold text-gray-700">
                            Estado *
                          </Label>
                          <select
                            id="estado"
                            name="estado"
                            value={formData.estado}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-pink-500 focus:ring-pink-500"
                          >
                            <option value="">Selecione</option>
                            <option value="CE">Ceará</option>
                            <option value="SP">São Paulo</option>
                            <option value="RJ">Rio de Janeiro</option>
                            <option value="MG">Minas Gerais</option>
                            {/* Adicionar outros estados */}
                          </select>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Step 3: Pagamento */}
                  {step === 3 && (
                    <>
                      <div className="space-y-4">
                        <Label className="text-sm font-semibold text-gray-700">Forma de Pagamento *</Label>
                        <div className="space-y-3">
                          <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                            <input
                              type="radio"
                              name="formaPagamento"
                              value="pix"
                              checked={formData.formaPagamento === "pix"}
                              onChange={handleChange}
                              className="text-pink-600 focus:ring-pink-500"
                            />
                            <div className="flex items-center space-x-2">
                              <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                                <span className="text-green-600 font-bold text-sm">PIX</span>
                              </div>
                              <div>
                                <p className="font-medium">PIX</p>
                                <p className="text-sm text-gray-600">Pagamento instantâneo</p>
                              </div>
                            </div>
                          </label>
                          <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                            <input
                              type="radio"
                              name="formaPagamento"
                              value="cartao"
                              checked={formData.formaPagamento === "cartao"}
                              onChange={handleChange}
                              className="text-pink-600 focus:ring-pink-500"
                            />
                            <div className="flex items-center space-x-2">
                              <CreditCard className="w-8 h-8 text-blue-600" />
                              <div>
                                <p className="font-medium">Cartão de Crédito</p>
                                <p className="text-sm text-gray-600">Visa, Mastercard, Elo</p>
                              </div>
                            </div>
                          </label>
                          <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                            <input
                              type="radio"
                              name="formaPagamento"
                              value="boleto"
                              checked={formData.formaPagamento === "boleto"}
                              onChange={handleChange}
                              className="text-pink-600 focus:ring-pink-500"
                            />
                            <div className="flex items-center space-x-2">
                              <div className="w-8 h-8 bg-orange-100 rounded flex items-center justify-center">
                                <span className="text-orange-600 font-bold text-xs">BOL</span>
                              </div>
                              <div>
                                <p className="font-medium">Boleto Bancário</p>
                                <p className="text-sm text-gray-600">Vencimento em 3 dias</p>
                              </div>
                            </div>
                          </label>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="observacoes" className="text-sm font-semibold text-gray-700">
                          Observações (opcional)
                        </Label>
                        <Textarea
                          id="observacoes"
                          name="observacoes"
                          placeholder="Alguma observação sobre o pedido..."
                          value={formData.observacoes}
                          onChange={handleChange}
                          rows={3}
                          className="border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                        />
                      </div>
                    </>
                  )}

                  {/* Botões */}
                  <div className="flex justify-between pt-6">
                    {step > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep(step - 1)}
                        className="border-gray-300"
                      >
                        Voltar
                      </Button>
                    )}
                    <Button type="submit" className="bg-pink-600 hover:bg-pink-700 text-white ml-auto">
                      {step < 3 ? "Continuar" : "Finalizar Compra"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Resumo do Pedido */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Truck className="h-5 w-5" />
                  <span>Resumo do Pedido</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Produto */}
                <div className="flex space-x-3">
                  <img
                    src={productData.image || "/placeholder.svg"}
                    alt={productData.title}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">{productData.title}</h3>
                    <p className="text-xs text-gray-600">{productData.description}</p>
                    {productData.size && <p className="text-xs text-gray-600">Tamanho: {productData.size}</p>}
                    <p className="font-bold text-pink-600">{productData.price}</p>
                  </div>
                </div>

                <Separator />

                {/* Valores */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>{productData.price}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Frete:</span>
                    <span>R$ 15,00</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span className="text-pink-600">R$ {calculateTotal()}</span>
                  </div>
                </div>

                {/* Informações de entrega */}
                <div className="bg-pink-50 p-3 rounded-lg">
                  <div className="flex items-center space-x-2 text-sm text-pink-700">
                    <Truck className="h-4 w-4" />
                    <span className="font-medium">Entrega em 5-7 dias úteis</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
