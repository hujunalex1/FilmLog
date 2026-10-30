import {
  BookmarkIcon,
  CheckIcon,
  HeartIcon,
  PencilIcon,
  StarIcon,
  TrashIcon,
} from './Icons';
import EntryMenu from './EntryMenu';
import ArtworkPlaceholder from './ArtworkPlaceholder';
import { resolveEntryCover } from '../data/covers';
import { formatShortDate, formatWatchedWhen } from '../lib/format';

export default function EntryCard({
  entry,
  index,
  onOpen,
  onEdit,
  onToggleFavorite,
  onToggleStatus,
  onDelete,
}) {
  const watched = entry.status === 'watched';
  const watchedWhen = formatWatchedWhen(entry, { short: true });
  const addedWhen = formatShortDate(String(entry.addedAt).slice(0, 10));
  const meta = watched
    ? ['已看', watchedWhen].filter(Boolean).join(' · ')
    : ['待看', addedWhen ? `${addedWhen}加入` : ''].filter(Boolean).join(' · ');
  const note = entry.note || entry.synopsis || '';
  const genres = (entry.genres ?? []).join(' · ');
  const ratingWidth = Math.max(0, Math.min(100, (Number(entry.rating) / 5) * 100));
  const artwork = resolveEntryCover(entry);

  return (
    <article
      className="animate-card-rise group relative z-0 min-w-0 hover:z-20 focus-within:z-30"
      style={{ '--i': Math.min(index, 8) }}
    >
      <div className="relative">
        <button
          type="button"
          onClick={() => onOpen(entry)}
          className="focus-ring relative block aspect-[16/9] w-full overflow-hidden rounded-tile bg-thumb text-left shadow-[0_0_0_1px_var(--color-hairline)] transition-shadow duration-200 group-hover:shadow-[0_0_0_1px_rgba(243,240,234,.22)] group-focus-within:shadow-[0_0_0_1px_rgba(243,240,234,.22)]"
          aria-label={`打开《${entry.title}》的观影记录`}
        >
          {artwork.still ? (
            <img
              src={artwork.still}
              alt=""
              loading={index < 8 ? 'eager' : 'lazy'}
              decoding="async"
              className="cinema-still h-full w-full object-cover"
            />
          ) : (
            <ArtworkPlaceholder title={entry.title} variant="card" />
          )}
          <span
            className="absolute inset-x-0 bottom-0 z-[1] h-14 bg-[linear-gradient(to_top,rgba(8,7,6,.6),transparent)]"
            aria-hidden="true"
          />

          <span className="text-shadow-cinema absolute bottom-2.5 right-2.5 z-[3] text-right leading-none">
            <span className="block text-[11px] font-extrabold tracking-[.02em] text-white">
              motif
            </span>
            <span className="mt-[3px] block text-[7px] font-bold tracking-[.22em] text-white/85">
              手记
            </span>
          </span>

          <span
            className="absolute inset-x-0 bottom-0 z-[2] h-[3px] bg-hi/20"
            aria-hidden="true"
          >
            {watched && ratingWidth > 0 && (
              <span
                className="block h-full bg-accent transition-[width] duration-500 ease-expo"
                style={{ width: `${ratingWidth}%` }}
              />
            )}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onToggleFavorite(entry)}
          className={`focus-ring absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-black/60 transition-[color,background-color,transform] duration-200 hover:bg-black/85 hover:text-accent active:scale-95 ${
            entry.favorite ? 'text-accent' : 'text-white/65'
          }`}
          aria-label={entry.favorite ? `取消收藏《${entry.title}》` : `收藏《${entry.title}》`}
          aria-pressed={entry.favorite}
        >
          <HeartIcon filled={entry.favorite} className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 flex items-start justify-between gap-2">
        <p className="min-w-0 truncate text-[10.5px] font-bold tracking-[.08em] text-low">
          {meta}
        </p>
        <div className="-mr-1 flex shrink-0 items-center gap-1.5">
          {watched && Number(entry.rating) > 0 && (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-accent">
              <StarIcon filled className="h-3 w-3" />
              {Number(entry.rating).toFixed(1)}
            </span>
          )}
          <EntryMenu
            title={entry.title}
            items={[
              { label: '打开记录', onSelect: () => onOpen(entry) },
              {
                label: '编辑记录',
                icon: PencilIcon,
                onSelect: () => onEdit(entry),
              },
              {
                label: entry.favorite ? '取消收藏' : '加入收藏',
                icon: HeartIcon,
                onSelect: () => onToggleFavorite(entry),
              },
              {
                label: watched ? '移入待看' : '标记为已看',
                icon: watched ? BookmarkIcon : CheckIcon,
                onSelect: () => onToggleStatus(entry),
              },
              {
                label: '删除记录',
                icon: TrashIcon,
                danger: true,
                separator: true,
                onSelect: () => onDelete(entry),
              },
            ]}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={() => onOpen(entry)}
        className="focus-ring mt-1.5 block max-w-full rounded-sm text-left"
      >
        <h3 className="text-[19px] font-semibold leading-[1.25] tracking-[-0.012em] text-hi transition-colors duration-250 group-hover:text-[#fbf8f1]">
          {entry.title}
        </h3>
      </button>

      {note ? (
        <p className="mt-2.5 max-w-[34ch] text-[14.5px] leading-[1.55] text-mid line-clamp-3">
          {note}
        </p>
      ) : (
        genres && (
          <p className="mt-2.5 max-w-[34ch] text-[12.5px] leading-[1.6] tracking-[.02em] text-low line-clamp-2">
            {genres}
          </p>
        )
      )}
    </article>
  );
}
