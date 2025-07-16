import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/axios'
import type { Address } from './addressService'

// Tipos
export interface OrderItem {
  id: string
  quantity: number
  price: number
  product: {
    id: string
    name: string
    description: string
    imageUrl: string
  }
  variant?: {
    id: string
    size: string
    color?: string
  }
}

export interface Order {
  id: string
  orderNumber: string
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
  total: number
  createdAt: string
  updatedAt: string
  address: Address
  orderItems: OrderItem[]
  payment?: {
    id: string
    amount: number
    method: 'CREDIT_CARD' | 'DEBIT_CARD' | 'PIX' | 'BANK_TRANSFER'
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED'
    transactionId?: string
  }
}

export interface CreateOrderData {
  addressId: string
  paymentMethod: 'CREDIT_CARD' | 'DEBIT_CARD' | 'PIX' | 'BANK_TRANSFER'
}

// Hooks para usar em componentes
export const useOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const response = await api.get('/orders')
      return response.data
    },
  })
}

export const useOrder = (id: string) => {
  return useQuery({
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
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })
}

// Funções para chamada direta da API
export const getOrders = async () => {
  const response = await api.get('/orders')
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

// Utilitários
export const getOrderStatusLabel = (status: Order['status']): string => {
  const statusLabels = {
    PENDING: 'Pendente',
    CONFIRMED: 'Confirmado',
    PROCESSING: 'Em Processamento',
    SHIPPED: 'Enviado',
    DELIVERED: 'Entregue',
    CANCELLED: 'Cancelado'
  }
  return statusLabels[status] || status
}

export const getPaymentMethodLabel = (method: string): string => {
  const methodLabels = {
    CREDIT_CARD: 'Cartão de Crédito',
    DEBIT_CARD: 'Cartão de Débito',
    PIX: 'PIX',
    BANK_TRANSFER: 'Transferência Bancária'
  }
  return methodLabels[method as keyof typeof methodLabels] || method
}

export const getPaymentStatusLabel = (status: string): string => {
  const statusLabels = {
    PENDING: 'Pendente',
    APPROVED: 'Aprovado',
    REJECTED: 'Rejeitado',
    CANCELLED: 'Cancelado'
  }
  return statusLabels[status as keyof typeof statusLabels] || status
}

 