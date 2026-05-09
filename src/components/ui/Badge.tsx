import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  tone?: 'default' | 'accent' | 'muted' | 'success';
}

export function Badge({ children, tone = 'default' }: BadgeProps) {
  return <span className={`badge badge--${tone}`}>{children}</span>;
}
