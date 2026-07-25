import React from 'react';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen font-sans" style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%)' }}>
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <a href="/" className="inline-flex items-center gap-2 text-sm text-sky-600 hover:text-sky-700 transition-colors mb-6">
            ← Voltar ao início
          </a>
          <h1 className="text-2xl font-bold text-slate-900">Política de Privacidade</h1>
          <p className="text-sm text-slate-500 mt-1">Última atualização: 24 de julho de 2026</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-6 text-sm text-slate-700 leading-relaxed">

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">1. Controlador dos Dados</h2>
            <p>
              O responsável pelo tratamento dos dados pessoais coletados por meio desta aplicação é:
            </p>
            <div className="bg-slate-50 rounded-xl p-4 mt-2 border border-slate-100">
              <p><strong>Nome:</strong> Romário Maia Ramos</p>
              <p><strong>E-mail de contato:</strong> romariog3.fis@gmail.com</p>
              <p><strong>Aplicação:</strong> Larinha ExpoEduc — Assistente virtual do evento ExpoEduc 2026</p>
              <p className="text-xs text-slate-500 mt-2">
                Esta aplicação utiliza a marca e identidade visual da <strong>Teachy</strong> mediante autorização expressa da empresa.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">2. Dados Coletados</h2>
            <p>Coletamos os seguintes dados pessoais mediante seu consentimento explícito:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li><strong>Nome completo</strong> — identificação do participante</li>
              <li><strong>Escola / Instituição</strong> — vínculo profissional</li>
              <li><strong>Cidade / Estado</strong> — localização geográfica</li>
              <li><strong>Perfil profissional</strong> — função exercida (Professor, Coordenador, Diretor, Gestor ou Outro)</li>
              <li><strong>Contato (WhatsApp/Telefone)</strong> — canal de comunicação</li>
              <li><strong>E-mail</strong> (opcional) — para receber informações sobre o evento</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">3. Finalidade do Tratamento</h2>
            <p>Seus dados pessoais são coletados e tratados exclusivamente para as seguintes finalidades:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Credenciamento e identificação de participantes no evento <strong>ExpoEduc 2026</strong></li>
              <li>Personalização da experiência de atendimento pelo chatbot Larinha</li>
              <li>Comunicação de informações relevantes sobre o evento (apenas se o e-mail for fornecido voluntariamente)</li>
              <li>Análise estatística agregada do perfil dos participantes (sem identificação individual)</li>
            </ul>
            <p className="mt-2">
              <strong>Não utilizamos seus dados para marketing de terceiros, venda ou compartilhamento comercial de qualquer natureza.</strong>
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">4. Base Legal</h2>
            <p>
              O tratamento dos seus dados pessoais é realizado com fundamento no <strong>consentimento do titular</strong>,
              conforme o Art. 7º, inciso I, da Lei nº 13.709/2018 (Lei Geral de Proteção de Dados — LGPD).
            </p>
            <p className="mt-2">
              O consentimento é coletado de forma livre, informada, inequívoca e específica, por meio de checkbox
              obrigatório no formulário de pré-cadastro, antes do envio dos dados.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">5. Compartilhamento de Dados</h2>
            <p>
              Seus dados pessoais poderão ser compartilhados <strong>exclusivamente</strong> com:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li><strong>Equipe organizadora do evento ExpoEduc 2026</strong> — para fins de credenciamento e logística</li>
              <li><strong>Teachy</strong> — empresa parceira cujo chatbot (Larinha) é utilizado como interface de atendimento</li>
            </ul>
            <p className="mt-2">
              Não compartilhamos, vendemos ou transferimos seus dados a quaisquer terceiros fora do escopo acima descrito.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">6. Armazenamento e Segurança</h2>
            <p>
              Os dados são armazenados em servidores seguros da plataforma <strong>Vercel</strong> (infraestrutura em nuvem),
              com proteção por criptografia em trânsito (HTTPS/TLS) e acesso restrito por credenciais autenticadas.
            </p>
            <p className="mt-2">
              <strong>Período de retenção:</strong> Os dados serão mantidos pelo período do evento ExpoEduc 2026 acrescido de
              <strong> 90 (noventa) dias</strong>, após os quais serão permanentemente excluídos, salvo obrigação legal em contrário.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">7. Direitos do Titular</h2>
            <p>
              Conforme os artigos 17 e 18 da LGPD, você tem direito a, a qualquer momento:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li><strong>Confirmar</strong> a existência de tratamento dos seus dados</li>
              <li><strong>Acessar</strong> os dados pessoais coletados</li>
              <li><strong>Corrigir</strong> dados incompletos, inexatos ou desatualizados</li>
              <li><strong>Solicitar a exclusão</strong> dos seus dados pessoais</li>
              <li><strong>Revogar o consentimento</strong> a qualquer momento</li>
              <li><strong>Obter informações</strong> sobre o compartilhamento dos dados</li>
            </ul>
            <p className="mt-2">
              Para exercer qualquer desses direitos, entre em contato pelo e-mail: {' '}
              <a href="mailto:romariog3.fis@gmail.com" className="text-sky-600 hover:underline font-medium">
                romariog3.fis@gmail.com
              </a>
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Responderemos à sua solicitação em até 15 (quinze) dias úteis, conforme previsto na LGPD.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">8. Cookies e Dados de Navegação</h2>
            <p>
              Esta aplicação utiliza o <strong>localStorage</strong> do navegador para armazenar suas preferências
              de sessão e histórico de conversa com o chatbot. Esses dados são armazenados exclusivamente no seu
              dispositivo e podem ser removidos a qualquer momento limpando os dados do navegador.
            </p>
            <p className="mt-2">
              Não utilizamos cookies de rastreamento, pixels de terceiros ou ferramentas de analytics que identifiquem o usuário individualmente.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">9. Alterações nesta Política</h2>
            <p>
              Esta Política de Privacidade pode ser atualizada a qualquer momento. Caso haja alterações substanciais,
              os usuários serão notificados através da aplicação. A data da última atualização estará sempre indicada
              no topo deste documento.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">10. Legislação Aplicável e Foro</h2>
            <p>
              Esta Política de Privacidade é regida pela legislação brasileira, em especial pela
              Lei nº 13.709/2018 (LGPD) e pelo Código de Defesa do Consumidor (Lei nº 8.078/1990).
            </p>
            <p className="mt-2">
              Fica eleito o foro da comarca de <strong>Natal/RN</strong> para dirimir quaisquer controvérsias
              decorrentes desta Política.
            </p>
          </section>

          {/* Footer */}
          <div className="pt-4 border-t border-slate-100 text-xs text-slate-400 text-center">
            <p>Romário Maia Ramos — Controlador de Dados Pessoais</p>
            <p>Larinha ExpoEduc © 2026 — Todos os direitos reservados</p>
          </div>
        </div>
      </div>
    </div>
  );
};
