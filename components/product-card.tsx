"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"
import { formatCurrency } from "@/lib/utils"
import { useAddToCart } from "@/lib/cartService"
import { useToast } from "@/hooks/use-toast"

interface ProductCardProps {
  id: string
  image: string
  title: string
  description: string
  price: number
  sizes: string[]
  onBuy?: () => void
}

export default function ProductCard({ id, image, title, description, price, sizes }: ProductCardProps) {
  const [selectedSize, setSelectedSize] = useState(sizes[0] || "")
  const addToCart = useAddToCart()
  const { toast } = useToast()

  const handleBuyClick = async () => {
    if (!selectedSize) {
      toast({
        title: "Erro",
        description: "Selecione um tamanho antes de adicionar ao carrinho",
        variant: "destructive",
      })
      return
    }

    try {
      await addToCart.mutateAsync({
        productId: id,
        quantity: 1,
      })
      
      toast({
        title: "Sucesso!",
        description: "Produto adicionado ao carrinho",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao adicionar produto ao carrinho",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <img src={image || "/placeholder.svg"} alt={title} className="w-full h-48 md:h-64 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-bold text-pink-600 mb-2" style={{ fontFamily: "Playfair Display, serif" }}>
          {title}
        </h3>
        <p className="text-gray-600 mb-3 text-sm md:text-base">{description}</p>
        <p className="text-lg md:text-xl font-bold text-gray-800 mb-4">{formatCurrency(price)}</p>

        {sizes.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">Tamanhos:</p>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size, index) => (
                <label key={index} className="flex items-center space-x-1">
                  <input
                    type="radio"
                    name={`size-${title}`}
                    value={size}
                    checked={selectedSize === size}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="text-pink-600 focus:ring-pink-500"
                  />
                  <span className="text-sm">{size}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <Button 
          onClick={handleBuyClick} 
          disabled={addToCart.isPending}
          style={{ backgroundColor: '#811B2D' }} 
          className="w-full hover:bg-pink-700 text-white font-semibold"
        >
          {addToCart.isPending ? "Adicionando..." : "Adicionar ao Carrinho"}
        </Button>
      </div>
    </div>
  )
}
