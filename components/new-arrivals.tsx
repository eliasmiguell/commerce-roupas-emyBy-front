"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useQuery } from "@tanstack/react-query"
import { getNovosProdutos } from "@/lib/produtoService"
import ProductCard from "./product-card"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"
import { getImageUrl } from "@/lib/utils"

function NewArrivalCard({ product }: { product: any }) {
  const [selectedSize, setSelectedSize] = useState(product.variants?.[0]?.size || "")
  const router = useRouter()

  const handleBuy = () => {
    try {
      const params = new URLSearchParams({
        title: product.name,
        price: Number(product.price).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
        image: product.imageUrl,
        description: product.description,
        ...(selectedSize && { size: selectedSize }),
      })
      router.push(`/comprar?${params.toString()}`)
    } catch (error) {
      console.error("Erro ao redirecionar para página de compra:", error)
      // Fallback para redirecionamento simples
      window.location.href = `/comprar?title=${encodeURIComponent(product.name)}&price=${encodeURIComponent(Number(product.price).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }))}&image=${encodeURIComponent(product.imageUrl)}&description=${encodeURIComponent(product.description)}${selectedSize ? `&size=${encodeURIComponent(selectedSize)}` : ''}`
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <img src={getImageUrl(product.imageUrl)} alt={product.name} className="w-full h-48 md:h-64 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-bold text-pink-600 mb-2" style={{ fontFamily: "Playfair Display, serif" }}>
          {product.name}
        </h3>
        <p className="text-gray-600 mb-3 text-sm md:text-base">{product.description}</p>
        <p className="text-lg md:text-xl font-bold text-gray-800 mb-4">
          {Number(product.price).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
        </p>
        {product.variants && product.variants.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">Tamanhos:</p>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((variant: any, idx: number) => (
                <label key={idx} className="flex items-center space-x-1">
                  <input
                    type="radio"
                    name={`size-${product.id}`}
                    value={variant.size}
                    checked={selectedSize === variant.size}
                    onChange={() => setSelectedSize(variant.size)}
                    className="text-pink-600 focus:ring-pink-500"
                  />
                  <span className="text-sm">{variant.size}</span>
                </label>
              ))}
            </div>
          </div>
        )}
        <button
          onClick={handleBuy}
          style={{ backgroundColor: '#811B2D' }}
          className="w-full hover:bg-pink-700 text-white font-semibold rounded py-2 mt-2"
        >
          Comprar
        </button>
      </div>
    </div>
  )
}

export default function NewArrivals() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["new-products"],
    queryFn: () => getNovosProdutos(6),
    retry: 1,
    staleTime: 0,
  })

  return (
    <section className="py-16 bg-gradient-to-br from-pink-50 to-rose-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2
            className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Novidades <span className="text-pink-600">Emy-by</span>
          </h2>
          <p className="text-lg text-gray-600">Confira os produtos mais recentes que acabaram de chegar na loja!</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-32 text-pink-600">Carregando...</div>
        ) : isError ? (
          <div className="text-center text-red-500">Erro ao carregar novidades</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(data?.products) && data.products.length > 0 ? (
              data.products.map((product: any) => (
                <NewArrivalCard key={product.id} product={product} />
              ))
            ) : Array.isArray(data?.data?.products) && data.data.products.length > 0 ? (
              data.data.products.map((product: any) => (
                <NewArrivalCard key={product.id} product={product} />
              ))
            ) : Array.isArray(data) && data.length > 0 ? (
              data.map((product: any) => (
                <NewArrivalCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500">
                Nenhuma novidade encontrada
              </div>
            )}
          </div>
        )}

        <div className="text-center mt-12">
          <a href="/roupas">
            <button className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 text-lg font-semibold rounded">
              Ver todas as novidades
            </button>
          </a>
        </div>
      </div>
    </section>
  )
}