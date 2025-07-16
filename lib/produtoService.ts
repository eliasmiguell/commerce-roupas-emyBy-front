import { useQuery } from '@tanstack/react-query'
import api from '@/axios'

// Hook para usar em componentes
export const useProdutos = (params = {}) => {
  return useQuery<any>({
    queryKey: ['products', params],
    queryFn: async () => {
      const response = await api.get('/products', { params })
      console.log(response.data)
      return response.data
    },
  })
}

// Função para chamada direta da API (para usar com useQuery)
export const getNovosProdutos = async (limit = 6) => {
  const response = await api.get('/products', {
    params: { limit, page: 1, orderBy: 'createdAt', order: 'desc' },
  })
  
  console.log(response.data)
  return response.data
}

// Função para buscar produtos (para usar com useQuery)
export const getProdutos = async (params = {}) => {
  const response = await api.get('/products', { params })
  console.log(response.data)
  return response.data
}