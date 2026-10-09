/**
 * Travelpayouts affiliate integration utilities
 * Provides real deep links and widget placeholders for:
 * - Aviasales (flights)
 * - Ostrovok / Yandex Travel / Sutochno (hotels & apartments)
 * - Localrent (car rental in Russia / CIS)
 * - Cherehapa (travel insurance)
 * - Tripster (excursions and private tours)
 */

export interface TravelpayoutsSettings {
  marker: string;
  enableWidgets: boolean;
}

// User's official Travelpayouts partner marker ID
const DEFAULT_MARKER = (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_PARTNER_MARKER) || '726345';

export function getStoredMarker(): string {
  try {
    return localStorage.getItem('trvl4me_marker') || DEFAULT_MARKER;
  } catch {
    return DEFAULT_MARKER;
  }
}

export function saveMarker(marker: string) {
  try {
    localStorage.setItem('trvl4me_marker', marker.trim() || DEFAULT_MARKER);
  } catch (e) {
    console.error(e);
  }
}

// User's verified tpo.li short partner links from production bot
export const OFFICIAL_TPO_LINKS = {
  aviasales: "https://aviasales.tpo.li/gpok1RpX",
  ostrovok: "https://ostrovok.tpo.li/wprAzBjW",
  yandex: "https://yandex.tpo.li/uz2RUF0N",
  tripster: "https://tripster.tpo.li/4d8YW7ZG",
  sputnik8: "https://sputnik8.tpo.li/SXuUKdXk",
  travelata: "https://travelata.tpo.li/vYS8mpuL",
  level: "https://level.tpo.li/QFJg4gel",
  localrent: "https://localrent.tpo.li/I2hfvrX7",
  intui: "https://intui.tpo.li/rZeNIRdm",
  yesim: "https://yesim.tpo.li/oSJHQLjN",
  airalo: "https://airalo.tpo.li/6yqyjo3L",
  sravni: "https://sravni.tpo.li/e7pQ3KxJ",
  cherehapa: "https://cherehapa.tpo.li/4mN2rVXk",
};

export interface AffiliateOffer {
  id: string;
  category: 'flights' | 'hotels' | 'cars' | 'insurance' | 'tours' | 'trains' | 'esim';
  partnerName: string;
  badge: string;
  title: string;
  description: string;
  ctaText: string;
  linkUrl: string;
  discountOrPerk?: string;
}

export function getAffiliateOffers(destination: string, origin: string = 'Москва'): AffiliateOffer[] {
  const marker = getStoredMarker();
  const cleanDest = encodeURIComponent(destination.replace(/[\(].*?[\)]/g, '').trim());
  const cleanOrigin = encodeURIComponent(origin.trim());

  return [
    {
      id: 'aviasales-flight',
      category: 'flights',
      partnerName: 'Aviasales',
      badge: 'Авиабилеты',
      title: `Билеты ${origin} ➔ ${destination}`,
      description: 'Поиск лучших цен по всем авиакомпаниям без наценок с точным календарем низких цен.',
      ctaText: 'Сравнить цены на Aviasales',
      // Uses direct verified partner link or dynamic search with marker 726345
      linkUrl: OFFICIAL_TPO_LINKS.aviasales || `https://www.aviasales.ru/search?origin=${cleanOrigin}&destination=${cleanDest}&marker=${marker}`,
      discountOrPerk: 'Умный календарь цен'
    },
    {
      id: 'yandex-travel-hotels',
      category: 'hotels',
      partnerName: 'Яндекс Путешествия',
      badge: 'Отели и глэмпинги',
      title: `Жильё в ${destination}`,
      description: 'Отели, базы отдыха, уютные апартаменты и глэмпинги с кешбэком баллами Плюса.',
      ctaText: 'Выбрать отель на Яндекс Путешествиях',
      linkUrl: OFFICIAL_TPO_LINKS.yandex || `https://travel.yandex.ru/hotels/?destination=${cleanDest}&marker=${marker}`,
      discountOrPerk: 'Кешбэк до 15%'
    },
    {
      id: 'ostrovok-hotels',
      category: 'hotels',
      partnerName: 'Ostrovok',
      badge: 'Отели по РФ и миру',
      title: `Бронирование отелей в ${destination}`,
      description: 'Более 2.5 млн вариантов размещения без комиссии с возможностью оплаты российскими картами.',
      ctaText: 'Забронировать на Ostrovok',
      linkUrl: OFFICIAL_TPO_LINKS.ostrovok || `https://ostrovok.ru/?marker=${marker}`,
      discountOrPerk: 'Мгновенное подтверждение'
    },
    {
      id: 'localrent-cars',
      category: 'cars',
      partnerName: 'Localrent',
      badge: 'Аренда авто',
      title: `Прокат автомобилей в ${destination}`,
      description: 'Надёжные авто от локальных прокатов по честным ценам, низкие депозиты, каско и выдача в аэропорту.',
      ctaText: 'Забронировать авто на Localrent',
      linkUrl: OFFICIAL_TPO_LINKS.localrent || `https://localrent.com/?r=${marker}&city=${cleanDest}`,
      discountOrPerk: 'Депозит от 0 ₽'
    },
    {
      id: 'tripster-tours',
      category: 'tours',
      partnerName: 'Трипстер',
      badge: 'Экскурсии и гиды',
      title: `Авторские экскурсии по направлению ${destination}`,
      description: 'Индивидуальные и мини-групповые маршруты с местными жителями, историками и фотографами.',
      ctaText: 'Выбрать экскурсию на Tripster',
      linkUrl: OFFICIAL_TPO_LINKS.tripster || `https://experience.tripster.ru/experience/${cleanDest}/?marker=${marker}`,
      discountOrPerk: 'Отзывы реальных туристов'
    },
    {
      id: 'sputnik8-tours',
      category: 'tours',
      partnerName: 'Sputnik8',
      badge: 'Городские туры',
      title: `Билеты в музеи и туры по ${destination}`,
      description: 'Билеты без очередей, обзорные туры, речные прогулки и загородные поездки.',
      ctaText: 'Смотреть экскурсии на Sputnik8',
      linkUrl: OFFICIAL_TPO_LINKS.sputnik8 || `https://www.sputnik8.com/?marker=${marker}`,
      discountOrPerk: 'Электронный ваучер'
    },
    {
      id: 'cherehapa-insurance',
      category: 'insurance',
      partnerName: 'Cherehapa',
      badge: 'Страховка',
      title: 'Туристическая страховка и полис для авто',
      description: 'Сравнение условий 16 ведущих страховых компаний: защита от клещей, активный спорт и помощь в пути.',
      ctaText: 'Оформить страховку на Cherehapa',
      linkUrl: OFFICIAL_TPO_LINKS.cherehapa || `https://cherehapa.ru/?marker=${marker}`,
      discountOrPerk: 'Полис на почту за 3 мин'
    },
    {
      id: 'sravni-insurance',
      category: 'insurance',
      partnerName: 'Сравни.ру',
      badge: 'Страхование',
      title: 'Сравнение туристических полисов',
      description: 'Выбор лучшей цены среди топовых страховых компаний России с гарантией выплат.',
      ctaText: 'Сравнить цены на Сравни.ру',
      linkUrl: OFFICIAL_TPO_LINKS.sravni || `https://sravni.ru/?marker=${marker}`,
      discountOrPerk: 'Скидки до 20%'
    },
    {
      id: 'airalo-esim',
      category: 'esim',
      partnerName: 'Airalo',
      badge: 'eSIM интернет',
      title: 'Интернет без роуминга в 200+ странах',
      description: 'Мгновенное подключение eSIM в поездке без очередей за физической пластиковой симкой.',
      ctaText: 'Подключить eSIM на Airalo',
      linkUrl: OFFICIAL_TPO_LINKS.airalo || `https://airalo.tp.st/?marker=${marker}`,
      discountOrPerk: 'Мгновенная активация'
    },
    {
      id: 'travelata-packages',
      category: 'tours',
      partnerName: 'Travelata',
      badge: 'Пакетные туры',
      title: `Готовые туры в ${destination}`,
      description: 'Поиск готовых туров от 120 ведущих туроператоров, когда выгоднее лететь чартером.',
      ctaText: 'Подобрать тур на Travelata',
      linkUrl: OFFICIAL_TPO_LINKS.travelata || `https://travelata.ru/?marker=${marker}`,
      discountOrPerk: 'Сравнение 120 туроператоров'
    }
  ];
}
