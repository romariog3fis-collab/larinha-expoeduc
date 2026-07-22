import React, { useState, useEffect } from 'react';
import { Send, Mic, MicOff, RotateCcw } from 'lucide-react';

interface ChatInputProps {
  input: string;
  setInput: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  onClearHistory: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  input,
  setInput,
  onSubmit,
  isLoading,
  onClearHistory
}) => {
  const [isListening, setIsListening] = useState(false);
  const [hasSpeechSupport, setHasSpeechSupport] = useState(false);

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      setHasSpeechSupport(true);
    }
  }, []);

  const handleVoiceInput = () => {
    if (!hasSpeechSupport) {
      alert('O seu navegador não possui suporte para ditado por voz.');
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = 'pt-BR';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <div className="p-3 sm:p-4 border-t border-slate-100 flex items-center gap-2 bg-slate-50/70 shrink-0">
      <button
        type="button"
        onClick={onClearHistory}
        disabled={isLoading}
        title="Reiniciar conversa"
        className="w-10 h-10 border border-slate-200 hover:border-red-300 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-xl flex items-center justify-center transition-colors cursor-pointer shrink-0 disabled:opacity-50"
      >
        <RotateCcw size={16} />
      </button>

      <form onSubmit={onSubmit} className="flex-1 relative flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              isListening
                ? 'Fale agora, a Larinha está escutando...'
                : 'Pergunte sobre palestras, expositores ou dicas de Natal...'
            }
            className={`w-full h-11 pl-4 pr-10 rounded-xl border ${
              isListening
                ? 'border-sky-500 ring-2 ring-sky-500/20 bg-sky-50/30'
                : 'border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 bg-white'
            } text-sm shadow-xs transition-all`}
            disabled={isLoading}
          />

          {hasSpeechSupport && (
            <button
              type="button"
              onClick={handleVoiceInput}
              disabled={isLoading}
              title={isListening ? 'Escutando...' : 'Falar por voz'}
              className={`absolute right-2.5 top-2.5 p-1 rounded-lg transition-colors cursor-pointer ${
                isListening
                  ? 'text-red-500 animate-pulse bg-red-50'
                  : 'text-slate-400 hover:text-sky-600 hover:bg-slate-100'
              }`}
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="w-11 h-11 bg-sky-500 hover:bg-sky-600 disabled:bg-slate-300 text-white rounded-xl flex items-center justify-center font-bold transition-all shadow-xs disabled:shadow-none cursor-pointer shrink-0"
          title="Enviar mensagem"
        >
          <Send size={17} />
        </button>
      </form>
    </div>
  );
};
