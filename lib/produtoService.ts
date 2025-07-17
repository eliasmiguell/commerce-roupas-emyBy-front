import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/axios'

// Tipos
export interface Product {
  id: string
  name: string
  description: string
  price: number
  imageUrl: string
  categoryId: string
  variants?: ProductVariant[]
  createdAt: string
  updatedAt: string
}

export interface ProductVariant {
  id: string
  size: string
  stock: number
  productId: string
}

export interface CreateProductData {
  name: string
  description: string
  price: number
  imageUrl: string
  categoryId: string
  variants?: Omit<ProductVariant, 'id' | 'productId'>[]
}

export interface UpdateProductData extends Partial<CreateProductData> {
  id: string
}

// Hooks para usar em componentes
export const useProdutos = (params = {}) => {
  return useQuery<any>({
    queryKey: ['products', params],
    queryFn: async () => {
      const response = await api.get('/products', { params })
      return response.data.products || response.data
    },
  })
}

export const useProduto = (id: string) => {
  return useQuery<any>({
    queryKey: ['product', id],
    queryFn: async () => {
      const response = await api.get(`/products/${id}`)
      return response.data
    },
    enabled: !!id,
  })
}

export const useProdutosPorCategoria = (categoryId: string) => {
  return useQuery<any>({
    queryKey: ['products', 'category', categoryId],
    queryFn: async () => {
      const response = await api.get(`/products`, {
        params: { categoryId }
      })
      return response.data.products || response.data
    },
    enabled: !!categoryId,
  })
}

// Mutations
export const useCreateProduto = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: CreateProductData) => {
      const response = await api.post('/products', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

export const useUpdateProduto = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: UpdateProductData) => {
      const { id, ...updateData } = data
      const response = await api.put(`/products/${id}`, updateData)
      return response.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['product', data.id] })
    },
  })
}

export const useDeleteProduto = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/products/${id}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

// Funções para chamada direta da API
export const getNovosProdutos = async (limit = 6) => {
  const response = await api.get('/products', {
    params: { limit, page: 1, orderBy: 'createdAt', order: 'desc' },
  })

  return response.data.products || response.data
}

export const getProdutos = async (params = {}) => {
  const response = await api.get('/products', { params })
  console.log('Resposta da API produtos:', response.data)
  // A API retorna { products: [...] } diretamente
  return response.data
}

export const getProduto = async (id: string) => {
  const response = await api.get(`/products/${id}`)
  return response.data
}

export const createProduto = async (data: CreateProductData) => {
  const response = await api.post('/products', data)
  return response.data
}

export const updateProduto = async (id: string, data: Partial<CreateProductData>) => {
  const response = await api.put(`/products/${id}`, data)
  return response.data
}

export const deleteProduto = async (id: string) => {
  const response = await api.delete(`/products/${id}`)
  return response.data
}

export const searchProdutos = async (query: string) => {
  const response = await api.get('/products', {
    params: { search: query }
  })
  return response.data.products || response.data
}