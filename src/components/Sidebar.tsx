import React from 'react';
import { ScheduleEvent } from '../types';

export const SCHEDULE_DATA: Record<string, ScheduleEvent[]> = {
  '23': [
    { time: '15h40', title: 'Yves Justino', desc: 'Não deixe a graça passar', border: 'border-l-sky-500', text: 'text-sky-600' },
    { time: '16h30', title: 'Rodolfo Costa', desc: 'Lições de um Chapeleiro Maluco', border: 'border-l-emerald-500', text: 'text-emerald-600' },
    { time: '18h15', title: 'Maestro João Carlos Martins', desc: 'Uma história de Propósito e Legado', border: 'border-l-amber-500', text: 'text-amber-600' }
  ],
  '24': [
    { time: '13h50', title: 'Thaís e Roberta (SOS Educação)', desc: 'A dor e a delícia de ser um Educador em 2026', border: 'border-l-sky-500', text: 'text-sky-600' },
    { time: '15h20', title: 'Sandro Bonás', desc: 'Como guiar nossos filhos na era da IA', border: 'border-l-emerald-500', text: 'text-emerald-600' },
    { time: '17h00', title: 'Cláudia Costin', desc: 'O Futuro do Trabalho e a Educação', border: 'border-l-purple-500', text: 'text-purple-600' },
    { time: '18h00', title: 'Mayana Neiva', desc: 'A felicidade não está lá fora', border: 'border-l-orange-500', text: 'text-orange-600' }
  ],
  '25': [
    { time: '13h50', title: 'Selma de Niêta', desc: 'Risoterapia Pedagógica', border: 'border-l-sky-500', text: 'text-sky-600' },
    { time: '15h20', title: 'Bia Bedran', desc: 'Interfaces da Arte Narrativa', border: 'border-l-emerald-500', text: 'text-emerald-600' },
    { time: '16h40', title: 'Fátima Bernardes (Arena SAS)', desc: 'Nada é Para Sempre', border: 'border-l-rose-500', text: 'text-rose-600' },
    { time: '18h15', title: 'Marcos Piangers', desc: 'Escola do Futuro: Insights para ensinar', border: 'border-l-orange-500', text: 'text-orange-600' }
  ]
};

interface SidebarProps {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  onAskAboutEvent?: (title: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  selectedDate,
  setSelectedDate,
  onAskAboutEvent
}) => {
  return (
    <aside className="w-full h-full bg-slate-50 flex flex-col p-5 gap-5 overflow-y-auto border-l border-slate-200">
      {/* Event Main Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-sky-600">
          <div className="w-2 h-2 bg-sky-500 rounded-full animate-ping"></div>
          <span className="text-[10px] font-bold uppercase tracking-wider">Evento em Destaque</span>
        </div>
        <h3 className="font-bold text-slate-900 leading-tight text-base">Escola pra quê? Desafios da Educação 2030</h3>
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="text-xs">
            <p className="text-slate-400 font-medium">Data</p>
            <p className="font-semibold text-slate-800">23 - 25 Jul 2026</p>
          </div>
          <div className="text-xs">
            <p className="text-slate-400 font-medium">Público</p>
            <p className="font-semibold text-sky-600">10.000 educadores / dia</p>
          </div>
        </div>
      </div>

      {/* Quick Schedule */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">
            Palco Max - Destaques
          </h4>
        </div>

        <div className="flex bg-slate-200/60 p-1 rounded-xl">
          {['23', '24', '25'].map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDate(day)}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                selectedDate === day
                  ? 'bg-white text-sky-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
              }`}
            >
              {day} Jul
            </button>
          ))}
        </div>

        <div className="space-y-2.5 pt-1">
          {SCHEDULE_DATA[selectedDate]?.map((event, idx) => (
            <div
              key={idx}
              onClick={() => onAskAboutEvent && onAskAboutEvent(event.title)}
              className={`bg-white p-3 rounded-xl border-l-4 ${event.border} border border-slate-200 shadow-xs transition-all hover:shadow-md hover:-translate-y-0.5 cursor-pointer group`}
            >
              <div className="flex justify-between items-start">
                <p className={`text-[10px] font-bold ${event.text} uppercase`}>
                  {selectedDate} Jul • {event.time}
                </p>
                <span className="text-[10px] text-sky-500 opacity-0 group-hover:opacity-100 transition-opacity">Perguntar &rarr;</span>
              </div>
              <p className="text-xs font-bold mt-0.5 text-slate-800">{event.title}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">{event.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ABRASEL Discount Card */}
      <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-4 text-white shadow-sm relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-[10px] font-bold uppercase opacity-90 mb-0.5 tracking-wide">Parceria ABRASEL</p>
          <h4 className="font-bold text-sm mb-1">Alimentação com Desconto</h4>
          <p className="text-[11px] leading-snug opacity-95">
            Apresente seu crachá oficial da ExpoEduc e ganhe até 20% de desconto em restaurantes como Mangai, Dom Aquino e outros!
          </p>
        </div>
        <div className="absolute -right-3 -bottom-3 text-5xl opacity-20 select-none">🍽️</div>
      </div>

      {/* Sustainability Section */}
      <div className="mt-auto">
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white shrink-0 shadow-xs text-base">
            🌱
          </div>
          <div className="text-[11px] leading-tight">
            <p className="font-bold text-emerald-900">ExpoEduc Social & Verde</p>
            <p className="text-emerald-700 mt-0.5">Resíduos transformados em biogás e ações de impacto socioambiental.</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
