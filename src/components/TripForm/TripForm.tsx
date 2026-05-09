import { useState } from 'react';
import type { FormEvent } from 'react';
import type { GenerationStatus, TripRequest } from '../../types';
import { Button } from '../ui/Button';
import { Spinner } from '../ui/Spinner';
import { BudgetSelector } from './BudgetSelector';
import { InterestPicker } from './InterestPicker';

const TRAVEL_STYLES: TripRequest['travelStyle'][] = ['solo', 'couple', 'family', 'group'];

interface TripFormProps {
  status: GenerationStatus;
  onSubmit: (request: TripRequest) => void;
}

export function TripForm({ status, onSubmit }: TripFormProps) {
  const [destination, setDestination] = useState('');
  const [duration, setDuration] = useState(5);
  const [budget, setBudget] = useState<TripRequest['budget']>('mid');
  const [interests, setInterests] = useState<string[]>(['food', 'history']);
  const [travelStyle, setTravelStyle] = useState<TripRequest['travelStyle']>('couple');
  const [startDate, setStartDate] = useState('');
  const [errors, setErrors] = useState<{ destination?: string; interests?: string }>({});

  const isGenerating = status !== 'idle' && status !== 'done' && status !== 'error';
  const isDisabled = status === 'connecting' || status === 'enriching' || status === 'streaming';

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = {
      destination: destination.trim() ? undefined : 'Destination is required.',
      interests: interests.length > 0 ? undefined : 'Choose at least one interest.',
    };

    setErrors(nextErrors);
    if (nextErrors.destination || nextErrors.interests) return;

    onSubmit({
      destination: destination.trim(),
      duration,
      budget,
      interests,
      travelStyle,
      startDate: startDate || undefined,
    });
  };

  return (
    <form className="trip-form" onSubmit={handleSubmit}>
      <div className="field field--wide">
        <label htmlFor="destination">
          <span aria-hidden="true">PIN</span>
          Destination
        </label>
        <input
          aria-invalid={Boolean(errors.destination)}
          id="destination"
          onChange={(event) => setDestination(event.target.value)}
          placeholder="Tokyo, Japan"
          type="text"
          value={destination}
        />
        {errors.destination ? <p className="field-error">{errors.destination}</p> : null}
      </div>

      <div className="field">
        <label htmlFor="duration">
          <span aria-hidden="true">CAL</span>
          Duration
        </label>
        <div className="range-row">
          <input
            id="duration"
            max={14}
            min={1}
            onChange={(event) => setDuration(Number(event.target.value))}
            type="range"
            value={duration}
          />
          <strong>{duration} days</strong>
        </div>
      </div>

      <div className="field">
        <label>Budget</label>
        <BudgetSelector onChange={setBudget} value={budget} />
      </div>

      <div className="field">
        <label>
          <span aria-hidden="true">PPL</span>
          Travel style
        </label>
        <div className="segmented-control" role="radiogroup" aria-label="Travel style">
          {TRAVEL_STYLES.map((style) => (
            <button
              aria-checked={travelStyle === style}
              className={travelStyle === style ? 'is-active' : ''}
              key={style}
              onClick={() => setTravelStyle(style)}
              role="radio"
              type="button"
            >
              {style}
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <label htmlFor="startDate">Start date</label>
        <input id="startDate" onChange={(event) => setStartDate(event.target.value)} type="date" value={startDate} />
      </div>

      <div className="field field--wide">
        <label>Interests</label>
        <InterestPicker onChange={setInterests} value={interests} />
        {errors.interests ? <p className="field-error">{errors.interests}</p> : null}
      </div>

      <Button className="trip-form__submit" disabled={isDisabled} type="submit">
        {isGenerating ? <Spinner /> : <span aria-hidden="true">GO</span>}
        Plan my trip
      </Button>
    </form>
  );
}
