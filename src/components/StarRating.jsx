import { useState } from 'react';
import { StarIcon } from './Icons';

const visualSizes = {
  sm: { star: 'h-3 w-3', gap: 'gap-[2px]' },
  md: { star: 'h-4 w-4', gap: 'gap-[3px]' },
  lg: { star: 'h-5 w-5', gap: 'gap-1' },
};

export default function StarRating({
  value = 0,
  onChange,
  readOnly = false,
  size = 'md',
  showValue = false,
  className = '',
}) {
  const [hoverValue, setHoverValue] = useState(0);
  const displayValue = hoverValue || value;
  const scales = visualSizes[size] ?? visualSizes.md;

  if (readOnly) {
    const percentage = Math.max(0, Math.min(100, (Number(value) / 5) * 100));

    return (
      <span
        className={`inline-flex items-center gap-2 ${className}`}
        role="img"
        aria-label={`评分 ${Number(value).toFixed(1)} / 5`}
      >
        <span className={`relative inline-flex ${scales.star}`} aria-hidden="true">
          <span className={`flex ${scales.gap}`}>
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIcon
                key={star}
                filled={false}
                className={`${scales.star} shrink-0 text-low/60`}
              />
            ))}
          </span>
          <span
            className="absolute inset-y-0 left-0 overflow-hidden"
            style={{ width: `${percentage}%` }}
          >
            <span className={`flex w-max ${scales.gap}`}>
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon
                  key={star}
                  filled
                  className={`${scales.star} shrink-0 text-accent`}
                />
              ))}
            </span>
          </span>
        </span>
        {showValue && (
          <span className="text-[11px] font-semibold tracking-wide text-mid">
            {Number(value) > 0 ? Number(value).toFixed(1) : '未评分'}
          </span>
        )}
      </span>
    );
  }

  return (
    <div
      role="group"
      aria-label="给这部电影评分"
      className={`flex flex-wrap items-center gap-1 ${className}`}
      onMouseLeave={() => setHoverValue(0)}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= displayValue;
        return (
          <button
            key={star}
            type="button"
            className="focus-ring rounded-sm p-0.5 text-low transition-colors duration-200 hover:text-accent"
            aria-label={`给 ${star} 星`}
            aria-pressed={Number(value) === star}
            onMouseEnter={() => setHoverValue(star)}
            onFocus={() => setHoverValue(star)}
            onBlur={() => setHoverValue(0)}
            onClick={() => onChange?.(Number(value) === star ? 0 : star)}
          >
            <StarIcon
              filled={filled}
              className={`h-5 w-5 transition-transform duration-200 ${filled ? 'scale-105 text-accent' : 'text-low'}`}
            />
          </button>
        );
      })}
      <span className="ml-2 text-[11px] font-semibold tracking-[.08em] text-low">
        {displayValue > 0 ? `${displayValue} / 5` : '未评分'}
      </span>
    </div>
  );
}
