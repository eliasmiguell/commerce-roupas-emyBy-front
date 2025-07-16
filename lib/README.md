# Libs do Frontend - Emy-by

Este diretório contém todas as bibliotecas e serviços necessários para comunicação com o backend.

## Estrutura

### Autenticação
- **`auth.ts`** - Funções de gerenciamento de estado de autenticação
- **`authService.ts`** - Serviços de autenticação (login, registro, perfil)

### Produtos
- **`produtoService.ts`** - Serviços para gerenciamento de produtos
- **`categoriaService.ts`** - Serviços para gerenciamento de categorias
- **`roupasService.ts`** - Serviços específicos para roupas (vestidos, blusas, saias, calças)
- **`calcadosService.ts`** - Serviços específicos para calçados (sapatos, tênis, sandálias)
- **`acessoriosService.ts`** - Serviços específicos para acessórios (relógios, colares, etc.)

### Carrinho e Pedidos
- **`cartService.ts`** - Serviços para gerenciamento do carrinho de compras
- **`orderService.ts`** - Serviços para gerenciamento de pedidos
- **`addressService.ts`** - Serviços para gerenciamento de endereços

### Utilitários
- **`utils.ts`** - Funções utilitárias (formatação, validação, etc.)
- **`index.ts`** - Arquivo de índice para exportações organizadas

## Como usar

### Importação
```typescript
// Importar tudo
import * as libs from '@/lib'

// Importar serviços específicos
import { useLogin, useCartItems, formatCurrency } from '@/lib'

// Importar diretamente
import { useLogin } from '@/lib/authService'
```

### Exemplos de uso

#### Autenticação
```typescript
import { useLogin, useProfile } from '@/lib'

function LoginComponent() {
  const login = useLogin()
  const { data: profile } = useProfile()

  const handleLogin = async (email: string, password: string) => {
    try {
      await login.mutateAsync({ email, password })
      // Redirecionar após login
    } catch (error) {
      console.error('Erro no login:', error)
    }
  }
}
```

#### Produtos
```typescript
import { useProdutos, useProduto } from '@/lib'

function ProductsComponent() {
  const { data: products, isLoading } = useProdutos()
  const { data: product } = useProduto('product-id')

  if (isLoading) return <div>Carregando...</div>
  
  return (
    <div>
      {products?.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
```

#### Roupas
```typescript
import { useVestidos, useBlusas, useSaias, useCalcas } from '@/lib'

function RoupasComponent() {
  const { data: vestidos, isLoading } = useVestidos()
  const { data: blusas } = useBlusas()
  const { data: saias } = useSaias()
  const { data: calcas } = useCalcas()

  if (isLoading) return <div>Carregando...</div>
  
  return (
    <div>
      <h2>Vestidos</h2>
      {vestidos?.map(vestido => (
        <ProductCard key={vestido.id} product={vestido} />
      ))}
    </div>
  )
}
```

#### Calçados
```typescript
import { useSapatos, useTenis, useSandalias } from '@/lib'

function CalcadosComponent() {
  const { data: sapatos } = useSapatos()
  const { data: tenis } = useTenis()
  const { data: sandalias } = useSandalias()

  return (
    <div>
      <h2>Sapatos</h2>
      {sapatos?.map(sapato => (
        <ProductCard key={sapato.id} product={sapato} />
      ))}
    </div>
  )
}
```

#### Acessórios
```typescript
import { useRelogios, useColares } from '@/lib'

function AcessoriosComponent() {
  const { data: relogios } = useRelogios()
  const { data: colares } = useColares()

  return (
    <div>
      <h2>Relógios</h2>
      {relogios?.map(relogio => (
        <ProductCard key={relogio.id} product={relogio} />
      ))}
    </div>
  )
}
```

#### Carrinho
```typescript
import { useCartItems, useAddToCart, calculateCartTotal } from '@/lib'

function CartComponent() {
  const { data: cartItems } = useCartItems()
  const addToCart = useAddToCart()

  const handleAddToCart = async (productId: string, quantity: number) => {
    await addToCart.mutateAsync({ productId, quantity })
  }

  const total = calculateCartTotal(cartItems || [])

  return (
    <div>
      <p>Total: {formatCurrency(total)}</p>
    </div>
  )
}
```

## Configuração

### Variáveis de ambiente
Certifique-se de que a variável `NEXT_PUBLIC_BACKEND_URL` está configurada no seu `.env.local`:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8001/api
```

### React Query
As libs utilizam React Query para cache e gerenciamento de estado. Certifique-se de que o QueryClient está configurado:

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

function App({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
```

## Tipos

Todos os tipos estão definidos em cada arquivo de serviço correspondente. Para importar tipos específicos:

```typescript
import type { Product, CartItem, Order } from '@/lib'
```

## Observações

- Todas as requisições incluem automaticamente o token de autenticação
- O cache é invalidado automaticamente após mutações
- Erros são tratados de forma consistente em todos os serviços
- As funções de formatação seguem o padrão brasileiro (pt-BR) 