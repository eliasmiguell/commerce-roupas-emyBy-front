"use client"

import { useState } from "react"
import ProductCard from "./product-card"

const accessoriesCategories = {
  relogios: [
    {
      image:
        "https://d2r9epyceweg5n.cloudfront.net/stores/754/485/products/lrgj138l-kz511-26351753f5637bafc016345825233105-1024-1024.png",
      title: "Kit relógio Lice",
      description: "Kit completo com relógio e pulseiras",
      price: "R$ 400,00",
      sizes: [],
    },
    {
      image: "https://images.tcdn.com.br/img/img_prod/555399/3857_0_20200229141847.jpg",
      title: "Kit relógio HTS",
      description: "Kit relógio elegante",
      price: "R$ 250,00",
      sizes: [],
    },
    {
      image: "https://zionstorerj.com.br/wp-content/uploads/2021/04/Screenshot_2-2.png",
      title: "Kit relógio Zions",
      description: "Kit relógio premium",
      price: "R$ 350,00",
      sizes: [],
    },
  ],
  colares: [
    {
      image:
        "https://d3ugyf2ht6aenh.cloudfront.net/stores/001/296/390/products/whatsapp-image-2023-02-07-at-13-01-331-46de0e2c1ffea4cfb916759659039393-480-0.webp",
      title: "Colar Dourado",
      description: "Colar elegante dourado",
      price: "R$ 150,00",
      sizes: [],
    },
    {
      image: "https://i.pinimg.com/474x/52/d3/db/52d3dbb7279b833b73a6ce2a4aa8ce0a.jpg",
      title: "Colar de Ouro",
      description: "Colar de ouro premium",
      price: "R$ 1000,00",
      sizes: [],
    },
  ],
}

export default function AccessoriesSection() {
  const [activeCategory, setActiveCategory] = useState("relogios")

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
              {Object.keys(accessoriesCategories).map((category) => (
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
              {accessoriesCategories[activeCategory as keyof typeof accessoriesCategories].map((product, index) => (
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
