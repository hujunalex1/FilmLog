import { useId, useRef, useState } from 'react';
import ModalShell from './ModalShell';
import StarRating from './StarRating';
import {
  BookmarkIcon,
  CheckIcon,
  HeartIcon,
  PlusIcon,
  TrashIcon,
  UploadIcon,
} from './Icons';
import { artworkOptions, emptyEntry } from '../data/content';
import { resolveEntryCover } from '../data/covers';
import { compressImage } from '../lib/image';

const baseInput =
  'focus-ring mt-2 w-full border bg-elevated px-3.5 text-[13px] text-hi placeholder:text-low/55 transition-colors duration-200 focus:border-accent';

const labelClass =
  'text-[10px] font-bold tracking-[.14em] text-low';

function buildFormState(entry) {
  const source = entry ?? emptyEntry;
  const resolved = entry ? resolveEntryCover(entry) : {};
  const initialStill = source.still || resolved.still || artworkOptions[0].src;
  const initialPoster = source.poster || resolved.poster || initialStill;

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
    still: initialStill,
    poster: initialPoster,
    note: source.note ?? '',
    synopsis: source.synopsis ?? '',
  };
}

export default function LogDialog({ entry, onClose, onSave }) {
  const [form, setForm] = useState(() => buildFormState(entry));
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef(null);
  const titleId = useId();

  const isEditing = Boolean(entry);
  const watching = form.status === 'watched';

  const isCustomImage = Boolean(
    form.still && !artworkOptions.some((option) => option.src === form.still),
  );

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

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await compressImage(file, { maxWidth: 1200, maxHeight: 1600 });
      setForm((current) => ({
        ...current,
        still: result.dataUrl,
        poster: result.dataUrl,
      }));
      if (error) setError('');
    } catch (err) {
      setError(err.message || '上传图片失败，请重试');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleCustomUrl = (url) => {
    const trimmed = url.trim();
    setForm((current) => ({
      ...current,
      still: trimmed,
      poster: trimmed,
    }));
  };

  const handleResetArtwork = () => {
    setForm((current) => ({
      ...current,
      still: artworkOptions[0].src,
      poster: artworkOptions[0].src,
    }));
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
                <span className={labelClass}>海报 / 剧照画面</span>
                <span className="text-[10px] text-low">
                  {isCustomImage ? '已选择自定义海报' : '可本地上传、填入链接或选择预设'}
                </span>
              </div>

              {/* Upload Card / Preview */}
              <div className="mt-2.5 flex flex-col gap-3.5 border border-hairline bg-thumb/40 p-3.5 sm:flex-row sm:items-center">
                <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden border border-hairline bg-thumb sm:w-[130px]">
                  {form.still ? (
                    <img
                      src={form.still}
                      alt="当前海报预览"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[10.5px] text-low">
                      暂无图片
                    </div>
                  )}
                  {uploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/75 text-[11px] font-medium text-hi">
                      压缩中...
                    </div>
                  )}
                </div>

                <div className="flex min-w-0 flex-1 flex-col justify-between gap-2.5">
                  <div>
                    <p className="text-[12px] font-semibold text-hi">
                      {isCustomImage ? '使用自定义图片' : '使用内置精选剧照'}
                    </p>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-low">
                      支持 JPG / PNG / WebP 格式。选图后浏览器会在本地自动优化压缩，不占额度。
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id={`${titleId}-file-input`}
                    />
                    <button
                      type="button"
                      disabled={uploading}
                      onClick={() => fileInputRef.current?.click()}
                      className="focus-ring inline-flex items-center gap-1.5 border border-hairline bg-elevated px-3 py-1.5 text-[11px] font-semibold text-hi transition-colors hover:border-hi/30 hover:bg-elevated/80 disabled:opacity-50"
                    >
                      <UploadIcon className="h-3.5 w-3.5 text-accent" />
                      {uploading ? '正在处理...' : '上传本地海报'}
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowUrlInput((prev) => !prev)}
                      className="focus-ring inline-flex items-center gap-1.5 border border-hairline px-3 py-1.5 text-[11px] font-medium text-mid transition-colors hover:border-hi/25 hover:text-hi"
                    >
                      {showUrlInput ? '收起 URL' : '图片链接'}
                    </button>

                    {isCustomImage && (
                      <button
                        type="button"
                        onClick={handleResetArtwork}
                        className="focus-ring inline-flex items-center gap-1 text-[11px] font-medium text-low transition-colors hover:text-[#d58b7e]"
                      >
                        <TrashIcon className="h-3 w-3" />
                        恢复默认
                      </button>
                    )}
                  </div>

                  {showUrlInput && (
                    <div className="mt-1">
                      <input
                        type="url"
                        value={form.still?.startsWith('http') ? form.still : ''}
                        onChange={(e) => handleCustomUrl(e.target.value)}
                        placeholder="粘贴网络图片地址 (例如: https://.../poster.jpg)"
                        className="focus-ring h-8 w-full border border-hairline bg-elevated px-2.5 text-[11.5px] text-hi placeholder:text-low/50 focus:border-accent"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Preset Still Options */}
              <div className="mt-3">
                <span className="text-[10px] font-semibold text-low">
                  或直接从内置精选画面中挑选：
                </span>
                <div className="mt-1.5 grid grid-cols-4 gap-2 sm:grid-cols-8">
                  {artworkOptions.map((option) => {
                    const selected = form.still === option.src;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => handleArtwork(option.src)}
                        className={`focus-ring group/art relative aspect-[16/10] overflow-hidden border transition-colors duration-200 ${
                          selected
                            ? 'border-accent'
                            : 'border-hairline hover:border-hi/30'
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
                            selected
                              ? 'opacity-100'
                              : 'opacity-65 group-hover/art:opacity-90'
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
