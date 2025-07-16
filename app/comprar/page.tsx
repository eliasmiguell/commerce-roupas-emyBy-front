import { Suspense } from "react"
import CompraForm from "@/components/compra-form"

export default function ComprarPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50">
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando formulário de compra...</p>
          </div>
        </div>
      }>
        <CompraForm />
      </Suspense>
    </div>
  )
}
