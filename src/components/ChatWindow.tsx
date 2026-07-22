import React, { useState } from 'react';
import { Loader2, User, Volume2, VolumeX } from 'lucide-react';
import Markdown from 'react-markdown';
import { ChatMessage } from '../types';

interface ChatWindowProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (text: string) => void;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  isLoading,
  onSendMessage,
  messagesEndRef
}) => {
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);

  const handleSpeak = (id: string, text: string) => {
    if (!('speechSynthesis' in window)) {
      alert('Seu navegador não suporta sintetizador de voz.');
      return;
    }

    if (speakingMessageId === id) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();

    // Limpa caracteres de markdown básicos para a leitura soar natural
    const cleanText = text
      .replace(/[*_#`~]/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'pt-BR';
    utterance.rate = 1.05;

    utterance.onend = () => {
      setSpeakingMessageId(null);
    };

    utterance.onerror = () => {
      setSpeakingMessageId(null);
    };

    setSpeakingMessageId(id);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex-1 p-4 sm:p-6 space-y-6 overflow-y-auto">
      {messages.map((msg) =>
        msg.role === 'model' ? (
          <div key={msg.id} className="flex gap-3 sm:gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="shrink-0 w-11 h-11 sm:w-12 sm:h-12 bg-sky-100 rounded-2xl flex items-center justify-center border-2 border-sky-200 shadow-xs overflow-hidden p-1">
              <img src="/larinha.png" alt="Larinha" className="w-full h-full object-contain" />
            </div>
            <div className="space-y-3 max-w-[90%] sm:max-w-[85%]">
              <div className="bg-sky-50 border border-sky-100 rounded-2xl rounded-tl-none p-4 sm:p-5 shadow-xs relative group">
                <div className="markdown-body text-sm leading-relaxed text-slate-700 prose prose-sm sm:prose-base prose-sky max-w-none [&_strong]:text-sky-700">
                  <Markdown>{msg.parts[0].text}</Markdown>
                </div>

                {/* Text to speech audio button */}
                <button
                  onClick={() => handleSpeak(msg.id, msg.parts[0].text)}
                  title={speakingMessageId === msg.id ? 'Parar áudio' : 'Ouvir resposta'}
                  className={`mt-2 flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-colors cursor-pointer border ${
                    speakingMessageId === msg.id
                      ? 'bg-sky-600 text-white border-sky-600'
                      : 'bg-white/80 text-sky-700 border-sky-200 hover:bg-sky-100'
                  }`}
                >
                  {speakingMessageId === msg.id ? (
                    <>
                      <VolumeX size={14} className="animate-pulse" />
                      <span>Parar áudio</span>
                    </>
                  ) : (
                    <>
                      <Volume2 size={14} />
                      <span>Ouvir a Larinha</span>
                    </>
                  )}
                </button>
              </div>

              {msg.id === 'welcome' && (
                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    onClick={() => onSendMessage('Qual é a programação do Palco Max?')}
                    disabled={isLoading}
                    className="px-3.5 py-2 bg-white border border-slate-200 hover:border-sky-500 hover:text-sky-600 rounded-full text-xs font-medium transition-all shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    🗓️ Programação Palco Max
                  </button>
                  <button
                    onClick={() => onSendMessage('Quais restaurantes têm desconto?')}
                    disabled={isLoading}
                    className="px-3.5 py-2 bg-white border border-slate-200 hover:border-sky-500 hover:text-sky-600 rounded-full text-xs font-medium transition-all shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    🍽️ Restaurantes com Desconto
                  </button>
                  <button
                    onClick={() => onSendMessage('Como faço para chegar ao Centro de Convenções?')}
                    disabled={isLoading}
                    className="px-3.5 py-2 bg-white border border-slate-200 hover:border-sky-500 hover:text-sky-600 rounded-full text-xs font-medium transition-all shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    📍 Como chegar
                  </button>
                  <button
                    onClick={() => onSendMessage('Fale sobre a ExpoEduc Social')}
                    disabled={isLoading}
                    className="px-3.5 py-2 bg-white border border-slate-200 hover:border-sky-500 hover:text-sky-600 rounded-full text-xs font-medium transition-all shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    🌱 ExpoEduc Social
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div key={msg.id} className="flex gap-3 sm:gap-4 justify-end animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="bg-slate-800 text-slate-50 border border-slate-700 rounded-2xl rounded-tr-none p-4 text-sm max-w-[85%] shadow-xs whitespace-pre-wrap">
              {msg.parts[0].text}
            </div>
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-slate-200 rounded-full shrink-0 flex items-center justify-center text-slate-600 shadow-xs mt-1">
              <User size={18} />
            </div>
          </div>
        )
      )}

      {isLoading && (
        <div className="flex gap-3 sm:gap-4 animate-in fade-in duration-200">
          <div className="shrink-0 w-11 h-11 sm:w-12 sm:h-12 bg-sky-100 rounded-2xl flex items-center justify-center border-2 border-sky-200 shadow-xs overflow-hidden p-1">
            <img src="/larinha.png" alt="Larinha" className="w-full h-full object-contain animate-bounce" />
          </div>
          <div className="space-y-4 max-w-[90%] sm:max-w-[85%]">
            <div className="bg-sky-50 border border-sky-100 rounded-2xl rounded-tl-none p-4 shadow-xs flex items-center gap-2.5">
              <Loader2 size={16} className="animate-spin text-sky-600" />
              <span className="text-sm font-semibold text-sky-800">Larinha está pensando na resposta...</span>
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};
