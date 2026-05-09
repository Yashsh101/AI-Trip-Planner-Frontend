import type { TripRequest } from '../../types';

const BUDGETS: TripRequest['budget'][] = ['budget', 'mid', 'luxury'];

interface BudgetSelectorProps {
  value: TripRequest['budget'];
  onChange: (value: TripRequest['budget']) => void;
}

export function BudgetSelector({ value, onChange }: BudgetSelectorProps) {
  return (
    <div className="segmented-control" role="radiogroup" aria-label="Budget">
      {BUDGETS.map((budget) => (
        <button
          aria-checked={value === budget}
          className={value === budget ? 'is-active' : ''}
          key={budget}
          onClick={() => onChange(budget)}
          role="radio"
          type="button"
        >
          {budget}
        </button>
      ))}
    </div>
  );
}
