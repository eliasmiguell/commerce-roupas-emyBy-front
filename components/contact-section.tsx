"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Facebook, Instagram, MessageCircle, MapPin, ThumbsUp } from "lucide-react"
import Link from "next/link"
import { API_ENDPOINTS } from "@/lib/config"

export default function ContactSection() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    mensagem: "",
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccess("")
    setError("")
    try {
      const res = await fetch(API_ENDPOINTS.CONTACT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (res.ok) {
        setSuccess(data.message || "Mensagem enviada com sucesso!")
        setFormData({ nome: "", email: "", telefone: "", mensagem: "" })
      } else {
        setError(data.error || "Erro ao enviar mensagem.")
      }
    } catch (err) {
      setError("Erro ao enviar mensagem. Tente novamente mais tarde.")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <section className="py-8 md:py-16 bg-gradient-to-br from-pink-50 to-rose-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <h2
            className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Fale <span className="text-pink-600">conosco</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 md:gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              <div>
                <Label htmlFor="nome" className="text-sm font-semibold text-pink-600">
                  Nome:
                </Label>
                <Input
                  type="text"
                  id="nome"
                  name="nome"
                  placeholder="Digite seu nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                  className="mt-1 border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-sm font-semibold text-pink-600">
                  E-mail:
                </Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Digite seu E-mail"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-1 border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                />
              </div>

              <div>
                <Label htmlFor="telefone" className="text-sm font-semibold text-pink-600">
                  Telefone (opcional):
                </Label>
                <Input
                  type="tel"
                  id="telefone"
                  name="telefone"
                  placeholder="Digite seu telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  className="mt-1 border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                />
              </div>

              <div>
                <Label htmlFor="mensagem" className="text-sm font-semibold text-pink-600">
                  Mensagem:
                </Label>
                <Textarea
                  id="mensagem"
                  name="mensagem"
                  placeholder="Sua mensagem"
                  value={formData.mensagem}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="mt-1 border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                />
              </div>

              <Button
                type="submit"
                style={{ backgroundColor: '#811B2D' }} 
                className="w-full md:w-auto hover:bg-pink-700 text-white font-semibold px-8 py-3"
                disabled={loading}
              >
                {loading ? "Enviando..." : "Enviar"}
              </Button>
              {success && <p className="text-green-600 font-semibold mt-2">{success}</p>}
              {error && <p className="text-red-600 font-semibold mt-2">{error}</p>}
            </form>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-5 space-y-6 md:space-y-8">
            {/* Social Media */}
            <div>
              <h3 className="text-lg md:text-xl font-bold text-pink-600 mb-4 flex items-center">
                <ThumbsUp className="h-5 w-5 mr-2" />
                Redes <span className="ml-1">sociais</span>
              </h3>
              <div className="flex space-x-4">
                <Link
                  href="https://m.facebook.com/profile.php?id=100004604200316"
                  target="_blank"
                  className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
                >
                  <Facebook className="h-6 w-6" />
                </Link>
                <Link
                  href="https://instagram.com/emy_by_esterfanny?igshid=YmMyMTA2M2Y="
                  target="_blank"
                  className="w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center text-white hover:bg-pink-700 transition-colors"
                >
                  <Instagram className="h-6 w-6" />
                </Link>
                <Link
                  href="https://api.whatsapp.com/send/?phone=5585992245116&text&type=phone_number&app_absent=0"
                  target="_blank"
                  className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white hover:bg-green-700 transition-colors"
                >
                  <MessageCircle className="h-6 w-6" />
                </Link>
              </div>
            </div>

            {/* Address */}
            <div>
              <h3 className="text-lg md:text-xl font-bold text-pink-600 mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Endereço
              </h3>
              <address className="text-gray-700 not-italic">
                Rua José Moreira; Centro nº 26
                <br />
                Enfrente a praça - Ceará - CE
              </address>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
