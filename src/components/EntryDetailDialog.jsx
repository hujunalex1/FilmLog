import ModalShell from './ModalShell';
import StarRating from './StarRating';
import ArtworkPlaceholder from './ArtworkPlaceholder';
import { resolveEntryCover } from '../data/covers';
import {
  BookmarkIcon,
  CalendarIcon,
  CheckIcon,
  ClockIcon,
  HeartIcon,
  PencilIcon,
  TrashIcon,
} from './Icons';
import { formatLongDate, formatWatchedWhen } from '../lib/format';

function DetailItem({ label, value }) {
  return (
    <div className="border-b border-r border-hairline p-4">
      <dt className="text-[9.5px] font-bold tracking-[.14em] text-low">
        {label}
      </dt>
      <dd className="mt-1.5 text-[13px] font-medium leading-[1.55] text-hi">
        {value || '—'}
      </dd>
    </div>
  );
}

export default function EntryDetailDialog({
  entry,
  onClose,
  onEdit,
  onUpdate,
  onToggleFavorite,
  onToggleStatus,
  onDelete,
}) {
  const watched = entry.status === 'watched';
  const watchedWhen = formatWatchedWhen(entry);
  const artwork = resolveEntryCover(entry);
  const detailMeta = [
    entry.year,
    (entry.genres ?? []).join('、'),
    entry.runtime,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <ModalShell title={entry.title} onClose={onClose} size="lg">
      <div className="p-6 sm:p-8">
        <div className="flex flex-col gap-7 sm:flex-row sm:gap-8">
          <div className="relative aspect-[16/9] w-full overflow-hidden border border-hairline bg-thumb shadow-[0_18px_34px_-24px_rgba(0,0,0,.9)] sm:aspect-[2/3] sm:w-[218px] sm:max-w-[218px] sm:shrink-0">
            {artwork.poster ? (
              <img
                src={artwork.poster}
                alt=""
                loading="eager"
                decoding="async"
                className="cinema-still h-full w-full object-cover"
              />
            ) : (
              <ArtworkPlaceholder title={entry.title} variant="poster" />
            )}
            <div
              className="absolute inset-x-0 bottom-0 h-16 bg-[linear-gradient(to_top,rgba(8,7,6,.6),transparent)]"
              aria-hidden="true"
            />
            <div className="text-shadow-cinema absolute bottom-3 right-3 text-right leading-none">
              <span className="block text-[11px] font-extrabold tracking-[.02em] text-white">
                motif
              </span>
              <span className="mt-[3px] block text-[7px] font-bold tracking-[.22em] text-white/85">
                手记
              </span>
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 border px-2.5 py-1.5 text-[9px] font-bold tracking-[.13em] ${
                  watched
                    ? 'border-accent/35 bg-accent/10 text-accent'
                    : 'border-hairline bg-elevated text-mid'
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${watched ? 'bg-accent' : 'bg-low'}`} />
                {watched ? '已看' : '待看'}
              </span>
              {watched && watchedWhen && (
                <span className="inline-flex items-center gap-1.5 text-[9.5px] font-semibold tracking-[.08em] text-low">
                  <CalendarIcon className="h-3 w-3" />
                  {watchedWhen}
                </span>
              )}
            </div>

            {/* deslop-ignore-next-line 07 */}
            <h3 className="mt-4 font-serif text-[clamp(2.6rem,6vw,4.2rem)] leading-[0.92] tracking-[-0.03em] text-hi">
              {entry.title}
            </h3>

            <p className="mt-3 text-[10.5px] font-semibold tracking-[.06em] text-low">
              {detailMeta}
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-y border-hairline py-4">
              <div>
                <p className="text-[9.5px] font-bold tracking-[.14em] text-low">
                  你的评分
                </p>
                <div className="mt-1.5">
                  {watched ? (
                    <StarRating
                      value={entry.rating}
                      onChange={(rating) => onUpdate(entry, { rating })}
                      size="md"
                    />
                  ) : (
                    <p className="text-[12px] text-low">
                      还没有评分——标记为已看后就能打分。
                    </p>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => onToggleFavorite(entry)}
                aria-pressed={entry.favorite}
                className={`focus-ring inline-flex items-center gap-2 border px-3.5 py-2.5 text-[9.5px] font-bold tracking-[.1em] transition-colors duration-200 ${
                  entry.favorite
                    ? 'border-accent/40 bg-accent/10 text-accent'
                    : 'border-hairline text-mid hover:border-hi/20 hover:text-hi'
                }`}
              >
                <HeartIcon filled={entry.favorite} className="h-3.5 w-3.5" />
                {entry.favorite ? '已收藏' : '加入收藏'}
              </button>
            </div>

            <p className="mt-5 max-w-[58ch] text-[13.5px] leading-[1.65] text-mid">
              {entry.synopsis ||
                '暂无简介。'}
            </p>

            <div className="mt-6">
              <div className="flex items-center gap-2">
                <span className="h-px w-5 bg-accent" aria-hidden="true" />
                <p className="text-[9.5px] font-bold tracking-[.14em] text-low">
                  手记短评
                </p>
              </div>
              <blockquote className="mt-3 border-l-2 border-accent/70 pl-4">
                <p className="max-w-[52ch] text-[14.5px] leading-[1.65] text-hi">
                  {entry.note || (
                    <span className="italic text-low">
                      还没有短评。
                    </span>
                  )}
                </p>
              </blockquote>
            </div>
          </div>
        </div>

        {/* deslop-ignore-next-line 28 */}
        <dl className="mt-8 grid grid-cols-2 border-l border-t border-hairline sm:grid-cols-3">
          <DetailItem label="导演" value={entry.director} />
          <DetailItem label="国家 / 地区" value={entry.country} />
          <DetailItem label="语言" value={entry.language} />
          <DetailItem
            label="观看次数"
            value={watched ? `${Number(entry.rewatches) + 1} 次` : '—'}
          />
          <DetailItem
            label="加入日期"
            value={formatLongDate(String(entry.addedAt).slice(0, 10))}
          />
          <DetailItem label="状态" value={watched ? '已看' : '待看'} />
        </dl>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-hairline pt-5">
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => onEdit(entry)}
              className="focus-ring inline-flex items-center gap-2 bg-accent px-4 py-2.5 text-[10.5px] font-bold tracking-[.08em] text-accent-ink transition-[background-color,transform] duration-200 hover:bg-[#c18f50] active:scale-[.985]"
            >
              <PencilIcon className="h-3.5 w-3.5" />
              编辑记录
            </button>
            <button
              type="button"
              onClick={() => onToggleStatus(entry)}
              className="focus-ring inline-flex items-center gap-2 border border-hairline px-4 py-2.5 text-[10.5px] font-semibold tracking-[.08em] text-mid transition-colors duration-200 hover:border-hi/20 hover:text-hi"
            >
              {watched ? (
                <BookmarkIcon className="h-3.5 w-3.5" />
              ) : (
                <CheckIcon className="h-3.5 w-3.5" />
              )}
              {watched ? '移入待看' : '标记为已看'}
            </button>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden items-center gap-1.5 text-[9.5px] tracking-[.08em] text-low sm:flex">
              <ClockIcon className="h-3.5 w-3.5" />
              {entry.runtime || '片长未知'}
            </span>
            <button
              type="button"
              onClick={() => onDelete(entry)}
              className="focus-ring inline-flex items-center gap-1.5 text-[9.5px] font-semibold tracking-[.08em] text-[#d58b7e]/80 transition-colors duration-200 hover:text-[#e3aa9f]"
            >
              <TrashIcon className="h-3.5 w-3.5" />
              删除
            </button>
          </div>
        </div>
      </div>
    </ModalShell>
  );
}
