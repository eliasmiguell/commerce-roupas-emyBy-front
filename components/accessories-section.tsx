"use client"

import { useState } from "react"
import { useRelogios, useColares, useTodosAcessorios } from "@/lib/acessoriosService"
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
      router.push("/login")
      return
    }

    if (availableSizes.length > 1 && !selectedSize) {
      toast({
        title: "Selecione um tamanho",
        description: "Por favor, selecione um tamanho antes de adicionar ao carrinho.",
        variant: "destructive",
      })
      return
    }

    const variantId = product.variants.find(v => v.size === selectedSize)?.id
    
    addToCart.mutate({
      productId: product.id,
      variantId: variantId || product.variants[0]?.id,
      quantity: 1,
    }, {
      onSuccess: () => {
        toast({
          title: "Produto adicionado!",
          description: `${product.name} foi adicionado ao seu carrinho.`,
        })
      },
      onError: () => {
        toast({
          title: "Erro",
          description: "Não foi possível adicionar o produto ao carrinho.",
          variant: "destructive",
        })
      }
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="aspect-square bg-gray-100 flex items-center justify-center">
        {product.imageUrl ? (
          <img
            src={getImageUrl(product.imageUrl)}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-gray-400 text-center">
            <div className="text-4xl mb-2">📦</div>
            <p className="text-sm">Imagem não disponível</p>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 text-gray-800">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-3">{product.description}</p>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-pink-600">
            R$ {Number(product.price).toFixed(2).replace('.', ',')}
          </span>
          <span className="text-sm text-gray-500">{product.category.name}</span>
        </div>

        {availableSizes.length > 1 && (
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tamanho:
            </label>
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="">Selecione o tamanho</option>
              {availableSizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}

        <Button
          onClick={handleAddToCart}
          className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          disabled={addToCart.isPending}
        >
          {addToCart.isPending ? "Adicionando..." : user ? "Adicionar ao Carrinho" : "Fazer Login"}
        </Button>
      </div>
    </div>
  )
}

export default function AccessoriesSection() {
  const [activeCategory, setActiveCategory] = useState<'todos' | 'relogios' | 'colares'>('todos')
  const { data: todosAcessorios, isLoading: isLoadingTodos } = useTodosAcessorios()
  const { data: relogios, isLoading: isLoadingRelogios } = useRelogios()
  const { data: colares, isLoading: isLoadingColares } = useColares()

  const getProducts = () => {
    switch (activeCategory) {
      case 'relogios':
        return relogios || []
      case 'colares':
        return colares || []
      default:
        return todosAcessorios?.todos || []
    }
  }

  const isLoading = () => {
    switch (activeCategory) {
      case 'relogios':
        return isLoadingRelogios
      case 'colares':
        return isLoadingColares
      default:
        return isLoadingTodos
    }
  }

  const products = getProducts()

  return (
    <section className="py-8 md:py-16">
      <div className="container mx-auto px-4">
        <h2
          className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          <span className="text-pink-600">Acessórios</span> Emy-by
        </h2>

        <div className="grid lg:grid-cols-12 gap-6 md:gap-8">
          {/* Category Navigation */}
          <aside className="lg:col-span-2">
            <nav className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
              <button
                onClick={() => setActiveCategory('todos')}
                className={`px-4 py-2 text-left font-semibold rounded-lg transition-colors whitespace-nowrap lg:whitespace-normal ${
                  activeCategory === 'todos'
                    ? "bg-pink-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-pink-100"
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setActiveCategory('relogios')}
                className={`px-4 py-2 text-left font-semibold rounded-lg transition-colors whitespace-nowrap lg:whitespace-normal ${
                  activeCategory === 'relogios'
                    ? "bg-pink-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-pink-100"
                }`}
              >
                Relógios
              </button>
              <button
                onClick={() => setActiveCategory('colares')}
                className={`px-4 py-2 text-left font-semibold rounded-lg transition-colors whitespace-nowrap lg:whitespace-normal ${
                  activeCategory === 'colares'
                    ? "bg-pink-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-pink-100"
                }`}
              >
                Colares
              </button>
            </nav>
          </aside>

          {/* Products Grid */}
          <div className="lg:col-span-10">
            {isLoading() ? (
              <div className="text-center py-8">
                <div className="text-gray-500">Carregando produtos...</div>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-500">Nenhum produto encontrado nesta categoria.</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {products.map((product: any) => (
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
