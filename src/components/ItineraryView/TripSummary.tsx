import { Badge } from '../ui/Badge';
import type { Itinerary } from '../../types';

interface TripSummaryProps {
  itinerary: Itinerary;
}

export function TripSummary({ itinerary }: TripSummaryProps) {
  return (
    <aside className="trip-summary">
      <div>
        <span className="section-label">Trip summary</span>
        <h3>${itinerary.totalEstimatedCostUSD.toLocaleString()}</h3>
        <p>{itinerary.duration} days in {itinerary.destination}</p>
      </div>
      <div className="summary-badges">
        <Badge tone="accent">Gemini 1.5 Flash</Badge>
        <Badge tone="success">RAG · {itinerary.meta.ragChunksUsed} chunks</Badge>
        <Badge tone="muted">{itinerary.meta.weatherDataUsed ? 'Weather used' : 'No weather'}</Badge>
        <Badge tone="muted">{itinerary.meta.generationMs.toLocaleString()} ms</Badge>
      </div>
      <div>
        <h4>Best time</h4>
        <p>{itinerary.bestTimeToVisit}</p>
      </div>
      <div>
        <h4>Travel tips</h4>
        <ul>
          {itinerary.travelTips.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
