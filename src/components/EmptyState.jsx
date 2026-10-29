import { ArrowRightIcon, FilmIcon } from './Icons';

export default function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondary,
  icon: Icon = FilmIcon,
  compact = false,
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center border border-hairline bg-panel/35 px-6 text-center ${
        compact ? 'py-12' : 'py-20'
      }`}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-hairline bg-elevated text-accent">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-5 text-[19px] font-semibold tracking-[-0.012em] text-hi">
        {title}
      </h3>
      <p className="mt-2 max-w-[38ch] text-[14px] leading-[1.6] text-mid">
        {description}
      </p>

      {(actionLabel || secondaryLabel) && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {actionLabel && (
            <button
              type="button"
              onClick={onAction}
              className="focus-ring inline-flex items-center gap-2 bg-accent px-4 py-2.5 text-[11px] font-bold tracking-[.1em] text-accent-ink transition-colors duration-250 hover:bg-[#c18f50] active:scale-[.98]"
            >
              {actionLabel}
              <ArrowRightIcon className="h-3.5 w-3.5" />
            </button>
          )}
          {secondaryLabel && (
            <button
              type="button"
              onClick={onSecondary}
              className="focus-ring border border-hairline px-4 py-2.5 text-[11px] font-semibold tracking-[.1em] text-mid transition-colors duration-250 hover:border-hi/20 hover:text-hi"
            >
              {secondaryLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
