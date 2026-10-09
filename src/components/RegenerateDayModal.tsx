import React, { useState } from 'react';
import { Sparkles, X, RefreshCw, Wand2, ArrowRight } from 'lucide-react';
import { DayPlan } from '../types/trip';

interface RegenerateDayModalProps {
  isOpen: boolean;
  onClose: () => void;
  day: DayPlan | null;
  destination: string;
  tripMode: string;
  remoteWork: boolean;
  onRegenerate: (dayNumber: number, instruction: string) => Promise<void>;
  isLoading: boolean;
}

const QUICK_INSTRUCTIONS = [
  'Сделай день менее насыщенным, больше отдыха и релакса',
  'Выдели утренний слот для работы и созвонов (до 13:00)',
  'Сделай упор на природные смотровые площадки и треккинг',
  'Уменьши время за рулём, без длинных перегонов',
  'Добавь гастрономические точки и аутентичную местную кухню',
  'Маршрут для плохой/дождливой погоды (музеи, уютные кафе, спа)'
];

export const RegenerateDayModal: React.FC<RegenerateDayModalProps> = ({
  isOpen,
  onClose,
  day,
  destination,
  tripMode,
  remoteWork,
  onRegenerate,
  isLoading,
}) => {
  const [instruction, setInstruction] = useState('');

  if (!isOpen || !day) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!instruction.trim()) return;
    await onRegenerate(day.dayNumber, instruction.trim());
    onClose();
  };

  const handleSelectQuick = (text: string) => {
    setInstruction(text);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Перегенерировать День {day.dayNumber}
              </h3>
              <p className="text-xs text-slate-500 line-clamp-1">
                {day.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Что изменить в этом дне?
            </label>
            <textarea
              rows={3}
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              placeholder="Например: 'Хочу провести утро в тихом коворкинге, а во второй половине дня съездить на водопад без сложных подъемов'..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-slate-800 text-sm"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-[11px] font-semibold text-slate-500 mb-2">
              Или выберите готовый сценарий:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_INSTRUCTIONS.map((text, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectQuick(text)}
                  className={`text-xs px-2.5 py-1.5 rounded-lg text-left transition-colors ${
                    instruction === text
                      ? 'bg-emerald-600 text-white font-medium'
                      : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
                  }`}
                >
                  {text}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isLoading || !instruction.trim()}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-emerald-600/20 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Генерируем...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>Обновить день с ИИ</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
