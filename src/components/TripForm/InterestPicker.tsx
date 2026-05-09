const INTERESTS = ['history', 'food', 'nature', 'shopping', 'art', 'nightlife', 'adventure', 'wellness'];

interface InterestPickerProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export function InterestPicker({ value, onChange }: InterestPickerProps) {
  const toggle = (interest: string) => {
    onChange(value.includes(interest) ? value.filter((item) => item !== interest) : [...value, interest]);
  };

  return (
    <div className="interest-grid" aria-label="Interests">
      {INTERESTS.map((interest) => (
        <button
          className={value.includes(interest) ? 'chip is-selected' : 'chip'}
          key={interest}
          onClick={() => toggle(interest)}
          type="button"
        >
          {interest}
        </button>
      ))}
    </div>
  );
}
