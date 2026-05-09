import type { Activity } from '../../types';

const ICONS = {
  attraction: 'A',
  food: 'F',
  transport: 'T',
  accommodation: 'H',
  activity: 'E',
};

interface ActivityPinProps {
  activity: Activity;
}

export function ActivityPin({ activity }: ActivityPinProps) {
  const icon = ICONS[activity.type] ?? 'E';

  return (
    <div className="activity-pin" title={activity.name}>
      {icon}
    </div>
  );
}
