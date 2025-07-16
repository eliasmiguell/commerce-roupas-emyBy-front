import Link from "next/link"
import { Button } from "@/components/ui/button"

const featuredCategories = [
  {
    title: "Roupas",
    description: "Vestidos, blusas, saias e calças",
    image: "/placeholder.svg?height=300&width=400",
    href: "/roupas",
    emoji: "👗",
  },
  {
    title: "Calçados",
    description: "Sapatos, tênis e sandálias",
    image: "/placeholder.svg?height=300&width=400",
    href: "/calcados",
    emoji: "👠",
  },
  {
    title: "Acessórios",
    description: "Relógios, colares e mais",
    image: "/placeholder.svg?height=300&width=400",
    href: "/acessorios",
    emoji: "💍",
  },
]

export default function FeaturedProducts() {
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
          {featuredCategories.map((category, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="relative h-48 md:h-64">
                <img
                  src={category.image || "/placeholder.svg"}
                  alt={category.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute top-4 left-4 text-3xl md:text-4xl">{category.emoji}</div>
              </div>
              <div className="p-4 md:p-6">
                <h3
                  className="text-xl md:text-2xl font-bold text-gray-800 mb-2"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  {category.title}
                </h3>
                <p className="text-gray-600 mb-4">{category.description}</p>
                <Link href={category.href}>
                  <Button className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold">
                    Ver Produtos
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
