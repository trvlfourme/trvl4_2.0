import React, { useState } from 'react';
import { Laptop, ExternalLink, Sparkles, Check, ArrowUpRight, X, ShieldCheck } from 'lucide-react';

interface KabinetDomaCardProps {
  destination?: string;
}

export const KabinetDomaCard: React.FC<KabinetDomaCardProps> = ({ destination }) => {
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);

  return (
    <>
      <div className="bg-gradient-to-br from-slate-900 to-teal-950 text-white rounded-3xl p-5 sm:p-6 shadow-md border border-teal-800/40 relative overflow-hidden my-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-400/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Laptop className="w-3 h-3 text-teal-400" />
                Воркейшн & Эргономика
              </span>
              <span className="text-[11px] text-slate-300 font-medium">
                партнёрский спецпроект с <strong className="text-white">kabinetdoma.ru</strong>
              </span>
            </div>
            <span className="text-[10px] text-teal-400 font-semibold bg-white/5 px-2 py-0.5 rounded">
              Советы экспертов
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-white mb-1.5">
            Как организовать комфортное рабочее место в поездке {destination ? `по направлению ${destination}` : ''}?
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed max-w-2xl mb-4 font-normal">
            Работа в отелях, кафе и глэмпингах часто приводит к болям в шее и быстрой утомляемости. Эксперты по обустройству домашних и мобильных офисов делятся проверенным набором для удалёнщика:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4 text-xs text-slate-200">
            <div className="flex items-start gap-2 bg-white/5 rounded-xl p-2.5 border border-white/5">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 shrink-0" />
              <span><strong>Складная подставка:</strong> поднимает экран ноутбука на уровень глаз, спасая осанку.</span>
            </div>
            <div className="flex items-start gap-2 bg-white/5 rounded-xl p-2.5 border border-white/5">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 shrink-0" />
              <span><strong>ANC-наушники:</strong> блокируют шум кофейни и обеспечивают чёткий голос на созвонах.</span>
            </div>
            <div className="flex items-start gap-2 bg-white/5 rounded-xl p-2.5 border border-white/5">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 shrink-0" />
              <span><strong>Портативный монитор:</strong> удваивает продуктивность при работе с таблицами и кодом.</span>
            </div>
            <div className="flex items-start gap-2 bg-white/5 rounded-xl p-2.5 border border-white/5">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 shrink-0" />
              <span><strong>GaN-зарядка 65W+:</strong> один лёгкий адаптер для ноутбука, планшета и смартфона.</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setIsArticleModalOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-500 px-3.5 py-2 rounded-xl transition-colors shadow-xs"
            >
              <span>Читать гайд: Организация мобильного офиса</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
            <a
              href="https://kabinetdoma.ru"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-teal-300 hover:text-white transition-colors underline-offset-4 hover:underline"
            >
              <span>Перейти на kabinetdoma.ru</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Modal with preview article */}
      {isArticleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div 
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-200">
                  <Laptop className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">
                    kabinetdoma.ru & trvl4.me
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Спецпроект об эргономике работы в дороге
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsArticleModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700 leading-relaxed max-h-[60vh] overflow-y-auto pr-1">
              <h3 className="font-extrabold text-base text-slate-900">
                Чек-лист: Мобильный офис без боли в спине и сорванных дедлайнов
              </h3>
              <p>
                Главная проблема работы на удалёнке во время путешествий — случайные столы и неудобные кресла в номерах отелей или шумных кофейнях.
              </p>
              
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <p className="font-bold text-slate-900">4 золотых правила мобильного офиса:</p>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  <li><strong>Экран на уровне глаз:</strong> используйте компактную алюминиевую подставку (весит всего 250 г) + отдельную компактную Bluetooth-клавиатуру и мышь.</li>
                  <li><strong>Акустический комфорт:</strong> гарнитура с шумоподавлением микрофона отсекает лай собак, шум прибоя и разговоры соседей.</li>
                  <li><strong>Запас энергии:</strong> пауэрбанк 20 000+ мАч с поддержкой Power Delivery (65W) зарядит ноутбук прямо посреди перевала или в поезде.</li>
                  <li><strong>Эргономика тела:</strong> делайте 5-минутную разминку каждый час, совмещая её с осмотром местных достопримечательностей.</li>
                </ul>
              </div>

              <p className="text-slate-500 text-[11px]">
                Полный расширенный обзор с подборками оборудования и мебели для постоянного домашнего офиса читайте на профильном портале kabinetdoma.ru.
              </p>
            </div>

            <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setIsArticleModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Закрыть
              </button>
              <a
                href="https://kabinetdoma.ru"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors"
              >
                <span>Перейти на kabinetdoma.ru</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
