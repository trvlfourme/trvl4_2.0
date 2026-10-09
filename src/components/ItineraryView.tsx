import React, { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  DollarSign, 
  Car, 
  Laptop, 
  Share2, 
  Bookmark, 
  BookmarkCheck, 
  Download, 
  Printer, 
  ArrowLeft, 
  Sparkles, 
  Sun, 
  Coffee, 
  Moon, 
  Utensils, 
  Bed, 
  Compass, 
  AlertTriangle, 
  CheckSquare, 
  Square, 
  Fuel, 
  ShieldCheck, 
  Wifi, 
  Send, 
  MessageSquare, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Clock,
  Layers,
  Wand2,
  Mail,
  Bot,
  Navigation
} from 'lucide-react';
import { Itinerary, DayPlan } from '../types/trip';
import { getAffiliateOffers } from '../utils/travelpayouts';
import { generateItineraryMarkdown } from '../utils/storage';
import { KabinetDomaCard } from './KabinetDomaCard';
import { TPOWidgetEmbed } from './TPOWidgetEmbed';

interface ItineraryViewProps {
  itinerary: Itinerary;
  onBackToEdit: () => void;
  onSave: () => void;
  isSaved: boolean;
  onOpenShare: () => void;
  onOpenEmail: () => void;
  onOpenTelegram: () => void;
  onOpenRegenerateDay: (day: DayPlan) => void;
  onUpdateDay: (updatedDay: DayPlan) => void;
  isRegeneratingDay: boolean;
}

type TabType = 'days' | 'transport' | 'hotels' | 'budget' | 'tips' | 'partners';

export const ItineraryView: React.FC<ItineraryViewProps> = ({
  itinerary,
  onBackToEdit,
  onSave,
  isSaved,
  onOpenShare,
  onOpenEmail,
  onOpenTelegram,
  onOpenRegenerateDay,
  onUpdateDay,
  isRegeneratingDay,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('days');
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [isAskingAi, setIsAskingAi] = useState(false);
  const [expandedDay, setExpandedDay] = useState<number | null>(1); // default expand first day

  const toggleCheck = (item: string) => {
    setCheckedItems(prev => ({ ...prev, [item]: !prev[item] }));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportMarkdown = () => {
    const md = generateItineraryMarkdown(itinerary);
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${itinerary.id || 'itinerary'}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleAskAi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuestion.trim()) return;
    setIsAskingAi(true);
    setAiAnswer(null);

    try {
      const res = await fetch('/api/ask-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: aiQuestion.trim(),
          destination: itinerary.destinationRegion,
          tripMode: itinerary.transportSummary.carTips ? 'roadtrip' : 'standard'
        }),
      });
      const data = await res.json();
      setAiAnswer(data.answer || 'Ответ не получен, попробуйте еще раз.');
    } catch (err) {
      setAiAnswer('Не удалось получить ответ от ИИ в данный момент.');
    } finally {
      setIsAskingAi(false);
    }
  };

  const affiliateOffers = getAffiliateOffers(itinerary.destinationRegion);
  const hasWorkation = itinerary.days.some(d => !!d.workationWindow);
  const isCarTrip = !!itinerary.transportSummary.carTips;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Top action toolbar (Screen only) */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 print:hidden">
        <button
          onClick={onBackToEdit}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200/90 px-3.5 py-2 rounded-xl transition-colors shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4 text-slate-500" />
          <span>Изменить параметры</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onSave}
            className={`inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold px-3 py-2 rounded-xl transition-all shadow-2xs ${
              isSaved
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
            }`}
          >
            {isSaved ? (
              <>
                <BookmarkCheck className="w-4 h-4 text-emerald-600" />
                <span>Сохранено</span>
              </>
            ) : (
              <>
                <Bookmark className="w-4 h-4 text-slate-500" />
                <span className="hidden sm:inline">В закладки</span>
              </>
            )}
          </button>

          <button
            onClick={onOpenEmail}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-2xs transition-colors"
            title="Отправить план на Email"
          >
            <Mail className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">На почту</span>
          </button>

          <button
            onClick={onOpenTelegram}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold px-3 py-2 rounded-xl bg-sky-50 hover:bg-sky-100/80 text-sky-800 border border-sky-200 shadow-2xs transition-colors"
            title="Получить в Telegram боте"
          >
            <Bot className="w-4 h-4 text-sky-600" />
            <span className="hidden sm:inline">В Telegram</span>
          </button>

          <button
            onClick={onOpenShare}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-2xs transition-colors"
          >
            <Share2 className="w-4 h-4 text-emerald-400" />
            <span>Поделиться</span>
          </button>

          <button
            onClick={handlePrint}
            title="Версия для печати / Скачать PDF"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors shadow-2xs"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span className="hidden sm:inline">PDF / Печать</span>
          </button>

          <button
            onClick={handleExportMarkdown}
            title="Экспорт в Markdown"
            className="p-2 text-slate-500 hover:text-slate-800 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors shadow-2xs"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Warning banner if temporary demo fallback was used */}
      {itinerary.warning && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <strong>Уведомление генерации:</strong> {itinerary.warning}
            </div>
          </div>
          <button
            onClick={onBackToEdit}
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold whitespace-nowrap transition-colors"
          >
            Повторить генерацию
          </button>
        </div>
      )}

      {/* Hero Itinerary Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              {itinerary.aiModelUsed ? `ИИ: ${itinerary.aiModelUsed}` : 'Gemini AI'}
            </span>
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-white/10 text-slate-200 backdrop-blur-xs flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              {itinerary.destinationRegion}
            </span>
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-white/10 text-slate-200 backdrop-blur-xs flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-teal-400" />
              {itinerary.totalDays} дней
            </span>
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-white/10 text-slate-200 backdrop-blur-xs flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-amber-400" />
              ~{itinerary.budgetBreakdown.totalEstimatedRub.toLocaleString('ru-RU')} ₽ всего
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-2 leading-tight">
            {itinerary.title}
          </h1>
          <p className="text-sm sm:text-base text-slate-300 mb-6 max-w-3xl font-normal">
            {itinerary.subtitle}
          </p>

          <p className="text-xs sm:text-sm text-slate-200/90 max-w-4xl bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-xs leading-relaxed mb-6">
            {itinerary.overview}
          </p>

          {/* Highlights pills */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
              Ключевые акценты поездки:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {itinerary.highlights.map((hl, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-200 bg-white/5 rounded-xl px-3 py-2 border border-white/5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <span>{hl}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Multi-layer Verification & Live Data Status Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              3-Этапная верификация данных и безопасности (Grounding + ИИ-Ревизор)
            </span>
          </div>
          <div className="flex items-center gap-2">
            {itinerary.aiAudit?.auditorModel && (
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 ${
                itinerary.aiAudit.auditorModel.includes('DeepSeek') 
                  ? 'bg-blue-50 text-blue-800 border-blue-200' 
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200'
              }`}>
                <span>Ревизор: {itinerary.aiAudit.auditorModel}</span>
              </span>
            )}
            {itinerary.aiAudit && (
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Оценка аудитора: {itinerary.aiAudit.criticScore}/100</span>
              </span>
            )}
          </div>
        </div>

        {/* 3 Verification Stages Timeline Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 py-1">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2 text-xs">
            <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold text-[11px] flex items-center justify-center shrink-0">1</span>
            <div>
              <div className="font-bold text-slate-800 text-[11px]">Этап 1: Генерация базового плана</div>
              <div className="text-[10px] text-slate-500">Gemini 2.5/3.8 Flash под критерии поездки</div>
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2 text-xs">
            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold text-[11px] flex items-center justify-center shrink-0">2</span>
            <div>
              <div className="font-bold text-slate-800 text-[11px]">Этап 2: Независимый ИИ-аудит</div>
              <div className="text-[10px] text-slate-500">{itinerary.aiAudit?.auditorModel || 'DeepSeek-V3 / Gemini Critic'} (безопасность & темп)</div>
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2 text-xs">
            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[11px] flex items-center justify-center shrink-0">3</span>
            <div>
              <div className="font-bold text-slate-800 text-[11px]">Этап 3: Метео & бюджет-калибровка</div>
              <div className="text-[10px] text-slate-500">Open-Meteo API + детские льготы + навигаторы</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Live Weather from Open-Meteo API */}
          <div className="p-3 rounded-xl bg-sky-50/70 border border-sky-200/80 flex items-start gap-2.5">
            <Sun className="w-4 h-4 text-sky-600 mt-0.5 shrink-0" />
            <div>
              <div className="text-[11px] font-bold text-sky-950 flex items-center gap-1">
                <span>Прогноз погоды (Open-Meteo API)</span>
                <span className="text-[9px] bg-sky-200 text-sky-800 px-1 rounded">Live API</span>
              </div>
              <div className="text-xs text-sky-900 font-semibold mt-0.5">
                {itinerary.liveWeather?.text || `Сезон: ${itinerary.bestSeason}`}
              </div>
              <div className="text-[10px] text-sky-700 mt-0.5">
                Данные реальной метеомодели
              </div>
            </div>
          </div>

          {/* Group & Kids composition */}
          <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <div className="text-[11px] font-bold text-amber-950">
                {itinerary.groupComposition?.childrenCount 
                  ? 'Состав семьи и детские условия' 
                  : itinerary.groupComposition?.groupAccommodationType === 'shared_villa_house'
                  ? 'Формат компании (Дом/Вилла)'
                  : 'Логистика группы'}
              </div>
              <div className="text-xs text-amber-900 font-semibold mt-0.5">
                {itinerary.groupComposition?.childrenCount 
                  ? `${itinerary.groupComposition.adultsCount} взр. + ${itinerary.groupComposition.childrenCount} детей (возрасты: ${itinerary.groupComposition.childrenAges.join(', ')} л.)`
                  : itinerary.groupComposition?.groupAccommodationType === 'shared_villa_house'
                  ? 'Аренда дома целиком (кухня, BBQ, лаунж)'
                  : `${itinerary.budgetBreakdown.categories.accommodation ? 'Индивидуальные номера' : 'Стандартное размещение'}`}
              </div>
              <div className="text-[10px] text-amber-800 mt-0.5">
                {itinerary.groupComposition?.childrenCount 
                  ? 'Скидки на билеты и семейный темп учтены' 
                  : 'Математическая калибровка бюджета'}
              </div>
            </div>
          </div>

          {/* Road / Transport Verification */}
          <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex items-start gap-2.5">
            <Car className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
            <div>
              <div className="text-[11px] font-bold text-emerald-950 flex items-center gap-1">
                <span>Дорожный аудит и навигаторы</span>
                <span className="text-[9px] bg-emerald-200 text-emerald-800 px-1 rounded">1-Click</span>
              </div>
              <div className="text-xs text-emerald-900 font-semibold mt-0.5">
                {itinerary.transportSummary.carTips ? 'Трассы РФ/СНГ, АЗС и перевалы' : itinerary.transportSummary.recommendedPrimary}
              </div>
              <div className="text-[10px] text-emerald-700 mt-0.5">
                Готовые маршруты для Яндекс.Карт и 2ГИС
              </div>
            </div>
          </div>
        </div>

        {/* AI Critic Passed Checklist & Notes */}
        {itinerary.aiAudit && (
          <div className="space-y-2 pt-1 border-t border-slate-100 text-[11px]">
            {itinerary.aiAudit.passedChecks && itinerary.aiAudit.passedChecks.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 text-slate-600">
                <span className="font-semibold text-slate-700">Проверки качества:</span>
                {itinerary.aiAudit.passedChecks.map((chk, i) => (
                  <span key={i} className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                    <span className="text-emerald-600 font-bold">✓</span> {chk}
                  </span>
                ))}
              </div>
            )}

            {/* Auditor safety/kids advice if present */}
            {(itinerary.aiAudit.safetyAndKidsNotes || itinerary.aiAudit.drivingRealityNotes) && (
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 space-y-1">
                {itinerary.aiAudit.safetyAndKidsNotes?.map((note, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 text-amber-900">
                    <span className="font-bold">👶 Совет по детям:</span>
                    <span>{note}</span>
                  </div>
                ))}
                {itinerary.aiAudit.drivingRealityNotes?.map((note, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 text-slate-800">
                    <span className="font-bold">🚗 Совет по дороге:</span>
                    <span>{note}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tabs Navigation (Screen only) */}
      <div className="flex border-b border-slate-200 overflow-x-auto gap-2 sm:gap-4 no-scrollbar print:hidden">
        {[
          { id: 'days', label: `План по дням (${itinerary.days.length})`, icon: Calendar },
          { id: 'transport', label: 'Транспорт и дороги', icon: Car },
          { id: 'hotels', label: 'Рекомендуемое жильё', icon: Bed },
          { id: 'budget', label: 'Бюджет поездки', icon: DollarSign },
          { id: 'tips', label: 'Советы & Чек-лист', icon: CheckSquare },
          { id: 'partners', label: 'Бронирование (Travelpayouts)', icon: ExternalLink },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-2 py-3.5 px-3 sm:px-4 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? 'border-emerald-600 text-emerald-800'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content: Days (Main) */}
      {activeTab === 'days' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>Подробная программа по дням</span>
              <span className="text-xs font-normal text-slate-500">
                (нажмите на день, чтобы развернуть детали или перегенерировать с ИИ)
              </span>
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setExpandedDay(expandedDay === null ? 1 : null)}
                className="text-xs text-slate-600 hover:text-slate-900 font-medium px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                {expandedDay === null ? 'Развернуть день' : 'Свернуть все'}
              </button>
            </div>
          </div>

          <div className="space-y-5">
            {itinerary.days.map((day) => {
              const isExpanded = expandedDay === day.dayNumber || expandedDay === null;

              return (
                <div
                  key={day.dayNumber}
                  className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all overflow-hidden"
                >
                  {/* Day header */}
                  <div
                    onClick={() => setExpandedDay(expandedDay === day.dayNumber ? -1 : day.dayNumber)}
                    className="p-5 sm:p-6 bg-slate-50/70 hover:bg-slate-50 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none"
                  >
                    <div className="flex items-start sm:items-center gap-3.5">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white font-extrabold text-base flex items-center justify-center shrink-0 shadow-sm shadow-emerald-600/30">
                        {day.dayNumber}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-bold text-base sm:text-lg text-slate-900">
                            {day.title}
                          </h3>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 font-medium">
                          {day.theme}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/60">
                        ~{day.dayBudgetEstimateRub.toLocaleString('ru-RU')} ₽ / день
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenRegenerateDay(day);
                          }}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-white hover:bg-emerald-50 border border-emerald-200/80 px-2.5 py-1.5 rounded-xl transition-all shadow-2xs"
                          title="Перегенерировать этот день с помощью ИИ"
                        >
                          <Wand2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="hidden sm:inline">Перегенерировать</span>
                        </button>

                        <div className="text-slate-400 p-1">
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Day body */}
                  {isExpanded && (
                    <div className="p-5 sm:p-7 space-y-6 animate-in fade-in duration-200">
                      
                      {/* Workation Banner (if day has work window) */}
                      {day.workationWindow && (
                        <div className="bg-teal-50/70 border border-teal-200/90 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0">
                              <Laptop className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-teal-900">
                                  Воркейшн-окно: {day.workationWindow.recommendedHours}
                                </h4>
                                <span className="text-[10px] font-bold bg-teal-200 text-teal-800 px-2 py-0.5 rounded">
                                  Wi-Fi: {day.workationWindow.wifiRating}
                                </span>
                              </div>
                              <p className="text-xs text-teal-800 mt-0.5">
                                <strong>Где работать:</strong> {day.workationWindow.suggestedWorkplace}
                              </p>
                              {day.workationWindow.tips && (
                                <p className="text-[11px] text-teal-700 mt-1 italic">
                                  💡 {day.workationWindow.tips}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Roadtrip Segment Banner (if road trip segment) */}
                      {day.roadtripSegment && (
                        <div className="bg-emerald-50/70 border border-emerald-200/90 rounded-2xl p-4">
                          <div className="flex items-start gap-3 mb-2">
                            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                              <Car className="w-4 h-4" />
                            </div>
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                                  Авто-маршрут: {day.roadtripSegment.route}
                                </h4>
                                <div className="flex items-center gap-3 text-xs font-bold text-emerald-800">
                                  <span>{day.roadtripSegment.distanceKm} км</span>
                                  <span>•</span>
                                  <span>~{day.roadtripSegment.drivingTimeHours} ч в пути</span>
                                </div>
                              </div>
                              <p className="text-xs text-emerald-800 mt-1">
                                <strong>Дорога:</strong> {day.roadtripSegment.roadCondition}
                              </p>
                              {day.roadtripSegment.tollRoads && (
                                <p className="text-[11px] text-emerald-700 mt-0.5">
                                  <strong>Платные участки:</strong> {day.roadtripSegment.tollRoads}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Scenic stops & Gas */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 pt-3 border-t border-emerald-200/60 text-xs text-emerald-900">
                            <div>
                              <strong className="text-[11px] uppercase tracking-wider text-emerald-700 block mb-1">
                                📸 Смотровые площадки:
                              </strong>
                              <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                                {day.roadtripSegment.scenicViewpoints.map((pt, idx) => (
                                  <li key={idx} className="line-clamp-1">{pt}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <strong className="text-[11px] uppercase tracking-wider text-emerald-700 block mb-1">
                                ⛽ Проверенные АЗС и остановки:
                              </strong>
                              <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                                {day.roadtripSegment.gasStationsAndStops.map((st, idx) => (
                                  <li key={idx} className="line-clamp-1">{st}</li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          {/* Quick Navigation in Maps */}
                          <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-emerald-200/60">
                            <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1">
                              <Navigation className="w-3.5 h-3.5" />
                              Построить в навигаторе:
                            </span>
                            <a
                              href={`https://yandex.ru/maps/?rtext=${encodeURIComponent(day.roadtripSegment.route || day.location)}&rtt=auto`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] font-semibold text-slate-700 hover:text-red-600 bg-white hover:bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors"
                            >
                              <span>Яндекс.Карты</span>
                              <ExternalLink className="w-3 h-3 text-slate-400" />
                            </a>
                            <a
                              href={`https://2gis.ru/search/${encodeURIComponent(day.location)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] font-semibold text-slate-700 hover:text-emerald-700 bg-white hover:bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors"
                            >
                              <span>2ГИС</span>
                              <ExternalLink className="w-3 h-3 text-slate-400" />
                            </a>
                            <a
                              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(day.location)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] font-semibold text-slate-700 hover:text-blue-600 bg-white hover:bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors"
                            >
                              <span>Google Карты</span>
                              <ExternalLink className="w-3 h-3 text-slate-400" />
                            </a>
                          </div>
                        </div>
                      )}

                      {/* Daily schedule: Morning, Afternoon, Evening */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Morning */}
                        <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/60 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="flex items-center gap-1.5 text-xs font-bold text-amber-900 uppercase tracking-wider">
                                <Sun className="w-4 h-4 text-amber-600" />
                                Утро
                              </span>
                              <span className="text-[11px] font-semibold text-amber-700">
                                {day.morning.time || '09:00'}
                              </span>
                            </div>
                            <p className="text-xs text-slate-800 leading-relaxed font-medium">
                              {day.morning.activity}
                            </p>
                          </div>
                          {day.morning.tip && (
                            <div className="mt-3 pt-2 border-t border-amber-200/60 text-[11px] text-amber-800 italic">
                              💡 {day.morning.tip}
                            </div>
                          )}
                        </div>

                        {/* Afternoon */}
                        <div className="p-4 rounded-2xl bg-sky-50/50 border border-sky-200/60 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="flex items-center gap-1.5 text-xs font-bold text-sky-900 uppercase tracking-wider">
                                <Coffee className="w-4 h-4 text-sky-600" />
                                День
                              </span>
                              <span className="text-[11px] font-semibold text-sky-700">
                                {day.afternoon.time || '13:30'}
                              </span>
                            </div>
                            <p className="text-xs text-slate-800 leading-relaxed font-medium">
                              {day.afternoon.activity}
                            </p>
                          </div>
                          {day.afternoon.tip && (
                            <div className="mt-3 pt-2 border-t border-sky-200/60 text-[11px] text-sky-800 italic">
                              💡 {day.afternoon.tip}
                            </div>
                          )}
                        </div>

                        {/* Evening */}
                        <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-200/60 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="flex items-center gap-1.5 text-xs font-bold text-indigo-900 uppercase tracking-wider">
                                <Moon className="w-4 h-4 text-indigo-600" />
                                Вечер
                              </span>
                              <span className="text-[11px] font-semibold text-indigo-700">
                                {day.evening.time || '18:30'}
                              </span>
                            </div>
                            <p className="text-xs text-slate-800 leading-relaxed font-medium">
                              {day.evening.activity}
                            </p>
                          </div>
                          {day.evening.tip && (
                            <div className="mt-3 pt-2 border-t border-indigo-200/60 text-[11px] text-indigo-800 italic">
                              💡 {day.evening.tip}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Meals & Local Cuisine */}
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5 flex items-center gap-1.5">
                          <Utensils className="w-3.5 h-3.5 text-slate-500" />
                          Питание и местная кухня
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-700">
                          <div>
                            <strong className="text-slate-900 block text-[11px]">Обед:</strong>
                            <span className="text-slate-600">{day.meals.lunch || 'Кафе местной кухни'}</span>
                          </div>
                          <div>
                            <strong className="text-slate-900 block text-[11px]">Ужин:</strong>
                            <span className="text-slate-600">{day.meals.dinner || 'Ресторан с террасой'}</span>
                          </div>
                          <div>
                            <strong className="text-emerald-800 block text-[11px]">Обязательно попробовать:</strong>
                            <span className="text-slate-700 font-medium">{day.meals.localCuisineMustTry || 'Местные блюда и травяной сбор'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Accommodation for the night */}
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
                            <Bed className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900">
                              {day.accommodationRecommendation.name}
                            </div>
                            <div className="text-xs text-slate-500">
                              {day.accommodationRecommendation.type} • {day.accommodationRecommendation.priceEstimate}
                            </div>
                            <div className="text-[11px] text-slate-600 mt-0.5">
                              {day.accommodationRecommendation.bookingHint}
                            </div>
                          </div>
                        </div>

                        <a
                          href={`https://travel.yandex.ru/hotels/?destination=${encodeURIComponent(day.location)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100/70 border border-emerald-200 px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors flex items-center gap-1 shrink-0"
                        >
                          <span>Найти на Яндекс.Путешествиях</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>

                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Workation recommendation from kabinetdoma.ru */}
          {hasWorkation && (
            <KabinetDomaCard destination={itinerary.destinationRegion} />
          )}
        </div>
      )}

      {/* Tab Content: Transport & Roads */}
      {activeTab === 'transport' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Транспортная логистика и дороги</h2>
              <p className="text-xs text-slate-500">
                Рекомендованный транспорт: {itinerary.transportSummary.recommendedPrimary}
              </p>
            </div>
          </div>

          <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
            {itinerary.transportSummary.details}
          </p>

          {itinerary.transportSummary.carTips && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Особенности для автопутешественников по России и СНГ:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border border-slate-200 bg-white">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900 mb-1.5">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    Платные дороги и транспондер
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {itinerary.transportSummary.carTips.roadTolls}
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-white">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900 mb-1.5">
                    <Fuel className="w-4 h-4 text-amber-600" />
                    Заправки (АЗС) и зарядки
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {itinerary.transportSummary.carTips.gasAndCharging}
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-white">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900 mb-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    Камеры, радары и ДПС
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {itinerary.transportSummary.carTips.speedTrapsAndPolice}
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-white">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900 mb-1.5">
                    <ShieldCheck className="w-4 h-4 text-teal-600" />
                    Экстренные службы и эвакуация
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {itinerary.transportSummary.carTips.emergencyContacts}
                  </p>
                </div>
              </div>

              {itinerary.transportSummary.carTips.carRentalHint && (
                <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-xs text-teal-900 flex items-start justify-between gap-3">
                  <div>
                    <strong>Совет по аренде автомобиля:</strong> {itinerary.transportSummary.carTips.carRentalHint}
                  </div>
                  <a
                    href={`https://localrent.com/?city=${encodeURIComponent(itinerary.destinationRegion)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-semibold whitespace-nowrap"
                  >
                    Аренда на Localrent
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Practical road tips */}
          {itinerary.practicalTips.roadsAndDriving && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Дополнительные советы водителю:
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {itinerary.practicalTips.roadsAndDriving.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Direct Navigation Integration */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2 flex items-center gap-1.5">
              <Navigation className="w-4 h-4 text-emerald-600" />
              Открыть маршрут в мобильных навигаторах:
            </h4>
            <p className="text-xs text-slate-500 mb-3">
              Запустите навигацию до {itinerary.destinationRegion} в один клик с телефона:
            </p>
            <div className="flex flex-wrap gap-2.5">
              <a
                href={`https://yandex.ru/maps/?rtext=~${encodeURIComponent(itinerary.destinationRegion)}&rtt=auto`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 hover:text-red-600 flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <span>Яндекс.Карты & Навигатор</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
              <a
                href={`https://2gis.ru/search/${encodeURIComponent(itinerary.destinationRegion)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 hover:text-emerald-700 flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <span>2ГИС (офлайн-карты)</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(itinerary.destinationRegion)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 hover:text-blue-600 flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <span>Google Maps</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </div>
          </div>
        </div>
      )}

        {/* Tab Content: Hotels & Workation Stays */}
      {activeTab === 'hotels' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Рекомендуемые варианты проживания</h2>
              <p className="text-xs text-slate-500">
                Проверенные варианты с быстрым интернетом, парковкой и рабочими местами
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {itinerary.stayRecommendations.map((stay, idx) => (
              <div key={idx} className="p-5 rounded-2xl border border-slate-200 hover:border-emerald-500/80 bg-white transition-all flex flex-col justify-between shadow-2xs">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {stay.type}
                    </span>
                    {stay.workFriendly && (
                      <span className="text-[10px] font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded flex items-center gap-1">
                        <Wifi className="w-3 h-3 text-teal-600" />
                        Для удалёнки
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 mb-1">{stay.name}</h3>
                  <div className="text-xs text-slate-500 mb-2 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {stay.cityOrArea}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {stay.whyGood}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="font-extrabold text-sm text-slate-900">
                    {stay.pricePerNightRub}
                  </span>
                  <a
                    href={`https://travel.yandex.ru/hotels/?destination=${encodeURIComponent(stay.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1"
                  >
                    <span>Забронировать</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Travelpayouts Hotels Interactive Widget */}
          <TPOWidgetEmbed 
            type="hotels" 
            title="Интерактивный подбор отелей и сравнение цен"
            subtitle="Поиск свободных номеров от Ostrovok с гарантией заселения"
          />
        </div>
      )}

      {/* Tab Content: Budget */}
      {activeTab === 'budget' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Примерный бюджет поездки</h2>
              <p className="text-xs text-slate-500">
                Расчёт на {itinerary.totalDays} дней для всей группы
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-extrabold text-emerald-800">
                ~{itinerary.budgetBreakdown.totalEstimatedRub.toLocaleString('ru-RU')} ₽
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                ~{Math.round(itinerary.budgetBreakdown.totalEstimatedRub / itinerary.totalDays).toLocaleString('ru-RU')} ₽ / день
              </div>
            </div>
          </div>

          {/* Visual progress bar */}
          <div className="h-4 bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
            <div 
              style={{ width: `${(itinerary.budgetBreakdown.categories.accommodation / itinerary.budgetBreakdown.totalEstimatedRub) * 100}%` }}
              className="bg-emerald-600"
              title="Жильё"
            />
            <div 
              style={{ width: `${(itinerary.budgetBreakdown.categories.transport / itinerary.budgetBreakdown.totalEstimatedRub) * 100}%` }}
              className="bg-teal-500"
              title="Транспорт"
            />
            <div 
              style={{ width: `${(itinerary.budgetBreakdown.categories.food / itinerary.budgetBreakdown.totalEstimatedRub) * 100}%` }}
              className="bg-amber-500"
              title="Питание"
            />
            <div 
              style={{ width: `${(itinerary.budgetBreakdown.categories.activitiesAndTickets / itinerary.budgetBreakdown.totalEstimatedRub) * 100}%` }}
              className="bg-sky-500"
              title="Развлечения"
            />
            <div 
              style={{ width: `${(itinerary.budgetBreakdown.categories.emergencyReserve / itinerary.budgetBreakdown.totalEstimatedRub) * 100}%` }}
              className="bg-slate-400"
              title="Резерв"
            />
          </div>

          {/* Category breakdown cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block mr-1.5" />
              <span className="text-xs font-semibold text-slate-600">Проживание</span>
              <div className="text-sm font-extrabold text-slate-900 mt-1">
                ~{itinerary.budgetBreakdown.categories.accommodation.toLocaleString('ru-RU')} ₽
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500 inline-block mr-1.5" />
              <span className="text-xs font-semibold text-slate-600">Транспорт/бензин</span>
              <div className="text-sm font-extrabold text-slate-900 mt-1">
                ~{itinerary.budgetBreakdown.categories.transport.toLocaleString('ru-RU')} ₽
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block mr-1.5" />
              <span className="text-xs font-semibold text-slate-600">Питание</span>
              <div className="text-sm font-extrabold text-slate-900 mt-1">
                ~{itinerary.budgetBreakdown.categories.food.toLocaleString('ru-RU')} ₽
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block mr-1.5" />
              <span className="text-xs font-semibold text-slate-600">Экскурсии/билеты</span>
              <div className="text-sm font-extrabold text-slate-900 mt-1">
                ~{itinerary.budgetBreakdown.categories.activitiesAndTickets.toLocaleString('ru-RU')} ₽
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 col-span-2 sm:col-span-1">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block mr-1.5" />
              <span className="text-xs font-semibold text-slate-600">Резерв на случай ЧП</span>
              <div className="text-sm font-extrabold text-slate-900 mt-1">
                ~{itinerary.budgetBreakdown.categories.emergencyReserve.toLocaleString('ru-RU')} ₽
              </div>
            </div>
          </div>

          {/* Money saving tips */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 mb-2">
              💡 Советы по оптимизации расходов:
            </h4>
            <ul className="space-y-1.5 text-xs text-emerald-900">
              {itinerary.budgetBreakdown.moneySavingTips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Tab Content: Tips & Packing list */}
      {activeTab === 'tips' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Packing list with interactive checkboxes */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-emerald-600" />
                Чек-лист сборов в дорогу
              </h3>
              <span className="text-xs text-slate-500 font-medium">
                {Object.values(checkedItems).filter(Boolean).length} из {itinerary.practicalTips.packingList.length} собрано
              </span>
            </div>

            <div className="space-y-2">
              {itinerary.practicalTips.packingList.map((item, idx) => {
                const isChecked = !!checkedItems[item];
                return (
                  <div
                    key={idx}
                    onClick={() => toggleCheck(item)}
                    className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer select-none transition-all ${
                      isChecked
                        ? 'bg-emerald-50/60 border-emerald-300 text-slate-400 line-through'
                        : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200 text-slate-800'
                    }`}
                  >
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                    <span className="text-xs font-medium">{item}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Connectivity, Internet & Etiquette */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 space-y-4">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Wifi className="w-4 h-4 text-teal-600" />
                Связь, интернет и мобильные операторы
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed bg-teal-50/50 p-3.5 rounded-xl border border-teal-200/60">
                {itinerary.practicalTips.connectivityAndSim}
              </p>

              {itinerary.practicalTips.remoteWorkAndInternet && (
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {itinerary.practicalTips.remoteWorkAndInternet.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-1.5 shrink-0" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 space-y-3">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-slate-700" />
                Безопасность и местный этикет
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {itinerary.practicalTips.safetyAndLocalEtiquette.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-500 mt-1.5 shrink-0" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: Travelpayouts Partners */}
      {activeTab === 'partners' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">
                  Партнёрские сервисы и бронирование
                </h2>
                <span className="text-[10px] uppercase font-extrabold tracking-wider bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200">
                  Travelpayouts
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Надёжные сервисы для бронирования билетов, жилья, аренды авто и экскурсий
              </p>
            </div>
          </div>

          {/* Contextual JS Widgets from Travelpayouts (726345) */}
          <div className="space-y-4">
            {!isCarTrip && (
              <TPOWidgetEmbed 
                type="flights" 
                title="Поиск и бронирование авиабилетов (Aviasales)"
                subtitle="Прямые рейсы и оптимальные пересадки по лучшим ценам"
              />
            )}

            <TPOWidgetEmbed 
              type="hotels" 
              title="Интерактивная карта отелей и апартаментов"
              subtitle="Сравнение цен и моментальное бронирование с оплатой картами РФ"
            />

            {!isCarTrip && (
              <TPOWidgetEmbed 
                type="packages" 
                title="Пакетные туры от 120 туроператоров (Level.Travel / Travelata)"
                subtitle="Выгодные готовые туры, когда чартерный перелёт дешевле регулярного"
              />
            )}
          </div>

          <div className="pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
              Проверенные сервисы и прямые партнёрские ссылки:
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {affiliateOffers.map((offer) => (
              <div key={offer.id} className="p-5 rounded-2xl border border-slate-200 hover:border-indigo-400 bg-white transition-all flex flex-col justify-between shadow-2xs hover:shadow-md">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                      {offer.badge}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {offer.partnerName}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 mb-1.5">{offer.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {offer.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  {offer.discountOrPerk && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      {offer.discountOrPerk}
                    </span>
                  )}
                  <a
                    href={offer.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 px-3.5 py-2 rounded-xl transition-colors ml-auto"
                  >
                    <span>{offer.ctaText}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interactive AI Concierge Q&A box at bottom (Screen only) */}
      <div className="bg-slate-50 rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs print:hidden">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900">
              Задать вопрос ИИ по этому маршруту
            </h3>
            <p className="text-xs text-slate-500">
              Спросите про перевалы, паромы, детские кафе, парковки или погоду в {itinerary.destinationRegion}
            </p>
          </div>
        </div>

        <form onSubmit={handleAskAi} className="flex gap-2">
          <input
            type="text"
            value={aiQuestion}
            onChange={(e) => setAiQuestion(e.target.value)}
            placeholder="Например: 'Какой мобильный оператор лучше ловит в горах?' или 'Есть ли газовые заправки?'..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-slate-900 text-xs sm:text-sm bg-white"
          />
          <button
            type="submit"
            disabled={isAskingAi || !aiQuestion.trim()}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            {isAskingAi ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Спросить</span>
              </>
            )}
          </button>
        </form>

        {aiAnswer && (
          <div className="mt-4 p-4 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed animate-in fade-in">
            <div className="font-bold text-emerald-800 text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              Ответ эксперта trvl4.me:
            </div>
            {aiAnswer}
          </div>
        )}
      </div>

    </div>
  );
};
