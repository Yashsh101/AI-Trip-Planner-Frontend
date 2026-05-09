import { useEffect, useState } from 'react';
import type { GenerationStatus, Itinerary } from '../../types';
import { MapView } from '../MapView';
import { StatusBar } from '../StatusBar/StatusBar';
import { ErrorMessage } from '../ui/ErrorMessage';
import { DayCard } from './DayCard';
import { StreamingText } from './StreamingText';
import { TripSummary } from './TripSummary';

interface ItineraryViewProps {
  status: GenerationStatus;
  tokens: string;
  itinerary: Itinerary | null;
  error?: string | null;
}

export function ItineraryView({ status, tokens, itinerary, error }: ItineraryViewProps) {
  const [selectedDay, setSelectedDay] = useState(0);

  useEffect(() => {
    setSelectedDay(0);
  }, [itinerary?.tripId]);

  if (status === 'idle') return null;

  if (status === 'error') {
    return <ErrorMessage message={error ?? 'Something went wrong while generating this itinerary.'} />;
  }

  if (status !== 'done' || !itinerary) {
    return (
      <section className="generation-panel">
        <StatusBar status={status} tokenCount={tokens.length} />
        {(status === 'streaming' || tokens) ? <StreamingText tokens={tokens} /> : null}
      </section>
    );
  }

  const activeDay = itinerary.days[selectedDay] ?? itinerary.days[0] ?? null;

  return (
    <section className="itinerary-view">
      <div className="itinerary-view__intro">
        <span className="section-label">Generated itinerary</span>
        <h2>{itinerary.destination}</h2>
        <p>Powered by RAG · {itinerary.meta.ragChunksUsed} knowledge chunks · Gemini 1.5 Flash</p>
      </div>
      <div className="itinerary-layout">
        <div className="day-list">
          {itinerary.days.map((day, index) => (
            <DayCard
              day={day}
              isSelected={selectedDay === index}
              key={day.day}
              onSelect={() => setSelectedDay(index)}
            />
          ))}
        </div>
        <div className="itinerary-sidebar">
          <MapView destination={itinerary.destination} selectedDay={activeDay} />
          <TripSummary itinerary={itinerary} />
        </div>
      </div>
    </section>
  );
}
