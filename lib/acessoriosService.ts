import { useQuery } from '@tanstack/react-query'
import api from '@/axios'

// Tipos específicos para acessórios
export interface Acessorio {
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

export interface AcessorioFilters {
  category?: 'relogios' | 'colares' | 'pulseiras' | 'brincos' | 'anéis'
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
}

// Hooks para usar em componentes
export const useAcessorios = (filters: AcessorioFilters = {}) => {
  return useQuery({
    queryKey: ['acessorios', filters],
    queryFn: async () => {
      const params = new URLSearchParams()
      
      // Filtrar por categorias de acessórios
      const acessorioCategories = ['relogios', 'colares', 'pulseiras', 'brincos', 'aneis']
      if (filters.category) {
        params.append('categorySlug', filters.category)
      } else {
        // Se não especificar categoria, buscar todas as de acessórios
        acessorioCategories.forEach(cat => params.append('categorySlug', cat))
      }
      
      if (filters.minPrice) params.append('minPrice', filters.minPrice.toString())
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString())
      if (filters.inStock) params.append('inStock', 'true')
      
      const response = await api.get(`/products?${params.toString()}`)
      return response.data as Acessorio[]
    },
  })
}

export const useRelogios = () => {
  return useQuery({
    queryKey: ['acessorios', 'relogios'],
    queryFn: async () => {
      const response = await api.get('/products?categorySlug=relogios')
      return response.data as Acessorio[]
    },
  })
}

export const useColares = () => {
  return useQuery({
    queryKey: ['acessorios', 'colares'],
    queryFn: async () => {
      const response = await api.get('/products?categorySlug=colares')
      return response.data as Acessorio[]
    },
  })
}

export const useAcessorio = (id: string) => {
  return useQuery({
    queryKey: ['acessorio', id],
    queryFn: async () => {
      const response = await api.get(`/products/${id}`)
      return response.data as Acessorio
    },
    enabled: !!id,
  })
}

// Funções para chamada direta da API
export const getAcessorios = async (filters: AcessorioFilters = {}) => {
  const params = new URLSearchParams()
  
  const acessorioCategories = ['relogios', 'colares', 'pulseiras', 'brincos', 'aneis']
  if (filters.category) {
    params.append('categorySlug', filters.category)
  } else {
    acessorioCategories.forEach(cat => params.append('categorySlug', cat))
  }
  
  if (filters.minPrice) params.append('minPrice', filters.minPrice.toString())
  if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString())
  if (filters.inStock) params.append('inStock', 'true')
  
  const response = await api.get(`/products?${params.toString()}`)
  return response.data as Acessorio[]
}

export const getRelogios = async () => {
  const response = await api.get('/products?categorySlug=relogios')
  return response.data as Acessorio[]
}

export const getColares = async () => {
  const response = await api.get('/products?categorySlug=colares')
  return response.data as Acessorio[]
}

export const getAcessorio = async (id: string) => {
  const response = await api.get(`/products/${id}`)
  return response.data as Acessorio
}

// Utilitários específicos para acessórios
export const getAcessorioAvailableSizes = (acessorio: Acessorio): string[] => {
  return acessorio.variants
    .filter(variant => variant.stock > 0)
    .map(variant => variant.size)
    .sort()
}

export const getAcessorioAvailableColors = (acessorio: Acessorio): string[] => {
  const colors = acessorio.variants
    .filter(variant => variant.stock > 0 && variant.color)
    .map(variant => variant.color!)
    .filter((color, index, arr) => arr.indexOf(color) === index)
  
  return colors
}

export const getAcessorioStockBySize = (acessorio: Acessorio, size: string): number => {
  const variant = acessorio.variants.find(v => v.size === size)
  return variant?.stock || 0
}

export const getAcessorioStockBySizeAndColor = (acessorio: Acessorio, size: string, color?: string): number => {
  const variant = acessorio.variants.find(v => 
    v.size === size && (!color || v.color === color)
  )
  return variant?.stock || 0
}

export const isAcessorioInStock = (acessorio: Acessorio): boolean => {
  return acessorio.variants.some(variant => variant.stock > 0)
}

// Funções de busca e filtros
export const searchAcessorios = async (query: string) => {
  const response = await api.get('/products', {
    params: { 
      search: query,
      categorySlug: ['relogios', 'colares', 'pulseiras', 'brincos', 'aneis']
    }
  })
  return response.data as Acessorio[]
}

export const getAcessoriosByPriceRange = async (minPrice: number, maxPrice: number) => {
  const response = await api.get('/products', {
    params: { 
      minPrice,
      maxPrice,
      categorySlug: ['relogios', 'colares', 'pulseiras', 'brincos', 'aneis']
    }
  })
  return response.data as Acessorio[]
}

export const getAcessoriosInStock = async () => {
  const response = await api.get('/products', {
    params: { 
      inStock: true,
      categorySlug: ['relogios', 'colares', 'pulseiras', 'brincos', 'aneis']
    }
  })
  return response.data as Acessorio[]
}

// Funções específicas por tipo de acessório
export const getAcessoriosPorTipo = async (tipo: string) => {
  const response = await api.get(`/products?categorySlug=${tipo}`)
  return response.data as Acessorio[]
}

export const getAcessoriosElegantes = async () => {
  // Buscar acessórios com preço acima de R$ 100 (considerados elegantes)
  const response = await api.get('/products', {
    params: { 
      minPrice: 100,
      categorySlug: ['relogios', 'colares', 'pulseiras', 'brincos', 'aneis']
    }
  })
  return response.data as Acessorio[]
}

export const getAcessoriosCasuais = async () => {
  // Buscar acessórios com preço abaixo de R$ 100 (considerados casuais)
  const response = await api.get('/products', {
    params: { 
      maxPrice: 100,
      categorySlug: ['relogios', 'colares', 'pulseiras', 'brincos', 'aneis']
    }
  })
  return response.data as Acessorio[]
}
