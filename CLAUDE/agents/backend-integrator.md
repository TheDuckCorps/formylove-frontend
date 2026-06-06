# Agent: Backend Integrator

## Propósito
Conectar o frontend For My Love ao backend à medida que os endpoints forem implementados.

## Estado atual da integração

| Endpoint | Status | Arquivo frontend |
|----------|--------|-----------------|
| `POST /api/v1/sites` | 🔴 Não implementado no backend | `SiteRepository.create()` |
| `GET /api/v1/sites/:slug` | 🔴 Não implementado | `SiteRepository.getBySlug()` |
| `GET /api/v1/sites?email` | 🔴 Não implementado | `SiteRepository.listByEmail()` |
| `POST /api/v1/auth/otp/send` | 🔴 Não implementado | `AuthRepository.sendOTP()` |
| `POST /api/v1/auth/otp/verify` | 🔴 Não implementado | `AuthRepository.verifyOTP()` |
| `GET /api/v1/auth/confirm-email` | 🔴 Não implementado | `AuthRepository.confirmEmail()` |
| `POST /api/v1/payments` | 🟡 Existe estrutura, precisa ajuste | `PaymentRepository.create()` |
| `POST /api/v1/coupons/validate` | 🔴 Não implementado | `PaymentRepository.validateCoupon()` |

## Como integrar um novo endpoint

1. **Confirmar contrato**: verificar payload de request/response com o backend
2. **Atualizar interface**: ajustar `src/core/repositories/I*.ts` se necessário  
3. **Atualizar implementação**: ajustar `src/infrastructure/repositories/*.ts`
4. **Testar com dados reais**: usar `.env.local` com `VITE_API_BASE_URL=http://localhost:8080`

## Payload de criação do site

```typescript
// POST /api/v1/sites
{
  ownerEmail: string,
  planType: 'BASIC' | 'INTERMEDIATE' | 'PREMIUM',
  qrTemplate: string,
  pages: Array<{
    id: string,
    type: PageType,   // 'MEDIDOR_AMOR' | 'QUIZ_AFETIVO' | ...
    order: number,
    data: object      // depende do type — ver src/core/entities/Page.ts
  }>
}

// Response
{
  site: { id, slug, status, expirationDate, ... },
  paymentId: string
}
```

## Variáveis de ambiente

```env
# .env.local (não comitar)
VITE_API_BASE_URL=http://localhost:8080
```

O token JWT é salvo em `sessionStorage` com key `hl_token` e injetado automaticamente pelo interceptor do `httpClient`.
