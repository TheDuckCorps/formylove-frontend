import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'

export function PrivacidadeView() {
  return (
    <div className="page-wrapper">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-1">
          Política de Privacidade
        </h1>
        <p className="text-xs text-gray-400 text-center mb-8">
          Última atualização: [INSERIR DATA]
        </p>
        <p className="text-sm text-gray-500 text-center mb-10">
          Ao utilizar o For My Love, você concorda com esta política de privacidade. Leia-os atentamente.
        </p>

        <div className="prose prose-sm max-w-none text-gray-700 space-y-6">
          {[
            {
              title: '1. Informações Coletadas',
              body: `Ao usar o For My Love, coletamos:\n• E-mail: Necessário para criar e acessar sua conta.\n• Conteúdo multimídia: Imagens, áudios, vídeos e desenhos enviados para personalizar suas páginas interativas.\n• Dados de interação: Como respostas a quizzes, resultados de jogos e preferências de personalização.\n• Cookies e tecnologias similares: Usamos serviços externos para análises de tráfego e melhora da experiência.`,
            },
            {
              title: '2. Uso das Informações',
              body: `Seus dados são utilizados para:\n• Criar e manter suas páginas personalizadas (ex: jogos, quizzes, presentes virtuais).\n• Melhorar a navegação, personalização e funcionalidades do site.\n• Garantir a segurança e integridade do serviço.\n• Enviar comunicações sobre atualizações, suporte ou novidades (via e-mail ou WhatsApp).`,
            },
            {
              title: '3. Armazenamento e Proteção',
              body: `• Utilizamos serviços externos confiáveis (ex: AWS, Google Cloud) para armazenar seus dados.\n• Empregamos medidas técnicas (criptografia, firewalls) para proteger suas informações contra acesso não autorizado.`,
            },
            {
              title: '4. Compartilhamento de Dados',
              body: `• Nunca vendemos ou compartilhamos seus dados com terceiros não essenciais.\n• Usamos apenas serviços técnicos indispensáveis ao funcionamento da plataforma (ex: hospedagem, processamento de pagamento).`,
            },
            {
              title: '5. Direitos dos Usuários',
              body: `• Excluir seus dados: Solicite via e-mail [INSERIR E-MAIL] ou WhatsApp [INSERIR NÚMERO].\n• Gerenciar cookies: Ajuste as configurações no seu navegador.`,
            },
            {
              title: '6. Pagamentos e Segurança',
              body: `• Não armazenamos dados financeiros. Pagamentos são processados por plataformas externas seguras (ex: Stripe, Mercado Pago).`,
            },
            {
              title: '7. Reembolsos',
              body: `• Solicite reembolsos dentro de 24 horas após a compra, caso o serviço não tenha sido utilizado.\n• Após esse período, reembolsos não serão aceitos.\n• Contate-nos via [INSERIR E-MAIL] ou [INSERIR WHATSAPP] para solicitações.`,
            },
            {
              title: '8. Interrupção do Serviço',
              body: `• O For My Love pode sofrer interrupções devido a falhas técnicas ou manutenções programadas.\n• Não nos responsabilizamos por perdas causadas por tais interrupções. Para casos de interrupção prolongada, entre em contato via e-mail para avaliar compensação proporcional.`,
            },
            {
              title: '9. Alterações na Política',
              body: `• Atualizações serão comunicadas no site. Recomendamos revisar periodicamente.`,
            },
            {
              title: '10. Contato',
              body: `Para dúvidas, suporte ou solicitações:\n• E-mail: [INSERIR E-MAIL]\n• WhatsApp: [INSERIR NÚMERO]`,
            },
          ].map((section) => (
            <div key={section.title}>
              <h2 className="text-base font-bold text-gray-800 mb-2">{section.title}</h2>
              <div className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">
                {section.body}
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}
