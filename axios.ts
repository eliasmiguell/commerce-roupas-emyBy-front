import axios from "axios"

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8001/api",
})

// Interceptor para adicionar o token de autenticação automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  console.log("axios",token)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api