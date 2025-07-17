# Solução de Problemas da API - Emy-by

## Erro: "/categories" undefined undefined

### Possíveis Causas:

1. **Backend não está rodando**
   - Verifique se o backend está rodando em `http://localhost:8001/`
   - Teste a rota de health: `http://localhost:8001//api/health`

2. **Problema de CORS**
   - O backend foi atualizado para aceitar requisições da Vercel
   - Domínios permitidos: `emy-by.vercel.app`, `emy-by-git-main.vercel.app`

3. **Variável de ambiente incorreta**
   - Verifique se `NEXT_PUBLIC_API_URL` está configurada na Vercel
   - Valor correto: `http://localhost:8001//api`

### Passos para Resolver:

1. **Teste a API diretamente:**
   ```bash
   curl http://localhost:8001//api/health
   curl http://localhost:8001//api/categories
   ```

2. **Verifique as variáveis de ambiente na Vercel:**
   - Acesse o dashboard da Vercel
   - Vá em Settings > Environment Variables
   - Configure: `NEXT_PUBLIC_API_URL = http://localhost:8001//api`

3. **Use o componente de teste:**
   - O componente `ApiTest` foi adicionado na página principal
   - Clique nos botões para testar a conectividade

4. **Verifique o console do navegador:**
   - Abra as ferramentas de desenvolvedor (F12)
   - Vá na aba Console
   - Procure por erros de rede ou CORS

### Configuração do Backend (Render):

1. **Variáveis de ambiente necessárias:**
   - `DATABASE_URL` - URL do banco PostgreSQL
   - `JWT_SECRET` - Chave secreta para JWT
   - `EMAIL_USER` - Email para envio de mensagens
   - `EMAIL_PASS` - Senha do email

2. **Build Command:**
   ```bash
   npm install && npm run build
   ```

3. **Start Command:**
   ```bash
   npm start
   ```

### Se o problema persistir:

1. Verifique se o banco de dados está acessível
2. Confirme se as migrações do Prisma foram executadas
3. Verifique os logs do backend no Render
4. Teste com uma nova instância do backend 