import { Link, useParams } from 'react-router-dom';
import { ItineraryView } from '../components/ItineraryView';
import { Spinner } from '../components/ui/Spinner';
import { useSavedTrip } from '../hooks/useSavedTrip';

export default function Trip() {
  const { id } = useParams();
  const { data, error, isLoading } = useSavedTrip(id);

  return (
    <main className="app-shell">
      <header className="site-header">
        <Link className="brand" to="/">AI Trip Planner</Link>
        <Link className="button button--secondary" to="/">Generate your own</Link>
      </header>

      <section className="shared-header">
        <span className="section-label">Shared trip</span>
        <h1>{data?.destination ?? 'Loading itinerary'}</h1>
      </section>

      {isLoading ? (
        <div className="loading-panel">
          <Spinner />
          <span>Loading saved trip...</span>
        </div>
      ) : (
        <ItineraryView
          error={error instanceof Error ? error.message : null}
          itinerary={data ?? null}
          status={error ? 'error' : 'done'}
          tokens=""
        />
      )}
    </main>
  );
}
