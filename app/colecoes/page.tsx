"use client"

import { useState } from "react"
import Header from "@/components/header"
import { useGetCategorias } from "@/lib/categoriaService"
import { useProdutos } from "@/lib/produtoService"
import { Button } from "@/components/ui/button"
import { Loader2, Grid, List } from "lucide-react"
import { getImageUrl, getOptimizedImageUrl } from "@/lib/utils"
import Link from "next/link"
import ProductCard from "@/components/product-card"

export default function ColecoesPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // Buscar categorias
  const { data: categoriesData, isLoading: loadingCategories } = useGetCategorias()

  // Buscar produtos
  const { data: productsData, isLoading: loadingProducts, error: productsError } = useProdutos({ limit: 100 })

  const categories = categoriesData || []
  const products = productsData?.products || productsData || []

  // Filtrar produtos por categoria selecionada
  const filteredProducts = selectedCategory 
    ? products.filter((product: any) => product.category?.slug === selectedCategory)
    : products

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

  if (productsError) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-red-600 mb-4">Erro ao carregar produtos</h1>
            <p className="text-gray-600 mb-8">Não foi possível carregar os produtos. Tente novamente.</p>
            <div className="text-sm text-gray-500">
              Erro: {productsError.message}
            </div>
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
          {/* Header da página */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 text-center">
              Nossas <span className="text-pink-600">Coleções</span>
            </h1>
            <p className="text-lg text-gray-600 text-center mb-6">
              Descubra nossa coleção completa de produtos
            </p>
          </div>

          {/* Filtros de categoria */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 justify-center">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                onClick={() => setSelectedCategory(null)}
                className="bg-pink-600 hover:bg-pink-700 text-white"
              >
                Todas as Categorias
              </Button>
              {categories.map((category: any) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.slug ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.slug)}
                  className={selectedCategory === category.slug 
                    ? "bg-pink-600 hover:bg-pink-700 text-white" 
                    : "border-pink-300 text-pink-700 hover:bg-pink-50"
                  }
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Controles de visualização */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-gray-600">
              {filteredProducts.length} produto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
              {selectedCategory && (
                <span> em {categories.find((c: any) => c.slug === selectedCategory)?.name}</span>
              )}
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
          {filteredProducts.length > 0 ? (
            <div className={
              viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            }>
              {filteredProducts.map((product: any) => {
                // Verificar se o produto tem a estrutura correta
                if (!product.id || !product.name) {
                  console.log('Produto inválido:', product)
                  return null
                }
                
                return (
                  <ProductCard 
                    key={product.id} 
                    id={product.id}
                    image={product.imageUrl || ''}
                    title={product.name}
                    description={product.description || ''}
                    price={product.price || 0}
                    sizes={product.variants?.map((v: any) => v.size) || []}
                  />
                )
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-gray-500 mb-4">
                Nenhum produto encontrado{selectedCategory && ` na categoria selecionada`}.
              </div>
              <div className="text-sm text-gray-400 mb-4">
                Total de produtos carregados: {products.length}
              </div>
              {selectedCategory && (
                <Button
                  onClick={() => setSelectedCategory(null)}
                  className="bg-pink-600 hover:bg-pink-700"
                >
                  Ver todas as categorias
                </Button>
              )}
            </div>
          )}

          {/* Seção de categorias */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
              Explore por <span className="text-pink-600">Categoria</span>
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category: any) => (
                <div
                  key={category.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="relative h-48">
                    <img
                      src={getOptimizedImageUrl(category.imageUrl, 400, 300, 90)}
                      alt={category.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg"
                      }}
                    />
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute top-4 left-4 text-3xl md:text-4xl">
                      {category.emoji || "🛍️"}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {category.name}
                    </h3>
                    <p className="text-gray-600 mb-4">{category.description}</p>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setSelectedCategory(category.slug)}
                        className="flex-1 bg-pink-600 hover:bg-pink-700"
                      >
                        Ver Produtos
                      </Button>
                      <Link href={`/${category.slug}`}>
                        <Button variant="outline" className="border-pink-300 text-pink-700 hover:bg-pink-50">
                          Página Completa
                        </Button>
                      </Link>
                    </div>
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