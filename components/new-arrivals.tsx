import Link from "next/link"
import { Button } from "@/components/ui/button"
import ProductCard from "./product-card"

const newProducts = [
  {
    image: "/placeholder.svg?height=300&width=250",
    title: "Blusa de Seda Elegante",
    description: "Perfeita para qualquer ocasião, toque suave.",
    price: "R$ 95,00",
    sizes: ["P", "M", "G"],
  },
  {
    image: "/placeholder.svg?height=300&width=250",
    title: "Sandália de Salto Fino",
    description: "Conforto e elegância para seus pés.",
    price: "R$ 180,00",
    sizes: ["35", "36", "37"],
  },
  {
    image:
      "https://d3ugyf2ht6aenh.cloudfront.net/stores/001/296/390/products/whatsapp-image-2023-02-07-at-13-01-331-46de0e2c1ffea4cfb916759659039393-480-0.webp",
    title: "Colar de Pérolas Clássico",
    description: "Um toque de sofisticação para seu pescoço.",
    price: "R$ 120,00",
    sizes: [],
  },
]

export default function NewArrivals() {
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newProducts.map((product, index) => (
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

        <div className="text-center mt-12">
          <Link href="/roupas">
            <Button className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 text-lg font-semibold">
              Ver todas as novidades
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
