"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Header from "@/components/header"
import { useGetCategorias } from "@/lib/categoriaService"
import { getProdutos } from "@/lib/produtoService"
import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Loader2, Grid, List, ArrowLeft } from "lucide-react"
import { getImageUrl, getOptimizedImageUrl } from "@/lib/utils"
import Link from "next/link"
import ProductCard from "@/components/product-card"

export default function CategoriaPage() {
  const params = useParams()
  const slug = params.slug as string
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Buscar categorias
  const { data: categoriesData, isLoading: loadingCategories } = useGetCategorias()

  // Buscar produtos
  const { data: productsData, isLoading: loadingProducts } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProdutos({ limit: 100 }),
    retry: 1,
    staleTime: 0,
  })

  const categories = categoriesData || []
  const products = productsData?.data?.products || []

  // Encontrar a categoria pelo slug
  const category = categories.find((cat: any) => cat.slug === slug)

  // Filtrar produtos da categoria
  const categoryProducts = products.filter((product: any) => product.category?.slug === slug)

  if (loadingCategories || loadingProducts) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin w-8 h-8 text-pink-600" />
        </div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Categoria não encontrada</h1>
            <p className="text-gray-600 mb-8">A categoria que você está procurando não existe.</p>
            <Link href="/colecoes">
              <Button className="bg-pink-600 hover:bg-pink-700">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar às Coleções
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-8">
        <div className="container mx-auto px-4">
          {/* Header da categoria */}
          <div className="mb-8">
            <Link href="/colecoes" className="inline-flex items-center text-pink-600 hover:text-pink-700 mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar às Coleções
            </Link>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="text-4xl">{category.emoji || "🛍️"}</div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                  {category.name}
                </h1>
                <p className="text-lg text-gray-600">{category.description}</p>
              </div>
            </div>
          </div>

          {/* Controles de visualização */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-gray-600">
              {categoryProducts.length} produto{categoryProducts.length !== 1 ? 's' : ''} encontrado{categoryProducts.length !== 1 ? 's' : ''} nesta categoria
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? "bg-pink-600 hover:bg-pink-700" : ""}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? "bg-pink-600 hover:bg-pink-700" : ""}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Grid de produtos */}
          {categoryProducts.length > 0 ? (
            <div className={
              viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            }>
              {categoryProducts.map((product: any) => (
                <ProductCard 
                  key={product.id} 
                  id={product.id}
                  image={product.imageUrl}
                  title={product.name}
                  description={product.description}
                  price={product.price}
                  sizes={product.variants?.map((v: any) => v.size) || []}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-gray-500 mb-4">
                Nenhum produto encontrado nesta categoria.
              </div>
              <Link href="/colecoes">
                <Button className="bg-pink-600 hover:bg-pink-700">
                  Ver outras categorias
                </Button>
              </Link>
            </div>
          )}

          {/* Outras categorias */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
              Explore outras <span className="text-pink-600">Categorias</span>
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories
                .filter((cat: any) => cat.slug !== slug)
                .slice(0, 3)
                .map((cat: any) => (
                <div
                  key={cat.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="relative h-48">
                    <img
                      src={getOptimizedImageUrl(cat.imageUrl, 400, 300, 90)}
                      alt={cat.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg"
                      }}
                    />
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute top-4 left-4 text-3xl md:text-4xl">
                      {cat.emoji || "🛍️"}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {cat.name}
                    </h3>
                    <p className="text-gray-600 mb-4">{cat.description}</p>
                    <Link href={`/${cat.slug}`}>
                      <Button className="w-full bg-pink-600 hover:bg-pink-700">
                        Ver Produtos
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 