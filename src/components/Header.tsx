import React from 'react';
import { Compass, Bookmark, PlusCircle, Share2, Settings, Sparkles, MapPin } from 'lucide-react';

interface HeaderProps {
  savedCount: number;
  onOpenSaved: () => void;
  onNewTrip: () => void;
  onOpenPartnerSettings: () => void;
  hasActiveTrip: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  savedCount,
  onOpenSaved,
  onNewTrip,
  onOpenPartnerSettings,
  hasActiveTrip,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div 
          onClick={onNewTrip}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Compass className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                trvl4<span className="text-emerald-600">.me</span>
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase bg-emerald-50 text-emerald-700 border border-emerald-200/60 rounded">
                AI MVP
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-500 hidden sm:block">
              Умный планировщик автотуров и воркейшна
            </p>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {hasActiveTrip && (
            <button
              onClick={onNewTrip}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-700 hover:text-emerald-700 bg-slate-100 hover:bg-slate-200/70 px-3 py-2 rounded-lg transition-colors"
            >
              <PlusCircle className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">Новый маршрут</span>
              <span className="sm:hidden">Создать</span>
            </button>
          )}

          <button
            onClick={onOpenSaved}
            className="relative inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 px-3 py-2 rounded-lg transition-colors"
            title="Сохранённые маршруты"
          >
            <Bookmark className="w-4 h-4 text-slate-600" />
            <span className="hidden md:inline">Мои маршруты</span>
            {savedCount > 0 && (
              <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold bg-emerald-600 text-white rounded-full">
                {savedCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenPartnerSettings}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            title="Интеграции Travelpayouts"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
