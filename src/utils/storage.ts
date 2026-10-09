import { Itinerary } from '../types/trip';

const STORAGE_KEY = 'trvl4me_saved_itineraries';

export function getSavedItineraries(): Itinerary[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch (err) {
    console.error('Failed to load itineraries from localStorage', err);
    return [];
  }
}

export function saveItineraryToStorage(itinerary: Itinerary): boolean {
  try {
    const current = getSavedItineraries();
    const existingIndex = current.findIndex((i) => i.id === itinerary.id);
    if (existingIndex >= 0) {
      current[existingIndex] = itinerary;
    } else {
      current.unshift(itinerary);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    return true;
  } catch (err) {
    console.error('Failed to save itinerary', err);
    return false;
  }
}

export function deleteItineraryFromStorage(id: string): boolean {
  try {
    const current = getSavedItineraries();
    const filtered = current.filter((i) => i.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (err) {
    console.error('Failed to delete itinerary', err);
    return false;
  }
}

// Encode itinerary into compressed base64 string for URL sharing
export function encodeItineraryForShare(itinerary: Itinerary): string {
  try {
    const jsonStr = JSON.stringify(itinerary);
    // encode UTF-8 properly into base64
    const encoded = btoa(encodeURIComponent(jsonStr));
    return encoded;
  } catch (err) {
    console.error('Failed to encode itinerary', err);
    return '';
  }
}

export function decodeItineraryFromShare(encoded: string): Itinerary | null {
  try {
    const jsonStr = decodeURIComponent(atob(encoded));
    return JSON.parse(jsonStr) as Itinerary;
  } catch (err) {
    console.error('Failed to decode itinerary', err);
    return null;
  }
}

// Export as markdown formatted text
export function generateItineraryMarkdown(itinerary: Itinerary): string {
  let md = `# ${itinerary.title}\n\n`;
  md += `> ${itinerary.subtitle}\n\n`;
  md += `**Регион:** ${itinerary.destinationRegion} | **Длительность:** ${itinerary.totalDays} дн. | **Сезон:** ${itinerary.bestSeason}\n\n`;
  md += `## Обзор поездки\n${itinerary.overview}\n\n`;

  md += `### Главные акценты\n`;
  itinerary.highlights.forEach(h => {
    md += `- ${h}\n`;
  });
  md += `\n`;

  md += `## Программа по дням\n\n`;
  itinerary.days.forEach(day => {
    md += `### ${day.title}\n`;
    md += `*Локация:* ${day.location} | *Тема:* ${day.theme}\n\n`;

    if (day.workationWindow) {
      md += `💻 **Воркейшн-окно:** ${day.workationWindow.recommendedHours} (${day.workationWindow.suggestedWorkplace}) - Wi-Fi: ${day.workationWindow.wifiRating}\n\n`;
    }

    if (day.roadtripSegment) {
      md += `🚗 **Авто-маршрут:** ${day.roadtripSegment.route} (${day.roadtripSegment.distanceKm} км, ~${day.roadtripSegment.drivingTimeHours} ч) | Дорога: ${day.roadtripSegment.roadCondition}\n\n`;
    }

    md += `- **Утро:** ${day.morning.activity} _(${day.morning.tip || ''})_\n`;
    md += `- **День:** ${day.afternoon.activity} _(${day.afternoon.tip || ''})_\n`;
    md += `- **Вечер:** ${day.evening.activity} _(${day.evening.tip || ''})_\n`;
    md += `- **Питание:** ${day.meals.lunch || ''} | ${day.meals.dinner || ''}\n`;
    md += `- **Рекомендуемое жилье:** ${day.accommodationRecommendation.name} (${day.accommodationRecommendation.priceEstimate})\n\n`;
  });

  md += `## Бюджет поездки: ~${itinerary.budgetBreakdown.totalEstimatedRub.toLocaleString('ru-RU')} ₽\n`;
  md += `- Жилье: ~${itinerary.budgetBreakdown.categories.accommodation.toLocaleString('ru-RU')} ₽\n`;
  md += `- Транспорт: ~${itinerary.budgetBreakdown.categories.transport.toLocaleString('ru-RU')} ₽\n`;
  md += `- Питание: ~${itinerary.budgetBreakdown.categories.food.toLocaleString('ru-RU')} ₽\n`;
  md += `- Развлечения и экскурсии: ~${itinerary.budgetBreakdown.categories.activitiesAndTickets.toLocaleString('ru-RU')} ₽\n\n`;

  md += `---\n_Маршрут сгенерирован умным планировщиком trvl4.me_\n`;
  return md;
}
