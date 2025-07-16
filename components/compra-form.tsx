"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ShoppingBag, CreditCard, Truck } from "lucide-react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"

export default function CompraForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
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
  })

  // Dados do produto vindos da URL
  const productData = {
    title: searchParams.get("title") || "Produto",
    price: searchParams.get("price") || "R$ 0,00",
    image: searchParams.get("image") || "/placeholder.svg",
    description: searchParams.get("description") || "",
    size: searchParams.get("size") || "",
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Compra finalizada:", { productData, formData })
    // Aqui você adicionaria a lógica de finalização da compra
    alert("Compra realizada com sucesso!")
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Formulário de Compra */}
          <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center space-y-4">
            <Button
            onClick={() => router.push("/")}
            className="  flex items-center space-x-2 text-white transition-colors bg-pink-600 backdrop-blur-sm rounded-lg px-3 py-2 w-[140px] mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Voltar à loja</span>
          </Button>
              <div className="flex items-center justify-center space-x-3 mb-4">
                <ShoppingBag className="h-8 w-8 text-pink-600" />
                <h1 className="text-2xl font-bold text-pink-600" style={{ fontFamily: "Pacifico, cursive" }}>
                  Emy-by
                </h1>
              </div>
              <CardTitle className="text-2xl font-bold text-gray-800" style={{ fontFamily: "Playfair Display, serif" }}>
                Finalizar Compra
              </CardTitle>
              <CardDescription className="text-gray-600">Complete seus dados para finalizar a compra</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
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

                <Button
                  type="submit"
                  style={{ backgroundColor: '#811B2D' }}
                  className="w-full hover:bg-pink-700 text-white font-semibold py-3"
                >
                  Finalizar Compra
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
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
