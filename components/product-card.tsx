"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"

interface ProductCardProps {
  image: string
  title: string
  description: string
  price: string
  sizes: string[]
  onBuy?: () => void
}

export default function ProductCard({ image, title, description, price, sizes }: ProductCardProps) {
  const [selectedSize, setSelectedSize] = useState(sizes[0] || "")

  const handleBuyClick = () => {
    const params = new URLSearchParams({
      title,
      price,
      image,
      description,
      ...(selectedSize && { size: selectedSize }),
    })

    // Redireciona para a página de carrinho
    window.location.href = `/carrinho?${params.toString()}`
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <img src={image || "/placeholder.svg"} alt={title} className="w-full h-48 md:h-64 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-bold text-pink-600 mb-2" style={{ fontFamily: "Playfair Display, serif" }}>
          {title}
        </h3>
        <p className="text-gray-600 mb-3 text-sm md:text-base">{description}</p>
        <p className="text-lg md:text-xl font-bold text-gray-800 mb-4">{price}</p>

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

        <Button onClick={handleBuyClick} style={{ backgroundColor: '#811B2D' }} className="w-full hover:bg-pink-700 text-white font-semibold">
          Comprar
        </Button>
      </div>
    </div>
  )
}
