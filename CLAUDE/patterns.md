# For My Love Frontend — Padrões e Estrutura

## Visão Geral

**For My Love Frontend** é uma SPA (Single Page Application) construída com **Vite + React + TypeScript + Tailwind CSS**, seguindo o padrão **MVVM** (Model-View-ViewModel) com camadas hexagonais adaptadas para o frontend.

---

## Arquitetura MVVM

```
┌────────────────────────────────────────────┐
│  View (src/presentation/views/ + components/)│  ← Componentes React puros
├────────────────────────────────────────────┤
│  ViewModel (src/presentation/viewModels/)   │  ← Hooks com lógica de UI/negócio
├────────────────────────────────────────────┤
│  Model (src/core/entities/ + repositories/) │  ← Contratos de domínio
├────────────────────────────────────────────┤
│  Infrastructure (src/infrastructure/)       │  ← Implementações HTTP
└────────────────────────────────────────────┘
```

### Regras por camada

| Camada | Responsabilidade | Não deve |
|--------|-----------------|----------|
| **View** | Renderizar UI, capturar eventos | Chamar APIs diretamente |
| **ViewModel** | Orquestrar store + repositórios, transformar dados | Conter JSX |
| **Core/Entity** | Definir tipos de domínio | Importar React |
| **Infrastructure** | Implementar chamadas HTTP | Ter lógica de negócio |

---

## Estrutura de Pastas

```
src/
├── core/
│   ├── entities/          # Tipos de domínio (Site, Page, Payment)
│   └── repositories/      # Interfaces de repositório (contratos)
│
├── infrastructure/
│   ├── api/               # httpClient (Axios configurado)
│   └── repositories/      # Implementações concretas das interfaces
│
├── presentation/
│   ├── components/
│   │   ├── common/        # Button, Input, Textarea, Logo
│   │   ├── layout/        # Header, Footer, EditorHeader
│   │   └── pages/         # Editores de cada tipo de página
│   ├── modals/            # EmailModal, EditarPaginasModal
│   ├── viewModels/        # useSiteViewModel, useEditorViewModel
│   └── views/             # Uma view por rota (LandingView, EditorView…)
│
├── shared/
│   ├── constants/         # routes.ts, outros constantes
│   ├── store/             # siteBuilderStore.ts (Zustand com persist)
│   └── utils/             # nanoid, helpers
│
├── App.tsx                # React Router — wiring de todas as rotas
└── main.tsx               # Entry point
```

---

## Design System

### Cores (Tailwind)

| Token | Valor | Uso |
|-------|-------|-----|
| `brand` / `brand-DEFAULT` | `#C62A87` | Cor primária, textos de destaque |
| `brand-light` | `#E91E8C` | Gradiente direito dos botões |
| `brand-dark` | `#A01E6E` | Hover states |
| `brand-50` | `#FFF0F7` | Backgrounds suaves |
| `bg-brand-gradient` | `135deg #C62A87→#E91E8C` | Botões primários, chips |

### Tipografia

- Fonte: **Inter** (Google Fonts, pesos 400/500/600/700/800)
- Tamanhos seguem escala Tailwind padrão

### Classes utilitárias (definidas em `index.css`)

| Classe | Uso |
|--------|-----|
| `.btn-brand` | Botão primário com gradiente |
| `.btn-brand-outline` | Botão secundário |
| `.input-base` | Campo de texto padrão |
| `.upload-zone` | Área de upload com borda tracejada |
| `.page-wrapper` | Wrapper padrão de página (`min-h-screen bg-page-gradient flex flex-col`) |
| `.editor-wrapper` | Wrapper das telas de editor |

---

## Fluxo de Criação do Presente

```
/ (Landing)
  └── /criar             → EscolherPaginasView
        └── /criar/editor  → EditorView (currentPageIndex no store)
              └── /criar/qrcode → QRCodeTemplateView
                    └── EmailModal → POST /api/v1/sites
                          └── /criar/pagamento → PaymentView
                                └── /criar/sucesso
```

---

## State Management (Zustand)

Store: `src/shared/store/siteBuilderStore.ts`  
Persiste no `localStorage` com key `for-my-love-builder`.

```typescript
// Campos principais:
email: string                   // identificador do usuário
isEmailVerified: boolean
planType: PlanType | null       // BASIC | INTERMEDIATE | PREMIUM
selectedPages: PageItem[]       // páginas escolhidas (ordenadas)
currentPageIndex: number        // índice do editor atual
qrTemplate: string              // id do template de QR Code
maxPages: number                // derivado do planType
```

---

## Integração com Backend

### Payload `pages` (JSONB)

O campo `pages` enviado ao backend é exatamente `selectedPages` do store:

```json
[
  {
    "id": "abc123",
    "type": "MEDIDOR_AMOR",
    "order": 0,
    "data": {
      "question": "Você sabe o quanto eu te amo?",
      "secret": "Mais do que o infinito",
      "imageUrl": "data:image/jpeg;base64,..."
    }
  },
  {
    "id": "def456",
    "type": "QUIZ_AFETIVO",
    "order": 1,
    "data": {
      "question": "Quando nos conhecemos?",
      "answers": [
        { "id": "1", "text": "2019", "isCorrect": false },
        { "id": "2", "text": "2021", "isCorrect": true }
      ]
    }
  }
]
```

### Endpoints esperados

| Método | Rota | Descrição |
|--------|------|-----------|
| `POST` | `/api/v1/sites` | Cria site (email, planType, pages, qrTemplate) |
| `GET` | `/api/v1/sites/:slug` | Acesso público ao site |
| `GET` | `/api/v1/sites?email=...` | Lista sites do usuário (autenticado) |
| `POST` | `/api/v1/auth/otp/send` | Envia OTP para o email |
| `POST` | `/api/v1/auth/otp/verify` | Verifica OTP, retorna JWT |
| `GET` | `/api/v1/auth/confirm-email?token=...` | Confirma email de criação |
| `POST` | `/api/v1/payments` | Cria cobrança Pix (AbacatePay) |
| `POST` | `/api/v1/coupons/validate` | Valida cupom de desconto |

---

## Convenções de Código

- Nomes de componentes: **PascalCase** (`EditorView`, `MedidorAmorPage`)
- Nomes de hooks/viewModels: **camelCase com prefixo `use`** (`useSiteViewModel`)
- Arquivos de entidade: **PascalCase** (`Site.ts`, `Page.ts`)
- Arquivos de repositório/infra: **PascalCase** (`SiteRepository.ts`)
- Constantes: **SCREAMING_SNAKE_CASE** nos valores, `camelCase` na variável exportada

---

## Adicionando um Novo Tipo de Página

1. Adicionar o tipo a `PageType` em `src/core/entities/Page.ts`
2. Criar a interface de dados correspondente (`XxxData`)
3. Adicionar entrada em `PAGE_TYPES_META` com `defaultData`
4. Criar o componente editor em `src/presentation/components/pages/XxxPage.tsx`
5. Adicionar o `case` no switch de `PageEditorSwitch` em `EditorView.tsx`
