import { useState, useRef, useEffect } from 'react';
import { ChatMessage, UserProfile } from './types';
import { Navbar } from './components/Navbar';
import { ChatWindow } from './components/ChatWindow';
import { ChatInput } from './components/ChatInput';
import { Sidebar } from './components/Sidebar';
import { MobileScheduleModal } from './components/MobileScheduleModal';
import { Footer } from './components/Footer';
import { PreRegisterModal } from './components/PreRegisterModal';
import { AdminPanel } from './components/AdminPanel';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { TermsOfUse } from './components/TermsOfUse';

// Schema version — bump this to force re-registration for existing users
const SCHEMA_VERSION = 'v2';
const SCHEMA_KEY = `larinha_schema_${SCHEMA_VERSION}`;
const PROFILE_KEY = 'larinha_user_profile_v2';
const LOCAL_STORAGE_KEY = 'larinha_chat_messages_v1';

const buildWelcomeMessage = (name?: string) =>
  `Olá${name ? `, **${name}**` : ', educador(a)'}! Que alegria ter você por aqui! 🦜✨ Eu sou a **Larinha**, a mascote arara-azul-claro da **Teachy**, e serei a sua guia oficial na **ExpoEduc 2026**!\n\nComo defensora de uma rotina docente mais ágil e menos exaustiva, quero te fazer um convite: que tal descobrir como a **Teachy e nossas soluções de Inteligência Artificial** podem transformar a sua prática pedagógica? Nós ajudamos professores e gestores a reduzirem a sobrecarga de tarefas administrativas, criando planos de aula criativos, avaliações personalizadas e relatórios em segundos, permitindo que você foque no que realmente importa: o desenvolvimento integral dos seus estudantes! 🚀\n\nEstou pronta para te ajudar a voar alto neste congresso. Quer saber mais sobre a programação do Palco Max - AI4School, dicas de restaurantes com descontos em Natal ou como funciona o credenciamento antecipado? Me diga: qual é o seu principal desafio pedagógico hoje e como posso te ajudar?`;

// Check if the current path matches special routes
const getRoute = () => window.location.pathname;

export default function App() {
  // ── Special routes ────────────────────────────────────────────────
  const route = getRoute();
  if (route === '/admin') return <AdminPanel />;
  if (route === '/privacidade') return <PrivacyPolicy />;
  if (route === '/termos') return <TermsOfUse />;

  // ── Registration state ─────────────────────────────────────────────
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    try {
      const schemaOk = localStorage.getItem(SCHEMA_KEY) === 'registered';
      if (!schemaOk) return null; // force re-registration for old users
      const saved = localStorage.getItem(PROFILE_KEY);
      return saved ? (JSON.parse(saved) as UserProfile) : null;
    } catch {
      return null;
    }
  });

  const isRegistered = userProfile !== null;

  // ── Chat messages ──────────────────────────────────────────────────
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      // Only restore messages if user is already registered
      const schemaOk = localStorage.getItem(SCHEMA_KEY) === 'registered';
      if (!schemaOk) {
        return [{ id: 'welcome', role: 'model', parts: [{ text: buildWelcomeMessage() }] }];
      }
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallthrough
    }
    return [{ id: 'welcome', role: 'model', parts: [{ text: buildWelcomeMessage() }] }];
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState('24');
  const [isMobileScheduleOpen, setIsMobileScheduleOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Persist messages
  useEffect(() => {
    if (!isRegistered) return;
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {
      console.error('Erro ao salvar mensagens:', e);
    }
  }, [messages, isRegistered]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // ── Handle registration complete ───────────────────────────────────
  const handleRegistrationComplete = (profile: UserProfile) => {
    // Persist profile + schema flag
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
      localStorage.setItem(SCHEMA_KEY, 'registered');
    } catch {
      // ignore
    }
    setUserProfile(profile);

    // Personalize the welcome message with user's first name
    const firstName = profile.name.trim().split(' ')[0];
    const welcomeMsg: ChatMessage = {
      id: 'welcome',
      role: 'model',
      parts: [{ text: buildWelcomeMessage(firstName) }],
    };
    setMessages([welcomeMsg]);
  };

  // ── Send message ───────────────────────────────────────────────────
  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      parts: [{ text: messageText.trim() }],
    };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (userProfile?.name) {
        headers['X-User-Name'] = userProfile.name.trim().split(' ')[0];
        headers['X-User-Role'] = userProfile.role;
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers,
        body: JSON.stringify({ message: userMsg.parts[0].text, history: messages }),
      });

      if (!response.ok) {
        if (response.status === 429) throw new Error('Rate limit exceeded');
        const errJson = await response.json().catch(() => null);
        if (errJson?.error) throw new Error(errJson.error);
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      const modelMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        parts: [{ text: data.text }],
      };
      setMessages(prev => [...prev, modelMsg]);
    } catch (error: any) {
      console.error('Chat API Error:', error);
      let errorText = 'Ops! Parece que minhas asas se enrolaram num galho. Não consegui conectar com o servidor no momento. 🦜';
      if (error?.message === 'Rate limit exceeded') {
        errorText = 'Ops! Estou recebendo muitas mensagens de professores incríveis ao mesmo tempo! 🦜 Por favor, aguarde cerca de um minuto e tente falar comigo novamente (limite de cota atingido).';
      } else if (error?.message?.includes('Chave de API não configurada')) {
        errorText = `⚠️ **Configuração necessária:** ${error.message}`;
      }
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'model', parts: [{ text: errorText }] }]);
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
      const firstName = userProfile?.name?.trim().split(' ')[0];
      const initial: ChatMessage[] = [{
        id: 'welcome',
        role: 'model',
        parts: [{ text: buildWelcomeMessage(firstName) }],
      }];
      setMessages(initial);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initial));
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans overflow-hidden text-slate-800">
      {/* Pre-Registration Modal — shown to all users without schema v2 */}
      {!isRegistered && (
        <PreRegisterModal onComplete={handleRegistrationComplete} />
      )}

      {/* Top Navigation Bar */}
      <Navbar
        onNavAction={handleNavAction}
        onOpenMobileSchedule={() => setIsMobileScheduleOpen(true)}
        isLoading={isLoading}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Area */}
        <main className="flex-1 flex flex-col bg-white min-w-0">
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
        <div className="hidden lg:flex w-80 xl:w-96 shrink-0">
          <Sidebar
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            onAskAboutEvent={title => sendMessage(`Me fale sobre a palestra: "${title}"`)}
          />
        </div>
      </div>

      {/* Mobile Schedule Modal */}
      <MobileScheduleModal
        isOpen={isMobileScheduleOpen}
        onClose={() => setIsMobileScheduleOpen(false)}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        onAskAboutEvent={title => sendMessage(`Me fale sobre a palestra: "${title}"`)}
      />

      {/* Footer Status & Credits */}
      <Footer />
    </div>
  );
}
