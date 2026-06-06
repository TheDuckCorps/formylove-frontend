import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'

export function TermosUsoView() {
  return (
    <div className="page-wrapper">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-1">
          Termos de Uso
        </h1>
        <p className="text-xs text-gray-400 text-center mb-8">
          Última atualização: [INSERIR DATA]
        </p>
        <p className="text-sm text-gray-500 text-center mb-10">
          Ao utilizar o For My Love, você concorda com estes Termos de Uso. Leia-os atentamente.
        </p>

        <div className="text-sm text-gray-700 space-y-6">
          {[
            {
              title: '1. Aceitação dos Termos',
              body: `Ao criar uma conta ou usar o serviço, você confirma que:\n• Tem 18 anos ou mais (ou autorização de um responsável, se menor).\n• Concorda com todas as condições aqui descritas.`,
            },
            {
              title: '2. Descrição do Serviço',
              body: `O For My Love é uma plataforma que permite:\n• Criar páginas interativas com jogos, quizzes, presentes virtuais e mensagens multimídia.\n• Personalizar conteúdo com imagens, vídeos, áudios e desenhos.\n• Compartilhar experiências com amigos, familiares ou parceiros.`,
            },
            {
              title: '3. Registro de Conta',
              body: `• Dados obrigatórios: E-mail válido e senha segura.\n• Você é responsável por manter a confidencialidade da conta e notificar acesso não autorizado.`,
            },
            {
              title: '4. Conteúdo do Usuário',
              body: `• Propriedade: Você mantém a posse do conteúdo que enviar (imagens, vídeos, textos).\n• Licença: Ao enviar conteúdo, concede ao For My Love o direito não exclusivo de hospedá-lo e exibi-lo na plataforma.\n• Proibições: Não envie material legal, ofensivo, discriminatório ou que viole direitos de terceiros.`,
            },
            {
              title: '5. Conduta Proibida',
              body: `Você não poderá:\n• Usar a plataforma para atividades ilegais ou prejudiciais.\n• Copiar, modificar ou distribuir funcionalidades do For My Love sem autorização.\n• Interferir na segurança ou desempenho do serviço.`,
            },
            {
              title: '6. Pagamentos e Assinaturas',
              body: `• Planos pagos: Valores e benefícios são descritos no site.\n• Renovação automática: Assinaturas recorrentes podem ser canceladas a qualquer momento.\n• Reembolsos: Siga as regras descritas na Política de Privacidade.`,
            },
            {
              title: '7. Interrupção do Serviço',
              body: `O For My Love pode sofrer indisponibilidade devido a:\n• Manutenções programadas.\n• Falhas em serviços de terceiros (hospedagem, pagamento).\nNão nos responsabilizamos por perdas causadas por interrupções.`,
            },
            {
              title: '8. Rescisão',
              body: `Podemos encerrar ou suspender sua conta, sem aviso prévio, se:\n• Violar estes Termos.\n• Desrespeitar direitos de outros usuários.`,
            },
            {
              title: '9. Limitação de Responsabilidade',
              body: `O For My Love é fornecido "no estado em que se encontra", sem garantias de disponibilidade ou adequação a fins específicos.\nNão nos responsabilizamos por:\n• Conteúdo gerado por usuários.\n• Danos indiretos (lucros cessantes, perda de dados).`,
            },
            {
              title: '10. Alterações nos Termos',
              body: `• Atualizaremos estes Termos periodicamente.\n• Alterações serão comunicadas por e-mail ou notificação no site.`,
            },
            {
              title: '11. Lei Aplicável',
              body: `• Estes Termos são regidos pela legislação brasileira (Lei nº 13.709/2018 - LGPD). Disputas serão resolvidas no foro de [INSERIR CIDADE/ESTADO].`,
            },
            {
              title: '12. Contato',
              body: `Para dúvidas ou suporte:\n• E-mail: [INSERIR E-MAIL]\n• WhatsApp: [INSERIR NÚMERO]`,
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
