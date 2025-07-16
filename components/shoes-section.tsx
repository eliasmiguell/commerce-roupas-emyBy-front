"use client"

import { useState } from "react"
import ProductCard from "./product-card"

const shoesCategories = {
  sapatos: [
    {
      image: "/placeholder.svg?height=300&width=250",
      title: "Sapato para casamentos",
      description: "Sapato Bege",
      price: "R$ 300,00",
      sizes: ["36", "37"],
    },
    {
      image: "/placeholder.svg?height=300&width=250",
      title: "Sapato para casamentos",
      description: "Sapato Branco",
      price: "R$ 350,00",
      sizes: ["37", "39"],
    },
    {
      image: "/placeholder.svg?height=300&width=250",
      title: "Sapato cinza",
      description: "Sapato elegante",
      price: "R$ 400,00",
      sizes: ["35", "37", "38", "39"],
    },
  ],
  tenis: [
    {
      image: "/placeholder.svg?height=300&width=250",
      title: "Tênis Nike",
      description: "Confortável e estiloso",
      price: "R$ 300,00",
      sizes: ["36", "37", "40"],
    },
    {
      image: "/placeholder.svg?height=300&width=250",
      title: "Tênis Adidas",
      description: "Qualidade Adidas",
      price: "R$ 350,00",
      sizes: ["37", "39", "40", "41"],
    },
    {
      image: "/placeholder.svg?height=300&width=250",
      title: "Tênis Puma",
      description: "Tênis Puma Vermelho",
      price: "R$ 350,00",
      sizes: ["35", "37", "39", "42"],
    },
  ],
  sandalias: [
    {
      image:
        "https://boutiquedassi.fbitsstatic.net/img/p/sandalia-rute-81693/301956-1.jpg?w=600&h=800&v=no-change&qs=ignore",
      title: "Sandália Rute",
      description: "Sandália elegante",
      price: "R$ 125,00",
      sizes: ["36", "37", "40"],
    },
    {
      image:
        "https://a-static.mlcdn.com.br/800x560/sandalia-salto-sandalha-tira-sandalha-moda-sandalha-verao-misslis/misslis/7d5076c041e311ed867b4201ac185019/77cf9a8ff5198cc414d891968876a349.jpeg",
      title: "Sandália Verão",
      description: "Salto Sandália Verão",
      price: "R$ 150,00",
      sizes: ["37", "39", "40", "41"],
    },
    {
      image:
        "https://img1.wsimg.com/isteam/ip/3a9eb2b2-580d-44cc-a8c8-9c01b580ee7f/ols/36-006.1.jpg/:/rs=w:1200,h:1200",
      title: "Sandália Anabela",
      description: "Sandália confortável",
      price: "R$ 90,00",
      sizes: ["35", "37", "39", "42"],
    },
  ],
}

export default function ShoesSection() {
  const [activeCategory, setActiveCategory] = useState("sapatos")

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
              {Object.keys(shoesCategories).map((category) => (
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {shoesCategories[activeCategory as keyof typeof shoesCategories].map((product, index) => (
                <ProductCard
                  key={index}
                  image={product.image}
                  title={product.title}
                  description={product.description}
                  price={product.price}
                  sizes={product.sizes}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
