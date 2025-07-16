import Header from "@/components/header"
import AccessoriesSection from "@/components/accessories-section"
import GiftIdeas from "@/components/gift-ideas" // Novo componente
import Footer from "@/components/footer"

export default function AcessoriosPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-8">
        <div className="container mx-auto px-4 mb-12 text-center">
          <h2
            className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Realce seu estilo com nossos <span className="text-pink-600">Acessórios</span>
          </h2>
          <p className="text-lg text-gray-600">Detalhes que fazem toda a diferença no seu look.</p>
        </div>
        <AccessoriesSection />
        <GiftIdeas /> {/* Nova seção */}
      </main>
      <Footer />
    </div>
  )
}
