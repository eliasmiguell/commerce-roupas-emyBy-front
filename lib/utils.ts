import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function getImageUrl(imagePath: string | null): string {
  // Se imagePath é null, undefined ou string vazia, retorna placeholder
  if (!imagePath || imagePath === "null" || imagePath === "undefined") {
    return "/placeholder.svg"
  }
  
  // Se já é uma URL completa, retorna como está
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath
  }
  
  // Se começa com /uploads, adiciona a URL base do backend
  if (imagePath.startsWith('/uploads')) {
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8001"
    return `${baseUrl}${imagePath}`
  }
  
  // Se não começa com /, adiciona /uploads/
  if (!imagePath.startsWith('/')) {
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8001"
    return `${baseUrl}/uploads/${imagePath}`
  }
  
  // Para outros casos, adiciona a URL base
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8001"
  return `${baseUrl}${imagePath}`
}

export const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(new Date(date))
}

export const formatDateTime = (date: string | Date): string => {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))
}

// Funções de validação
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const isValidCPF = (cpf: string): boolean => {
  const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/
  return cpfRegex.test(cpf)
}

export const isValidCEP = (cep: string): boolean => {
  const cepRegex = /^\d{5}-?\d{3}$/
  return cepRegex.test(cep)
}

// Funções de string
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export const truncate = (str: string, length: number): string => {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}

// Funções de array
export const groupBy = <T, K extends keyof any>(array: T[], key: (item: T) => K): Record<K, T[]> => {
  return array.reduce((groups, item) => {
    const group = key(item)
    groups[group] = groups[group] || []
    groups[group].push(item)
    return groups
  }, {} as Record<K, T[]>)
}

// Funções de debounce
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}
