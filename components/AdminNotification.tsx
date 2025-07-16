"use client"

import { useEffect, useState } from "react"
import { Crown, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AdminNotificationProps {
  isVisible: boolean
  onClose: () => void
}

export default function AdminNotification({ isVisible, onClose }: AdminNotificationProps) {
  if (!isVisible) return null

  return (
    <div className="fixed top-20 right-4 z-50 animate-in slide-in-from-right duration-300">
      <div className="bg-yellow-500 text-gray-900 p-4 rounded-lg shadow-lg border border-yellow-600 max-w-sm">
        <div className="flex items-center space-x-3">
          <Crown className="h-6 w-6 text-yellow-700" />
          <div className="flex-1">
            <h3 className="font-semibold text-lg">Bem-vindo, Administrador!</h3>
            <p className="text-sm text-gray-800">
              Você tem acesso ao painel administrativo da loja.
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-700 hover:text-gray-900"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-3 pt-3 border-t border-yellow-600">
          <p className="text-xs text-gray-700">
            Clique no botão "Painel Admin" no cabeçalho para acessar as funcionalidades administrativas.
          </p>
        </div>
      </div>
    </div>
  )
} 