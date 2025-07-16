import Header from "@/components/header"
import CartPage from "@/components/cart-page"
import Footer from "@/components/footer"

export default function CarrinhoPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-8">
        <CartPage />
      </main>
      <Footer />
    </div>
  )
}
