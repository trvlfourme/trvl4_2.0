export type TripMode = 'standard' | 'roadtrip' | 'workation';
export type TransportType = 'car' | 'plane' | 'train' | 'mixed';
export type BudgetLevel = 'budget' | 'comfort' | 'premium';
export type TravelersGroup = 'solo' | 'couple' | 'family' | 'friends';

export interface GroupComposition {
  adultsCount: number;
  childrenCount: number;
  childrenAges: number[]; // e.g. [1, 7]
  groupAccommodationType?: 'separate_rooms' | 'shared_villa_house';
}

export interface AiAuditReport {
  status: 'APPROVED' | 'CALIBRATED';
  criticScore: number; // e.g. 96
  auditorModel?: string; // e.g. 'DeepSeek-V3 (API)' or 'Gemini-3.8-Flash Auditor'
  verificationStages?: string[];
  safetyAndKidsNotes?: string[];
  drivingRealityNotes?: string[];
  budgetAccuracyNotes?: string[];
  passedChecks: string[];
}

export interface TripRequest {
  origin: string;
  destination: string;
  daysCount: number;
  startDate?: string;
  endDate?: string;
  tripMode: TripMode;
  budgetLevel: BudgetLevel;
  transportType: TransportType;
  travelersCount: number;
  travelersGroup: TravelersGroup;
  groupComposition?: GroupComposition;
  tripPurpose: string;
  remoteWork: boolean;
  remoteWorkDetails?: {
    workHoursPerDay: number;
    needCoworking: boolean;
    internetPriority: 'vital' | 'moderate' | 'casual';
  };
  customNotes?: string;
}

export interface WorkationWindow {
  recommendedHours: string;
  suggestedWorkplace: string;
  wifiRating: string;
  tips: string;
}

export interface RoadtripSegment {
  route: string;
  distanceKm: number;
  drivingTimeHours: number;
  roadCondition: string;
  gasStationsAndStops: string[];
  scenicViewpoints: string[];
  tollRoads: string;
}

export interface ActivitySlot {
  time?: string;
  activity: string;
  location?: string;
  tip?: string;
}

export interface DayPlan {
  dayNumber: number;
  title: string;
  location: string;
  theme: string;
  workationWindow?: WorkationWindow;
  roadtripSegment?: RoadtripSegment;
  morning: ActivitySlot;
  afternoon: ActivitySlot;
  evening: ActivitySlot;
  meals: {
    breakfast?: string;
    lunch?: string;
    dinner?: string;
    localCuisineMustTry?: string;
  };
  accommodationRecommendation: {
    name: string;
    type: string;
    priceEstimate: string;
    bookingHint: string;
  };
  dayBudgetEstimateRub: number;
  notes?: string;
}

export interface StayRecommendation {
  name: string;
  cityOrArea: string;
  type: 'hotel' | 'apartment' | 'glamping' | 'guesthouse' | string;
  pricePerNightRub: string;
  whyGood: string;
  workFriendly: boolean;
}

export interface TransportSummary {
  recommendedPrimary: string;
  details: string;
  carTips?: {
    roadTolls: string;
    speedTrapsAndPolice: string;
    gasAndCharging: string;
    emergencyContacts: string;
    carRentalHint?: string;
  };
  alternativeOptions: string[];
}

export interface BudgetBreakdown {
  totalEstimatedRub: number;
  currency: string;
  categories: {
    transport: number;
    accommodation: number;
    food: number;
    activitiesAndTickets: number;
    emergencyReserve: number;
  };
  moneySavingTips: string[];
}

export interface PracticalTips {
  roadsAndDriving?: string[];
  remoteWorkAndInternet?: string[];
  packingList: string[];
  safetyAndLocalEtiquette: string[];
  connectivityAndSim: string;
}

export interface Itinerary {
  id: string;
  title: string;
  subtitle: string;
  overview: string;
  destinationRegion: string;
  totalDays: number;
  bestSeason: string;
  highlights: string[];
  days: DayPlan[];
  transportSummary: TransportSummary;
  stayRecommendations: StayRecommendation[];
  budgetBreakdown: BudgetBreakdown;
  practicalTips: PracticalTips;
  createdAt: string;
  isCustomized?: boolean;
  aiModelUsed?: string;
  warning?: string;
  aiAudit?: AiAuditReport;
  groupComposition?: GroupComposition;
  liveWeather?: {
    temperature?: number;
    condition?: string;
    text?: string;
    source?: string;
  };
  verificationLayers?: string[];
}
