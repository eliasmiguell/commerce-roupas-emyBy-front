"use client"

import { useState, useEffect } from "react"
import { Menu, X, Home, ShoppingCart, MessageCircle, Shirt,Gem,
  MessageSquare,
  LogOut, Settings, Crown, Package, } from "lucide-react";
  import { FaShoePrints } from "react-icons/fa";
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useCartItems } from "@/lib/cartService";
import AdminNotification from "./AdminNotification";
import { API_ENDPOINTS } from "@/lib/config";
import { useAuth } from "@/hooks/use-auth";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [userName, setUserName] = useState("")
  const [showAdminNotification, setShowAdminNotification] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { isAuthenticated, user, logout } = useAuth()
  const { data: cartData } = useCartItems()

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        if (isAuthenticated && user) {
          const isUserAdmin = user.role === "ADMIN"
          setIsAdmin(isUserAdmin)
          setUserName(user.name)
          
          // Mostrar notificação se for admin
          if (isUserAdmin) {
            setShowAdminNotification(true)
            // Auto-hide após 8 segundos
            setTimeout(() => setShowAdminNotification(false), 8000)
          }
        }
      } catch (error) {
        console.error("Erro ao verificar status de admin:", error)
      }
    }

    checkAdminStatus()

    // Cleanup function para restaurar overflow
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
    // Prevenir scroll quando menu estiver aberto
    if (!isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }
  const handleLogout = () => {
    console.log('Header - Logout clicado')
    logout()
    // Redirecionar manualmente para login após logout
    router.push('/login')
  }
  const closeMenu = () => {
    setIsMenuOpen(false)
    document.body.style.overflow = 'unset'
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
            
            <img src="/imagens/logo-loja.png" alt="logo-loja" className="w-[80px] h-[60px]"/>
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
              href="/colecoes"
              className={`flex items-center space-x-2 transition-colors ${
                isActive("/colecoes") ? "text-pink-600" : "text-white hover:text-pink-600"
              }`}
            >
              <span className="text-lg">🛍️</span>
              <span>Coleções</span>
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
              <span>Contato</span>
            </Link>
            <Link
              href="/carrinho"
              className={`flex items-center space-x-2 transition-colors relative ${
                isActive("/carrinho") ? "text-pink-600" : "text-white hover:text-pink-600"
              }`}
            >
              <ShoppingCart className="h-6 w-6" />
              {cartData?.count && cartData.count > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartData.count}
                </span>
              )}
            </Link>
            {isAuthenticated && !isAdmin && (
              <Link
                href="/meus-pedidos"
                onClick={() => console.log('Link Meus Pedidos clicado - Desktop')}
                className={`flex items-center space-x-2 transition-colors ${
                  isActive("/meus-pedidos") ? "text-pink-600" : "text-white hover:text-pink-600"
                }`}
              >
                <Package className="h-5 w-5" />
                <span>Meus Pedidos</span>
              </Link>
            )}
            
            {/* Indicador de Admin */}
            {/* {isAdmin && (
              <div className="flex items-center space-x-2 text-yellow-400">
                <Crown className="h-5 w-5" />
                <span className="text-sm font-medium">Admin</span>
              </div>
            )}
             */}

            {/* Seção do usuário logado - Desktop */}
            {isAuthenticated && user && (
              <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 ">
                <div className="w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center">
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-pink-600 text-sm font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-white">{user.name.split(" ")[0]}</p>
                  {isAdmin && (
                    <div className="flex items-center space-x-1">
                      <Crown className="h-3 w-3 text-yellow-400" />
                      <span className="text-xs text-yellow-40s0">Admin</span>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {isAdmin && (
              <Link
                href="/admin"
                className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Settings className="h-5 w-5" />
                <span>Painel Admin</span>
              </Link>
            )}
              <Button
                onClick={handleLogout}
                variant='ghost'
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  isActive("/login") ? "bg-pink-100 text-pink-600" : "text-white hover:bg-gray-100"
                }`}
              >
                <LogOut className="h-6 w-6" />
                <span className="text-lg font-medium">Sair</span>
              </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button 
            size="icon" 
            className="lg:hidden text-white hover:bg-white/30 bg-white/20 backdrop-blur-sm rounded-lg p-2 border border-white/20" 
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </nav>

        {/* Mobile Navigation Menu */}
        <div
          className={`lg:hidden fixed inset-0 top-[73px] bg-white shadow-2xl z-40 transform transition-transform duration-300 ease-in-out ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          style={{ backgroundColor: 'white' }}
        >
          <div className="flex flex-col h-full bg-white">
            {/* Seção do usuário logado */}
            {isAuthenticated && user && (
              <div className="px-4 py-6 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                    {user.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-pink-600 text-lg font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    {isAdmin && (
                      <div className="flex items-center space-x-1 mt-1">
                        <Crown className="h-4 w-4 text-yellow-500" />
                        <span className="text-xs text-yellow-600 font-medium">Administrador</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex-1 px-4 py-8 space-y-4 bg-white">
              <Link
                href="/"
                onClick={closeMenu}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  isActive("/") ? "bg-pink-100 text-pink-600" : "text-gray-800 hover:bg-gray-100"
                }`}
              >
                <Home className="h-6 w-6" />
                <span className="text-lg font-medium">Loja</span>
              </Link>
              <Link
                href="/colecoes"
                onClick={closeMenu}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  isActive("/colecoes") ? "bg-pink-100 text-pink-600" : "text-gray-800 hover:bg-gray-100"
                }`}
              >
                <span className="text-xl">🛍️</span>
                <span className="text-lg font-medium">Coleções</span>
              </Link>
              <Link
                href="/roupas"
                onClick={closeMenu}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  isActive("/roupas") ? "bg-pink-100 text-pink-600" : "text-gray-800 hover:bg-gray-100"
                }`}
              >
                <Shirt className="h-6 w-6" />
                <span className="text-lg font-medium">Roupas</span>
              </Link>
              <Link
                href="/calcados"
                onClick={closeMenu}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  isActive("/calcados") ? "bg-pink-100 text-pink-600" : "text-gray-800 hover:bg-gray-100"
                }`}
              >
                <FaShoePrints className="h-6 w-6" />
                <span className="text-lg font-medium">Calçados</span>
              </Link>
              <Link
                href="/acessorios"
                onClick={closeMenu}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  isActive("/acessorios") ? "bg-pink-100 text-pink-600" : "text-gray-800 hover:bg-gray-100"
                }`}
              >
                <Gem className="h-6 w-6" />
                <span className="text-lg font-medium">Acessórios</span>
              </Link>
              <Link
                href="/contato"
                onClick={closeMenu}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  isActive("/contato") ? "bg-pink-100 text-pink-600" : "text-gray-800 hover:bg-gray-100"
                }`}
              >
                <MessageCircle className="h-6 w-6" />
                <span className="text-lg font-medium">Fale Conosco</span>
              </Link>
              <Link
                href="/carrinho"
                onClick={closeMenu}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors relative ${
                  isActive("/carrinho") ? "bg-pink-100 text-pink-600" : "text-gray-800 hover:bg-gray-100"
                }`}
              >
                <ShoppingCart className="h-6 w-6" />
                <span className="text-lg font-medium">Carrinho</span>
                {cartData?.count && cartData.count > 0 && (
                  <span className="absolute top-2 right-2 bg-pink-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartData.count}
                  </span>
                )}
              </Link>
              
              {/* Link para Meus Pedidos - Mobile */}
              {isAuthenticated && !isAdmin && (
                <Link
                  href="/meus-pedidos"
                  onClick={() => {
                    console.log('Link Meus Pedidos clicado - Mobile')
                    closeMenu()
                  }}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    isActive("/meus-pedidos") ? "bg-pink-100 text-pink-600" : "text-gray-800 hover:bg-gray-100"
                  }`}
                >
                  <Package className="h-6 w-6" />
                  <span className="text-lg font-medium">Meus Pedidos</span>
                </Link>
              )}
              
              {/* Indicador de Admin no Mobile */}
              {isAdmin && (
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-yellow-500/20 text-yellow-600 border border-yellow-400/30">
                  <Crown className="h-6 w-6" />
                  <span className="text-lg font-medium">Administrador</span>
                </div>
              )}
              
              {/* Botão Admin no Mobile */}
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={closeMenu}
                  className="flex items-center space-x-3 p-3 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold transition-colors"
                >
                  <Settings className="h-6 w-6" />
                  <span className="text-lg font-medium">Painel Admin</span>
                </Link>
              )}
              <Button
                onClick={handleLogout}
                variant='ghost'
                className="flex items-center space-x-3 p-3 rounded-lg transition-colors text-gray-800 hover:bg-gray-100 w-full justify-start"
              >
                <LogOut className="h-6 w-6" />
                <span className="text-lg font-medium">Sair</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-black/20 z-30" 
            onClick={closeMenu}
            style={{ top: '73px' }}
          />
        )}
      </div>
      
      {/* Admin Notification */}
      <AdminNotification 
        isVisible={showAdminNotification} 
        onClose={() => setShowAdminNotification(false)} 
      />
    </header>
  )
}
