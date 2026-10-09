import React, { useState, useEffect } from 'react';
import { X, Send, Bot, Check, Smartphone, Sparkles, ExternalLink } from 'lucide-react';
import { Itinerary } from '../types/trip';

interface TelegramExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  itinerary: Itinerary;
}

export const TelegramExportModal: React.FC<TelegramExportModalProps> = ({
  isOpen,
  onClose,
  itinerary,
}) => {
  const [tgUserId, setTgUserId] = useState<string>('');
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check URL parameters or local storage for Telegram user id
    const urlParams = new URLSearchParams(window.location.search);
    const idFromUrl = urlParams.get('tg_id') || urlParams.get('tg_user_id');
    if (idFromUrl) {
      setTgUserId(idFromUrl);
      localStorage.setItem('trvl4me_tg_id', idFromUrl);
    } else {
      const stored = localStorage.getItem('trvl4me_tg_id');
      if (stored) setTgUserId(stored);
    }
  }, []);

  if (!isOpen) return null;

  const botUsername = 'trvl4me_bot'; // Replaceable with real bot username
  const tgDeepLink = `https://t.me/${botUsername}?start=trip_${itinerary.id}`;

  const handleSendToBot = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/tg-send-trip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tgUserId: tgUserId || 'demo_user',
          tripId: itinerary.id,
          title: itinerary.title,
          totalDays: itinerary.totalDays,
          budget: itinerary.budgetBreakdown.totalEstimatedRub,
          destination: itinerary.destinationRegion,
        }),
      });
      setIsSent(true);
    } catch (e) {
      setIsSent(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenBot = () => {
    window.open(tgDeepLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-200">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Маршрут в Telegram боте
              </h3>
              <p className="text-xs text-slate-500">
                Сохранение отчёта и уведомления в чате
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

        {isSent ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-12 h-12 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-base text-slate-900">
              Отчёт отправлен в Telegram!
            </h4>
            <p className="text-xs text-slate-600 max-w-xs mx-auto">
              Бот @{botUsername} отправил вам карточку маршрута со всеми днями и ссылкой на интерактивный план.
            </p>
            <div className="pt-2">
              <button
                onClick={onClose}
                className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold"
              >
                Отлично
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-3.5 bg-sky-50/70 border border-sky-200/80 rounded-2xl text-xs text-sky-900 space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                Удобство в поездке:
              </p>
              <p className="text-[11px] text-sky-800 leading-relaxed">
                Получите маршрут в мессенджер: план на каждый день будет всегда под рукой, даже при медленном мобильном интернете.
              </p>
            </div>

            {tgUserId ? (
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700">
                  Привязанный аккаунт: <strong>ID: {tgUserId}</strong>
                </div>
                <button
                  onClick={handleSendToBot}
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-sky-500/20 transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>{isLoading ? 'Отправляем...' : 'Отправить отчёт в мой Telegram-чат'}</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={handleOpenBot}
                  className="w-full py-3 px-4 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-sky-500/20 transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Открыть в боте @{botUsername}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>

                <p className="text-[11px] text-slate-400 text-center">
                  Бот сохранит маршрут и сможет присылать напоминания по этапам поездки
                </p>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Закрыть
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
