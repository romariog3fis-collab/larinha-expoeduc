import React from 'react';
import { User, Calendar } from 'lucide-react';

interface NavbarProps {
  onNavAction: (topic: string) => void;
  onOpenMobileSchedule: () => void;
  isLoading: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNavAction,
  onOpenMobileSchedule,
  isLoading
}) => {
  return (
    <nav className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 shrink-0 z-10 shadow-xs">
      <div className="flex items-center gap-3">
        <img
          src="/larinha.png"
          alt="Larinha Logo"
          className="w-10 h-10 object-contain rounded-xl shadow-xs"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            const nextSibling = e.currentTarget.nextElementSibling as HTMLElement;
            if (nextSibling) nextSibling.style.display = 'flex';
          }}
        />
        <div className="hidden w-10 h-10 bg-sky-500 rounded-xl items-center justify-center text-white font-bold text-2xl shadow-xs italic">
          T
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-900 leading-tight uppercase tracking-tight flex items-center gap-2">
            Larinha Teachy
          </h1>
          <p className="text-[10px] text-sky-600 font-semibold uppercase tracking-widest">
            ExpoEduc 2026
          </p>
        </div>
      </div>

      {/* Desktop Navigation Links */}
      <div className="hidden md:flex gap-6 text-sm font-medium text-slate-600 h-full items-center">
        <span className="text-sky-600 border-b-2 border-sky-600 py-5 font-semibold">
          Assistente Virtual
        </span>
        <button
          onClick={() => onNavAction('a programação')}
          disabled={isLoading}
          className="hover:text-sky-600 cursor-pointer py-5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Programação
        </button>
        <button
          onClick={() => onNavAction('os restaurantes com desconto')}
          disabled={isLoading}
          className="hover:text-sky-600 cursor-pointer py-5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Restaurantes
        </button>
        <button
          onClick={() => onNavAction('o credenciamento antecipado')}
          disabled={isLoading}
          className="hover:text-sky-600 cursor-pointer py-5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Credenciamento
        </button>
      </div>

      <div className="flex items-center gap-3">
        {/* Mobile Schedule Toggle Button */}
        <button
          onClick={onOpenMobileSchedule}
          className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded-lg text-xs font-semibold transition-colors border border-sky-200"
          title="Ver programação do evento"
        >
          <Calendar size={15} />
          <span>Agenda</span>
        </button>

        <div className="text-right hidden sm:block">
          <p className="text-xs font-semibold text-slate-800">Centro de Convenções</p>
          <p className="text-[10px] text-slate-500">Natal, RN</p>
        </div>

        <div className="w-8 h-8 bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center text-slate-600 shadow-xs">
          <User size={16} />
        </div>
      </div>
    </nav>
  );
};
