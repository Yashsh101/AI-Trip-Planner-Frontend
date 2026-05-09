import type { GenerationStatus } from '../../types';

const STATUS_MESSAGES: Record<GenerationStatus, string> = {
  idle: '',
  connecting: 'Connecting to AI...',
  enriching: 'Retrieving local knowledge + weather...',
  streaming: 'Generating your itinerary...',
  parsing: 'Assembling day plans...',
  done: '',
  error: '',
};

interface StatusBarProps {
  status: GenerationStatus;
  tokenCount?: number;
}

export function StatusBar({ status, tokenCount = 0 }: StatusBarProps) {
  const message = STATUS_MESSAGES[status];

  if (!message) return null;

  return (
    <div className="status-bar" aria-live="polite">
      <span className="status-bar__pulse" aria-hidden="true" />
      <span>
        {status === 'streaming'
          ? `Generating... (${tokenCount.toLocaleString()} tokens)`
          : message}
      </span>
    </div>
  );
}
