export interface TripRequest {
  destination: string;
  duration: number;
  budget: 'budget' | 'mid' | 'luxury';
  interests: string[];
  travelStyle: 'solo' | 'couple' | 'family' | 'group';
  startDate?: string;
}

export interface Activity {
  name: string;
  description: string;
  duration: string;
  location: string;
  coordinates?: { lat: number; lng: number };
  type: 'attraction' | 'food' | 'transport' | 'accommodation' | 'activity';
  estimatedCostUSD: number;
  ragSource: string | null;
}

export interface DayPlan {
  day: number;
  title: string;
  theme: string;
  morning: Activity[];
  afternoon: Activity[];
  evening: Activity[];
  dailyCostUSD: number;
  weatherNote: string | null;
}

export interface Itinerary {
  tripId: string;
  destination: string;
  duration: number;
  days: DayPlan[];
  totalEstimatedCostUSD: number;
  travelTips: string[];
  bestTimeToVisit: string;
  generatedAt: string;
  meta: {
    modelVersion: string;
    promptVersion: string;
    ragChunksUsed: number;
    weatherDataUsed: boolean;
    fromCache: boolean;
    generationMs: number;
  };
}

export type GenerationStatus =
  | 'idle'
  | 'connecting'
  | 'enriching'
  | 'streaming'
  | 'parsing'
  | 'done'
  | 'error';

export interface SSEMeta {
  tripId: string;
  ragChunksUsed: number;
  weatherDataUsed: boolean;
  promptVersion: string;
}
