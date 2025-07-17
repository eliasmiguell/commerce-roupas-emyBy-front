"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useGetCategorias } from "@/lib/categoriaService"
import { getProdutos } from "@/lib/produtoService"
import { useQuery } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { getImageUrl } from "@/lib/utils"

export default function FeaturedProducts() {
  // Buscar categorias usando hook
  const { data: categoriesData, isLoading, isError } = useGetCategorias()

  // Buscar produtos usando serviço
  const { data: productsData } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProdutos({ limit: 100 }),
    retry: 1,
    staleTime: 0,
  })

  if (isLoading) return (
    <div className="flex justify-center items-center h-64">
      <Loader2 className="animate-spin w-8 h-8 text-pink-600" />
    </div>
  )
  
  if (isError || !categoriesData) return (
    <div className="text-center text-red-500">Erro ao carregar categorias</div>
  )

  // Extrair as categorias dos dados
  const categories = categoriesData || []

  // Agrupar produtos por categoria
  const productsByCategory = (productsData?.data?.products || []).reduce((acc: any, product: any) => {
    const catId = product.category?.id || "outros"
    if (!acc[catId]) acc[catId] = []
    acc[catId].push(product)
    return acc
  }, {})

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2
            className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Nossas <span className="text-pink-600">Categorias</span>
          </h2>
          <p className="text-lg text-gray-600">Descubra nossa coleção completa</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {categories.map((category: any) => (
            <div
              key={category.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="relative h-48 md:h-64">
                <img
                  src={getImageUrl(category.imageUrl)}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute top-4 left-4 text-3xl md:text-4xl">
                  {category.emoji || "🛍️"}
                </div>
              </div>
              <div className="p-4 md:p-6">
                <h3
                  className="text-xl md:text-2xl font-bold text-gray-800 mb-2"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  {category.name}
                </h3>
                <p className="text-gray-600 mb-2">{category.description}</p>
                <div className="mt-4">
                  <div className="grid grid-cols-1 gap-2">
                    {(productsByCategory[category.id] || []).slice(0, 2).map((product: any) => (
                      <div key={product.id} className="flex items-center gap-3">
                        <img 
                          src={getImageUrl(product.imageUrl)} 
                          alt={product.name} 
                          className="w-12 h-12 object-cover rounded" 
                        />
                        <div>
                          <div className="font-semibold text-gray-800">{product.name}</div>
                          <div className="text-pink-600 font-bold">
                            R$ {Number(product.price).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <Link href={`/${category.slug}`} className="block mt-4">
                  <Button className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold">
                    Ver {category.name}
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}