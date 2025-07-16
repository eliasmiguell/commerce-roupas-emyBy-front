import { useQuery } from '@tanstack/react-query'
import api from '@/axios'

export const useGetCategorias = () => {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery<any>({
    queryKey: ['categorias'],
    queryFn: async () => {
      const response = await api.get('/categories') 
      console.log('Categorias response:', response.data)
      return response.data
    },
  })

  return { data, isLoading, isError, error, refetch }
}