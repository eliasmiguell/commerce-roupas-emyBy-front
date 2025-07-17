import LoginForm from "@/components/login-form"
import PublicRoute from "@/components/PublicRoute"

export default function LoginPage() {
  return (
    <PublicRoute>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50">
        <LoginForm />
      </div>
    </PublicRoute>
  )
}
