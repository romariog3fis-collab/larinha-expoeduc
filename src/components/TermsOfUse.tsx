import React from 'react';

export const TermsOfUse: React.FC = () => {
  return (
    <div className="min-h-screen font-sans" style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%)' }}>
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <a href="/" className="inline-flex items-center gap-2 text-sm text-sky-600 hover:text-sky-700 transition-colors mb-6">
            ← Voltar ao início
          </a>
          <h1 className="text-2xl font-bold text-slate-900">Termos de Uso</h1>
          <p className="text-sm text-slate-500 mt-1">Última atualização: 24 de julho de 2026</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-6 text-sm text-slate-700 leading-relaxed">

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">1. Sobre a Aplicação</h2>
            <p>
              A <strong>Larinha ExpoEduc</strong> é um chatbot assistente virtual desenvolvido para apoiar os participantes
              do evento <strong>ExpoEduc 2026</strong>, realizado no Centro de Convenções de Natal/RN nos dias 23, 24 e 25
              de julho de 2026.
            </p>
            <p className="mt-2">
              A aplicação utiliza a marca e identidade visual da <strong>Teachy</strong> mediante autorização expressa,
              sendo operada e mantida por <strong>Romário Maia Ramos</strong> (pessoa física).
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">2. Funcionalidades</h2>
            <p>A Larinha oferece as seguintes funcionalidades:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Informações sobre a programação do evento (palestras, arenas, horários)</li>
              <li>Dicas sobre credenciamento, alimentação, turismo e logística em Natal/RN</li>
              <li>Informações sobre as soluções e ferramentas da Teachy</li>
              <li>Pré-cadastro de participantes para credenciamento no evento</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">3. Limitação de Responsabilidade</h2>
            <p>
              A Larinha é um assistente baseado em <strong>inteligência artificial</strong>. Embora suas respostas sejam
              fundamentadas em informações oficiais do evento, <strong>podem ocorrer imprecisões ou erros</strong>.
            </p>
            <p className="mt-2">
              O usuário deve sempre confirmar informações críticas (horários, locais, preços) diretamente com
              a organização oficial do evento. O responsável pela aplicação <strong>não se responsabiliza</strong> por
              decisões tomadas exclusivamente com base nas respostas do chatbot.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">4. Uso Adequado</h2>
            <p>Ao utilizar esta aplicação, o usuário se compromete a:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Fornecer informações verdadeiras no cadastro</li>
              <li>Não utilizar a aplicação para fins ilegais, fraudulentos ou abusivos</li>
              <li>Não tentar contornar, desabilitar ou interferir nos mecanismos de segurança da aplicação</li>
              <li>Não enviar conteúdo ofensivo, discriminatório ou que viole direitos de terceiros</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">5. Propriedade Intelectual</h2>
            <p>
              A marca <strong>Larinha</strong>, o logotipo da arara-azul-claro e a identidade visual da <strong>Teachy</strong> são
              propriedade intelectual de seus respectivos titulares. O uso nesta aplicação é feito
              sob autorização e não confere ao usuário qualquer direito sobre essas marcas.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">6. Disponibilidade</h2>
            <p>
              A aplicação é fornecida "como está" (<em>as is</em>), sem garantias de disponibilidade ininterrupta.
              O responsável poderá, a qualquer momento e sem aviso prévio, modificar, suspender ou encerrar
              a aplicação, especialmente após o término do evento ExpoEduc 2026.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">7. Privacidade e Proteção de Dados</h2>
            <p>
              O tratamento de dados pessoais realizado por esta aplicação está descrito em nossa{' '}
              <a href="/privacidade" className="text-sky-600 hover:underline font-medium">Política de Privacidade</a>,
              que integra estes Termos de Uso e deve ser lida e aceita antes da utilização do serviço.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">8. Alterações nos Termos</h2>
            <p>
              Estes Termos de Uso podem ser atualizados a qualquer momento. Alterações significativas serão
              comunicadas através da aplicação. O uso continuado após alterações constitui aceitação dos novos termos.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">9. Legislação Aplicável e Foro</h2>
            <p>
              Estes Termos de Uso são regidos pela legislação da República Federativa do Brasil.
              Fica eleito o foro da comarca de <strong>Natal/RN</strong> para dirimir quaisquer controvérsias
              oriundas destes Termos, com renúncia expressa a qualquer outro, por mais privilegiado que seja.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">10. Contato</h2>
            <p>
              Para dúvidas, sugestões ou reclamações sobre estes Termos de Uso ou sobre a aplicação, entre em contato:
            </p>
            <div className="bg-slate-50 rounded-xl p-4 mt-2 border border-slate-100">
              <p><strong>Romário Maia Ramos</strong></p>
              <p>E-mail: <a href="mailto:romariog3.fis@gmail.com" className="text-sky-600 hover:underline">romariog3.fis@gmail.com</a></p>
            </div>
          </section>

          {/* Footer */}
          <div className="pt-4 border-t border-slate-100 text-xs text-slate-400 text-center">
            <p>Romário Maia Ramos — Responsável pela Aplicação</p>
            <p>Larinha ExpoEduc © 2026 — Todos os direitos reservados</p>
          </div>
        </div>
      </div>
    </div>
  );
};
