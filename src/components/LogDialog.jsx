import { useId, useState } from 'react';
import ModalShell from './ModalShell';
import StarRating from './StarRating';
import {
  BookmarkIcon,
  CheckIcon,
  HeartIcon,
  PlusIcon,
} from './Icons';
import { artworkOptions, emptyEntry } from '../data/content';

const baseInput =
  'focus-ring mt-2 w-full border bg-elevated px-3.5 text-[13px] text-hi placeholder:text-low/55 transition-colors duration-200 focus:border-accent';

const labelClass =
  'text-[10px] font-bold tracking-[.14em] text-low';

function buildFormState(entry) {
  const source = entry ?? emptyEntry;
  return {
    title: source.title ?? '',
    year: source.year ? String(source.year) : '',
    director: source.director ?? '',
    runtime: source.runtime ?? '',
    genres: Array.isArray(source.genres)
      ? source.genres.join('、')
      : source.genres ?? '',
    country: source.country ?? '',
    language: source.language ?? '',
    status: source.status ?? 'watched',
    rating: Number(source.rating) || 0,
    watchedAt: source.watchedAt ?? '',
    favorite: Boolean(source.favorite),
    rewatches: Number(source.rewatches) || 0,
    still: source.still ?? artworkOptions[0].src,
    poster: source.poster ?? artworkOptions[0].src,
    note: source.note ?? '',
    synopsis: source.synopsis ?? '',
  };
}

export default function LogDialog({ entry, onClose, onSave }) {
  const [form, setForm] = useState(() => buildFormState(entry));
  const [error, setError] = useState('');
  const titleId = useId();

  const isEditing = Boolean(entry);
  const watching = form.status === 'watched';

  const update = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    if (error) setError('');
  };

  const handleStatus = (status) => {
    setForm((current) => ({ ...current, status }));
  };

  const handleArtwork = (src) => {
    setForm((current) => ({ ...current, still: src, poster: src }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.title.trim()) {
      setError('保存前，先给这部电影一个片名。');
      window.setTimeout(() => document.getElementById(titleId)?.focus(), 20);
      return;
    }

    const year = form.year ? Number(form.year) : '';
    if (form.year && (!Number.isFinite(year) || year < 1880 || year > 2100)) {
      setError('请输入 1880 到 2100 之间的年份。');
      return;
    }

    const watchedYear = watching
      ? form.watchedAt
        ? Number(form.watchedAt.slice(0, 4))
        : Number(entry?.watchedYear) || ''
      : '';

    onSave({
      ...(entry ?? {}),
      title: form.title.trim(),
      year,
      director: form.director.trim(),
      runtime: form.runtime.trim(),
      genres: form.genres
        .split(/[,，、]/)
        .map((genre) => genre.trim())
        .filter(Boolean),
      country: form.country.trim(),
      language: form.language.trim(),
      status: form.status,
      rating: watching ? form.rating : 0,
      watchedAt: watching ? form.watchedAt : '',
      watchedYear,
      favorite: form.favorite,
      rewatches: Number(form.rewatches) || 0,
      still: form.still,
      poster: form.poster,
      note: form.note.trim(),
      synopsis: form.synopsis.trim(),
      addedAt: entry?.addedAt ?? new Date().toISOString(),
    });
  };

  return (
    <ModalShell
      title={isEditing ? '编辑记录' : '记录一部电影'}
      onClose={onClose}
      size="md"
      describedBy={`${titleId}-description`}
    >
      <form onSubmit={handleSubmit} noValidate>
        <div className="p-6 sm:p-8">
          <p
            id={`${titleId}-description`}
            className="max-w-[52ch] text-[13.5px] leading-[1.7] text-mid"
          >
            {isEditing
              ? '修改这部电影的细节、评分或短评。改动只保存在本机。'
              : '把一部电影收进手记。只填片名也可以，其余稍后再补。'}
          </p>

          {error && (
            <div
              className="mt-5 border border-[#d58b7e]/35 bg-[#d58b7e]/10 px-3.5 py-3 text-[12px] text-[#e3aa9f]"
              role="alert"
            >
              {error}
            </div>
          )}

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor={titleId} className={labelClass}>
                片名 <span className="text-accent">*</span>
              </label>
              <input
                id={titleId}
                data-autofocus
                type="text"
                value={form.title}
                onChange={(event) => update('title', event.target.value)}
                placeholder="你看过的电影"
                autoComplete="off"
                aria-required="true"
                className={`${baseInput} h-12 text-[16px] ${
                  error && !form.title.trim() ? 'border-[#d58b7e]' : 'border-hairline'
                }`}
                aria-invalid={Boolean(error && !form.title.trim())}
              />
            </div>

            <div>
              <label htmlFor={`${titleId}-year`} className={labelClass}>
                年份
              </label>
              <input
                id={`${titleId}-year`}
                type="number"
                inputMode="numeric"
                min="1880"
                max="2100"
                value={form.year}
                onChange={(event) => update('year', event.target.value)}
                placeholder="2026"
                className={`${baseInput} h-11 border-hairline`}
              />
            </div>

            <div>
              <label htmlFor={`${titleId}-director`} className={labelClass}>
                导演
              </label>
              <input
                id={`${titleId}-director`}
                type="text"
                value={form.director}
                onChange={(event) => update('director', event.target.value)}
                placeholder="导演姓名"
                className={`${baseInput} h-11 border-hairline`}
              />
            </div>

            <div>
              <label htmlFor={`${titleId}-runtime`} className={labelClass}>
                片长
              </label>
              <input
                id={`${titleId}-runtime`}
                type="text"
                value={form.runtime}
                onChange={(event) => update('runtime', event.target.value)}
                placeholder="例如 1 小时 42 分"
                className={`${baseInput} h-11 border-hairline`}
              />
            </div>

            <div>
              <span className={labelClass}>状态</span>
              <div className="mt-2 grid grid-cols-2 gap-2" role="group" aria-label="观看状态">
                <button
                  type="button"
                  onClick={() => handleStatus('watched')}
                  aria-pressed={watching}
                  className={`focus-ring flex h-11 items-center justify-center gap-2 border text-[11px] font-semibold transition-colors duration-200 ${
                    watching
                      ? 'border-accent bg-accent/10 text-accent'
                      : 'border-hairline bg-elevated text-low hover:text-mid'
                  }`}
                >
                  <CheckIcon className="h-3.5 w-3.5" />
                  已看
                </button>
                <button
                  type="button"
                  onClick={() => handleStatus('watchlist')}
                  aria-pressed={!watching}
                  className={`focus-ring flex h-11 items-center justify-center gap-2 border text-[11px] font-semibold transition-colors duration-200 ${
                    !watching
                      ? 'border-accent bg-accent/10 text-accent'
                      : 'border-hairline bg-elevated text-low hover:text-mid'
                  }`}
                >
                  <BookmarkIcon className="h-3.5 w-3.5" />
                  待看
                </button>
              </div>
            </div>

            <div>
              <label htmlFor={`${titleId}-date`} className={labelClass}>
                观看日期
              </label>
              <input
                id={`${titleId}-date`}
                type="date"
                value={form.watchedAt}
                disabled={!watching}
                onChange={(event) => update('watchedAt', event.target.value)}
                className={`${baseInput} h-11 border-hairline [color-scheme:dark] disabled:cursor-not-allowed disabled:opacity-40`}
              />
              <p className="mt-1.5 text-[10px] text-low">
                只知道年份时，可以留空。
              </p>
            </div>

            <div>
              <span className={labelClass}>你的评分</span>
              <div className={`mt-2 flex min-h-11 items-center border border-hairline bg-elevated px-3 ${!watching ? 'opacity-40' : ''}`}>
                <StarRating
                  value={form.rating}
                  onChange={
                    watching ? (rating) => update('rating', rating) : undefined
                  }
                  readOnly={!watching}
                  size="md"
                  showValue={false}
                />
              </div>
              {!watching && (
                <p className="mt-1.5 text-[10px] text-low">
                  标记为已看后即可评分。
                </p>
              )}
            </div>

            <div>
              <label htmlFor={`${titleId}-genres`} className={labelClass}>
                类型
              </label>
              <input
                id={`${titleId}-genres`}
                type="text"
                value={form.genres}
                onChange={(event) => update('genres', event.target.value)}
                placeholder="剧情、悬疑"
                className={`${baseInput} h-11 border-hairline`}
              />
            </div>

            <div>
              <label htmlFor={`${titleId}-country`} className={labelClass}>
                国家 / 地区
              </label>
              <input
                id={`${titleId}-country`}
                type="text"
                value={form.country}
                onChange={(event) => update('country', event.target.value)}
                placeholder="国家或地区"
                className={`${baseInput} h-11 border-hairline`}
              />
            </div>

            <div>
              <label htmlFor={`${titleId}-language`} className={labelClass}>
                语言
              </label>
              <input
                id={`${titleId}-language`}
                type="text"
                value={form.language}
                onChange={(event) => update('language', event.target.value)}
                placeholder="原始语言"
                className={`${baseInput} h-11 border-hairline`}
              />
            </div>

            <div className="sm:col-span-2">
              <div className="flex items-center justify-between gap-3">
                <span className={labelClass}>占位画面</span>
                <span className="text-[10px] text-low">选择一张剧照</span>
              </div>
              <div className="mt-2 grid grid-cols-4 gap-2 sm:grid-cols-8">
                {artworkOptions.map((option) => {
                  const selected = form.still === option.src;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => handleArtwork(option.src)}
                      className={`focus-ring group/art relative aspect-[16/10] overflow-hidden border transition-colors duration-200 ${
                        selected ? 'border-accent' : 'border-hairline hover:border-hi/30'
                      }`}
                      aria-label={`使用画面：${option.label}`}
                      aria-pressed={selected}
                      title={option.label}
                    >
                      <img
                        src={option.src}
                        alt=""
                        loading="lazy"
                        className={`h-full w-full object-cover transition-opacity duration-200 ${
                          selected ? 'opacity-100' : 'opacity-65 group-hover/art:opacity-90'
                        }`}
                      />
                      {selected && (
                        <span className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-accent-ink">
                            <CheckIcon className="h-3 w-3" />
                          </span>
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="sm:col-span-2">
              <div className="flex items-end justify-between gap-3">
                <label htmlFor={`${titleId}-note`} className={labelClass}>
                  你的短评
                </label>
                <span className="text-[10px] tabular-nums text-low">
                  {form.note.length} / 360
                </span>
              </div>
              <textarea
                id={`${titleId}-note`}
                rows={4}
                maxLength={360}
                value={form.note}
                onChange={(event) => update('note', event.target.value)}
                placeholder="一个镜头、一句台词，或一种想留住的感觉……"
                className={`${baseInput} resize-y py-3 leading-[1.65]`}
              />
            </div>

            <div className="sm:col-span-2">
              <button
                type="button"
                onClick={() => update('favorite', !form.favorite)}
                aria-pressed={form.favorite}
                className={`focus-ring flex items-center gap-2 border px-3.5 py-2.5 text-[10.5px] font-semibold tracking-[.1em] transition-colors duration-200 ${
                  form.favorite
                    ? 'border-accent/40 bg-accent/10 text-accent'
                    : 'border-hairline bg-elevated text-low hover:text-mid'
                }`}
              >
                <HeartIcon filled={form.favorite} className="h-4 w-4" />
                {form.favorite ? '已收藏' : '加入收藏'}
              </button>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 z-10 border-t border-hairline bg-panel px-6 py-4 sm:px-8">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="focus-ring border border-hairline px-4 py-2.5 text-[10.5px] font-semibold tracking-[.1em] text-mid transition-colors duration-200 hover:border-hi/20 hover:text-hi"
            >
              取消
            </button>
            <button
              type="submit"
              className="focus-ring inline-flex items-center gap-2 bg-accent px-5 py-2.5 text-[10.5px] font-bold tracking-[.1em] text-accent-ink transition-[background-color,transform] duration-200 hover:bg-[#c18f50] active:scale-[.985]"
            >
              {isEditing ? <CheckIcon className="h-4 w-4" /> : <PlusIcon className="h-4 w-4" />}
              {isEditing ? '保存修改' : '保存记录'}
            </button>
          </div>
        </div>
      </form>
    </ModalShell>
  );
}
