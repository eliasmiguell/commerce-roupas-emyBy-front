import { useQuery } from '@tanstack/react-query'
import api from '@/axios'
import type { Product } from './produtoService'

// Tipos específicos para calçados
export interface Calcado {
  id: string
  name: string
  description: string
  price: number
  imageUrl: string
  categoryId: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  category: {
    id: string
    name: string
    slug: string
  }
  variants: {
    id: string
    size: string
    color?: string
    stock: number
    productId: string
  }[]
}

export interface CalcadoFilters {
  category?: 'sapatos' | 'tenis' | 'sandalias'
  size?: string
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
}

// Hooks para usar em componentes
export const useCalcados = (filters: CalcadoFilters = {}) => {
  return useQuery({
    queryKey: ['calcados', filters],
    queryFn: async () => {
      // Buscar todos os produtos e filtrar no frontend
      const response = await api.get('/products')
      const allProducts = response.data.products || response.data
      
      // Filtrar apenas produtos de calçados
      const calcadoCategories = ['sapatos', 'tenis', 'sandalias']
      let filteredProducts = allProducts.filter((product: any) => 
        calcadoCategories.includes(product.category?.slug)
      )
      
      // Aplicar filtros adicionais
      if (filters.category) {
        filteredProducts = filteredProducts.filter((product: any) => 
          product.category?.slug === filters.category
        )
      }
      
      if (filters.minPrice) {
        filteredProducts = filteredProducts.filter((product: any) => 
          Number(product.price) >= filters.minPrice!
        )
      }
      
      if (filters.maxPrice) {
        filteredProducts = filteredProducts.filter((product: any) => 
          Number(product.price) <= filters.maxPrice!
        )
      }
      
      if (filters.inStock) {
        filteredProducts = filteredProducts.filter((product: any) => 
          product.variants?.some((variant: any) => variant.stock > 0)
        )
      }
      
      return filteredProducts
    },
  })
}

export const useSapatos = () => {
  return useQuery({
    queryKey: ['calcados', 'sapatos'],
    queryFn: async () => {
      const response = await api.get('/products?category=sapatos')
      return response.data.products || response.data
    },
  })
}

export const useTenis = () => {
  return useQuery({
    queryKey: ['calcados', 'tenis'],
    queryFn: async () => {
      const response = await api.get('/products?category=tenis')
      return response.data.products || response.data
    },
  })
}

export const useSandalias = () => {
  return useQuery({
    queryKey: ['calcados', 'sandalias'],
    queryFn: async () => {
      const response = await api.get('/products?category=sandalias')
      return response.data.products || response.data
    },
  })
}

export const useCalcado = (id: string) => {
  return useQuery({
    queryKey: ['calcado', id],
    queryFn: async () => {
      const response = await api.get(`/products/${id}`)
      return response.data as Calcado
    },
    enabled: !!id,
  })
}

// Funções para chamada direta da API
export const getCalcados = async (filters: CalcadoFilters = {}) => {
  const params = new URLSearchParams()
  
  const calcadoCategories = ['sapatos', 'tenis', 'sandalias']
  if (filters.category) {
    params.append('category', filters.category)
  } else {
    calcadoCategories.forEach(cat => params.append('category', cat))
  }
  
  if (filters.minPrice) params.append('minPrice', filters.minPrice.toString())
  if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString())
  if (filters.inStock) params.append('inStock', 'true')
  
  const response = await api.get(`/products?${params.toString()}`)
  return response.data.products || response.data
}

export const getSapatos = async () => {
  const response = await api.get('/products?category=sapatos')
  return response.data.products || response.data
}

export const getTenis = async () => {
  const response = await api.get('/products?category=tenis')
  return response.data.products || response.data
}

export const getSandalias = async () => {
  const response = await api.get('/products?category=sandalias')
  return response.data.products || response.data
}

export const getCalcado = async (id: string) => {
  const response = await api.get(`/products/${id}`)
  return response.data as Calcado
}

// Utilitários específicos para calçados
export const getCalcadoAvailableSizes = (calcado: Calcado): string[] => {
  return calcado.variants
    .filter(variant => variant.stock > 0)
    .map(variant => variant.size)
    .sort()
}

export const getCalcadoAvailableColors = (calcado: Calcado): string[] => {
  const colors = calcado.variants
    .filter(variant => variant.stock > 0 && variant.color)
    .map(variant => variant.color!)
    .filter((color, index, arr) => arr.indexOf(color) === index)
  
  return colors
}

export const getCalcadoStockBySize = (calcado: Calcado, size: string): number => {
  const variant = calcado.variants.find(v => v.size === size)
  return variant?.stock || 0
}

export const getCalcadoStockBySizeAndColor = (calcado: Calcado, size: string, color?: string): number => {
  const variant = calcado.variants.find(v => 
    v.size === size && (!color || v.color === color)
  )
  return variant?.stock || 0
}

export const isCalcadoInStock = (calcado: Calcado): boolean => {
  return calcado.variants.some(variant => variant.stock > 0)
}

// Funções de busca e filtros
export const searchCalcados = async (query: string) => {
  const response = await api.get('/products', {
    params: { 
      search: query,
      categorySlug: ['sapatos', 'tenis', 'sandalias']
    }
  })
  return response.data as Calcado[]
}

export const getCalcadosByPriceRange = async (minPrice: number, maxPrice: number) => {
  const response = await api.get('/products', {
    params: { 
      minPrice,
      maxPrice,
      categorySlug: ['sapatos', 'tenis', 'sandalias']
    }
  })
  return response.data as Calcado[]
}

export const getCalcadosInStock = async () => {
  const response = await api.get('/products', {
    params: { 
      inStock: true,
      categorySlug: ['sapatos', 'tenis', 'sandalias']
    }
  })
  return response.data as Calcado[]
}
