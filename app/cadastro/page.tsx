import CadastroForm from "@/components/cadastro-form"
import PublicRoute from "@/components/PublicRoute"

export default function CadastroPage() {
  return (
    <PublicRoute>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50">
        <CadastroForm />
      </div>
    </PublicRoute>
  )
}
