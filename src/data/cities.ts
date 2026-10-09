export interface CitySuggestion {
  name: string;
  country: string;
  region?: string;
  iata?: string;
  popular?: boolean;
}

export const CITIES_DATABASE: CitySuggestion[] = [
  // Россия - ключевые хабы и города отправления
  { name: 'Москва', country: 'Россия', region: 'Центральный ФО', iata: 'MOW', popular: true },
  { name: 'Санкт-Петербург', country: 'Россия', region: 'Северо-Западный ФО', iata: 'LED', popular: true },
  { name: 'Казань', country: 'Россия', region: 'Приволжский ФО', iata: 'KZN', popular: true },
  { name: 'Екатеринбург', country: 'Россия', region: 'Уральский ФО', iata: 'SVX', popular: true },
  { name: 'Новосибирск', country: 'Россия', region: 'Сибирский ФО', iata: 'OVB', popular: true },
  { name: 'Нижний Новгород', country: 'Россия', region: 'Приволжский ФО', iata: 'GOJ', popular: true },
  { name: 'Самара', country: 'Россия', region: 'Приволжский ФО', iata: 'KUF', popular: true },
  { name: 'Уфа', country: 'Россия', region: 'Приволжский ФО', iata: 'UFA', popular: true },
  { name: 'Ростов-на-Дону', country: 'Россия', region: 'Южный ФО', iata: 'ROV', popular: true },
  { name: 'Красноярск', country: 'Россия', region: 'Сибирский ФО', iata: 'KJA', popular: true },
  { name: 'Пермь', country: 'Россия', region: 'Приволжский ФО', iata: 'PEE', popular: true },
  { name: 'Воронеж', country: 'Россия', region: 'Центральный ФО', iata: 'VOZ', popular: true },
  { name: 'Волгоград', country: 'Россия', region: 'Южный ФО', iata: 'VOG', popular: true },
  { name: 'Челябинск', country: 'Россия', region: 'Уральский ФО', iata: 'CEK', popular: true },
  { name: 'Омск', country: 'Россия', region: 'Сибирский ФО', iata: 'OMS', popular: true },
  { name: 'Тюмень', country: 'Россия', region: 'Уральский ФО', iata: 'TJM', popular: true },
  { name: 'Саратов', country: 'Россия', region: 'Приволжский ФО', iata: 'RTW', popular: true },
  { name: 'Иркутск', country: 'Россия', region: 'Сибирь & Байкал', iata: 'IKT', popular: true },
  { name: 'Владивосток', country: 'Россия', region: 'Дальневосточный ФО', iata: 'VVO', popular: true },
  { name: 'Хабаровск', country: 'Россия', region: 'Дальневосточный ФО', iata: 'KHV', popular: true },

  // Россия - популярные туристические направления и автомаршруты
  { name: 'Алтай (Чуйский тракт & Горно-Алтайск)', country: 'Россия', region: 'Республика Алтай', iata: 'RGK', popular: true },
  { name: 'Горно-Алтайск', country: 'Россия', region: 'Алтай', iata: 'RGK', popular: true },
  { name: 'Дагестан (Махачкала & Дербент)', country: 'Россия', region: 'Северный Кавказ', iata: 'MCX', popular: true },
  { name: 'Махачкала', country: 'Россия', region: 'Дагестан', iata: 'MCX', popular: true },
  { name: 'Дербент', country: 'Россия', region: 'Дагестан', popular: true },
  { name: 'Сочи (Адлер & Красная Поляна)', country: 'Россия', region: 'Краснодарский край', iata: 'AER', popular: true },
  { name: 'Красная Поляна', country: 'Россия', region: 'Сочи', iata: 'AER', popular: true },
  { name: 'Минеральные Воды (КМВ, Кисловодск, Пятигорск)', country: 'Россия', region: 'Ставропольский край', iata: 'MRV', popular: true },
  { name: 'Кисловодск', country: 'Россия', region: 'КМВ', popular: true },
  { name: 'Пятигорск', country: 'Россия', region: 'КМВ', popular: true },
  { name: 'Калининград (Куршская коса)', country: 'Россия', region: 'Калининградская обл.', iata: 'KGD', popular: true },
  { name: 'Карелия (Петрозаводск, Ладога & Сортавала)', country: 'Россия', region: 'Карелия', iata: 'PES', popular: true },
  { name: 'Петрозаводск', country: 'Россия', region: 'Карелия', iata: 'PES', popular: true },
  { name: 'Сортавала', country: 'Россия', region: 'Карелия', popular: true },
  { name: 'Золотое кольцо (Ярославль, Суздаль, Владимир)', country: 'Россия', region: 'Трасса М-8', popular: true },
  { name: 'Ярославль', country: 'Россия', region: 'Золотое кольцо', iata: 'IAR', popular: true },
  { name: 'Суздаль', country: 'Россия', region: 'Владимирская обл.', popular: true },
  { name: 'Байкал (Листвянка & Ольхон)', country: 'Россия', region: 'Иркутская обл. / Бурятия', popular: true },
  { name: 'Кольский полуостров (Мурманск & Териберка)', country: 'Россия', region: 'Мурманская обл.', iata: 'MMK', popular: true },
  { name: 'Мурманск', country: 'Россия', region: 'Север', iata: 'MMK', popular: true },
  { name: 'Териберка', country: 'Россия', region: 'Баренцево море', popular: true },
  { name: 'Камчатка (Петропавловск-Камчатский)', country: 'Россия', region: 'Вулканы & Океан', iata: 'PKC', popular: true },
  { name: 'Анапа', country: 'Россия', region: 'Черноморское побережье', iata: 'AAQ', popular: true },
  { name: 'Геленджик', country: 'Россия', region: 'Черноморское побережье', iata: 'GDZ', popular: true },
  { name: 'Владикавказ (Северная Осетия)', country: 'Россия', region: 'Кавказ', iata: 'OGZ', popular: true },
  { name: 'Нальчик (Приэльбрусье)', country: 'Россия', region: 'Кабардино-Балкария', iata: 'NAL', popular: true },

  // Турция (Пилотное популярное направление)
  { name: 'Турция: Анталья (курорты & море)', country: 'Турция', region: 'Средиземное море', iata: 'AYT', popular: true },
  { name: 'Анталья', country: 'Турция', region: 'Анталийское побережье', iata: 'AYT', popular: true },
  { name: 'Турция: Стамбул (Босфор & история)', country: 'Турция', region: 'Мраморное море', iata: 'IST', popular: true },
  { name: 'Стамбул', country: 'Турция', region: 'Босфор', iata: 'IST', popular: true },
  { name: 'Кемер', country: 'Турция', region: 'Анталья', popular: true },
  { name: 'Алания', country: 'Турция', region: 'Анталья', iata: 'GZP', popular: true },
  { name: 'Сиде', country: 'Турция', region: 'Анталья', popular: true },
  { name: 'Бодрум', country: 'Турция', region: 'Эгейское море', iata: 'BJV', popular: true },
  { name: 'Мармарис', country: 'Турция', region: 'Эгейское море', iata: 'DLM', popular: true },
  { name: 'Каппадокия (Гёреме & воздушные шары)', country: 'Турция', region: 'Анатолия', iata: 'NAV', popular: true },

  // Таиланд (Пилотное популярное направление)
  { name: 'Таиланд: Пхукет (пляжи & острова)', country: 'Таиланд', region: 'Андаманское море', iata: 'HKT', popular: true },
  { name: 'Пхукет', country: 'Таиланд', region: 'Остров', iata: 'HKT', popular: true },
  { name: 'Таиланд: Бангкок (храмы, шопинг & еда)', country: 'Таиланд', region: 'Центральный', iata: 'BKK', popular: true },
  { name: 'Бангкок', country: 'Таиланд', region: 'Столица', iata: 'BKK', popular: true },
  { name: 'Паттайя', country: 'Таиланд', region: 'Сиамский залив', iata: 'UTP', popular: true },
  { name: 'Самуи', country: 'Таиланд', region: 'Остров', iata: 'USM', popular: true },
  { name: 'Краби', country: 'Таиланд', region: 'Скалы & пляжи', iata: 'KBV', popular: true },
  { name: 'Чиангмай', country: 'Таиланд', region: 'Север & храмы', iata: 'CNX', popular: true },

  // Китай (Пилотное популярное направление)
  { name: 'Китай: Хайнань / Санья (тропический остров)', country: 'Китай', region: 'Южно-Китайское море', iata: 'SYX', popular: true },
  { name: 'Санья (Хайнань)', country: 'Китай', region: 'Курорт', iata: 'SYX', popular: true },
  { name: 'Китай: Пекин (Великая стена & Запретный город)', country: 'Китай', region: 'Столица', iata: 'PEK', popular: true },
  { name: 'Пекин', country: 'Китай', region: 'Север', iata: 'PEK', popular: true },
  { name: 'Китай: Шанхай (небоскрёбы & набережная Вайтань)', country: 'Китай', region: 'Восточный', iata: 'PVG', popular: true },
  { name: 'Шанхай', country: 'Китай', region: 'Мегаполис', iata: 'PVG', popular: true },
  { name: 'Гуанчжоу', country: 'Китай', region: 'Юг Китая', iata: 'CAN', popular: true },
  { name: 'Гонконг', country: 'Китай', region: 'Специальный район', iata: 'HKG', popular: true },

  // Страны СНГ и ближнее зарубежье
  { name: 'Узбекистан (Ташкент, Самарканд, Бухара)', country: 'Узбекистан', region: 'Шёлковый путь', iata: 'TAS', popular: true },
  { name: 'Самарканд', country: 'Узбекистан', region: 'История', iata: 'SKD', popular: true },
  { name: 'Бухара', country: 'Узбекистан', region: 'История', iata: 'BHK', popular: true },
  { name: 'Ташкент', country: 'Узбекистан', region: 'Столица', iata: 'TAS', popular: true },
  { name: 'Грузия (Тбилиси, Казбеги, Батуми)', country: 'Грузия', region: 'Кавказ', iata: 'TBS', popular: true },
  { name: 'Тбилиси', country: 'Грузия', region: 'Столица', iata: 'TBS', popular: true },
  { name: 'Батуми', country: 'Грузия', region: 'Море', iata: 'BUS', popular: true },
  { name: 'Армения (Ереван & Севан)', country: 'Армения', region: 'Закавказье', iata: 'EVN', popular: true },
  { name: 'Ереван', country: 'Армения', region: 'Столица', iata: 'EVN', popular: true },
  { name: 'Казахстан (Алматы & Астана)', country: 'Казахстан', region: 'Тянь-Шань', iata: 'ALA', popular: true },
  { name: 'Алматы', country: 'Казахстан', region: 'Горы & Медео', iata: 'ALA', popular: true },
  { name: 'Беларусь (Минск & замки)', country: 'Беларусь', region: 'Европа', iata: 'MSQ', popular: true },
  { name: 'Минск', country: 'Беларусь', region: 'Столица', iata: 'MSQ', popular: true },
  { name: 'Баку (Азербайджан)', country: 'Азербайджан', region: 'Каспийское море', iata: 'GYD', popular: true },

  // Популярные зарубежные пляжи и города
  { name: 'ОАЭ: Дубай (небоскрёбы, пляжи & шопинг)', country: 'ОАЭ', region: 'Персидский залив', iata: 'DXB', popular: true },
  { name: 'Дубай', country: 'ОАЭ', region: 'Мегаполис', iata: 'DXB', popular: true },
  { name: 'Абу-Даби', country: 'ОАЭ', region: 'Столица', iata: 'AUH', popular: true },
  { name: 'Египет: Хургада & Шарм-эль-Шейх', country: 'Египет', region: 'Красное море', iata: 'HRG', popular: true },
  { name: 'Шарм-эль-Шейх', country: 'Египет', region: 'Синай', iata: 'SSH', popular: true },
  { name: 'Хургада', country: 'Египет', region: 'Красное море', iata: 'HRG', popular: true },
  { name: 'Индонезия: Бали (серфинг, храмы & природа)', country: 'Индонезия', region: 'Остров', iata: 'DPS', popular: true },
  { name: 'Мальдивы (Мале & атоллы)', country: 'Мальдивы', region: 'Индийский океан', iata: 'MLE', popular: true },
  { name: 'Шри-Ланка (Коломбо & чайные плантации)', country: 'Шри-Ланка', region: 'Цейлон', iata: 'CMB', popular: true },
  { name: 'Филиппины (Боракай, Эль-Нидо, Себу)', country: 'Филиппины', region: 'Острова', iata: 'MNL', popular: true },
];

export const ROADTRIP_ACCESSIBLE_COUNTRIES = [
  'Россия',
  'Беларусь',
  'Казахстан',
  'Грузия',
  'Армения',
  'Узбекистан',
  'Кыргызстан',
  'Азербайджан',
  'Абхазия',
  'Монголия'
];

export function isReachableByCarFromRussia(destinationName: string, country?: string): boolean {
  if (country && ROADTRIP_ACCESSIBLE_COUNTRIES.includes(country)) return true;
  const d = (destinationName || '').toLowerCase();
  return ROADTRIP_ACCESSIBLE_COUNTRIES.some(c => d.includes(c.toLowerCase())) ||
         d.includes('алтай') || d.includes('карели') || d.includes('дагестан') || 
         d.includes('байкал') || d.includes('териберк') || d.includes('кольск') ||
         d.includes('золотое кольцо') || d.includes('сочи') || d.includes('крым') ||
         d.includes('кавказ') || d.includes('казань') || d.includes('питер') ||
         d.includes('санкт-петербург') || d.includes('москва') || d.includes('селигер') || 
         d.includes('урал') || d.includes('кмв') || d.includes('кисловодск') ||
         d.includes('пятигорск') || d.includes('владикавказ') || d.includes('эльбрус');
}

export function searchCities(query: string, maxResults: number = 8, mode?: 'roadtrip' | 'workation' | 'standard'): CitySuggestion[] {
  let baseList = CITIES_DATABASE;
  
  if (mode === 'roadtrip') {
    baseList = baseList.filter(c => isReachableByCarFromRussia(c.name, c.country));
  }

  const q = query.trim().toLowerCase();
  if (!q) {
    return baseList.filter(c => c.popular).slice(0, maxResults);
  }

  // Сначала точное совпадение с начала слова
  const prefixMatches = baseList.filter(c => {
    const cityName = c.name.toLowerCase();
    const countryName = c.country.toLowerCase();
    const regionName = (c.region || '').toLowerCase();
    return cityName.startsWith(q) || countryName.startsWith(q) || regionName.startsWith(q);
  });

  // Затем включение внутри слова
  const substringMatches = baseList.filter(c => {
    const cityName = c.name.toLowerCase();
    const countryName = c.country.toLowerCase();
    const regionName = (c.region || '').toLowerCase();
    return !prefixMatches.includes(c) && (cityName.includes(q) || countryName.includes(q) || regionName.includes(q));
  });

  return [...prefixMatches, ...substringMatches].slice(0, maxResults);
}
