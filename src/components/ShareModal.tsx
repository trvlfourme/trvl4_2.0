import React, { useState } from 'react';
import { X, Copy, Check, Share2, Send, QrCode, Smartphone } from 'lucide-react';
import { Itinerary } from '../types/trip';
import { encodeItineraryForShare } from '../utils/storage';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  itinerary: Itinerary;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  itinerary,
}) => {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  if (!isOpen) return null;

  // Build share URL
  const encoded = encodeItineraryForShare(itinerary);
  const shareUrl = `${window.location.origin}${window.location.pathname}#trip=${encoded}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  const handleTelegramShare = () => {
    const text = encodeURIComponent(`Маршрут "${itinerary.title}" на ${itinerary.totalDays} дней в trvl4.me:`);
    const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${text}`;
    window.open(tgUrl, '_blank', 'noopener,noreferrer');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: itinerary.title,
          text: itinerary.overview,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      handleCopy();
    }
  };

  // Generate lightweight SVG QR representation using Google Charts API or inline SVG fallback
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareUrl)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-200">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Поделиться маршрутом
              </h3>
              <p className="text-xs text-slate-500">
                Ссылка содержит полный готовый план поездки
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

        {/* Copy link input */}
        <div className="mb-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
            Прямая ссылка
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-600 font-mono focus:outline-hidden"
            />
            <button
              onClick={handleCopy}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Скопировано!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Копировать</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Social actions */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <button
            onClick={handleTelegramShare}
            className="py-2.5 px-3 rounded-xl border border-sky-200 bg-sky-50/80 hover:bg-sky-100/90 text-sky-800 font-medium text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <Send className="w-4 h-4 text-sky-600" />
            <span>В Telegram</span>
          </button>

          <button
            onClick={() => setShowQr(!showQr)}
            className="py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <QrCode className="w-4 h-4 text-slate-600" />
            <span>{showQr ? 'Скрыть QR' : 'QR для телефона'}</span>
          </button>
        </div>

        {/* QR Code view */}
        {showQr && (
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-center mb-4 animate-in fade-in">
            <img 
              src={qrImageUrl} 
              alt="QR Code" 
              className="w-40 h-40 mx-auto rounded-lg shadow-xs bg-white p-2 border border-slate-200" 
            />
            <p className="text-[11px] text-slate-500 mt-2 flex items-center justify-center gap-1">
              <Smartphone className="w-3 h-3 text-slate-400" />
              Наведите камеру смартфона, чтобы открыть маршрут
            </p>
          </div>
        )}

        {/* Web Share API fallback */}
        {typeof navigator !== 'undefined' && 'share' in navigator && (
          <button
            onClick={handleNativeShare}
            className="w-full py-2.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors"
          >
            Поделиться через меню устройства
          </button>
        )}
      </div>
    </div>
  );
};
