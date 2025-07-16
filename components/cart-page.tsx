"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, ArrowLeft, Trash2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

// Placeholder para itens do carrinho
interface CartItem {
  id: string
  image: string
  title: string
  price: number
  quantity: number
  size?: string
}

const initialCartItems: CartItem[] = [
  {
    id: "1",
    image: "/placeholder.svg?height=100&width=100",
    title: "Vestido longo Florido",
    price: 70.0,
    quantity: 1,
    size: "M",
  },
  {
    id: "2",
    image: "/placeholder.svg?height=100&width=100",
    title: "Sapato para casamentos",
    price: 300.0,
    quantity: 1,
    size: "37",
  },
  {
    id: "3",
    image:
      "https://d2r9epyceweg5n.cloudfront.net/stores/754/485/products/lrgj138l-kz511-26351753f5637bafc016345825233105-1024-1024.png",
    title: "Kit relógio Lice",
    price: 400.0,
    quantity: 1,
  },
]

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems)

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(
      (prevItems) =>
        prevItems
          .map((item) => (item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item))
          .filter((item) => item.quantity > 0), // Remove if quantity becomes 0 (though we prevent it from going below 1)
    )
  }

  const removeItem = (id: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const shippingCost = 15.0 // Frete fixo
  const total = calculateSubtotal() + shippingCost

  return (
    <section className="py-8 md:py-12 bg-gradient-to-br from-pink-50 to-rose-50 min-h-[calc(100vh-150px)]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-pink-600 transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span>Continuar Comprando</span>
          </Link>
          <h1
            className="text-2xl md:text-3xl font-bold text-gray-800"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Seu Carrinho
          </h1>
        </div>

        {cartItems.length === 0 ? (
          <Card className="max-w-2xl mx-auto text-center p-8">
            <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">Seu carrinho está vazio!</h2>
            <p className="text-gray-600 mb-6">Adicione produtos incríveis para começar a comprar.</p>
            <Link href="/">
              <Button className="bg-pink-600 hover:bg-pink-700">Voltar à Loja</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Itens do Carrinho */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id} className="flex items-center p-4">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    className="w-24 h-24 object-cover rounded-lg mr-4"
                  />
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2 items-center">
                    <div>
                      <h3 className="font-semibold text-lg text-pink-600">{item.title}</h3>
                      {item.size && <p className="text-sm text-gray-600">Tamanho: {item.size}</p>}
                      <p className="font-bold text-gray-800">R$ {item.price.toFixed(2).replace(".", ",")}</p>
                    </div>
                    <div className="flex items-center justify-end md:justify-between space-x-2">
                      <div className="flex items-center space-x-2 border rounded-md p-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => updateQuantity(item.id, -1)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </Button>
                        <span className="font-medium w-6 text-center">{item.quantity}</span>
                        <Button variant="ghost" size="icon" onClick={() => updateQuantity(item.id, 1)}>
                          +
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Resumo do Pedido */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <ShoppingCart className="h-5 w-5" />
                    <span>Resumo do Carrinho</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span>R$ {calculateSubtotal().toFixed(2).replace(".", ",")}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Frete:</span>
                      <span>R$ {shippingCost.toFixed(2).replace(".", ",")}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span className="text-pink-600">R$ {total.toFixed(2).replace(".", ",")}</span>
                    </div>
                  </div>
                  <Link href="/comprar">
                    <Button style={{ backgroundColor: '#811B2D' }}  className="w-full  hover:bg-pink-700 text-white font-semibold py-3">
                      Finalizar Compra
                    </Button>
                  </Link>
                  <Link href="/" className="block text-center text-sm text-gray-600 hover:text-pink-600 mt-2">
                    Continuar Comprando
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
