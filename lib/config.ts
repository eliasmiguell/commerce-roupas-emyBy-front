// Configuração da API
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001'

// Endpoints da API
export const API_ENDPOINTS = {
  // Auth
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  REGISTER: `${API_BASE_URL}/api/auth/register`,
  ME: `${API_BASE_URL}/api/auth/me`,
  
  // Products
  PRODUCTS: `${API_BASE_URL}/api/products`,
  PRODUCT: (id: string) => `${API_BASE_URL}/api/products/${id}`,
  
  // Categories
  CATEGORIES: `${API_BASE_URL}/api/categories`,
  CATEGORY: (id: string) => `${API_BASE_URL}/api/categories/${id}`,
  
  // Orders
  ORDERS: `${API_BASE_URL}/api/orders`,
  ORDER: (id: string) => `${API_BASE_URL}/api/orders/${id}`,
  
  // Users
  USERS: `${API_BASE_URL}/api/users`,
  USER: (id: string) => `${API_BASE_URL}/api/users/${id}`,
  
  // Cart
  CART: `${API_BASE_URL}/api/cart`,
  CART_ITEMS: `${API_BASE_URL}/api/cart/items`,
  
  // Upload
  UPLOAD: `${API_BASE_URL}/api/upload`,
  
  // Contact
  CONTACT: `${API_BASE_URL}/api/contact/send`,
  
  // Addresses
  ADDRESSES: `${API_BASE_URL}/api/addresses`,
  ADDRESS: (id: string) => `${API_BASE_URL}/api/addresses/${id}`,
} 