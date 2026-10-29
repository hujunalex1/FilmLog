/* deslop-ignore-file 06, 07 */
import { FilmIcon } from './Icons';

const palettes = [
  {
    from: '#2a2118',
    to: '#0b0907',
    glow: 'rgba(176, 127, 67, 0.28)',
    ink: 'rgba(201, 160, 106, 0.22)',
  },
  {
    from: '#1b2827',
    to: '#080b0b',
    glow: 'rgba(115, 156, 145, 0.2)',
    ink: 'rgba(143, 181, 168, 0.2)',
  },
  {
    from: '#251d2b',
    to: '#0a080c',
    glow: 'rgba(142, 116, 160, 0.2)',
    ink: 'rgba(181, 159, 198, 0.2)',
  },
  {
    from: '#27251b',
    to: '#0a0a08',
    glow: 'rgba(164, 154, 104, 0.18)',
    ink: 'rgba(199, 189, 136, 0.18)',
  },
  {
    from: '#2c1e1a',
    to: '#0c0807',
    glow: 'rgba(175, 108, 87, 0.2)',
    ink: 'rgba(217, 161, 141, 0.2)',
  },
];

function paletteFor(title) {
  const hash = Array.from(title || '影').reduce(
    (total, character) => total + character.codePointAt(0),
    0,
  );
  return palettes[hash % palettes.length];
}

export default function ArtworkPlaceholder({
  title = '',
  variant = 'card',
  className = '',
}) {
  const palette = paletteFor(title);
  const character = title.trim().charAt(0) || '影';
  const characterSize =
    variant === 'hero'
      ? 'text-[clamp(7rem,18vw,13rem)]'
      : variant === 'poster'
        ? 'text-[clamp(5rem,12vw,8rem)]'
        : 'text-[clamp(4.5rem,10vw,7rem)]';

  return (
    <span
      className={`absolute inset-0 isolate flex items-center justify-center overflow-hidden ${className}`}
      style={{
        backgroundImage: `radial-gradient(circle at 50% 34%, ${palette.glow} 0%, transparent 56%), linear-gradient(145deg, ${palette.from} 0%, ${palette.to} 100%)`,
      }}
      aria-hidden="true"
    >
      <span
        className="absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 48%, transparent 0%, transparent 32%, rgba(0,0,0,.34) 100%)',
        }}
      />
      <span
        className={`relative z-[2] select-none font-serif leading-none ${characterSize}`}
        style={{ color: palette.ink }}
      >
        {character}
      </span>

      {variant !== 'hero' && (
        <span className="absolute left-3 top-3 z-[2] inline-flex items-center gap-1.5 text-[8px] font-semibold tracking-[.14em] text-white/30">
          <FilmIcon className="h-3 w-3" />
          暂无剧照
        </span>
      )}

      <span className="grain absolute inset-0 z-[1]" />
    </span>
  );
}
