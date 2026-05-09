import { useEffect, useRef } from 'react';

interface StreamingTextProps {
  tokens: string;
}

export function StreamingText({ tokens }: StreamingTextProps) {
  const ref = useRef<HTMLPreElement | null>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [tokens]);

  return (
    <pre className="streaming-text" ref={ref}>
      {tokens || '{ "itinerary": '}
    </pre>
  );
}
