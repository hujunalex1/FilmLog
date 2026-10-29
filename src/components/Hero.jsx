import {
  ArrowRightIcon,
  BookmarkIcon,
  CloudIcon,
  FilmIcon,
  HeartIcon,
  PlusIcon,
} from './Icons';
import StarRating from './StarRating';
import ArtworkPlaceholder from './ArtworkPlaceholder';
import { resolveEntryCover } from '../data/covers';
import { brand, hero } from '../data/content';
import { formatWatchedWhen } from '../lib/format';

export default function Hero({
  featured,
  watchlistCount,
  onOpenFeatured,
  onLogFilm,
  onBrowseWatchlist,
  onOpenAccount,
  user,
  cloudStatus,
}) {
  const featuredMeta = featured
    ? [featured.year, featured.genres?.[0], featured.runtime]
        .filter(Boolean)
        .join(' · ')
    : '';
  const featuredWhen = featured ? formatWatchedWhen(featured) : '';
  const featuredNote = featured?.note || featured?.synopsis || '';
  const featuredArtwork = featured ? resolveEntryCover(featured) : { still: '', poster: '' };
  const cloudLabel = !user
    ? '登录以云同步'
    : cloudStatus === 'synced'
      ? '已同步至 Supabase'
      : cloudStatus === 'error'
        ? '云同步异常'
        : '正在同步至 Supabase';
  const cloudDot =
    cloudStatus === 'synced'
      ? 'bg-[#7f9b72]'
      : cloudStatus === 'loading' || cloudStatus === 'syncing'
        ? 'bg-accent'
        : cloudStatus === 'error'
          ? 'bg-[#d58b7e]'
          : 'bg-low';

  return (
    <section className="relative overflow-hidden border-b border-hairline">
      <div className="relative z-10 mx-auto grid max-w-[1500px] gap-12 px-5 py-12 md:px-8 lg:grid-cols-[1.03fr_.97fr] lg:items-end lg:gap-14 lg:px-[34px] lg:py-16 xl:py-20">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <span className="h-px w-7 bg-accent" aria-hidden="true" />
            <p className="text-[9.5px] font-bold uppercase tracking-[.2em] text-low">
              {hero.eyebrow} {/* deslop-ignore 10 */}
            </p>
          </div>

          {/* deslop-ignore-next-line 07 */}
          <h1 className="mt-6 font-serif text-[clamp(3.5rem,10vw,7rem)] leading-[0.95] tracking-[-0.02em] text-hi">
            <span className="block">{hero.headline[0]}</span>
            <span className="block text-accent">{hero.headline[1]}</span>
          </h1>

          <p className="mt-6 max-w-[47ch] text-[14.5px] leading-[1.65] text-mid">
            {hero.description}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onLogFilm}
              className="focus-ring inline-flex items-center gap-2.5 bg-accent px-5 py-3 text-[11px] font-bold tracking-[.13em] text-accent-ink transition-[background-color,transform] duration-250 hover:bg-[#c18f50] active:scale-[.985]"
            >
              <PlusIcon className="h-4 w-4" />
              记录电影
            </button>
            <button
              type="button"
              onClick={onBrowseWatchlist}
              className="focus-ring inline-flex items-center gap-2.5 border border-hairline px-5 py-3 text-[11px] font-semibold tracking-[.13em] text-mid transition-[border-color,color,transform] duration-250 hover:border-hi/25 hover:text-hi active:scale-[.985]"
            >
              <BookmarkIcon className="h-3.5 w-3.5" />
              待看清单
              <span className="text-low">({String(watchlistCount).padStart(2, '0')})</span>
            </button>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-hairline pt-5">
            <p className="text-[9.5px] font-bold tracking-[.15em] text-low">
              {brand.tagline}
            </p>
            <span className="hidden h-3 w-px bg-hairline sm:block" aria-hidden="true" />
            <button
              type="button"
              onClick={onOpenAccount}
              className="focus-ring inline-flex items-center gap-1.5 text-[10px] tracking-[.04em] text-low transition-colors duration-200 hover:text-mid"
              aria-label={user ? '打开账号与云同步' : '登录以同步云端'}
            >
              <CloudIcon className="h-3 w-3" />
              {cloudLabel}
              <span
                className={`h-1.5 w-1.5 rounded-full ${cloudDot}`}
                aria-hidden="true"
              />
            </button>
          </div>
        </div>

        {featured ? (
          <button
            type="button"
            onClick={() => onOpenFeatured(featured)}
            className="focus-ring group relative block aspect-[4/3] w-full overflow-hidden rounded-card sm:aspect-[16/9] lg:aspect-[16/11] border border-hairline bg-thumb text-left shadow-[0_18px_36px_-18px_rgba(0,0,0,.8)]"
            aria-label={`打开最新记录：${featured.title}`}
          >
            {featuredArtwork.still ? (
              <img
                src={featuredArtwork.still}
                alt=""
                loading="eager"
                decoding="async"
                className="cinema-still absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <ArtworkPlaceholder title={featured.title} variant="hero" />
            )}
            <div
              className="absolute inset-0 bg-[linear-gradient(to_top,rgba(8,7,6,.94)_0%,rgba(8,7,6,.58)_42%,rgba(8,7,6,.16)_72%,rgba(8,7,6,.3)_100%)]"
              aria-hidden="true"
            />
            <div className="grain absolute inset-0" aria-hidden="true" />

            <div className="absolute left-5 right-5 top-5 flex items-start justify-between gap-3">
              <span className="inline-flex items-center gap-2 border border-white/15 bg-black/70 px-2.5 py-1.5 text-[9px] font-bold tracking-[.14em] text-white/85">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                最新记录
              </span>
              {featured.favorite && (
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-black/70 text-accent">
                  <HeartIcon filled className="h-4 w-4" />
                </span>
              )}
            </div>

            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
              <p className="text-[9.5px] font-semibold tracking-[.1em] text-white/60">
                {featuredMeta || '观影记录'}
              </p>
              {/* deslop-ignore-next-line 07 */}
              <h2 className="mt-2 max-w-[14ch] font-serif text-[clamp(2rem,4vw,3rem)] leading-[0.95] tracking-[-0.02em] text-white">
                {featured.title}
              </h2>
              {featuredNote && (
                <p className="mt-3 hidden max-w-[46ch] text-[13px] leading-[1.55] text-white/65 line-clamp-2 min-[360px]:block">
                  {featuredNote}
                </p>
              )}

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <StarRating value={featured.rating} readOnly size="sm" />
                  <span className="text-[10px] font-semibold uppercase tracking-[.13em] text-white/55">
                    {featured.rating > 0 ? `${Number(featured.rating).toFixed(1)} / 5` : '未评分'}
                    {featuredWhen ? ` · ${featuredWhen}` : ''}
                  </span>
                </div>
                <span className="ml-auto flex items-center gap-2 text-[10px] font-bold tracking-[.12em] text-accent">
                  打开记录
                  <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          </button>
        ) : (
          <button
            type="button"
            onClick={onLogFilm}
            className="focus-ring group flex aspect-[4/3] w-full flex-col justify-between overflow-hidden rounded-card border border-hairline bg-panel/45 p-6 text-left transition-colors duration-300 hover:border-hi/20 sm:aspect-[16/9] lg:aspect-[16/11]"
            aria-label="记录第一部电影"
          >
            <div className="flex items-center justify-between gap-4">
              <span className="inline-flex items-center gap-2 border border-hairline px-2.5 py-1.5 text-[9px] font-bold tracking-[.14em] text-low">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                新的一页
              </span>
              <FilmIcon className="h-5 w-5 text-low" />
            </div>
            <div>
              {/* deslop-ignore-next-line 07 */}
              <h2 className="font-serif text-[clamp(2rem,4vw,3.2rem)] leading-[1.02] tracking-[-0.02em] text-hi">
                从这一部开始。
              </h2>
              <p className="mt-3 max-w-[42ch] text-[13px] leading-[1.7] text-mid">
                从片名、评分，或一句想留下的话开始。
              </p>
              <span className="mt-5 inline-flex items-center gap-2 text-[10px] font-bold tracking-[.12em] text-accent">
                记录电影
                <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </div>
          </button>
        )}
      </div>
    </section>
  );
}
