import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/axios'

// Tipos
export interface CartItem {
  id: string
  quantity: number
  createdAt: string
  updatedAt: string
  product: {
    id: string
    name: string
    description: string
    price: number
    imageUrl: string
  }
  variant?: {
    id: string
    size: string
    color?: string
    stock: number
  }
}

export interface AddToCartData {
  productId: string
  variantId?: string
  quantity: number
}

export interface UpdateCartItemData {
  quantity: number
}

// Hooks para usar em componentes
export const useCartItems = () => {
  return useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const response = await api.get('/cart')
      return response.data
    },
  })
}

// Mutations
export const useAddToCart = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: AddToCartData) => {
      const response = await api.post('/cart/add', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })
}

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateCartItemData }) => {
      const response = await api.put(`/cart/${id}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })
}

export const useRemoveCartItem = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/cart/${id}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })
}

export const useClearCart = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async () => {
      const response = await api.delete('/cart')
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })
}

// Funções para chamada direta da API
export const getCartItems = async () => {
  const response = await api.get('/cart')
  return response.data
}

export const addToCart = async (data: AddToCartData) => {
  const response = await api.post('/cart/add', data)
  return response.data
}

export const updateCartItem = async (id: string, data: UpdateCartItemData) => {
  const response = await api.put(`/cart/${id}`, data)
  return response.data
}

export const removeCartItem = async (id: string) => {
  const response = await api.delete(`/cart/${id}`)
  return response.data
}

export const clearCart = async () => {
  const response = await api.delete('/cart')
  return response.data
}

// Utilitários
export const calculateCartTotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => {
    return total + (item.product.price * item.quantity)
  }, 0)
}

export const getCartItemCount = (items: CartItem[]): number => {
  return items.reduce((count, item) => count + item.quantity, 0)
} 