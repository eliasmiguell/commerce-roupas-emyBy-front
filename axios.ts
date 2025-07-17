import axios from "axios"

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8001/api",
})

// Interceptor para adicionar o token de autenticação automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  console.log('Interceptor - Token encontrado:', token ? 'Sim' : 'Não')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor para logs de resposta
api.interceptors.response.use(
  (response) => {
    console.log('Resposta da API:', response.config.url, response.status)
    return response
  },
  (error) => {
    console.error('Erro da API:', error.config?.url, error.response?.status, error.response?.data)
    return Promise.reject(error)
  }
)

export default api