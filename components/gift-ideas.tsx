import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Gift, Heart, Star } from "lucide-react"

const giftCategories = [
  {
    icon: <Gift className="h-10 w-10 text-pink-600" />,
    title: "Presentes para Ela",
    description: "Surpreenda com acessórios que ela vai amar.",
    href: "/acessorios", // Redireciona para a página de acessórios
  },
  {
    icon: <Heart className="h-10 w-10 text-pink-600" />,
    title: "Ocasiões Especiais",
    description: "Peças únicas para momentos inesquecíveis.",
    href: "/acessorios", // Redireciona para a página de acessórios
  },
  {
    icon: <Star className="h-10 w-10 text-pink-600" />,
    title: "Mais Vendidos",
    description: "Descubra os acessórios favoritos das nossas clientes.",
    href: "/acessorios", // Redireciona para a página de acessórios
  },
]

export default function GiftIdeas() {
  return (
    <section className="py-16 bg-gradient-to-br from-pink-50 to-rose-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2
            className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Ideias de <span className="text-pink-600">Presentes</span>
          </h2>
          <p className="text-lg text-gray-600">Encontre o acessório perfeito para presentear quem você ama.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {giftCategories.map((category, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="flex justify-center mb-4">{category.icon}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2" style={{ fontFamily: "Playfair Display, serif" }}>
                {category.title}
              </h3>
              <p className="text-gray-600 mb-4">{category.description}</p>
              <Link href={category.href}>
                <Button style={{ backgroundColor: '#811B2D' }}  className="w-full  hover:bg-pink-700 text-white font-semibold">Ver Opções</Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
