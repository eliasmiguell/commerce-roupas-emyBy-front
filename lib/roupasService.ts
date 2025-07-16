import { useQuery } from '@tanstack/react-query'
import api from '@/axios'

// Tipos específicos para roupas
export interface Roupa {
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

export interface RoupaFilters {
  category?: 'vestidos' | 'blusas' | 'saias' | 'calcas'
  size?: string
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
}

// Hooks para usar em componentes
export const useRoupas = (filters: RoupaFilters = {}) => {
  return useQuery({
    queryKey: ['roupas', filters],
    queryFn: async () => {
      const params = new URLSearchParams()
      
      // Filtrar por categorias de roupas
      const roupaCategories = ['vestidos', 'blusas', 'saias', 'calcas']
      if (filters.category) {
        params.append('categorySlug', filters.category)
      } else {
        // Se não especificar categoria, buscar todas as de roupas
        roupaCategories.forEach(cat => params.append('categorySlug', cat))
      }
      
      if (filters.minPrice) params.append('minPrice', filters.minPrice.toString())
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString())
      if (filters.inStock) params.append('inStock', 'true')
      
      const response = await api.get(`/products?${params.toString()}`)
      return response.data as Roupa[]
    },
  })
}

export const useVestidos = () => {
  return useQuery({
    queryKey: ['roupas', 'vestidos'],
    queryFn: async () => {
      const response = await api.get('/products?categorySlug=vestidos')
      return response.data as Roupa[]
    },
  })
}

export const useBlusas = () => {
  return useQuery({
    queryKey: ['roupas', 'blusas'],
    queryFn: async () => {
      const response = await api.get('/products?categorySlug=blusas')
      return response.data as Roupa[]
    },
  })
}

export const useSaias = () => {
  return useQuery({
    queryKey: ['roupas', 'saias'],
    queryFn: async () => {
      const response = await api.get('/products?categorySlug=saias')
      return response.data as Roupa[]
    },
  })
}

export const useCalcas = () => {
  return useQuery({
    queryKey: ['roupas', 'calcas'],
    queryFn: async () => {
      const response = await api.get('/products?categorySlug=calcas')
      return response.data as Roupa[]
    },
  })
}

export const useRoupa = (id: string) => {
  return useQuery({
    queryKey: ['roupa', id],
    queryFn: async () => {
      const response = await api.get(`/products/${id}`)
      return response.data as Roupa
    },
    enabled: !!id,
  })
}

// Funções para chamada direta da API
export const getRoupas = async (filters: RoupaFilters = {}) => {
  const params = new URLSearchParams()
  
  const roupaCategories = ['vestidos', 'blusas', 'saias', 'calcas']
  if (filters.category) {
    params.append('categorySlug', filters.category)
  } else {
    roupaCategories.forEach(cat => params.append('categorySlug', cat))
  }
  
  if (filters.minPrice) params.append('minPrice', filters.minPrice.toString())
  if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString())
  if (filters.inStock) params.append('inStock', 'true')
  
  const response = await api.get(`/products?${params.toString()}`)
  return response.data as Roupa[]
}

export const getVestidos = async () => {
  const response = await api.get('/products?categorySlug=vestidos')
  return response.data as Roupa[]
}

export const getBlusas = async () => {
  const response = await api.get('/products?categorySlug=blusas')
  return response.data as Roupa[]
}

export const getSaias = async () => {
  const response = await api.get('/products?categorySlug=saias')
  return response.data as Roupa[]
}

export const getCalcas = async () => {
  const response = await api.get('/products?categorySlug=calcas')
  return response.data as Roupa[]
}

export const getRoupa = async (id: string) => {
  const response = await api.get(`/products/${id}`)
  return response.data as Roupa
}

// Utilitários específicos para roupas
export const getRoupaAvailableSizes = (roupa: Roupa): string[] => {
  return roupa.variants
    .filter(variant => variant.stock > 0)
    .map(variant => variant.size)
    .sort()
}

export const getRoupaAvailableColors = (roupa: Roupa): string[] => {
  const colors = roupa.variants
    .filter(variant => variant.stock > 0 && variant.color)
    .map(variant => variant.color!)
    .filter((color, index, arr) => arr.indexOf(color) === index)
  
  return colors
}

export const getRoupaStockBySize = (roupa: Roupa, size: string): number => {
  const variant = roupa.variants.find(v => v.size === size)
  return variant?.stock || 0
}

export const getRoupaStockBySizeAndColor = (roupa: Roupa, size: string, color?: string): number => {
  const variant = roupa.variants.find(v => 
    v.size === size && (!color || v.color === color)
  )
  return variant?.stock || 0
}

export const isRoupaInStock = (roupa: Roupa): boolean => {
  return roupa.variants.some(variant => variant.stock > 0)
}

// Funções de busca e filtros
export const searchRoupas = async (query: string) => {
  const response = await api.get('/products', {
    params: { 
      search: query,
      categorySlug: ['vestidos', 'blusas', 'saias', 'calcas']
    }
  })
  return response.data as Roupa[]
}

export const getRoupasByPriceRange = async (minPrice: number, maxPrice: number) => {
  const response = await api.get('/products', {
    params: { 
      minPrice,
      maxPrice,
      categorySlug: ['vestidos', 'blusas', 'saias', 'calcas']
    }
  })
  return response.data as Roupa[]
}

export const getRoupasInStock = async () => {
  const response = await api.get('/products', {
    params: { 
      inStock: true,
      categorySlug: ['vestidos', 'blusas', 'saias', 'calcas']
    }
  })
  return response.data as Roupa[]
}

// Funções específicas por tipo de roupa
export const getRoupasPorTipo = async (tipo: string) => {
  const response = await api.get(`/products?categorySlug=${tipo}`)
  return response.data as Roupa[]
}

export const getRoupasElegantes = async () => {
  // Buscar roupas com preço acima de R$ 100 (consideradas elegantes)
  const response = await api.get('/products', {
    params: { 
      minPrice: 100,
      categorySlug: ['vestidos', 'blusas', 'saias', 'calcas']
    }
  })
  return response.data as Roupa[]
}

export const getRoupasCasuais = async () => {
  // Buscar roupas com preço abaixo de R$ 100 (consideradas casuais)
  const response = await api.get('/products', {
    params: { 
      maxPrice: 100,
      categorySlug: ['vestidos', 'blusas', 'saias', 'calcas']
    }
  })
  return response.data as Roupa[]
} 