// Exportações de autenticação
export * from './auth'
export * from './authService'

// Exportações de produtos
export * from './produtoService'

// Exportações de categorias
export * from './categoriaService'

// Exportações específicas por categoria
export * from './calcadosService'
export * from './acessoriosService'
export * from './roupasService'

// Exportações de carrinho
export * from './cartService'

// Exportações de pedidos
export * from './orderService'

// Exportações de endereços
export * from './addressService'

// Exportações de utilitários
export * from './utils'

// Re-exportações comuns
export { default as api } from '@/axios' 