import { useState, useRef, useEffect } from 'react';
import { ChatMessage } from './types';
import { Navbar } from './components/Navbar';
import { ChatWindow } from './components/ChatWindow';
import { ChatInput } from './components/ChatInput';
import { Sidebar } from './components/Sidebar';
import { MobileScheduleModal } from './components/MobileScheduleModal';
import { Footer } from './components/Footer';

const WELCOME_MESSAGE = "Olá, educador(a)! Que alegria ter você por aqui! 🦜✨ Eu sou a **Larinha**, a mascote arara-azul-claro da **Teachy**, e serei a sua guia oficial na **ExpoEduc 2026**!\n\nComo defensora de uma rotina docente mais ágil e menos exaustiva, quero te fazer um convite: que tal descobrir como a **Teachy e nossas soluções de Inteligência Artificial** podem transformar a sua prática pedagógica? Nós ajudamos professores e gestores a reduzirem a sobrecarga de tarefas administrativas, criando planos de aula criativos, avaliações personalizadas e relatórios em segundos, permitindo que você foque no que realmente importa: o desenvolvimento integral dos seus estudantes! 🚀\n\nEstou pronta para te ajudar a voar alto neste congresso. Quer saber mais sobre a programação do Palco Max - AI4School, dicas de restaurantes com descontos em Natal ou como funciona o credenciamento antecipado? Me diga: qual é o seu principal desafio pedagógico hoje e como posso te ajudar?";

const LOCAL_STORAGE_KEY = 'larinha_chat_messages_v1';

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Erro ao ler mensagens do localStorage:', e);
    }
    return [
      {
        id: 'welcome',
        role: 'model',
        parts: [{ text: WELCOME_MESSAGE }]
      }
    ];
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState('23');
  const [isMobileScheduleOpen, setIsMobileScheduleOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Persistir mensagens no localStorage a cada alteração
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {
      console.error('Erro ao salvar mensagens no localStorage:', e);
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      parts: [{ text: messageText.trim() }]
    };

    setMessages((prev) => [...prev, userMsg]);
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

      setMessages((prev) => [...prev, modelMsg]);
    } catch (error: any) {
      console.error('Error:', error);
      let errorText =
        'Ops! Parece que minhas asas se enrolaram num galho. Não consegui conectar com o servidor no momento. 🦜';
      if (error?.message === 'Rate limit exceeded') {
        errorText =
          'Ops! Estou recebendo muitas mensagens de professores incríveis ao mesmo tempo! 🦜 Por favor, aguarde cerca de um minuto e tente falar comigo novamente (limite de cota atingido).';
      }
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        parts: [{ text: errorText }]
      };
      setMessages((prev) => [...prev, errorMsg]);
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

  const handleClearHistory = () => {
    if (window.confirm('Deseja realmente reiniciar a conversa com a Larinha?')) {
      const initial: ChatMessage[] = [
        {
          id: 'welcome',
          role: 'model',
          parts: [{ text: WELCOME_MESSAGE }]
        }
      ];
      setMessages(initial);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initial));
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans overflow-hidden text-slate-800">
      {/* Top Navigation Bar */}
      <Navbar
        onNavAction={handleNavAction}
        onOpenMobileSchedule={() => setIsMobileScheduleOpen(true)}
        isLoading={isLoading}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Area */}
        <main className="w-full lg:w-2/3 flex flex-col bg-white">
          <ChatWindow
            messages={messages}
            isLoading={isLoading}
            onSendMessage={sendMessage}
            messagesEndRef={messagesEndRef}
          />
          <ChatInput
            input={input}
            setInput={setInput}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            onClearHistory={handleClearHistory}
          />
        </main>

        {/* Sidebar (Desktop) */}
        <div className="hidden lg:flex w-1/3">
          <Sidebar
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            onAskAboutEvent={(title) => sendMessage(`Me fale sobre a palestra: "${title}"`)}
          />
        </div>
      </div>

      {/* Mobile Schedule Modal */}
      <MobileScheduleModal
        isOpen={isMobileScheduleOpen}
        onClose={() => setIsMobileScheduleOpen(false)}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        onAskAboutEvent={(title) => sendMessage(`Me fale sobre a palestra: "${title}"`)}
      />

      {/* Footer Status & Credits */}
      <Footer />
    </div>
  );
}
