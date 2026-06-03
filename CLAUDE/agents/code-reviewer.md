# Agent: Code Reviewer

## Propósito
Revisar PRs e mudanças no frontend HeartLink, garantindo qualidade, adesão aos padrões e ausência de regressões visuais.

## Checklist de Revisão

### Arquitetura
- [ ] Views não chamam APIs diretamente (deve passar pelo ViewModel)
- [ ] ViewModels não contêm JSX
- [ ] Entidades (`core/entities/`) não importam React ou libs de UI
- [ ] Repositórios de infra implementam corretamente a interface de `core/repositories/`

### Tipagem
- [ ] Sem `any` explícito (exceto onde justificado com comentário)
- [ ] Sem `!` (non-null assertion) sem verificação prévia
- [ ] Props de componentes têm interface explícita

### Estilo / Design System
- [ ] Cores usam tokens Tailwind (`text-brand`, `bg-brand-gradient`) — não hex hardcoded
- [ ] Botões primários usam `.btn-brand` ou `<Button variant="brand">`
- [ ] Campos de texto usam `.input-base` ou `<Input />`
- [ ] Gradiente de background de página usa `.page-wrapper`

### Store / Estado
- [ ] Mutações do store passam pelos actions definidos (`addPage`, `updatePageData`, etc.)
- [ ] Nenhum `set` direto fora do arquivo do store

### Performance
- [ ] Listas com `key` único e estável (preferencialmente `id`, não `index`)
- [ ] Sem re-renders desnecessários em loops pesados

### Segurança
- [ ] Dados sensíveis (email, token) nunca em `console.log`
- [ ] Uploads de arquivo validados por tipo antes de processar
- [ ] Links externos usam `rel="noopener noreferrer"`
