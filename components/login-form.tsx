"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, ShoppingBag, Facebook, Instagram, MessageCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

import { useRouter } from "next/navigation"
import { API_ENDPOINTS } from "@/lib/config"
import { useAuth } from "@/hooks/use-auth"


export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const router = useRouter()
  const { login } = useAuth()

  useEffect(() => {
    // Verificar se há mensagem de sucesso na URL
    const urlParams = new URLSearchParams(window.location.search)
    const message = urlParams.get('message')
    if (message) {
      setSuccessMessage(message)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch(API_ENDPOINTS.LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      console.log("Resposta do login:", data)
      if (!res.ok) {
        setError(data.error || "Erro ao fazer login")
        setLoading(false)
        return
      }
      console.log('LoginForm - Login bem-sucedido, chamando login hook')
      // Usar o hook de autenticação para fazer login
      login(data.token, data.user)
    } catch (err) {
      console.error("Erro no login:", err)
      setError("Erro de conexão com o servidor")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Back to home button */}
      {/* <Link
        href="/"
        className="fixed top-4 left-4 z-10 flex items-center space-x-2 text-gray-600 hover:text-pink-600 transition-colors bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Voltar à loja</span>
      </Link> */}

      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding */}
        <div className="hidden lg:block space-y-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-3 mb-8">
            <img src="imagens/logo-loja.png" alt="logo-loja" className="w-[70px] h-[70px] rounded-md"/>
             
            </div>
            <h2 className="text-3xl font-bold text-gray-800" style={{ fontFamily: "Playfair Display, serif" }}>
              Bem-vinda de volta!
            </h2>
            <p className="text-lg text-gray-600">
              Invista em <span className="text-pink-600 font-semibold text-xl">Você</span> com mais frequência
            </p>
          </div>

          {/* Store highlights */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl">👗</span>
              </div>
              <h3 className="font-semibold text-gray-800">Roupas</h3>
              <p className="text-sm text-gray-600">Vestidos, blusas, saias</p>
            </div>
            <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl">👠</span>
              </div>
              <h3 className="font-semibold text-gray-800">Calçados</h3>
              <p className="text-sm text-gray-600">Sapatos, tênis, sandálias</p>
            </div>
            <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl">💍</span>
              </div>
              <h3 className="font-semibold text-gray-800">Acessórios</h3>
              <p className="text-sm text-gray-600">Relógios, colares</p>
            </div>
            <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="font-semibold text-gray-800">Estilo</h3>
              <p className="text-sm text-gray-600">Beleza e elegância</p>
            </div>
          </div>

          {/* Social links */}
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Siga-nos nas redes sociais</h3>
            <div className="flex justify-center space-x-4">
              <Link
                href="https://m.facebook.com/profile.php?id=100004604200316"
                target="_blank"
                className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="https://instagram.com/emy_by_esterfanny?igshid=YmMyMTA2M2Y="
                target="_blank"
                className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center text-white hover:bg-pink-700 transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="https://api.whatsapp.com/send/?phone=5585992245116&text&type=phone_number&app_absent=0"
                target="_blank"
                className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white hover:bg-green-700 transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="w-full max-w-md mx-auto">
          <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center space-y-4">
              <div className="lg:hidden flex items-center justify-center space-x-3 mb-4">
              <img src="imagens/logo-loja.png" alt="logo-loja" className="w-[70px] h-[70px] rounded-md"/>
              </div>
              <CardTitle className="text-2xl font-bold text-gray-800" style={{ fontFamily: "Playfair Display, serif" }}>
                Entrar na sua conta
              </CardTitle>
              <CardDescription className="text-gray-600">Acesse sua conta para continuar comprando</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                    E-mail
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Digite seu e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                    Senha
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Digite sua senha"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="border-gray-300 focus:border-pink-500 focus:ring-pink-500 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 text-sm">
                    <input type="checkbox" className="rounded border-gray-300 text-pink-600 focus:ring-pink-500" />
                    <span className="text-gray-600">Lembrar de mim</span>
                  </label>
                  <Link href="#" className="text-sm text-pink-600 hover:text-pink-700 font-medium">
                    Esqueceu a senha?
                  </Link>
                </div>
                {successMessage && (
                  <div className="text-green-600 text-sm font-semibold text-center bg-green-50 p-3 rounded-lg border border-green-200">
                    {successMessage}
                  </div>
                )}
                {error && (
                  <div className="text-red-600 text-sm font-semibold text-center bg-red-50 p-3 rounded-lg border border-red-200">
                    {error}
                  </div>
                )}
                <Button
                  type="submit"
                  style={{ backgroundColor: '#811B2D' }}
                  className="w-full   text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                  disabled={loading}
                >
                  {loading ? "Entrando..." : "Entrar"}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Ou</span>
                </div>
              </div>
              <div className="space-y-3 text-center bg-gray-200 p-1 rounded-lg">Para melhor experiência e visualização, utilize o dispositivo desktop ou tablet</div>

              {/* <div className="space-y-3">
                <Button variant="outline" className="w-full border-gray-300 hover:bg-gray-50 bg-transparent">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continuar com Google
                </Button>
                <Button variant="outline" className="w-full border-gray-300 hover:bg-gray-50 bg-transparent">
                  <Facebook className="w-5 h-5 mr-2 text-blue-600" />
                  Continuar com Facebook
                </Button>
              </div> */}

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Não tem uma conta?{" "}
                  <Link href="/cadastro" className="text-pink-600 hover:text-pink-700 font-medium">
                    Cadastre-se
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Mobile social links */}
          <div className="lg:hidden mt-8 text-center space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Siga-nos nas redes sociais</h3>
            <div className="flex justify-center space-x-4">
              <Link
                href="https://m.facebook.com/profile.php?id=100004604200316"
                target="_blank"
                className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="https://instagram.com/emy_by_esterfanny?igshid=YmMyMTA2M2Y="
                target="_blank"
                className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center text-white hover:bg-pink-700 transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="https://api.whatsapp.com/send/?phone=5585992245116&text&type=phone_number&app_absent=0"
                target="_blank"
                className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white hover:bg-green-700 transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

