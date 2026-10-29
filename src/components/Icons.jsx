/* deslop-ignore-file 24 */
const baseProps = {
  fill: 'none',
  xmlns: 'http://www.w3.org/2000/svg',
  'aria-hidden': 'true',
  focusable: 'false',
};

export function LogoMark({ className = '' }) {
  return (
    <svg
      viewBox="0 0 28 28"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="1.25" y="1.25" width="25.5" height="25.5" rx="7" stroke="currentColor" strokeOpacity=".55" />
      <path
        d="M8 19.6V8.8l6 6.1 6-6.1v10.8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SearchIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...baseProps}>
      <circle cx="10.8" cy="10.8" r="6.6" stroke="currentColor" strokeWidth="1.7" />
      <path d="m16 16 4.2 4.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function CloseIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 20 20" className={className} {...baseProps}>
      <path d="M4.5 4.5 15.5 15.5M15.5 4.5 4.5 15.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function PlusIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 20 20" className={className} {...baseProps}>
      <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function ChevronDownIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 14 14" className={className} {...baseProps}>
      <path
        d="M3 5.2 7 9.2l4-4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MoreIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 16 16" className={className} {...baseProps} fill="currentColor">
      <circle cx="8" cy="3.2" r="1.35" />
      <circle cx="8" cy="8" r="1.35" />
      <circle cx="8" cy="12.8" r="1.35" />
    </svg>
  );
}

export function StarIcon({ className = '', filled = false }) {
  return (
    <svg viewBox="0 0 20 20" className={className} fill={filled ? 'currentColor' : 'none'} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="m10 2.8 2.15 4.37 4.82.7-3.49 3.4.82 4.8L10 13.8l-4.3 2.27.82-4.8-3.49-3.4 4.82-.7L10 2.8Z"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HeartIcon({ className = '', filled = false }) {
  return (
    <svg viewBox="0 0 20 20" className={className} fill={filled ? 'currentColor' : 'none'} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M10 16.4s-6.5-3.54-6.5-8A3.65 3.65 0 0 1 10 6.2a3.65 3.65 0 0 1 6.5 2.2c0 4.46-6.5 8-6.5 8Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function BookmarkIcon({ className = '', filled = false }) {
  return (
    <svg viewBox="0 0 20 20" className={className} fill={filled ? 'currentColor' : 'none'} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M5 3.8h10v13l-5-3.35L5 16.8v-13Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CheckIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 20 20" className={className} {...baseProps}>
      <path
        d="m4.8 10.5 3.3 3.3 7.1-7.6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CalendarIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 20 20" className={className} {...baseProps}>
      <rect x="3.1" y="4.6" width="13.8" height="12.3" rx="1.6" stroke="currentColor" strokeWidth="1.4" />
      <path d="M3.1 8.4h13.8M7 2.8v3.3M13 2.8v3.3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function ClockIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 20 20" className={className} {...baseProps}>
      <circle cx="10" cy="10" r="7.1" stroke="currentColor" strokeWidth="1.4" />
      <path d="M10 5.8v4.5l2.9 1.8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PencilIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 20 20" className={className} {...baseProps}>
      <path
        d="m13.3 3.9 2.8 2.8M4 16l.55-3.5L14.9 2.15a1.4 1.4 0 0 1 1.98 0l.97.97a1.4 1.4 0 0 1 0 1.98L7.5 15.45 4 16Z"
        stroke="currentColor"
        strokeWidth="1.45"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TrashIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 20 20" className={className} {...baseProps}>
      <path d="M4 5.7h12M8 3.4h4M5.6 5.7l.7 10.1h7.4l.7-10.1M8.2 8.6v4.5M11.8 8.6v4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function FilmIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...baseProps}>
      <rect x="3" y="4.5" width="18" height="15" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7.2 4.5v15M16.8 4.5v15M3 9.2h4.2M3 14.8h4.2M16.8 9.2H21M16.8 14.8H21" stroke="currentColor" strokeWidth="1.2" />
      <path d="m10.4 9.5 4.4 2.5-4.4 2.5v-5Z" fill="currentColor" opacity=".9" />
    </svg>
  );
}

export function ArrowUpRightIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 20 20" className={className} {...baseProps}>
      <path d="M5.5 14.5 14.5 5.5M7 5.5h7.5V13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ArrowUpIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 20 20" className={className} {...baseProps}>
      <path d="M10 16.2V3.8M4.8 9l5.2-5.2L15.2 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ArrowRightIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 20 20" className={className} {...baseProps}>
      <path d="M3.8 10h12.4M11 4.8l5.2 5.2-5.2 5.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SlidersIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 20 20" className={className} {...baseProps}>
      <path d="M3.5 6h13M3.5 14h13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="7.2" cy="6" r="2" fill="var(--color-canvas)" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="12.8" cy="14" r="2" fill="var(--color-canvas)" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export function DownloadIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 20 20" className={className} {...baseProps}>
      <path d="M10 3.2v9M6.4 8.8 10 12.4l3.6-3.6M4 16.4h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function UploadIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 20 20" className={className} {...baseProps}>
      <path d="M10 13.2v-9M6.4 7.6 10 4l3.6 3.6M4 16.4h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function DataTransferIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 20 20" className={className} {...baseProps}>
      <path d="M3.5 6.8h11.2M11.9 4l2.8 2.8-2.8 2.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16.5 13.2H5.3M8.1 10.4 5.3 13.2l2.8 2.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CloudIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 20 20" className={className} {...baseProps}>
      <path
        d="M5.9 15.4h8.2a3 3 0 0 0 .3-6 4.6 4.6 0 0 0-8.9-1.1A3.6 3.6 0 0 0 5.9 15.4Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CloudCheckIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 20 20" className={className} {...baseProps}>
      <path
        d="M5.3 14.8h7.8a2.8 2.8 0 0 0 .3-5.6A4.3 4.3 0 0 0 5 8.2a3.4 3.4 0 0 0 .3 6.6Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m8 11.2 1.4 1.4 2.7-2.9"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
