"use client"

import { useState } from "react"
import { useCalcados, useSapatos, useTenis, useSandalias } from "@/lib/calcadosService"
import { useProfile } from "@/lib/authService"
import { useAddToCart } from "@/lib/cartService"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { getImageUrl } from "@/lib/utils"

interface Product {
  id: string
  name: string
  description: string
  price: string
  imageUrl: string | null
  category: {
    id: string
    name: string
    slug: string
  }
  variants: {
    id: string
    size: string
    color?: string
    stock: number
    productId: string
  }[]
}

interface ProductCardProps {
  product: Product
}

function ProductCard({ product }: ProductCardProps) {
  const [selectedSize, setSelectedSize] = useState("")
  const { data: user } = useProfile()
  const addToCart = useAddToCart()
  const { toast } = useToast()
  const router = useRouter()

  const availableSizes = product.variants
    .filter(variant => variant.stock > 0)
    .map(variant => variant.size)

  const handleAddToCart = async () => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Faça login para adicionar produtos ao carrinho",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    if (!selectedSize) {
      toast({
        title: "Selecione um tamanho",
        description: "Por favor, selecione um tamanho antes de adicionar ao carrinho",
        variant: "destructive",
      })
      return
    }

    try {
      await addToCart.mutateAsync({
        productId: product.id,
        quantity: 1,
      })
      
      toast({
        title: "Sucesso!",
        description: `${product.name} adicionado ao carrinho`,
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
      <img 
        src={getImageUrl(product.imageUrl || "")} 
        alt={product.name} 
        className="w-full h-48 md:h-64 object-cover" 
      />
      <div className="p-4">
        <h3 className="text-lg font-bold text-pink-600 mb-2" style={{ fontFamily: "Playfair Display, serif" }}>
          {product.name}
        </h3>
        <p className="text-gray-600 mb-3 text-sm md:text-base">{product.description}</p>
        <p className="text-lg md:text-xl font-bold text-gray-800 mb-4">
          R$ {Number(product.price).toFixed(2).replace('.', ',')}
        </p>

        {availableSizes.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">Tamanhos disponíveis:</p>
            <div className="flex flex-wrap gap-2">
              {availableSizes.map((size, index) => (
                <label key={index} className="flex items-center space-x-1">
                  <input
                    type="radio"
                    name={`size-${product.id}`}
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
          onClick={handleAddToCart} 
          disabled={addToCart.isPending || availableSizes.length === 0}
          style={{ backgroundColor: '#811B2D' }} 
          className="w-full hover:bg-pink-700 text-white font-semibold"
        >
          {addToCart.isPending ? "Adicionando..." : 
           availableSizes.length === 0 ? "Sem estoque" :
           user ? "Adicionar ao Carrinho" : "Fazer Login"}
        </Button>
      </div>
    </div>
  )
}

export default function ShoesSection() {
  const [activeCategory, setActiveCategory] = useState<'todos' | 'sapatos' | 'tenis' | 'sandalias'>('todos')
  
  const { data: allCalcados, isLoading: loadingAll } = useCalcados()
  const { data: sapatos, isLoading: loadingSapatos } = useSapatos()
  const { data: tenis, isLoading: loadingTenis } = useTenis()
  const { data: sandalias, isLoading: loadingSandalias } = useSandalias()

  const getCurrentProducts = () => {
    switch (activeCategory) {
      case 'sapatos':
        return sapatos || []
      case 'tenis':
        return tenis || []
      case 'sandalias':
        return sandalias || []
      default:
        return allCalcados || []
    }
  }

  const isLoading = () => {
    switch (activeCategory) {
      case 'sapatos':
        return loadingSapatos
      case 'tenis':
        return loadingTenis
      case 'sandalias':
        return loadingSandalias
      default:
        return loadingAll
    }
  }

  const products = getCurrentProducts()

  return (
    <section className="py-8 md:py-16 bg-gradient-to-br from-pink-50 to-rose-50">
      <div className="container mx-auto px-4">
        <h2
          className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          <span className="text-pink-600">Calçados</span> Emy-by
        </h2>

        <div className="grid lg:grid-cols-12 gap-6 md:gap-8">
          {/* Category Navigation */}
          <aside className="lg:col-span-2">
            <nav className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
              {[
                { key: 'todos', label: 'Todos' },
                { key: 'sapatos', label: 'Sapatos' },
                { key: 'tenis', label: 'Tênis' },
                { key: 'sandalias', label: 'Sandálias' }
              ].map((category) => (
                <button
                  key={category.key}
                  onClick={() => setActiveCategory(category.key as any)}
                  className={`px-4 py-2 text-left font-semibold rounded-lg transition-colors whitespace-nowrap lg:whitespace-normal ${
                    activeCategory === category.key
                      ? "bg-pink-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-pink-100"
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Products Grid */}
          <div className="lg:col-span-10">
            {isLoading() ? (
              <div className="flex justify-center items-center h-64">
                <div className="text-lg text-gray-600">Carregando produtos...</div>
              </div>
            ) : products.length === 0 ? (
              <div className="flex justify-center items-center h-64">
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    Nenhum produto encontrado
                  </h3>
                  <p className="text-gray-500">
                    {activeCategory === 'todos' 
                      ? 'Não há calçados disponíveis no momento.'
                      : `Não há produtos na categoria "${activeCategory}" no momento.`
                    }
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {products.map((product: Product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
