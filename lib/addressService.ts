import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/axios'

// Tipos
export interface Address {
  id: string
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
  isDefault: boolean
}

export interface CreateAddressData {
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
  isDefault?: boolean
}

export interface UpdateAddressData extends Partial<CreateAddressData> {
  id: string
}

// Hooks para usar em componentes
export const useAddresses = () => {
  return useQuery({
    queryKey: ['addresses'],
    queryFn: async () => {
      const response = await api.get('/addresses')
      return response.data
    },
  })
}

export const useAddress = (id: string) => {
  return useQuery({
    queryKey: ['address', id],
    queryFn: async () => {
      const response = await api.get(`/addresses/${id}`)
      return response.data
    },
    enabled: !!id,
  })
}

// Mutations
export const useCreateAddress = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: CreateAddressData) => {
      const response = await api.post('/addresses', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
    },
  })
}

export const useUpdateAddress = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: UpdateAddressData) => {
      const { id, ...updateData } = data
      const response = await api.put(`/addresses/${id}`, updateData)
      return response.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
      queryClient.invalidateQueries({ queryKey: ['address', data.id] })
    },
  })
}

export const useDeleteAddress = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/addresses/${id}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
    },
  })
}

// Funções para chamada direta da API
export const getAddresses = async () => {
  const response = await api.get('/addresses')
  return response.data
}

export const getAddress = async (id: string) => {
  const response = await api.get(`/addresses/${id}`)
  return response.data
}

export const createAddress = async (data: CreateAddressData) => {
  const response = await api.post('/addresses', data)
  return response.data
}

export const updateAddress = async (id: string, data: Partial<CreateAddressData>) => {
  const response = await api.put(`/addresses/${id}`, data)
  return response.data
}

export const deleteAddress = async (id: string) => {
  const response = await api.delete(`/addresses/${id}`)
  return response.data
}

// Utilitários
export const formatAddress = (address: Address): string => {
  const parts = [
    `${address.street}, ${address.number}`,
    address.complement,
    address.neighborhood,
    `${address.city} - ${address.state}`,
    address.zipCode
  ].filter(Boolean)
  
  return parts.join(', ')
}

export const getDefaultAddress = (addresses: Address[]): Address | undefined => {
  return addresses.find(addr => addr.isDefault) || addresses[0]
} 