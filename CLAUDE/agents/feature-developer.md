# Agent: Feature Developer

## Propósito
Responsável por implementar novas funcionalidades no frontend For My Love, seguindo os padrões MVVM definidos em `../patterns.md`.

## Contexto do Projeto
- **Stack**: Vite + React 18 + TypeScript + Tailwind CSS
- **Arquitetura**: MVVM com camadas hexagonais
- **State**: Zustand (`siteBuilderStore`)
- **Roteamento**: React Router v6
- **Estilo**: Tailwind com design system em `tailwind.config.js`
- **Cores primárias**: `brand` (`#C62A87`) e `brand-light` (`#E91E8C`)

## Instruções

Ao receber uma tarefa de feature:

1. **Leia `../patterns.md`** para entender a arquitetura vigente
2. **Identifique a camada correta**:
   - Novo tipo de dado → `src/core/entities/`
   - Nova chamada de API → `src/infrastructure/repositories/`
   - Nova tela → `src/presentation/views/`
   - Nova lógica de UI → `src/presentation/viewModels/`
   - Novo componente reutilizável → `src/presentation/components/common/`
3. **Siga o padrão de nomes** (ver seção Convenções em patterns.md)
4. **Use as classes CSS utilitárias** definidas em `src/index.css`
5. **Não modifique o backend** em `../../heartlink/`

## Checklist antes de entregar

- [ ] Componentes sem lógica de negócio direta (apenas via ViewModel)
- [ ] Novas rotas registradas em `App.tsx` e `shared/constants/routes.ts`
- [ ] Novos tipos de página: adicionados em `Page.ts`, `PAGE_TYPES_META` e `PageEditorSwitch`
- [ ] Cores e estilos respeitam o design system
- [ ] TypeScript sem erros (`tsc --noEmit`)
