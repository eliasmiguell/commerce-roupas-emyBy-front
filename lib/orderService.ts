import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/axios'

// Tipos
export interface Order {
  id: string
  userId: string
  total: number
  status: string
  items: OrderItem[]
  user?: User
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  id: string
  productId: string
  quantity: number
  price: number
  product?: Product
}

export interface Product {
  id: string
  name: string
  price: number
  imageUrl?: string
}

export interface User {
  id: string
  name: string
  email: string
}

export interface CreateOrderData {
  userId: string
  items: Array<{
    productId: string
    quantity: number
  }>
}

export interface UpdateOrderData {
  status?: string
  total?: number
}

// Hooks para usar em componentes
export const useOrders = () => {
  return useQuery<any>({
    queryKey: ['orders'],
    queryFn: async () => {
      const response = await api.get('/orders')
      console.log('Resposta da API pedidos:', response.data)
      return response.data
    },
  })
}

export const useUserOrders = () => {
  return useQuery<any>({
    queryKey: ['user-orders'],
    queryFn: async () => {
      console.log('useUserOrders - Fazendo requisição para /orders')
      const response = await api.get('/orders')
      console.log('Resposta da API meus pedidos:', response.data)
      return response.data
    },
    enabled: true, // Sempre habilitado
  })
}

export const useOrder = (id: string) => {
  return useQuery<any>({
    queryKey: ['order', id],
    queryFn: async () => {
      const response = await api.get(`/orders/${id}`)
      return response.data
    },
    enabled: !!id,
  })
}

// Mutations
export const useCreateOrder = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: CreateOrderData) => {
      const response = await api.post('/orders', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })
}

export const useUpdateOrder = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateOrderData }) => {
      const response = await api.put(`/orders/${id}`, data)
      return response.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['order', data.order.id] })
    },
  })
}

export const useDeleteOrder = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/orders/${id}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })
}

// Funções para chamada direta da API
export const getOrders = async () => {
  const response = await api.get('/orders')
  console.log('Resposta da API pedidos:', response.data)
  return response.data
}

export const getOrder = async (id: string) => {
  const response = await api.get(`/orders/${id}`)
  return response.data
}

export const createOrder = async (data: CreateOrderData) => {
  const response = await api.post('/orders', data)
  return response.data
}

export const updateOrder = async (id: string, data: UpdateOrderData) => {
  const response = await api.put(`/orders/${id}`, data)
  return response.data
}

export const deleteOrder = async (id: string) => {
  const response = await api.delete(`/orders/${id}`)
  return response.data
}

 