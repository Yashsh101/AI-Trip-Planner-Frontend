import type { Activity } from '../../types';
import { Badge } from '../ui/Badge';

const ICONS = {
  attraction: 'A',
  food: 'F',
  transport: 'T',
  accommodation: 'H',
  activity: 'E',
};

interface ActivityItemProps {
  activity: Activity;
}

export function ActivityItem({ activity }: ActivityItemProps) {
  const icon = ICONS[activity.type] ?? 'E';

  return (
    <article className="activity-item">
      <div className="activity-item__icon">
        {icon}
      </div>
      <div className="activity-item__body">
        <div className="activity-item__title-row">
          <h4>{activity.name}</h4>
          <Badge tone="accent">${activity.estimatedCostUSD.toLocaleString()}</Badge>
        </div>
        <p>{activity.description}</p>
        <div className="activity-item__meta">
          <Badge tone="muted">{activity.duration}</Badge>
          <Badge tone="muted">{activity.location}</Badge>
          {activity.ragSource ? <Badge tone="success">RAG</Badge> : null}
        </div>
      </div>
    </article>
  );
}
