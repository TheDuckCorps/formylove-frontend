const PATTERNS: Array<{ test: RegExp | ((msg: string) => boolean); message: string }> = [
  {
    test: /network|failed to fetch|network error|ECONNREFUSED|ERR_NETWORK/i,
    message: 'Sem conexão com a internet. Verifique sua rede e tente de novo.',
  },
  {
    test: /timeout|timed out|ETIMEDOUT/i,
    message: 'A conexão demorou demais. Tente novamente em instantes.',
  },
  {
    test: /metadata for|SiteEntity|TypeORM|EntityMetadata|Unavailable Service/i,
    message: 'Estamos com instabilidade no servidor. Tente de novo em alguns minutos.',
  },
  {
    test: /404|not found|não encontrad/i,
    message: 'Não encontramos o que você procura. Verifique o link e tente novamente.',
  },
  {
    test: /401|403|unauthorized|forbidden|não autorizado/i,
    message: 'Você não tem permissão para acessar isso.',
  },
  {
    test: /500|502|503|504|internal server/i,
    message: 'Algo deu errado do nosso lado. Tente novamente em instantes.',
  },
  {
    test: /invalid email|e-mail inválido/i,
    message: 'Digite um e-mail válido para continuar.',
  },
]

const DEFAULT_MESSAGE = 'Algo deu errado. Tente novamente em instantes.'

export function getFriendlyMessage(error: unknown, fallback = DEFAULT_MESSAGE): string {
  if (!error) return fallback

  const raw =
    error instanceof Error
      ? error.message
      : typeof error === 'string'
        ? error
        : fallback

  if (!raw || raw === 'Erro desconhecido') return fallback

  for (const { test, message } of PATTERNS) {
    if (typeof test === 'function' ? test(raw) : test.test(raw)) {
      return message
    }
  }

  if (raw.length > 120 || /Entity|metadata|TypeORM|stack|undefined/i.test(raw)) {
    return fallback
  }

  return raw
}
