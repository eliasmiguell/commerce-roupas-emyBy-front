import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/axios'

// Tipos
export interface Category {
  id: string
  name: string
  description?: string
  imageUrl?: string
  createdAt: string
  updatedAt: string
}

export interface CreateCategoryData {
  name: string
  description?: string
  imageUrl?: string
}

export interface UpdateCategoryData extends Partial<CreateCategoryData> {
  id: string
}

// Hooks para usar em componentes
export const useGetCategorias = () => {
  return useQuery<any>({
    queryKey: ['categorias'],
    queryFn: async () => {
      const response = await api.get('/categories') 
      return response.data
    },
  })
}

export const useGetCategoria = (id: string) => {
  return useQuery<any>({
    queryKey: ['categoria', id],
    queryFn: async () => {
      const response = await api.get(`/categories/${id}`)
      return response.data
    },
    enabled: !!id,
  })
}

// Mutations
export const useCreateCategoria = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: CreateCategoryData) => {
      const response = await api.post('/categories', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] })
    },
  })
}

export const useUpdateCategoria = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: UpdateCategoryData) => {
      const { id, ...updateData } = data
      const response = await api.put(`/categories/${id}`, updateData)
      return response.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] })
      queryClient.invalidateQueries({ queryKey: ['categoria', data.id] })
    },
  })
}

export const useDeleteCategoria = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/categories/${id}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] })
    },
  })
}

// Funções para chamada direta da API
export const getCategorias = async () => {
  const response = await api.get('/categories')
  return response.data
}

export const getCategoria = async (id: string) => {
  const response = await api.get(`/categories/${id}`)
  return response.data
}

export const createCategoria = async (data: CreateCategoryData) => {
  const response = await api.post('/categories', data)
  return response.data
}

export const updateCategoria = async (id: string, data: Partial<CreateCategoryData>) => {
  const response = await api.put(`/categories/${id}`, data)
  return response.data
}

export const deleteCategoria = async (id: string) => {
  const response = await api.delete(`/categories/${id}`)
  return response.data
}