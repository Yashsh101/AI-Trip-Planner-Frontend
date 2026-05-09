import type { DayPlan } from '../../types';
import { ActivityItem } from './ActivityItem';

interface DayCardProps {
  day: DayPlan;
  isSelected: boolean;
  onSelect: () => void;
}

const PERIODS: Array<keyof Pick<DayPlan, 'morning' | 'afternoon' | 'evening'>> = ['morning', 'afternoon', 'evening'];

export function DayCard({ day, isSelected, onSelect }: DayCardProps) {
  return (
    <button className={isSelected ? 'day-card is-selected' : 'day-card'} onClick={onSelect} type="button">
      <span className="day-card__eyebrow">Day {day.day}</span>
      <h3>{day.title}</h3>
      <p>{day.theme}</p>
      {day.weatherNote ? <span className="day-card__weather">{day.weatherNote}</span> : null}
      <div className="day-card__sections">
        {PERIODS.map((period) => (
          <section key={period}>
            <h4>{period}</h4>
            <div className="activity-stack">
              {day[period].map((activity) => (
                <ActivityItem activity={activity} key={`${period}-${activity.name}-${activity.location}`} />
              ))}
            </div>
          </section>
        ))}
      </div>
      <span className="day-card__cost">${day.dailyCostUSD.toLocaleString()} day estimate</span>
    </button>
  );
}
