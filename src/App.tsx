import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Bot, User, Menu, Info, MapPin } from 'lucide-react';
import Markdown from 'react-markdown';
import { ChatMessage } from './types';

const WELCOME_MESSAGE = "Olá, educador(a)! Que alegria ter você por aqui! 🦜✨ Eu sou a **Larinha**, a mascote arara-azul-claro da **Teachy**, e serei a sua guia oficial na **ExpoEduc 2026**!\n\nComo defensora de uma rotina docente mais ágil e menos exaustiva, quero te fazer um convite: que tal descobrir como a **Teachy e nossas soluções de Inteligência Artificial** podem transformar a sua prática pedagógica? Nós ajudamos professores e gestores a reduzirem a sobrecarga de tarefas administrativas, criando planos de aula criativos, avaliações personalizadas e relatórios em segundos, permitindo que você foque no que realmente importa: o desenvolvimento integral dos seus estudantes! 🚀\n\nEstou pronta para te ajudar a voar alto neste congresso. Quer saber mais sobre a programação do Palco Max - AI4School, dicas de restaurantes com descontos em Natal ou como funciona o credenciamento antecipado? Me diga: qual é o seu principal desafio pedagógico hoje e como posso te ajudar?";

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      parts: [{ text: WELCOME_MESSAGE }]
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      parts: [{ text: messageText.trim() }]
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg.parts[0].text,
          history: messages
        })
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Rate limit exceeded');
        }
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      const modelMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        parts: [{ text: data.text }]
      };

      setMessages(prev => [...prev, modelMsg]);
    } catch (error: any) {
      console.error('Error:', error);
      let errorText = 'Ops! Parece que minhas asas se enrolaram num galho. Não consegui conectar com o servidor no momento. 🦜';
      if (error.message === 'Rate limit exceeded') {
        errorText = 'Ops! Estou recebendo muitas mensagens de professores incríveis ao mesmo tempo! 🦜 Por favor, aguarde cerca de um minuto e tente falar comigo novamente (limite de cota atingido).';
      }
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        parts: [{ text: errorText }]
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const textToSend = input;
    setInput('');
    await sendMessage(textToSend);
  };

  const handleNavAction = (topic: string) => {
    sendMessage(`Pode me falar sobre ${topic}?`);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans overflow-hidden text-slate-800">
      {/* Top Navigation Bar */}
      <nav className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 shrink-0">
        <div className="flex items-center gap-3">
          <img src="/larinha.png" alt="Logo" className="w-10 h-10 object-contain rounded-xl shadow-sm" onError={(e) => {
            // Fallback se a imagem não existir
            e.currentTarget.style.display = 'none';
            const nextSibling = e.currentTarget.nextElementSibling as HTMLElement;
            if (nextSibling) nextSibling.style.display = 'flex';
          }} />
          <div className="hidden w-10 h-10 bg-sky-500 rounded-xl items-center justify-center text-white font-bold text-2xl shadow-sm italic">T</div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 leading-tight uppercase tracking-tight">Larinha Teachy</h1>
            <p className="text-[10px] text-sky-600 font-semibold uppercase tracking-widest hidden sm:block">ExpoEduc 2026</p>
          </div>
        </div>
        <div className="hidden md:flex gap-6 text-sm font-medium text-slate-600 h-full">
          <span className="text-sky-600 border-b-2 border-sky-600 py-5">Assistente Virtual</span>
          <button onClick={() => handleNavAction('a programação')} disabled={isLoading} className="hover:text-sky-600 cursor-pointer py-5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Programação</button>
          <button onClick={() => handleNavAction('os restaurantes com desconto')} disabled={isLoading} className="hover:text-sky-600 cursor-pointer py-5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Restaurantes</button>
          <button onClick={() => handleNavAction('o credenciamento antecipado')} disabled={isLoading} className="hover:text-sky-600 cursor-pointer py-5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Credenciamento</button>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold">Centro de Convenções</p>
            <p className="text-[10px] text-slate-500">Natal, RN</p>
          </div>
          <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-500">
            <User size={16} />
          </div>
        </div>
      </nav>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Larinha Chat Interface */}
        <main className="w-full lg:w-2/3 flex flex-col border-r border-slate-200 bg-white">
          <div className="flex-1 p-4 sm:p-6 space-y-6 overflow-y-auto">
            {messages.map((msg) => (
              msg.role === 'model' ? (
                <div key={msg.id} className="flex gap-4">
                  <div className="shrink-0 w-12 h-12 bg-sky-100 rounded-2xl flex items-center justify-center border-2 border-sky-200 shadow-sm overflow-hidden p-1">
                    <img src="/larinha.png" alt="Larinha" className="w-full h-full object-contain" />
                  </div>
                  <div className="space-y-4 max-w-[90%] sm:max-w-[85%]">
                    <div className="bg-sky-50 border border-sky-100 rounded-2xl rounded-tl-none p-4 sm:p-5 shadow-sm">
                      <div className="markdown-body text-sm leading-relaxed text-slate-700 prose prose-sm sm:prose-base prose-sky max-w-none 
                                    prose-headings:font-bold prose-headings:text-slate-800 prose-p:my-2 prose-ul:my-2 prose-li:my-0
                                    [&_strong]:text-sky-700">
                        <Markdown>{msg.parts[0].text}</Markdown>
                      </div>
                    </div>
                    {msg.id === 'welcome' && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        <button onClick={() => sendMessage('Qual é a programação do Palco Max?')} disabled={isLoading} className="px-4 py-2 bg-white border border-slate-200 rounded-full text-xs font-medium hover:border-sky-500 hover:text-sky-600 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">🗓️ Programação Palco Max</button>
                        <button onClick={() => sendMessage('Quais restaurantes têm desconto?')} disabled={isLoading} className="px-4 py-2 bg-white border border-slate-200 rounded-full text-xs font-medium hover:border-sky-500 hover:text-sky-600 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">🍽️ Restaurantes com Desconto</button>
                        <button onClick={() => sendMessage('Como faço para chegar?')} disabled={isLoading} className="px-4 py-2 bg-white border border-slate-200 rounded-full text-xs font-medium hover:border-sky-500 hover:text-sky-600 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">📍 Como chegar</button>
                        <button onClick={() => sendMessage('Fale sobre a ExpoEduc Social')} disabled={isLoading} className="px-4 py-2 bg-white border border-slate-200 rounded-full text-xs font-medium hover:border-sky-500 hover:text-sky-600 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">🌱 ExpoEduc Social</button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div key={msg.id} className="flex gap-4 justify-end">
                  <div className="bg-slate-100 text-slate-700 border border-slate-200 rounded-2xl rounded-tr-none p-4 text-sm max-w-[85%] shadow-sm whitespace-pre-wrap">
                    {msg.parts[0].text}
                  </div>
                  <div className="w-10 h-10 bg-slate-300 rounded-full shrink-0 flex items-center justify-center text-white shadow-sm mt-1">
                    <User size={20} />
                  </div>
                </div>
              )
            ))}
            {isLoading && (
              <div className="flex gap-4">
                <div className="shrink-0 w-12 h-12 bg-sky-100 rounded-2xl flex items-center justify-center border-2 border-sky-200 shadow-sm overflow-hidden p-1">
                  <img src="/larinha.png" alt="Larinha" className="w-full h-full object-contain" />
                </div>
                <div className="space-y-4 max-w-[90%] sm:max-w-[85%]">
                  <div className="bg-sky-50 border border-sky-100 rounded-2xl rounded-tl-none p-5 shadow-sm flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin text-sky-500" />
                    <span className="text-sm font-medium text-sky-700">Larinha está digitando...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Area */}
          <div className="p-4 sm:p-5 border-t border-slate-100 flex items-center gap-3 bg-slate-50/50 shrink-0">
            <form
              onSubmit={handleSubmit}
              className="flex-1 relative"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Pergunte sobre palestras, expositores ou dicas de Natal..."
                className="w-full h-12 pl-4 pr-12 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-sm bg-white shadow-sm transition-shadow"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="absolute right-2 top-2 w-8 h-8 bg-sky-500 hover:bg-sky-600 disabled:bg-slate-300 text-white rounded-lg flex items-center justify-center font-bold transition-colors shadow-sm disabled:shadow-none"
                title="Enviar mensagem"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </main>

        {/* Right Side: Event Highlights Pane */}
        <aside className="hidden lg:flex w-1/3 bg-slate-50 flex-col p-6 gap-6 overflow-y-auto">
          {/* Event Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-sky-600">
              <div className="w-2 h-2 bg-sky-500 rounded-full"></div>
              <span className="text-[10px] font-bold uppercase tracking-wider">Evento em Destaque</span>
            </div>
            <h3 className="font-bold text-slate-900 leading-tight">Escola pra quê? Desafios da Educação 2030</h3>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="text-xs">
                <p className="text-slate-400">Data</p>
                <p className="font-semibold">23 - 25 Jul 2026</p>
              </div>
              <div className="text-xs">
                <p className="text-slate-400">Participantes</p>
                <p className="font-semibold underline text-sky-600">10.000 / dia</p>
              </div>
            </div>
          </div>

          {/* Quick Schedule */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Palco Max - Destaques</h4>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded-xl border-l-4 border-l-sky-500 border border-slate-200 shadow-sm">
                <p className="text-[10px] font-bold text-sky-600 uppercase">Amanhã • 13h50</p>
                <p className="text-xs font-bold">Thaís e Roberta (SOS Educação)</p>
                <p className="text-[10px] text-slate-500">A dor e a delícia de ser um Educador</p>
              </div>
              <div className="bg-white p-3 rounded-xl border-l-4 border-l-emerald-500 border border-slate-200 shadow-sm">
                <p className="text-[10px] font-bold text-emerald-600 uppercase">Amanhã • 15h20</p>
                <p className="text-xs font-bold">Sandro Bonás</p>
                <p className="text-[10px] text-slate-500">Como guiar nossos filhos na era da IA</p>
              </div>
              <div className="bg-white p-3 rounded-xl border-l-4 border-l-sky-500 border border-slate-200 shadow-sm">
                <p className="text-[10px] font-bold text-sky-600 uppercase">Amanhã • 17h00</p>
                <p className="text-xs font-bold">Cláudia Costin</p>
                <p className="text-[10px] text-slate-500">O Futuro do Trabalho e a Educação</p>
              </div>
            </div>
          </div>

          {/* Partners/Discounts */}
          <div className="bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-[10px] font-bold uppercase opacity-80 mb-1">Parceria ABRASEL</p>
              <h4 className="font-bold mb-2">Alimentação com Desconto</h4>
              <p className="text-[10px] leading-snug opacity-90">Apresente seu crachá e ganhe até 20% de desconto em restaurantes como Mangai, Dom Aquino e outros parceiros!</p>
            </div>
            <div className="absolute -right-4 -bottom-4 text-6xl opacity-20">🍽️</div>
          </div>

          {/* Sustainability Info */}
          <div className="mt-auto pt-4">
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white shrink-0 shadow-sm">🌱</div>
              <div className="text-[10px] leading-tight">
                <p className="font-bold text-emerald-800">ExpoEduc Social</p>
                <p className="text-emerald-700">Resíduos transformados em biogás e educação ambiental.</p>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Footer Status */}
      <footer className="hidden sm:flex h-10 bg-slate-100 border-t border-slate-200 items-center justify-between px-8 text-[10px] text-slate-400 shrink-0 font-medium">
        <div className="flex gap-4">
          <span>Natal, Julho de 2026</span>
          <span>|</span>
          <span>Dicas de Bagagem: Use roupas leves e calçados confortáveis</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
          <span className="text-emerald-600">Larinha está pronta para voar alto com você!</span>
        </div>
      </footer>
    </div>
  );
}

