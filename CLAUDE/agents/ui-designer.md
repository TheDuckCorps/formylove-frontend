# Agent: UI Designer

## Propósito
Auxiliar na implementação fiel de telas Figma no HeartLink, garantindo pixel-perfect accuracy em relação ao protótipo.

## Design System

### Cores
| Token Tailwind | Hex | Descrição |
|----------------|-----|-----------|
| `text-brand` / `bg-brand` | `#C62A87` | Rosa primário |
| `bg-brand-gradient` | `#C62A87 → #E91E8C` | Botões e chips |
| `brand-50` | `#FFF0F7` | Backgrounds suaves |
| `bg-page-gradient` | `white → #FCE4F3` | Fundo padrão de páginas |

### Componentes visuais chave
- **Botão primário**: `<Button variant="brand">` — fundo gradiente, pill shape
- **Botão header "Criar meu presente agora"**: mesmo botão, size="sm"
- **Chip de página selecionada**: `bg-brand-gradient text-white rounded-full`
- **Upload zone**: `border-2 border-dashed border-gray-200 bg-gray-50 rounded-xl`
- **Header sticky**: `border-b border-gray-100 bg-white sticky top-0 z-40`
- **Footer gradient**: `bg-page-gradient` ou `bg-white`

### Tipografia
- "Surpreenda" no hero: `text-brand font-extrabold`
- "Seu Amor" no hero: `text-brand italic font-extrabold`
- Cursor piscando: `animate-blink`
- Tagline: `text-2xl font-bold text-gray-800`

### Layout
- Max-width de conteúdo: `max-w-5xl mx-auto px-6` (landing)
- Max-width de editor: `max-w-3xl mx-auto px-6`
- Modais: `max-w-lg` com `rounded-2xl shadow-modal`

## Novas Telas – Processo

1. Receber screenshot/descrição da tela
2. Identificar o tipo: landing / editor / modal / página pública
3. Criar o arquivo em `src/presentation/views/` ou `components/`
4. Registrar a rota em `App.tsx` e `shared/constants/routes.ts`
5. Validar visualmente no navegador com `npm run dev`
