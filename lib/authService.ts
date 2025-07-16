import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/axios'
import { saveAuthData, logout as logoutAuth } from './auth'

// Tipos
export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  phone?: string
}

export interface UpdateProfileData {
  name: string
  phone?: string
}

export interface AuthResponse {
  message: string
  token: string
  user: {
    id: string
    name: string
    email: string
    phone?: string
    role: 'ADMIN' | 'CUSTOMER'
    createdAt: string
  }
}

// Hooks para usar em componentes
export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await api.get('/auth/profile')
      return response.data
    },
    retry: false,
  })
}

// Mutations
export const useLogin = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await api.post<AuthResponse>('/auth/login', data)
      return response.data
    },
    onSuccess: (data) => {
      saveAuthData(data.token, data.user)
      queryClient.setQueryData(['profile'], data.user)
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}

export const useRegister = () => {
  return useMutation({
    mutationFn: async (data: RegisterData) => {
      const response = await api.post('/auth/register', data)
      return response.data
    },
  })
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: UpdateProfileData) => {
      const response = await api.put('/auth/profile', data)
      return response.data
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['profile'], data.user)
      // Atualizar dados do usuário no localStorage
      const userStr = localStorage.getItem('user')
      if (userStr) {
        const user = JSON.parse(userStr)
        const updatedUser = { ...user, ...data.user }
        localStorage.setItem('user', JSON.stringify(updatedUser))
      }
    },
  })
}

export const useLogout = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async () => {
      // Limpar cache do React Query
      queryClient.clear()
      // Fazer logout
      logoutAuth()
    },
  })
}

// Funções para chamada direta da API
export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', data)
  return response.data
}

export const register = async (data: RegisterData) => {
  const response = await api.post('/auth/register', data)
  return response.data
}

export const getProfile = async () => {
  const response = await api.get('/auth/profile')
  return response.data
}

export const updateProfile = async (data: UpdateProfileData) => {
  const response = await api.put('/auth/profile', data)
  return response.data
} 