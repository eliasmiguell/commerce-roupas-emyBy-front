"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, ArrowLeft, Trash2, Loader2 } from "lucide-react"
import Link from "next/link"
import { useCartItems, useUpdateCartItem, useRemoveCartItem, useClearCart } from "@/lib/cartService"
import { useToast } from "@/hooks/use-toast"
import { formatCurrency, getImageUrl } from "@/lib/utils"

export default function CartPage() {
  const { data: cartData, isLoading, error } = useCartItems()
  const updateCartItem = useUpdateCartItem()
  const removeCartItem = useRemoveCartItem()
  const clearCart = useClearCart()
  const { toast } = useToast()

  const handleUpdateQuantity = async (id: string, quantity: number) => {
    try {
      await updateCartItem.mutateAsync({ id, data: { quantity } })
      toast({
        title: "Sucesso!",
        description: "Quantidade atualizada",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar quantidade",
        variant: "destructive",
      })
    }
  }

  const handleRemoveItem = async (id: string) => {
    try {
      await removeCartItem.mutateAsync(id)
      toast({
        title: "Sucesso!",
        description: "Item removido do carrinho",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao remover item",
        variant: "destructive",
      })
    }
  }

  const handleClearCart = async () => {
    try {
      await clearCart.mutateAsync()
      toast({
        title: "Sucesso!",
        description: "Carrinho limpo",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao limpar carrinho",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <section className="py-8 md:py-12 bg-gradient-to-br from-pink-50 to-rose-50 min-h-[calc(100vh-150px)]">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-pink-600" />
              <p className="text-gray-600">Carregando carrinho...</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-8 md:py-12 bg-gradient-to-br from-pink-50 to-rose-50 min-h-[calc(100vh-150px)]">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto text-center p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Erro ao carregar carrinho</h2>
            <p className="text-gray-600 mb-6">Tente novamente mais tarde.</p>
            <Link href="/">
              <Button className="bg-pink-600 hover:bg-pink-700">Voltar à Loja</Button>
            </Link>
          </Card>
        </div>
      </section>
    )
  }

  const cartItems = cartData?.items || []
  const subtotal = cartData?.total || 0
  const shippingCost = 15.0 // Frete fixo
  const total = subtotal + shippingCost

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
              {cartItems.map((item: any) => (
                <Card key={item.id} className="flex items-center p-4">
                  <img
                    src={getImageUrl(item.product.imageUrl)}
                    alt={item.product.name}
                    className="w-24 h-24 object-cover rounded-lg mr-4"
                  />
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2 items-center">
                    <div>
                      <h3 className="font-semibold text-lg text-pink-600">{item.product.name}</h3>
                      {item.variant && <p className="text-sm text-gray-600">Tamanho: {item.variant.size}</p>}
                      <p className="font-bold text-gray-800">{formatCurrency(item.product.price)}</p>
                    </div>
                    <div className="flex items-center justify-end md:justify-between space-x-2">
                      <div className="flex items-center space-x-2 border rounded-md p-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          disabled={item.quantity <= 1 || updateCartItem.isPending}
                        >
                          -
                        </Button>
                        <span className="font-medium w-6 text-center">{item.quantity}</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          disabled={updateCartItem.isPending}
                        >
                          +
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={removeCartItem.isPending}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
              
              {/* Botão Limpar Carrinho */}
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  onClick={handleClearCart}
                  disabled={clearCart.isPending}
                  className="text-red-600 border-red-600 hover:bg-red-50"
                >
                  {clearCart.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Limpando...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Limpar Carrinho
                    </>
                  )}
                </Button>
              </div>
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
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Frete:</span>
                      <span>{formatCurrency(shippingCost)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span className="text-pink-600">{formatCurrency(total)}</span>
                    </div>
                  </div>
                  <Link href="/comprar">
                    <Button style={{ backgroundColor: '#811B2D' }} className="w-full hover:bg-pink-700 text-white font-semibold py-3">
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
