import React from 'react';
import { Heart, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="h-auto py-2 sm:py-0 sm:h-11 bg-slate-900 text-slate-300 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between px-4 sm:px-8 text-xs shrink-0 font-medium gap-2 sm:gap-0">
      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-slate-400 text-[11px]">
        <span>Natal, RN • 23 a 25 de Julho de 2026</span>
        <span className="hidden sm:inline">•</span>
        <span className="hidden md:inline">Dica: Use roupas leves e calçados confortáveis</span>
      </div>

      <div className="flex items-center gap-2 bg-sky-950/60 border border-sky-800/50 px-3 py-1 rounded-full text-[11px]">
        <Sparkles size={13} className="text-sky-400 animate-pulse" />
        <span>
          Desenvolvido por <strong className="text-sky-300 font-semibold">Romário Ramos</strong> — Embaixador da Teachy
        </span>
      </div>
    </footer>
  );
};
