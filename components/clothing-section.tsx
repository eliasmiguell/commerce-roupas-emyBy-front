"use client"

import { useState } from "react"
import ProductCard from "./product-card"
import { useVestidos, useBlusas, useSaias, useCalcas, getRoupaAvailableSizes } from "@/lib/roupasService"
import { Skeleton } from "@/components/ui/skeleton"

const clothingCategories = {
  vestidos: "vestidos",
  blusas: "blusas", 
  saias: "saias",
  calcas: "calcas"
}

export default function ClothingSection() {
  const [activeCategory, setActiveCategory] = useState("vestidos")

  // Hooks para buscar dados da API
  const { data: vestidos, isLoading: loadingVestidos } = useVestidos()
  const { data: blusas, isLoading: loadingBlusas } = useBlusas()
  const { data: saias, isLoading: loadingSaias } = useSaias()
  const { data: calcas, isLoading: loadingCalcas } = useCalcas()

  // Função para obter dados da categoria ativa
  const getActiveCategoryData = () => {
    switch (activeCategory) {
      case "vestidos":
        return { data: vestidos, loading: loadingVestidos }
      case "blusas":
        return { data: blusas, loading: loadingBlusas }
      case "saias":
        return { data: saias, loading: loadingSaias }
      case "calcas":
        return { data: calcas, loading: loadingCalcas }
      default:
        return { data: vestidos, loading: loadingVestidos }
    }
  }

  const { data: products, loading } = getActiveCategoryData()

  // Componente de skeleton para loading
  const ProductSkeleton = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <Skeleton className="w-full h-48 md:h-64" />
      <div className="p-4">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-3" />
        <Skeleton className="h-6 w-1/2 mb-4" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  )

  return (
    <section className="py-8 md:py-16">
      <div className="container mx-auto px-4">
        <h2
          className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          <span className="text-pink-600">Roupas</span> Emy-by
        </h2>

        <div className="grid lg:grid-cols-12 gap-6 md:gap-8">
          {/* Category Navigation */}
          <aside className="lg:col-span-2">
            <nav className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
              {Object.keys(clothingCategories).map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 text-left font-semibold rounded-lg transition-colors whitespace-nowrap lg:whitespace-normal ${
                    activeCategory === category
                      ? "bg-pink-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-pink-100"
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </nav>
          </aside>

          {/* Products Grid */}
          <div className="lg:col-span-10">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <ProductSkeleton key={index} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {products?.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    image={product.imageUrl || "/placeholder.svg"}
                    title={product.name}
                    description={product.description}
                    price={product.price}
                    sizes={getRoupaAvailableSizes(product)}
                  />
                ))}
              </div>
            )}
            
            {!loading && (!products || products.length === 0) && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  Nenhum produto encontrado nesta categoria.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
