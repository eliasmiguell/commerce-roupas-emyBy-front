import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/axios'

// Tipos
export interface User {
  id: string
  name: string
  email: string
  role: string
  createdAt: string
  updatedAt: string
}

export interface CreateUserData {
  name: string
  email: string
  password: string
  role?: string
}

export interface UpdateUserData {
  name?: string
  email?: string
  role?: string
}

// Hooks para usar em componentes
export const useUsers = () => {
  return useQuery<any>({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await api.get('/users')
      console.log('Resposta da API usuários:', response.data)
      return response.data
    },
  })
}

export const useUser = (id: string) => {
  return useQuery<any>({
    queryKey: ['user', id],
    queryFn: async () => {
      const response = await api.get(`/users/${id}`)
      return response.data
    },
    enabled: !!id,
  })
}

// Mutations
export const useCreateUser = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: CreateUserData) => {
      const response = await api.post('/auth/register', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateUserData }) => {
      const response = await api.put(`/users/${id}`, data)
      return response.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['user', data.user.id] })
    },
  })
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/users/${id}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

// Funções para chamada direta da API
export const getUsers = async () => {
  const response = await api.get('/users')
  console.log('Resposta da API usuários:', response.data)
  return response.data
}

export const getUser = async (id: string) => {
  const response = await api.get(`/users/${id}`)
  return response.data
}

export const createUser = async (data: CreateUserData) => {
  const response = await api.post('/auth/register', data)
  return response.data
}

export const updateUser = async (id: string, data: UpdateUserData) => {
  const response = await api.put(`/users/${id}`, data)
  return response.data
}

export const deleteUser = async (id: string) => {
  const response = await api.delete(`/users/${id}`)
  return response.data
} 