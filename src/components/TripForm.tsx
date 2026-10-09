import React, { useState } from 'react';
import { 
  Car, 
  Laptop, 
  Palmtree, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Plane, 
  Train, 
  Users, 
  Sparkles, 
  Wifi, 
  Sliders, 
  CheckCircle2, 
  Navigation,
  Compass,
  Clock,
  ShieldCheck, 
  ChevronRight
} from 'lucide-react';
import { TripRequest, TripMode, TransportType, BudgetLevel, TravelersGroup, GroupComposition } from '../types/trip';
import { CityAutocomplete } from './CityAutocomplete';
import { isReachableByCarFromRussia } from '../data/cities';

interface TripFormProps {
  onSubmit: (params: TripRequest) => void;
  isLoading: boolean;
}

const ROADTRIP_PRESETS = [
  { name: 'Алтай (Чуйский тракт & Акташ)', tag: 'Горы & Панорамы' },
  { name: 'Дагестан (Сулакский каньон & Дербент)', tag: 'Кавказ & Море' },
  { name: 'Золотое кольцо (Ярославль, Суздаль, Ростов)', tag: 'Культура & Трасса М-8' },
  { name: 'Карелия (Ладога, Сортавала & Рускеала)', tag: 'Озёра & Природа' },
  { name: 'Кольский полуостров (Териберка & Мурманск)', tag: 'Север & Океан' },
  { name: 'Байкал (Листвянка & Ольхон)', tag: 'Сибирь & Воркейшн' },
  { name: 'Грузия (Тбилиси & Казбеги через Ларс)', tag: 'Закавказье & Горы' },
  { name: 'Беларусь (Минск, Мир & Несвиж)', tag: 'Замки & Трасса М-1' },
  { name: 'Узбекистан (Ташкент, Самарканд & Бухара)', tag: 'Шёлковый путь & СНГ' },
  { name: 'Казахстан (Алматы & Чарынский каньон)', tag: 'Тянь-Шань & СНГ' },
];

const WORKATION_PRESETS = [
  { name: 'Сочи (Красная Поляна & Сириус)', tag: 'Горы & Коворкинги' },
  { name: 'Турция: Стамбул (Босфор & кафе с Wi-Fi)', tag: 'Хаб & История' },
  { name: 'Казань (Иннополис & IT-парк)', tag: 'IT-столица РФ' },
  { name: 'Байкал (Листвянка & Ольхон)', tag: 'Природа & Фокус' },
  { name: 'Калининград (Зеленоградск & Светлогорск)', tag: 'Балтика & Уют' },
  { name: 'Таиланд: Пхукет (Панган & коворкинги)', tag: 'Тропики & Зимовка' },
];

const STANDARD_PRESETS = [
  { name: 'Турция: Анталья (море & курорты)', tag: 'Пляжи & Солнце' },
  { name: 'Таиланд: Пхукет (острова & пляжи)', tag: 'Тропики' },
  { name: 'Китай: Санья / Хайнань', tag: 'Островной релакс' },
  { name: 'Египет: Шарм-эль-Шейх (Красное море)', tag: 'Рифы & Дайвинг' },
  { name: 'ОАЭ: Дубай (небоскрёбы & шопинг)', tag: 'Мегаполис' },
  { name: 'Мальдивы (Мале & атоллы)', tag: 'Премиум релакс' },
];

export const TripForm: React.FC<TripFormProps> = ({ onSubmit, isLoading }) => {
  const [tripMode, setTripMode] = useState<TripMode>('roadtrip');
  const [origin, setOrigin] = useState('Москва');
  const [destination, setDestination] = useState('Алтай (Чуйский тракт & Акташ)');
  const [daysCount, setDaysCount] = useState<number>(5);
  const [budgetLevel, setBudgetLevel] = useState<BudgetLevel>('comfort');
  const [transportType, setTransportType] = useState<TransportType>('car');
  const [travelersGroup, setTravelersGroup] = useState<TravelersGroup>('couple');
  
  // Detailed group composition with child ages
  const [adultsCount, setAdultsCount] = useState<number>(2);
  const [childrenCount, setChildrenCount] = useState<number>(1);
  const [childrenAges, setChildrenAges] = useState<number[]>([7]);
  const [groupAccommodationType, setGroupAccommodationType] = useState<'separate_rooms' | 'shared_villa_house'>('shared_villa_house');
  
  const [tripPurpose, setTripPurpose] = useState('Автоэкспедиция и панорамные виды');
  const [remoteWork, setRemoteWork] = useState(false);
  const [workHoursPerDay, setWorkHoursPerDay] = useState(4);
  const [needCoworking, setNeedCoworking] = useState(true);
  const [customNotes, setCustomNotes] = useState('');
  const [modeNotice, setModeNotice] = useState<string | null>(null);

  // Calculate total travelers count
  const effectiveTravelersCount = travelersGroup === 'solo' 
    ? 1 
    : travelersGroup === 'couple' 
    ? 2 
    : travelersGroup === 'family' 
    ? (adultsCount + childrenCount) 
    : adultsCount;

  // Handle switching main modes
  const handleModeChange = (newMode: TripMode) => {
    setTripMode(newMode);
    setModeNotice(null);

    if (newMode === 'roadtrip') {
      setTransportType('car');
      setTripPurpose('Автоэкспедиция и панорамные виды');
      // If currently selected destination is overseas, auto-switch to top roadtrip
      if (!isReachableByCarFromRussia(destination)) {
        setDestination('Алтай (Чуйский тракт & Акташ)');
        setModeNotice('Для автопутешествия направление заменено на доступное на автомобиле.');
      }
    } else if (newMode === 'workation') {
      setRemoteWork(true);
      setTripPurpose('Совмещение продуктивной работы и отдыха');
    } else {
      setRemoteWork(false);
      setTransportType('plane');
      setTripPurpose('Отдых, экскурсии и релакс');
    }
  };

  const handleSelectPreset = (presetName: string) => {
    setModeNotice(null);
    setDestination(presetName);
    
    // Check if selecting an overseas preset while in roadtrip mode
    if (tripMode === 'roadtrip' && !isReachableByCarFromRussia(presetName)) {
      setTripMode('standard');
      setTransportType('plane');
      setModeNotice(`До локации "${presetName}" невозможно доехать на авто из РФ. Режим переключен на "Обычная поездка".`);
    }
  };

  const handleDestinationChange = (newDest: string) => {
    setDestination(newDest);
    setModeNotice(null);
    
    // Check roadtrip validity
    if (tripMode === 'roadtrip' && newDest.length > 3 && !isReachableByCarFromRussia(newDest)) {
      setModeNotice(`Обратите внимание: "${newDest}" находится за морем или вдали от автодорог РФ/СНГ. Если планируете перелёт, переключите вкладку.`);
    }
  };

  const handleChildrenCountChange = (newCount: number) => {
    const count = Math.max(0, Math.min(6, newCount));
    setChildrenCount(count);
    
    // Adjust children ages array
    if (count > childrenAges.length) {
      const added = Array.from({ length: count - childrenAges.length }, () => 7);
      setChildrenAges([...childrenAges, ...added]);
    } else if (count < childrenAges.length) {
      setChildrenAges(childrenAges.slice(0, count));
    }
  };

  const handleChildAgeChange = (index: number, age: number) => {
    const updated = [...childrenAges];
    updated[index] = age;
    setChildrenAges(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim()) return;

    const groupComposition: GroupComposition = {
      adultsCount,
      childrenCount: travelersGroup === 'family' ? childrenCount : 0,
      childrenAges: travelersGroup === 'family' ? childrenAges : [],
      groupAccommodationType: travelersGroup === 'friends' ? groupAccommodationType : 'separate_rooms',
    };

    onSubmit({
      origin: origin.trim() || 'Москва',
      destination: destination.trim(),
      daysCount,
      tripMode,
      budgetLevel,
      transportType,
      travelersCount: effectiveTravelersCount,
      travelersGroup,
      groupComposition,
      tripPurpose,
      remoteWork: remoteWork || tripMode === 'workation',
      remoteWorkDetails: (remoteWork || tripMode === 'workation') ? {
        workHoursPerDay,
        needCoworking,
        internetPriority: 'vital',
      } : undefined,
      customNotes: customNotes.trim() || undefined,
    });
  };

  // Get active presets list based on mode
  const activePresets = tripMode === 'roadtrip' 
    ? ROADTRIP_PRESETS 
    : tripMode === 'workation' 
    ? WORKATION_PRESETS 
    : STANDARD_PRESETS;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold mb-3 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
          <span>Планирование путешествий на базе Gemini AI</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
          Куда отправимся дальше?
        </h1>
        <p className="mt-3 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
          Умный ИИ построит маршрут по дням, подберёт трассы, проверенные отели с быстрым интернетом, локации для работы и рассчитает честный бюджет.
        </p>
      </div>

      {/* Main Mode Switcher */}
      <div className="bg-slate-200/60 p-1.5 rounded-2xl mb-8 flex flex-col sm:flex-row gap-1.5 shadow-inner">
        <button
          type="button"
          onClick={() => handleModeChange('roadtrip')}
          className={`flex-1 flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 ${
            tripMode === 'roadtrip'
              ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
          }`}
        >
          <Car className={`w-4 h-4 ${tripMode === 'roadtrip' ? 'text-emerald-600' : 'text-slate-400'}`} />
          <span>Автопутешествие (РФ & СНГ)</span>
          <span className="hidden md:inline-block text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-medium">
            Хит
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleModeChange('workation')}
          className={`flex-1 flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 ${
            tripMode === 'workation'
              ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
          }`}
        >
          <Laptop className={`w-4 h-4 ${tripMode === 'workation' ? 'text-teal-600' : 'text-slate-400'}`} />
          <span>Воркейшн (Работа + Отдых)</span>
          <span className="hidden md:inline-block text-[10px] bg-teal-100 text-teal-800 px-1.5 py-0.5 rounded font-medium">
            Wi-Fi фокус
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleModeChange('standard')}
          className={`flex-1 flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 ${
            tripMode === 'standard'
              ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
          }`}
        >
          <Palmtree className={`w-4 h-4 ${tripMode === 'standard' ? 'text-amber-600' : 'text-slate-400'}`} />
          <span>Обычная поездка (Отпуск)</span>
        </button>
      </div>

      {/* Mode notice banner */}
      {modeNotice && (
        <div className="mb-6 p-3.5 rounded-2xl bg-amber-50 border border-amber-200/90 text-amber-900 text-xs flex items-center gap-2.5 animate-in fade-in">
          <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{modeNotice}</span>
        </div>
      )}

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 border border-slate-200/80">
        
        {/* Quick presets (Filtered by Active Mode) */}
        <div className="mb-7">
          <div className="flex items-center justify-between mb-2.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              {tripMode === 'roadtrip' 
                ? '🚗 Популярные направления на авто из РФ & СНГ:' 
                : tripMode === 'workation'
                ? '💻 Топ локаций для воркейшна с проверенным Wi-Fi:'
                : '🌴 Популярные направления для отдыха:'}
            </label>
            <span className="text-[11px] text-slate-400 font-medium">
              {tripMode === 'roadtrip' ? 'Только доступные на автомобиле' : 'Все направления'}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {activePresets.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => handleSelectPreset(preset.name)}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 ${
                  destination === preset.name
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs font-semibold'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <span>{preset.name}</span>
                <span className={`text-[10px] px-1 py-0.2 rounded ${
                  destination === preset.name ? 'bg-emerald-700 text-white' : 'bg-slate-200/70 text-slate-600'
                }`}>
                  {preset.tag}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Section: Route Origin & Destination with Autocomplete */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <CityAutocomplete
            label="Откуда выезжаете (город)"
            value={origin}
            onChange={(val) => setOrigin(val)}
            placeholder="Начните ввод: Москва, СПб, Казань..."
            icon="nav"
            required
          />

          <CityAutocomplete
            label="Куда / регион поездки"
            value={destination}
            onChange={handleDestinationChange}
            placeholder={tripMode === 'roadtrip' ? 'Алтай, Дагестан, Карелия, Грузия, Беларусь...' : 'Турция, Пхукет, Алтай, Сочи...'}
            icon="map"
            mode={tripMode}
            required
          />
        </div>

        {/* Section: Duration & Budget */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Длительность поездки
              </label>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                {daysCount} {daysCount === 1 ? 'день' : daysCount < 5 ? 'дня' : 'дней'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="2"
                max="14"
                step="1"
                value={daysCount}
                onChange={(e) => setDaysCount(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex gap-1">
                {[3, 5, 7, 10].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDaysCount(d)}
                    className={`text-xs px-2 py-1 rounded border font-medium ${
                      daysCount === d 
                        ? 'bg-slate-900 text-white border-slate-900' 
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {d}д
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-slate-400" />
              Уровень бюджета
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'budget', label: 'Эконом', desc: 'Хостелы / кемпинг' },
                { id: 'comfort', label: 'Комфорт', desc: 'Отели 3-4★' },
                { id: 'premium', label: 'Премиум', desc: 'Глэмпинги 4-5★' }
              ].map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setBudgetLevel(lvl.id as BudgetLevel)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    budgetLevel === lvl.id
                      ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-500'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="text-xs font-bold text-slate-900">{lvl.label}</div>
                  <div className="text-[10px] text-slate-500 leading-tight">{lvl.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section: Transport & Travelers */}
        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Основной транспорт
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'car', icon: Car, label: 'Авто' },
                  { id: 'plane', icon: Plane, label: 'Самолёт' },
                  { id: 'train', icon: Train, label: 'Поезд' },
                  { id: 'mixed', icon: Compass, label: 'Смешанный' },
                ].map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setTransportType(item.id as TransportType)}
                      className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${
                        transportType === item.id
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-500'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <IconComponent className="w-4 h-4 mb-1" />
                      <span className="text-xs font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  Формат путешествия
                </span>
                <span className="text-[11px] text-emerald-700 font-semibold lowercase">
                  Всего: {effectiveTravelersCount} чел.
                </span>
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'solo', label: '1 (Соло)' },
                  { id: 'couple', label: '2 (Пара)' },
                  { id: 'family', label: 'Семья с детьми' },
                  { id: 'friends', label: 'Компания' },
                ].map((grp) => (
                  <button
                    key={grp.id}
                    type="button"
                    onClick={() => setTravelersGroup(grp.id as TravelersGroup)}
                    className={`py-2 px-1 rounded-xl border text-center transition-all ${
                      travelersGroup === grp.id
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-semibold ring-1 ring-emerald-500'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50 text-xs'
                    }`}
                  >
                    <span className="text-xs">{grp.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sub-panel: Detailed Family Composition (Adults + Kids with Ages) */}
          {travelersGroup === 'family' && (
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 animate-in fade-in space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                  <span>👨‍👩‍👧‍👦 Состав семьи и возраст детей</span>
                  <span className="text-[10px] bg-amber-200/70 text-amber-900 px-2 py-0.5 rounded-full font-medium">
                    Влияет на тарифы авиа, спальные места и активности
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Adults counter */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-amber-200">
                  <span className="text-xs font-medium text-slate-700">Взрослые (18+):</span>
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => setAdultsCount(Math.max(1, adultsCount - 1))}
                      className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-slate-700 text-sm"
                    >
                      -
                    </button>
                    <span className="w-4 text-center font-bold text-sm text-slate-900">{adultsCount}</span>
                    <button
                      type="button"
                      onClick={() => setAdultsCount(Math.min(6, adultsCount + 1))}
                      className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-slate-700 text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Children counter */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-amber-200">
                  <span className="text-xs font-medium text-slate-700">Дети (до 17 лет):</span>
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleChildrenCountChange(childrenCount - 1)}
                      className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-slate-700 text-sm"
                    >
                      -
                    </button>
                    <span className="w-4 text-center font-bold text-sm text-slate-900">{childrenCount}</span>
                    <button
                      type="button"
                      onClick={() => handleChildrenCountChange(childrenCount + 1)}
                      className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-slate-700 text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Individual child ages */}
              {childrenCount > 0 && (
                <div className="pt-2 border-t border-amber-200/60">
                  <label className="block text-[11px] font-semibold text-amber-900 mb-2">
                    Укажите точный возраст каждого ребёнка:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                    {childrenAges.slice(0, childrenCount).map((age, idx) => {
                      const isInfant = age < 2;
                      const isKid = age >= 2 && age < 12;
                      const isTeen = age >= 12;
                      return (
                        <div key={idx} className="p-2.5 rounded-xl bg-white border border-amber-200/90 flex flex-col gap-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-800">
                              Ребёнок #{idx + 1}
                            </span>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              isInfant ? 'bg-rose-100 text-rose-800' : isKid ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {isInfant ? '🍼 Младенец' : isKid ? '🧒 Ребёнок' : '🧑 Подросток'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <select
                              value={age}
                              onChange={(e) => handleChildAgeChange(idx, parseInt(e.target.value, 10))}
                              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-1.5 font-medium text-slate-800"
                            >
                              <option value={0}>до 1 года (младенец)</option>
                              <option value={1}>1 год</option>
                              <option value={2}>2 года</option>
                              <option value={3}>3 года</option>
                              <option value={4}>4 года</option>
                              <option value={5}>5 лет</option>
                              <option value={6}>6 лет</option>
                              <option value={7}>7 лет</option>
                              <option value={8}>8 лет</option>
                              <option value={9}>9 лет</option>
                              <option value={10}>10 лет</option>
                              <option value={11}>11 лет</option>
                              <option value={12}>12 лет</option>
                              <option value={13}>13 лет</option>
                              <option value={14}>14 лет</option>
                              <option value={15}>15 лет</option>
                              <option value={16}>16 лет</option>
                              <option value={17}>17 лет</option>
                            </select>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-2 text-[11px] text-amber-800 italic">
                    💡 <b>Учёт детских льгот:</b> Младенцы до 2 лет летят бесплатно или со скидкой 90% (без места); для детей 2–11 лет подбираются семейные номера и пологие прогулочные треки.
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Sub-panel: Detailed Friends Group (House vs Hotel) */}
          {travelersGroup === 'friends' && (
            <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200/80 animate-in fade-in space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-950">
                  👥 Параметры компании друзей
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-600">Человек:</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setAdultsCount(Math.max(3, adultsCount - 1))}
                      className="w-6 h-6 rounded-md bg-white border border-indigo-200 flex items-center justify-center font-bold text-xs"
                    >
                      -
                    </button>
                    <span className="w-5 text-center font-bold text-xs text-indigo-900">{adultsCount}</span>
                    <button
                      type="button"
                      onClick={() => setAdultsCount(Math.min(12, adultsCount + 1))}
                      className="w-6 h-6 rounded-md bg-white border border-indigo-200 flex items-center justify-center font-bold text-xs"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-indigo-900 mb-1.5">
                  Формат размещения для компании:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setGroupAccommodationType('shared_villa_house')}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      groupAccommodationType === 'shared_villa_house'
                        ? 'border-indigo-600 bg-white ring-1 ring-indigo-500 shadow-xs'
                        : 'border-indigo-200 bg-white/70 hover:bg-white'
                    }`}
                  >
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                      <span>🏡 Аренда дома / виллы целиком</span>
                      <span className="text-[10px] bg-indigo-100 text-indigo-800 px-1 py-0.2 rounded font-medium">Хит</span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      Своя кухня, зона BBQ, общая гостиная. Экономия до 35-40% на человека.
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setGroupAccommodationType('separate_rooms')}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      groupAccommodationType === 'separate_rooms'
                        ? 'border-indigo-600 bg-white ring-1 ring-indigo-500 shadow-xs'
                        : 'border-indigo-200 bg-white/70 hover:bg-white'
                    }`}
                  >
                    <div className="text-xs font-bold text-slate-900">
                      🏢 Отдельные номера в отеле
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      Максимальная приватность, завтраки включены, индивидуальные санузлы.
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section: Remote Work / Workation Toggle */}
        <div className={`p-4 rounded-2xl border transition-all mb-6 ${
          (remoteWork || tripMode === 'workation')
            ? 'bg-teal-50/70 border-teal-200 ring-1 ring-teal-300'
            : 'bg-slate-50/70 border-slate-200/80'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                (remoteWork || tripMode === 'workation') ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                <Wifi className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">
                  Совместить с удалённой работой (Воркейшн)?
                </div>
                <div className="text-xs text-slate-500">
                  ИИ выделит часы для созвонов, подберёт локации с надёжным Wi-Fi и коворкинги
                </div>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={remoteWork || tripMode === 'workation'}
                onChange={(e) => setRemoteWork(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
            </label>
          </div>

          {(remoteWork || tripMode === 'workation') && (
            <div className="mt-4 pt-4 border-t border-teal-200/80 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-teal-900 mb-1">
                  Сколько часов в день планируете работать:
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="2"
                    max="8"
                    step="1"
                    value={workHoursPerDay}
                    onChange={(e) => setWorkHoursPerDay(parseInt(e.target.value, 10))}
                    className="w-full h-2 bg-teal-200 rounded-lg appearance-none cursor-pointer accent-teal-700"
                  />
                  <span className="text-xs font-bold text-teal-800 bg-white px-2 py-1 rounded border border-teal-300 whitespace-nowrap">
                    ~{workHoursPerDay} ч/день
                  </span>
                </div>
              </div>

              <div className="flex items-center">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-teal-900">
                  <input
                    type="checkbox"
                    checked={needCoworking}
                    onChange={(e) => setNeedCoworking(e.target.checked)}
                    className="rounded border-teal-400 text-teal-600 focus:ring-teal-500 w-4 h-4"
                  />
                  Искать коворкинги и кафе с оптоволокном
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Section: Additional notes */}
        <div className="mb-6">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
            Особые пожелания (необязательно)
          </label>
          <input
            type="text"
            value={customNotes}
            onChange={(e) => setCustomNotes(e.target.value)}
            placeholder="Например: любим баню, едем с собакой, хотим встретить рассвет на перевале, без крутых подъемов..."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-slate-800 text-sm"
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-base shadow-lg shadow-emerald-600/30 hover:shadow-xl hover:shadow-emerald-600/40 active:scale-[0.99] transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed group cursor-pointer"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Нейросеть составляет персональный маршрут...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-emerald-200 group-hover:rotate-12 transition-transform" />
              <span>Составить маршрут с помощью ИИ</span>
              <ChevronRight className="w-4 h-4 text-emerald-200 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>

        {/* Trust badges */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Учёт состояния дорог РФ
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Проверенное жилье с Wi-Fi
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Редактирование любого дня
          </span>
        </div>
      </form>
    </div>
  );
};
