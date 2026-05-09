import { useCallback, useRef, useState } from 'react';
import { API_BASE } from '../lib/api';
import type { GenerationStatus, Itinerary, SSEMeta, TripRequest } from '../types';

interface SSEState {
  status: GenerationStatus;
  meta: SSEMeta | null;
  tokens: string;
  itinerary: Itinerary | null;
  error: string | null;
}

const INITIAL: SSEState = {
  status: 'idle',
  meta: null,
  tokens: '',
  itinerary: null,
  error: null,
};

export function useSSEItinerary() {
  const [state, setState] = useState<SSEState>(INITIAL);
  const abort = useRef<AbortController | null>(null);

  const generate = useCallback(async (request: TripRequest) => {
    abort.current?.abort();
    const ctrl = new AbortController();
    abort.current = ctrl;

    setState({ ...INITIAL, status: 'connecting' });

    try {
      const res = await fetch(`${API_BASE}/api/itinerary/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
        signal: ctrl.signal,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null) as { error?: { message?: string } } | null;
        throw new Error(body?.error?.message ?? `HTTP ${res.status}`);
      }

      const contentType = res.headers.get('content-type') ?? '';
      if (contentType.includes('application/json')) {
        const data = await res.json() as Itinerary;
        setState({
          ...INITIAL,
          status: 'done',
          itinerary: data,
          meta: {
            tripId: data.tripId,
            ragChunksUsed: data.meta.ragChunksUsed,
            weatherDataUsed: data.meta.weatherDataUsed,
            promptVersion: data.meta.promptVersion,
          },
        });
        return;
      }

      if (!res.body) {
        throw new Error('Streaming response did not include a readable body.');
      }

      setState((s) => ({ ...s, status: 'enriching' }));

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let currentEvent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          const trimmed = line.trimEnd();

          if (trimmed.startsWith('event: ')) {
            currentEvent = trimmed.slice(7).trim();
            continue;
          }

          if (!trimmed.startsWith('data: ')) continue;

          const raw = trimmed.slice(6);

          if (currentEvent === 'meta') {
            const meta = JSON.parse(raw) as SSEMeta;
            setState((s) => ({ ...s, status: 'streaming', meta }));
          } else if (currentEvent === 'token') {
            const { text } = JSON.parse(raw) as { text: string };
            setState((s) => ({ ...s, status: 'streaming', tokens: s.tokens + text }));
          } else if (currentEvent === 'done') {
            setState((s) => ({ ...s, status: 'parsing' }));
            const { itinerary } = JSON.parse(raw) as { itinerary: Itinerary };
            setState((s) => ({ ...s, status: 'done', itinerary }));
          } else if (currentEvent === 'error') {
            const { message } = JSON.parse(raw) as { message: string };
            setState((s) => ({ ...s, status: 'error', error: message }));
          }
        }
      }
    } catch (err) {
      if ((err as Error).name === 'AbortError') return;
      setState((s) => ({ ...s, status: 'error', error: err instanceof Error ? err.message : String(err) }));
    }
  }, []);

  const cancel = useCallback(() => {
    abort.current?.abort();
    abort.current = null;
    setState(INITIAL);
  }, []);

  const reset = useCallback(() => {
    abort.current?.abort();
    abort.current = null;
    setState(INITIAL);
  }, []);

  return { ...state, generate, cancel, reset };
}
