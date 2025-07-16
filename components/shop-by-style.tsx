"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

const styles = [
  {
    name: "Casual Chic",
    image: "/placeholder.svg?height=300&width=400",
    description: "Conforto e elegância para o dia a dia.",
    href: "/roupas", // Redireciona para a página de roupas
  },
  {
    name: "Festa & Eventos",
    image: "/placeholder.svg?height=300&width=400",
    description: "Brilhe em qualquer celebração com peças deslumbrantes.",
    href: "/roupas", // Redireciona para a página de roupas
  },
  {
    name: "Trabalho & Profissional",
    image: "/placeholder.svg?height=300&width=400",
    description: "Looks sofisticados para o ambiente corporativo.",
    href: "/roupas", // Redireciona para a página de roupas
  },
]

export default function ShopByStyle() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2
            className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Compre por <span className="text-pink-600">Estilo</span>
          </h2>
          <p className="text-lg text-gray-600">Encontre o look perfeito para cada ocasião.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {styles.map((style, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <img src={style.image || "/placeholder.svg"} alt={style.name} className="w-full h-48 object-cover" />
              <div className="p-4 text-center">
                <h3 className="text-xl font-bold text-pink-600 mb-2" style={{ fontFamily: "Playfair Display, serif" }}>
                  {style.name}
                </h3>
                <p className="text-gray-600 mb-4">{style.description}</p>
                <Link href={style.href}>
                  <Button className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold">Ver Coleção</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
