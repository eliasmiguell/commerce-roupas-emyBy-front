import Header from "@/components/header"
import ShoesSection from "@/components/shoes-section"
import CareTips from "@/components/care-tips" // Novo componente
import Footer from "@/components/footer"

export default function CalcadosPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-8">
        <div className="container mx-auto px-4 mb-12 text-center">
          <h2
            className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Encontre o par perfeito de <span className="text-pink-600">Calçados</span>
          </h2>
          <p className="text-lg text-gray-600">Conforto e estilo para cada passo da sua jornada.</p>
        </div>
        <ShoesSection />
        <CareTips /> {/* Nova seção */}
      </main>
      <Footer />
    </div>
  )
}
