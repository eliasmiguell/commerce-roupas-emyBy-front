"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useProdutos } from "@/lib/produtoService"
import { useGetCategorias } from "@/lib/categoriaService"
import { useAddToCart } from "@/lib/cartService"
import { useToast } from "@/hooks/use-toast"
import { ShoppingCart, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { getImageUrl } from "@/lib/utils"

export default function ClothingSectionSimple() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  
  const { toast } = useToast()
  const addToCartMutation = useAddToCart()
  const router = useRouter()
  
  // Verificar se o usuário está logado
  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsLoggedIn(!!token)
  }, [])
  
  // Buscar categorias
  const { data: categorias, isLoading: loadingCategorias } = useGetCategorias()
  
  // Buscar produtos
  const { data: produtos, isLoading: loadingProdutos } = useProdutos()
  
  // Buscar produtos por categoria quando uma categoria for selecionada
  const { data: produtosPorCategoria, isLoading: loadingProdutosPorCategoria } = useProdutos(
    selectedCategorySlug ? { category: selectedCategorySlug } : {}
  )

  // Determinar quais produtos mostrar
  const produtosExibidos = selectedCategorySlug ? produtosPorCategoria : produtos
  const isLoading = loadingProdutos || (selectedCategorySlug && loadingProdutosPorCategoria)

  const handleCategoryChange = (categorySlug: string | null) => {
    setSelectedCategorySlug(categorySlug)
    setActiveCategory(categorySlug)
  }

  const handleAddToCart = async (productId: string) => {
    if (!isLoggedIn) {
      toast({
        title: "Login necessário",
        description: "Faça login para adicionar produtos ao carrinho.",
        variant: "destructive",
      })
      router.push('/login')
      return
    }

    try {
      await addToCartMutation.mutateAsync({
        productId,
        quantity: 1
      })
      
      toast({
        title: "Produto adicionado!",
        description: "O produto foi adicionado ao seu carrinho.",
        variant: "default",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o produto ao carrinho.",
        variant: "destructive",
      })
    }
  }

  return (
    <section className="py-8 md:py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12">
          <span className="text-pink-600">Roupas</span> Emy-by
        </h2>

        <div className="grid lg:grid-cols-12 gap-6 md:gap-8">
          {/* Category Navigation */}
          <aside className="lg:col-span-2">
            <nav className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
              <button
                onClick={() => handleCategoryChange(null)}
                className={`px-4 py-2 text-left font-semibold rounded-lg transition-colors whitespace-nowrap lg:whitespace-normal ${
                  !activeCategory
                    ? "bg-pink-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-pink-100"
                }`}
              >
                Todas as Categorias
              </button>
              
              {loadingCategorias ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              ) : (
                categorias?.map((categoria: any) => (
                  <button
                    key={categoria.id}
                    onClick={() => handleCategoryChange(categoria.slug)}
                    className={`px-4 py-2 text-left font-semibold rounded-lg transition-colors whitespace-nowrap lg:whitespace-normal ${
                      activeCategory === categoria.slug
                        ? "bg-pink-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-pink-100"
                    }`}
                  >
                    {categoria.name}
                  </button>
                ))
              )}
            </nav>
          </aside>

          {/* Products Grid */}
          <div className="lg:col-span-10">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-pink-600" />
              </div>
            ) : produtosExibidos?.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  {selectedCategorySlug 
                    ? "Nenhum produto encontrado nesta categoria." 
                    : "Nenhum produto disponível no momento."
                  }
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {produtosExibidos?.map((product: any) => (
                  console.log("product", product),
                  <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <img 
                      src={getImageUrl(product.imageUrl)} 
                      alt={product.name} 
                      className="w-full h-48 md:h-64 object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg"
                      }}
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-pink-600 mb-2">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 mb-3 text-sm md:text-base">
                        {product.description}
                      </p>
                      <p className="text-lg md:text-xl font-bold text-gray-800 mb-4">
                        R$ {Number(product.price).toFixed(2).replace('.', ',')}
                      </p>
                      <Button 
                        className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold"
                        onClick={() => handleAddToCart(product.id)}
                        disabled={addToCartMutation.isPending}
                      >
                        {addToCartMutation.isPending ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Adicionando...
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            {isLoggedIn ? "Adicionar ao Carrinho" : "Fazer Login"}
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
} 