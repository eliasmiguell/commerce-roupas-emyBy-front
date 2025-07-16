import Header from "@/components/header"
import HeroCarousel from "@/components/hero-carousel"
import AboutSection from "@/components/about-section"
import FeaturedProducts from "@/components/featured-products"
import NewArrivals from "@/components/new-arrivals" // Novo componente
import Footer from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroCarousel />
        <AboutSection />
        <FeaturedProducts />
        <NewArrivals /> {/* Nova seção */}
      </main>
      <Footer />
    </div>
  )
}
