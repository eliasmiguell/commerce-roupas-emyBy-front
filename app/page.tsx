import Header from "@/components/header"
import HeroCarousel from "@/components/hero-carousel"
import AboutSection from "@/components/about-section"
import FeaturedProducts from "@/components/featured-products"
import NewArrivals from "@/components/new-arrivals" // Novo componente
import ShopByStyle from "@/components/shop-by-style"
import Footer from "@/components/footer"
import ProtectedRoute from "@/components/ProtectedRoute"


import FinalAdminButton from "@/components/FinalAdminButton"
import UltimateAdminButton from "@/components/UltimateAdminButton"


export default function HomePage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        <Header />
        <main>
          <HeroCarousel />
          <AboutSection />
          <FeaturedProducts />
          <ShopByStyle />
          <NewArrivals /> {/* Nova seção */}
        </main>
        <Footer />
       
        <FinalAdminButton />
        <UltimateAdminButton />
      </div>
    </ProtectedRoute>
  )
}
