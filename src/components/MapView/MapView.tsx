import { APIProvider, InfoWindow, Map, Marker } from '@vis.gl/react-google-maps';
import { useMemo, useState } from 'react';
import { DEFAULT_MAP_CENTER, GOOGLE_MAPS_API_KEY } from '../../lib/maps';
import type { Activity, DayPlan } from '../../types';

interface MapViewProps {
  destination: string;
  selectedDay: DayPlan | null;
}

function activitiesForDay(day: DayPlan | null): Activity[] {
  if (!day) return [];
  return [...day.morning, ...day.afternoon, ...day.evening];
}

export function MapView({ destination, selectedDay }: MapViewProps) {
  const [active, setActive] = useState<Activity | null>(null);
  const activities = useMemo(() => activitiesForDay(selectedDay), [selectedDay]);
  const mappedActivities = activities.filter((activity) => activity.coordinates);
  const center = mappedActivities[0]?.coordinates ?? DEFAULT_MAP_CENTER;

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div className="map-fallback">
        <span className="section-label">Map</span>
        <h3>{destination}</h3>
        <p>Add VITE_GOOGLE_MAPS_API_KEY to render live pins for this day.</p>
        <div className="map-fallback__list">
          {activities.map((activity) => (
            <span key={`${activity.name}-${activity.location}`}>{activity.location}</span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
      <div className="map-shell">
        <Map center={center} defaultZoom={12} gestureHandling="greedy" mapId="trip-planner-map" reuseMaps>
          {mappedActivities.map((activity) => (
            <Marker
              key={`${activity.name}-${activity.location}`}
              onClick={() => setActive(activity)}
              position={activity.coordinates}
              title={activity.name}
            />
          ))}
          {active?.coordinates ? (
            <InfoWindow onCloseClick={() => setActive(null)} position={active.coordinates}>
              <div className="info-window">
                <strong>{active.name}</strong>
                <span>{active.type}</span>
              </div>
            </InfoWindow>
          ) : null}
        </Map>
      </div>
    </APIProvider>
  );
}
