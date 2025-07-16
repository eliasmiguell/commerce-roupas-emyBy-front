"use client"

import { useState } from "react"
import { Menu, X, Home, ShoppingCart, MessageCircle, Shirt,Gem,
  MessageSquare, } from "lucide-react";
  import { FaShoePrints } from "react-icons/fa";
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <header style={{ backgroundColor: '#811B2D' }} className="sticky top-0 z-50 backdrop-blur-sm shadow-md">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3" onClick={closeMenu}>
            
            <img src="imagens/logo-loja.png" alt="logo-loja" className="w-[60px] h-[60px]"/>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link
              href="/"
              className={`flex items-center space-x-2 transition-colors ${
                isActive("/") ? "text-pink-600" : "text-white hover:text-pink-600"
              }`}
            >
              <Home className="h-5 w-5" />
              <span>Loja</span>
            </Link>
            <Link
              href="/roupas"
              className={`flex items-center space-x-2 transition-colors ${
                isActive("/roupas") ? "text-pink-600" : "text-white hover:text-pink-600"
              }`}
            >
             <Shirt size={18} /> 
              <span>Roupas</span>
            </Link>
            <Link
              href="/calcados"
              className={`flex items-center space-x-2 transition-colors ${
                isActive("/calcados") ? "text-pink-600" : "text-white hover:text-pink-600"
              }`}
            >
              <FaShoePrints size={18} />
              <span>Calçados</span>
            </Link>
            <Link
              href="/acessorios"
              className={`flex items-center space-x-2 transition-colors ${
                isActive("/acessorios") ? "text-pink-600" : "text-white hover:text-pink-600"
              }`}
            >
              <Gem size={18} /> 
              <span>Acessórios</span>
            </Link>
            <Link
              href="/contato"
              className={`flex items-center space-x-2 transition-colors ${
                isActive("/contato") ? "text-pink-600" : "text-white hover:text-pink-600"
              }`}
            >
              <MessageSquare size={18} /> 
              <span>Fale Conosco</span>
            </Link>
            <Link
              href="/carrinho"
              className={`flex items-center space-x-2 transition-colors ${
                isActive("/carrinho") ? "text-pink-600" : "text-white hover:text-pink-600"
              }`}
            >
              <ShoppingCart className="h-6 w-6" />
            </Link>
            <Link
              href="/login"
              className={`flex items-center space-x-2 transition-colors ${
                isActive("/login") ? "text-pink-600" : "text-white hover:text-pink-600"
              }`}
            >
              <span>Entrar</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={toggleMenu}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </nav>

        {/* Mobile Navigation Menu */}
        <div
          className={`lg:hidden fixed inset-0 top-[73px] bg-white z-40 transform transition-transform duration-300 ease-in-out ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full">
            <div className="flex-1 px-4 py-8 space-y-6">
              <Link
                href="/"
                onClick={closeMenu}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  isActive("/") ? "bg-pink-100 text-pink-600" : "text-white hover:bg-gray-100"
                }`}
              >
                <Home className="h-6 w-6" />
                <span className="text-lg font-medium">Loja</span>
              </Link>
              <Link
                href="/roupas"
                onClick={closeMenu}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  isActive("/roupas") ? "bg-pink-100 text-pink-600" : "text-white hover:bg-gray-100"
                }`}
              >
                <span className="text-2xl">👗</span>
                <span className="text-lg font-medium">Roupas</span>
              </Link>
              <Link
                href="/calcados"
                onClick={closeMenu}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  isActive("/calcados") ? "bg-pink-100 text-pink-600" : "text-white hover:bg-gray-100"
                }`}
              >
                <span className="text-2xl">👠</span>
                <span className="text-lg font-medium">Calçados</span>
              </Link>
              <Link
                href="/acessorios"
                onClick={closeMenu}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  isActive("/acessorios") ? "bg-pink-100 text-pink-600" : "text-white hover:bg-gray-100"
                }`}
              >
                <span className="text-2xl">💍</span>
                <span className="text-lg font-medium">Acessórios</span>
              </Link>
              <Link
                href="/contato"
                onClick={closeMenu}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  isActive("/contato") ? "bg-pink-100 text-pink-600" : "text-white hover:bg-gray-100"
                }`}
              >
                <MessageCircle className="h-6 w-6" />
                <span className="text-lg font-medium">Fale Conosco</span>
              </Link>
              <Link
                href="/carrinho"
                onClick={closeMenu}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  isActive("/carrinho") ? "bg-pink-100 text-pink-600" : "text-white hover:bg-gray-100"
                }`}
              >
                <ShoppingCart className="h-6 w-6" />
                <span className="text-lg font-medium">Carrinho</span>
              </Link>
              <Link
                href="/login"
                onClick={closeMenu}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  isActive("/login") ? "bg-pink-100 text-pink-600" : "text-white hover:bg-gray-100"
                }`}
              >
                <span className="text-xl">👤</span>
                <span className="text-lg font-medium">Entrar</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && <div className="lg:hidden fixed inset-0 bg-black/50 z-30" onClick={closeMenu} />}
      </div>
    </header>
  )
}
