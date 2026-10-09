import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { TripForm } from './components/TripForm';
import { ItineraryView } from './components/ItineraryView';
import { RegenerateDayModal } from './components/RegenerateDayModal';
import { ShareModal } from './components/ShareModal';
import { SavedTripsDrawer } from './components/SavedTripsDrawer';
import { TravelpayoutsPartnerModal } from './components/TravelpayoutsPartnerModal';
import { EmailModal } from './components/EmailModal';
import { TelegramExportModal } from './components/TelegramExportModal';
import { TripRequest, Itinerary, DayPlan } from './types/trip';
import { 
  getSavedItineraries, 
  saveItineraryToStorage, 
  deleteItineraryFromStorage,
  decodeItineraryFromShare
} from './utils/storage';
import { 
  Car, 
  Laptop, 
  ShieldCheck, 
  Sparkles, 
  Compass, 
  Map, 
  Calendar,
  AlertCircle
} from 'lucide-react';

export default function App() {
  const [currentItinerary, setCurrentItinerary] = useState<Itinerary | null>(null);
  const [savedTrips, setSavedTrips] = useState<Itinerary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modals state
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isTelegramModalOpen, setIsTelegramModalOpen] = useState(false);
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
  const [regenerateDayTarget, setRegenerateDayTarget] = useState<DayPlan | null>(null);
  const [isRegeneratingDay, setIsRegeneratingDay] = useState(false);

  // Load saved trips on mount and check URL hash for shared trips
  useEffect(() => {
    const loaded = getSavedItineraries();
    setSavedTrips(loaded);

    // Check URL search parameters for Telegram integration
    const urlParams = new URLSearchParams(window.location.search);
    const tgId = urlParams.get('tg_id') || urlParams.get('tg_user_id');
    if (tgId) {
      localStorage.setItem('trvl4me_tg_id', tgId);
    }

    // Check hash for #trip=...
    const hash = window.location.hash;
    if (hash && hash.startsWith('#trip=')) {
      const encoded = hash.replace('#trip=', '');
      const sharedItinerary = decodeItineraryFromShare(encoded);
      if (sharedItinerary) {
        setCurrentItinerary(sharedItinerary);
      }
    }
  }, []);

  // Handle generating new trip
  const handleGenerateTrip = async (params: TripRequest) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/generate-trip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!res.ok) {
        throw new Error(`Ошибка сервера: ${res.status}`);
      }

      const data = await res.json();
      if (data.itinerary) {
        setCurrentItinerary(data.itinerary);
        // Scroll smoothly to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        throw new Error('Не удалось сформировать маршрут');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Произошла непредвиденная ошибка при обращении к ИИ');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle saving current trip to local storage
  const handleSaveTrip = () => {
    if (!currentItinerary) return;
    saveItineraryToStorage(currentItinerary);
    setSavedTrips(getSavedItineraries());
  };

  // Handle deleting a trip
  const handleDeleteTrip = (id: string) => {
    deleteItineraryFromStorage(id);
    setSavedTrips(getSavedItineraries());
  };

  // Handle regenerating a single day with custom instruction
  const handleRegenerateDay = async (dayNumber: number, instruction: string) => {
    if (!currentItinerary || !regenerateDayTarget) return;
    setIsRegeneratingDay(true);

    try {
      const res = await fetch('/api/regenerate-day', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dayNumber,
          destination: currentItinerary.destinationRegion,
          currentDay: regenerateDayTarget,
          instruction,
          tripMode: currentItinerary.transportSummary.carTips ? 'roadtrip' : 'standard',
          remoteWork: !!regenerateDayTarget.workationWindow,
        }),
      });

      const data = await res.json();
      if (data.day) {
        const updatedDays = currentItinerary.days.map((d) =>
          d.dayNumber === dayNumber ? data.day : d
        );
        const updatedItinerary = {
          ...currentItinerary,
          days: updatedDays,
          isCustomized: true,
        };
        setCurrentItinerary(updatedItinerary);
        // If already saved in storage, update it too
        if (savedTrips.some((t) => t.id === updatedItinerary.id)) {
          saveItineraryToStorage(updatedItinerary);
          setSavedTrips(getSavedItineraries());
        }
      }
    } catch (err) {
      console.error('Error regenerating day', err);
    } finally {
      setIsRegeneratingDay(false);
    }
  };

  const handleUpdateDay = (updatedDay: DayPlan) => {
    if (!currentItinerary) return;
    const updatedDays = currentItinerary.days.map((d) =>
      d.dayNumber === updatedDay.dayNumber ? updatedDay : d
    );
    const updatedItinerary = {
      ...currentItinerary,
      days: updatedDays,
      isCustomized: true,
    };
    setCurrentItinerary(updatedItinerary);
  };

  const isCurrentTripSaved = currentItinerary
    ? savedTrips.some((t) => t.id === currentItinerary.id)
    : false;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Header */}
      <Header
        savedCount={savedTrips.length}
        onOpenSaved={() => setIsSavedDrawerOpen(true)}
        onNewTrip={() => {
          setCurrentItinerary(null);
          window.location.hash = '';
        }}
        onOpenPartnerSettings={() => setIsPartnerModalOpen(true)}
        hasActiveTrip={!!currentItinerary}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3 max-w-4xl mx-auto">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Не удалось завершить операцию</p>
              <p className="text-xs text-rose-700 mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}

        {currentItinerary ? (
          <ItineraryView
            itinerary={currentItinerary}
            onBackToEdit={() => setCurrentItinerary(null)}
            onSave={handleSaveTrip}
            isSaved={isCurrentTripSaved}
            onOpenShare={() => setIsShareModalOpen(true)}
            onOpenEmail={() => setIsEmailModalOpen(true)}
            onOpenTelegram={() => setIsTelegramModalOpen(true)}
            onOpenRegenerateDay={(day) => setRegenerateDayTarget(day)}
            onUpdateDay={handleUpdateDay}
            isRegeneratingDay={isRegeneratingDay}
          />
        ) : (
          <div className="space-y-16">
            {/* Planner Form */}
            <TripForm onSubmit={handleGenerateTrip} isLoading={isLoading} />

            {/* Feature Highlights Section */}
            <div className="max-w-5xl mx-auto pt-6 border-t border-slate-200/80">
              <div className="text-center mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Почему путешественники выбирают trvl4.me
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Умные алгоритмы учитывают реалии дорог, покрытия и баланса работы на удалёнке
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-shadow">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                    <Car className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-slate-900 mb-2">
                    Автопутешествия по РФ и СНГ
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Реальное состояние асфальта, перевалы, опасные участки, проверенные АЗС, платные трассы и лучшие смотровые площадки для остановок.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-shadow">
                  <div className="w-11 h-11 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4">
                    <Laptop className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-slate-900 mb-2">
                    Воркейшн (Работа + Отдых)
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Планирование рабочих слотов, выбор отелей с быстрым Wi-Fi, коворкинги и учёт часовых поясов для комфортных созвонов без срыва дедлайнов.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-shadow">
                  <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-slate-900 mb-2">
                    Гибкая настройка дней ИИ
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Не понравился отдельный день? Попросите ИИ перегенерировать только его: убрать спешку, добавить природный треккинг или спа-релакс.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">trvl4.me</span>
            <span>— Умный планировщик путешествий</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>Партнёрские предложения Travelpayouts</span>
            <span>•</span>
            <button
              onClick={() => setIsPartnerModalOpen(true)}
              className="text-slate-600 hover:text-slate-900 underline"
            >
              Настройка партнёра
            </button>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <SavedTripsDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        savedTrips={savedTrips}
        onSelectTrip={(trip) => setCurrentItinerary(trip)}
        onDeleteTrip={handleDeleteTrip}
      />

      {currentItinerary && (
        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          itinerary={currentItinerary}
        />
      )}

      {currentItinerary && (
        <EmailModal
          isOpen={isEmailModalOpen}
          onClose={() => setIsEmailModalOpen(false)}
          itinerary={currentItinerary}
        />
      )}

      {currentItinerary && (
        <TelegramExportModal
          isOpen={isTelegramModalOpen}
          onClose={() => setIsTelegramModalOpen(false)}
          itinerary={currentItinerary}
        />
      )}

      <RegenerateDayModal
        isOpen={!!regenerateDayTarget}
        onClose={() => setRegenerateDayTarget(null)}
        day={regenerateDayTarget}
        destination={currentItinerary?.destinationRegion || ''}
        tripMode={currentItinerary?.transportSummary?.carTips ? 'roadtrip' : 'standard'}
        remoteWork={!!regenerateDayTarget?.workationWindow}
        onRegenerate={handleRegenerateDay}
        isLoading={isRegeneratingDay}
      />

      <TravelpayoutsPartnerModal
        isOpen={isPartnerModalOpen}
        onClose={() => setIsPartnerModalOpen(false)}
        destination={currentItinerary?.destinationRegion || 'Алтай'}
      />
    </div>
  );
}
