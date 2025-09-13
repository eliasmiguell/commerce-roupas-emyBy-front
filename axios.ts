import axios from "axios"
import { API_BASE_URL } from "./lib/config"

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
})

// Interceptor para adicionar o token de autenticação automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  console.log('Interceptor - URL:', config.url, 'Token encontrado:', token ? 'Sim' : 'Não')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
    console.log('Interceptor - Token adicionado ao header:', token.substring(0, 20) + '...')
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
    console.log('Erro da API:', error.config?.url, error.response?.status, error.response?.data)
    return Promise.reject(error)
  }
)

export default api