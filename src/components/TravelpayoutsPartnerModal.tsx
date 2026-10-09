import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Settings, Check, HelpCircle, Layers, Copy, Code, CheckCircle2, Info } from 'lucide-react';
import { getStoredMarker, saveMarker, getAffiliateOffers } from '../utils/travelpayouts';

interface TravelpayoutsPartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  destination?: string;
}

export const TravelpayoutsPartnerModal: React.FC<TravelpayoutsPartnerModalProps> = ({
  isOpen,
  onClose,
  destination = 'Алтай',
}) => {
  const [marker, setMarker] = useState(getStoredMarker());
  const [customWidgetCode, setCustomWidgetCode] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [activeStepTab, setActiveStepTab] = useState<'instructions' | 'marker' | 'widgetCode'>('instructions');

  useEffect(() => {
    const savedCode = localStorage.getItem('trvl4me_custom_widget_code') || '';
    setCustomWidgetCode(savedCode);
  }, []);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveMarker(marker);
    localStorage.setItem('trvl4me_custom_widget_code', customWidgetCode.trim());
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const previewOffers = getAffiliateOffers(destination, 'Москва');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-200">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Интеграция Travelpayouts (TPO)
              </h3>
              <p className="text-xs text-slate-500">
                Подключение партнёрского аккаунта, ссылок и JS-виджетов
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

        {/* Tab switcher */}
        <div className="flex gap-2 pt-3 pb-2 border-b border-slate-100 text-xs font-semibold">
          <button
            onClick={() => setActiveStepTab('instructions')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeStepTab === 'instructions'
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            1. Инструкция: что взять из TPO
          </button>
          <button
            onClick={() => setActiveStepTab('marker')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeStepTab === 'marker'
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            2. Партнёрский Marker ID
          </button>
          <button
            onClick={() => setActiveStepTab('widgetCode')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeStepTab === 'widgetCode'
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            3. JS-код виджетов
          </button>
        </div>

        <div className="overflow-y-auto flex-1 py-4 space-y-5">
          {/* Instructions tab */}
          {activeStepTab === 'instructions' && (
            <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
              <div className="p-4 bg-indigo-50/70 border border-indigo-200/80 rounded-2xl">
                <h4 className="font-bold text-indigo-950 text-sm mb-1">
                  Что конкретно нужно сделать в кабинете Travelpayouts:
                </h4>
                <p className="text-indigo-800 mb-3 text-[11px]">
                  Монетизация в trvl4.me строится на двух уровнях: <strong>умные глубокие ссылки (Deep Links)</strong> и <strong>интерактивные JS-виджеты</strong>.
                </p>

                <ol className="list-decimal list-inside space-y-2 text-indigo-900 font-medium">
                  <li>
                    <strong>Узнать свой Marker ID:</strong> В кабинете <a href="https://travelpayouts.com" target="_blank" rel="noreferrer" className="underline font-bold">travelpayouts.com</a> в верхнем правом углу отображается ваш 5–6 значный номер (например: <code>548920</code>). Введите его во вкладке «2. Партнёрский Marker ID» — и <strong>все</strong> ссылки в приложении мгновенно станут вашими!
                  </li>
                  <li>
                    <strong>Подключить программы в каталоге:</strong>
                    <ul className="list-disc list-inside ml-4 mt-1 text-[11px] text-indigo-800 font-normal space-y-0.5">
                      <li><strong>Aviasales</strong> — поиск авиабилетов по всему миру</li>
                      <li><strong>Яндекс.Путешествия / Ostrovok</strong> — отели по РФ и миру</li>
                      <li><strong>Localrent</strong> — автопрокат в РФ, Грузии, Турции, Черногории</li>
                      <li><strong>Tripster</strong> — авторские экскурсии</li>
                      <li><strong>Cherehapa</strong> — страхование путешественников</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Получить код виджета (опционально):</strong> В любой программе перейдите в <em>«Инструменты» ➔ «Виджеты»</em>, настройте внешний вид и скопируйте HTML/JS-код во вкладку «3. JS-код виджетов».
                  </li>
                </ol>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 flex items-start gap-2">
                <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Преимущество Deep Links:</strong> Пользователю не обязательно показывать тяжелый iframe — когда он нажимает «Билеты в ${destination}» или «Отели в ${destination}», он сразу попадает на выдачу с вашим маркером, где уже подставлены город и даты.
                </span>
              </div>
            </div>
          )}

          {/* Marker setting tab */}
          {activeStepTab === 'marker' && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1.5">
                  <Settings className="w-3.5 h-3.5 text-slate-500" />
                  Укажите ваш Marker ID
                </h4>
                <p className="text-xs text-slate-500 mb-3">
                  Этот маркер будет автоматически подставляться во все партнёрские ссылки (`?marker=...`).
                </p>
                <form onSubmit={handleSave} className="flex gap-2">
                  <input
                    type="text"
                    value={marker}
                    onChange={(e) => setMarker(e.target.value)}
                    placeholder="Например: 548920"
                    className="flex-1 px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-300 text-slate-800 font-mono"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    {isSaved ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Сохранено</span>
                      </>
                    ) : (
                      <span>Сохранить маркер</span>
                    )}
                  </button>
                </form>
              </div>

              <div>
                <h5 className="text-xs font-bold text-slate-700 mb-2">
                  Пример сгенерированных ссылок для направления {destination}:
                </h5>
                <div className="space-y-1.5">
                  {previewOffers.slice(0, 3).map((offer) => (
                    <div key={offer.id} className="p-2.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <strong className="text-slate-900">{offer.partnerName}</strong>
                        <span className="text-slate-400 font-mono text-[10px] ml-2 block truncate max-w-xs">{offer.linkUrl}</span>
                      </div>
                      <a href={offer.linkUrl} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline shrink-0 text-[11px] font-semibold">
                        Проверить
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Widget code tab */}
          {activeStepTab === 'widgetCode' && (
            <div className="space-y-3">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5 text-slate-500" />
                  Поле для вставки JS-виджета Travelpayouts
                </h4>
                <p className="text-xs text-slate-500 mb-3">
                  Вставьте сюда готовый HTML/JS код виджета из Travelpayouts (например, скрипт поисковой строки Aviasales или карты отелей).
                </p>
                <form onSubmit={handleSave} className="space-y-3">
                  <textarea
                    rows={4}
                    value={customWidgetCode}
                    onChange={(e) => setCustomWidgetCode(e.target.value)}
                    placeholder={`<!-- Пример: <script charset="utf-8" src="//tp.media/content?promo_id=...&shmarker=${marker}..."></script> -->`}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-300 text-slate-800 font-mono"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      {isSaved ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Код сохранён</span>
                        </>
                      ) : (
                        <span>Сохранить код виджета</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {customWidgetCode && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800">
                  Виджет активен и подключен в интерфейсе бронирования.
                </div>
              )}
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
          <a
            href="https://travelpayouts.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-indigo-600 hover:underline flex items-center gap-1 font-semibold"
          >
            <span>Войти в Travelpayouts</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl transition-colors"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};
