import { useQuery } from '@tanstack/react-query';
import { fetchTrip } from '../lib/api';

export function useSavedTrip(tripId: string | undefined) {
  return useQuery({
    queryKey: ['trip', tripId],
    queryFn: () => fetchTrip(tripId ?? ''),
    enabled: Boolean(tripId),
    staleTime: 1000 * 60 * 5,
  });
}
