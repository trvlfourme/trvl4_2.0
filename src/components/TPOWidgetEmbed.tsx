import React, { useEffect, useRef } from 'react';
import { ExternalLink, Sparkles } from 'lucide-react';

export type WidgetType = 'flights' | 'hotels' | 'packages';

interface TPOWidgetEmbedProps {
  type: WidgetType;
  title?: string;
  subtitle?: string;
}

const WIDGET_SCRIPTS: Record<WidgetType, string> = {
  flights: "https://tpwidg.com/content?currency=rub&trs=527037&shmarker=726345&show_hotels=true&powered_by=true&locale=ru&searchUrl=www.aviasales.ru%2Fsearch&primary_override=%2332a8dd&color_button=%2332a8dd&color_icons=%2332a8dd&dark=%23262626&light=%23FFFFFF&secondary=%23FFFFFF&special=%23C4C4C4&color_focused=%2332a8dd&border_radius=0&plain=false&promo_id=7879&campaign_id=100",
  hotels: "https://tpwidg.com/content?trs=527037&shmarker=726345&locale=ru&powered_by=true&border_radius=0&plain=true&color_background=%23ffffff&color_border=%230f5de4&color_button=%2332a8dd&color_icons=%2332a8dd&promo_id=7257&campaign_id=459",
  packages: "https://tpwidg.com/content?trs=527037&shmarker=726345&locale=ru&origin=2&powered_by=true&color_background=%23ffffff&color_border=%230f5de4&color_button=%2332a8dd&color_icons=%2332a8dd&plain=true&border_radius=0&promo_id=8344&campaign_id=18",
};

export const TPOWidgetEmbed: React.FC<TPOWidgetEmbedProps> = ({
  type,
  title,
  subtitle,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear previous children
    container.innerHTML = '';

    const scriptSrc = WIDGET_SCRIPTS[type];
    if (!scriptSrc) return;

    // Create and append dynamic widget script
    const script = document.createElement('script');
    script.src = scriptSrc;
    script.async = true;
    script.charset = 'utf-8';

    container.appendChild(script);

    return () => {
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [type]);

  const defaultTitles = {
    flights: 'Поиск авиабилетов по всем направлениям (Aviasales)',
    hotels: 'Интерактивный подбор отелей и апартаментов',
    packages: 'Поиск готовых туров от 120 туроператоров',
  };

  const defaultSubtitles = {
    flights: 'Сравнение цен без наценок и скрытых комиссий',
    hotels: 'Лучшие цены с возможностью оплаты российскими картами',
    packages: 'Пакетные предложения, когда выгоднее лететь чартером',
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs my-5 overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
        <div>
          <h4 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            <span>{title || defaultTitles[type]}</span>
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            {subtitle || defaultSubtitles[type]}
          </p>
        </div>
        <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
          Travelpayouts 726345
        </span>
      </div>

      {/* Widget Container */}
      <div 
        ref={containerRef} 
        className="min-h-[140px] flex items-center justify-center bg-slate-50/50 rounded-2xl overflow-x-auto p-2"
      >
        <div className="text-xs text-slate-400 py-6 flex items-center gap-2 animate-pulse">
          <Sparkles className="w-4 h-4 text-emerald-500" />
          <span>Загрузка интерактивного модуля бронирования...</span>
        </div>
      </div>
    </div>
  );
};
