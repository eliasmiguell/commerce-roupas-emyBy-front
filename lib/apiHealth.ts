import api from '@/axios'

export const checkApiHealth = async () => {
  try {
    const response = await api.get('/health')
    console.log('API Health Check:', response.data)
    return response.data
  } catch (error) {
    console.error('API Health Check Failed:', error)
    throw error
  }
}

export const testApiConnection = async () => {
  try {
    const response = await api.get('/categories')
    console.log('API Categories Test:', response.data)
    return response.data
  } catch (error) {
    console.error('API Categories Test Failed:', error)
    throw error
  }
} 