import React from 'react';
import { Bookmark, X, Trash2, ArrowRight, Calendar, MapPin, DollarSign, Download } from 'lucide-react';
import { Itinerary } from '../types/trip';

interface SavedTripsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedTrips: Itinerary[];
  onSelectTrip: (trip: Itinerary) => void;
  onDeleteTrip: (id: string) => void;
}

export const SavedTripsDrawer: React.FC<SavedTripsDrawerProps> = ({
  isOpen,
  onClose,
  savedTrips,
  onSelectTrip,
  onDeleteTrip,
}) => {
  if (!isOpen) return null;

  const handleExportJson = (trip: Itinerary) => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(trip, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${trip.id || 'itinerary'}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col border-l border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
              <Bookmark className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-base text-slate-900">Мои сохранённые маршруты</h2>
              <p className="text-xs text-slate-500">
                {savedTrips.length} {savedTrips.length === 1 ? 'маршрут' : 'маршрутов'} в памяти браузера
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

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {savedTrips.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <Bookmark className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">Пока нет сохранённых поездок</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Создайте маршрут с помощью ИИ и нажмите «Сохранить», чтобы вернуться к нему в любое время.
              </p>
            </div>
          ) : (
            savedTrips.map((trip) => (
              <div
                key={trip.id}
                className="bg-white border border-slate-200/90 hover:border-emerald-500/80 rounded-2xl p-4 transition-all hover:shadow-md group"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="font-bold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                    {trip.title}
                  </h4>
                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                    <button
                      onClick={() => handleExportJson(trip)}
                      title="Экспорт в JSON"
                      className="p-1 text-slate-400 hover:text-slate-600 rounded"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteTrip(trip.id)}
                      title="Удалить"
                      className="p-1 text-slate-400 hover:text-rose-600 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                  {trip.overview}
                </p>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 font-medium text-slate-700">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {trip.totalDays} дн.
                    </span>
                    <span className="font-medium text-emerald-700">
                      ~{trip.budgetBreakdown.totalEstimatedRub.toLocaleString('ru-RU')} ₽
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      onSelectTrip(trip);
                      onClose();
                    }}
                    className="inline-flex items-center gap-1 font-semibold text-xs text-emerald-600 hover:text-emerald-700 group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>Открыть</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
