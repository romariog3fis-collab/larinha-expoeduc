import React from 'react';
import { X, Calendar } from 'lucide-react';
import { SCHEDULE_DATA } from './Sidebar';

interface MobileScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  onAskAboutEvent: (title: string) => void;
}

export const MobileScheduleModal: React.FC<MobileScheduleModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
  setSelectedDate,
  onAskAboutEvent
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-xs p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-200">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-base">
            <Calendar size={18} className="text-sky-600" />
            <span>Programação ExpoEduc 2026</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 overflow-y-auto space-y-4">
          {/* Day selector */}
          <div className="flex bg-slate-100 p-1 rounded-xl">
            {['23', '24', '25'].map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDate(day)}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
                  selectedDate === day
                    ? 'bg-white text-sky-600 shadow-xs'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {day} Julho
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {SCHEDULE_DATA[selectedDate]?.map((event, idx) => (
              <div
                key={idx}
                onClick={() => {
                  onAskAboutEvent(event.title);
                  onClose();
                }}
                className={`bg-slate-50 p-3.5 rounded-xl border-l-4 ${event.border} border border-slate-200 active:bg-sky-50 transition-colors cursor-pointer`}
              >
                <p className={`text-[10px] font-bold ${event.text} uppercase`}>
                  {selectedDate} Jul • {event.time}
                </p>
                <p className="text-sm font-bold mt-0.5 text-slate-800">{event.title}</p>
                <p className="text-xs text-slate-600 mt-1">{event.desc}</p>
                <p className="text-[11px] text-sky-600 font-semibold mt-2 text-right">Perguntar à Larinha &rarr;</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
