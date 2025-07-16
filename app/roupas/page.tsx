import Header from "@/components/header"
import ClothingSection from "@/components/clothing-section"
import ShopByStyle from "@/components/shop-by-style" // Novo componente
import Footer from "@/components/footer"

export default function RoupasPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-8">
        <div className="container mx-auto px-4 mb-12 text-center">
          <h2
            className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Explore nossa coleção de <span className="text-pink-600">Roupas</span>
          </h2>
          <p className="text-lg text-gray-600">
            Descubra as últimas tendências e peças essenciais para o seu guarda-roupa.
          </p>
        </div>
        <ClothingSection />
        <ShopByStyle /> {/* Nova seção */}
      </main>
      <Footer />
    </div>
  )
}
