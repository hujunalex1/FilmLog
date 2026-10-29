import { createId } from './format';

export const EXPORT_SCHEMA_VERSION = 1;
const MAX_IMPORT_BYTES = 5 * 1024 * 1024;

const cleanText = (value) =>
  typeof value === 'string' ? value.trim() : value == null ? '' : String(value).trim();

const normalizeGenres = (value) => {
  if (Array.isArray(value)) {
    return value.map((genre) => cleanText(genre)).filter(Boolean);
  }
  if (typeof value === 'string') {
    return value
      .split(/[,，、/]/)
      .map((genre) => genre.trim())
      .filter(Boolean);
  }
  return [];
};

const normalizeImage = (value) => {
  if (typeof value !== 'string') return '';
  const trimmed = value.trim();
  if (!trimmed.startsWith('/') || trimmed.includes('..')) return '';
  return trimmed;
};

const isValidDate = (value) => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  return !Number.isNaN(new Date(`${value}T12:00:00`).getTime());
};

function normalizeEntry(raw) {
  if (!raw || typeof raw !== 'object') return null;

  const title = cleanText(raw.title);
  if (!title) return null;

  const status = raw.status === 'watchlist' ? 'watchlist' : 'watched';
  const watchedAt =
    status === 'watched' && isValidDate(raw.watchedAt) ? raw.watchedAt : '';
  const rawYear = Number(raw.watchedYear);
  const watchedYear =
    status === 'watched'
      ? Number.isFinite(rawYear) && rawYear > 1800
        ? rawYear
        : watchedAt
          ? Number(watchedAt.slice(0, 4))
          : ''
      : '';

  const rating = Math.max(
    0,
    Math.min(5, Number.isFinite(Number(raw.rating)) ? Number(raw.rating) : 0),
  );

  return {
    id: typeof raw.id === 'string' && raw.id.trim() ? raw.id.trim() : createId(),
    title,
    year: raw.year === '' || raw.year == null ? '' : raw.year,
    director: cleanText(raw.director),
    runtime: cleanText(raw.runtime),
    genres: normalizeGenres(raw.genres),
    country: cleanText(raw.country),
    language: cleanText(raw.language),
    status,
    rating: status === 'watched' ? rating : 0,
    watchedAt,
    watchedYear,
    addedAt: typeof raw.addedAt === 'string' ? raw.addedAt : '',
    favorite: Boolean(raw.favorite),
    rewatches: Math.max(0, Number(raw.rewatches) || 0),
    still: normalizeImage(raw.still),
    poster: normalizeImage(raw.poster),
    synopsis: cleanText(raw.synopsis),
    note: cleanText(raw.note),
  };
}

export function parseImportPayload(text) {
  let payload;

  try {
    payload = JSON.parse(text);
  } catch {
    return {
      entries: [],
      skipped: 0,
      error: 'JSON 解析失败，请检查文件格式。',
    };
  }

  const rawEntries = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.entries)
      ? payload.entries
      : null;

  if (!rawEntries) {
    return {
      entries: [],
      skipped: 0,
      error: '文件里没有找到记录数组（entries）。',
    };
  }

  if (rawEntries.length === 0) {
    return {
      entries: [],
      skipped: 0,
      error: '文件里没有可导入的记录。',
    };
  }

  if (rawEntries.length > 5000) {
    return {
      entries: [],
      skipped: 0,
      error: '单次最多导入 5000 条记录。',
    };
  }

  const entries = [];
  const seenIds = new Set();
  let skipped = 0;

  for (const raw of rawEntries) {
    const entry = normalizeEntry(raw);
    if (!entry) {
      skipped += 1;
      continue;
    }

    if (seenIds.has(entry.id)) {
      entry.id = createId();
    }
    seenIds.add(entry.id);
    entries.push(entry);
  }

  if (entries.length === 0) {
    return {
      entries: [],
      skipped,
      error: '没有带片名的有效记录。',
    };
  }

  return { entries, skipped, error: '' };
}

export function mergeEntries(currentEntries, importedEntries, mode) {
  if (mode === 'replace') {
    return {
      entries: importedEntries,
      added: importedEntries.length,
      updated: 0,
    };
  }

  const merged = new Map(
    (Array.isArray(currentEntries) ? currentEntries : []).map((entry) => [
      entry.id,
      entry,
    ]),
  );
  let added = 0;
  let updated = 0;

  for (const entry of importedEntries) {
    if (merged.has(entry.id)) {
      updated += 1;
    } else {
      added += 1;
    }
    merged.set(entry.id, entry);
  }

  return {
    entries: Array.from(merged.values()),
    added,
    updated,
  };
}

export function buildExportPayload(entries) {
  return {
    app: 'Motif',
    schemaVersion: EXPORT_SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    count: entries.length,
    entries,
  };
}

function downloadJson(payload, fileName) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: 'application/json;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 500);
}

export async function saveBackupFile(entries) {
  const payload = buildExportPayload(entries);
  const fileName = `motif-entries-${new Date().toISOString().slice(0, 10)}.json`;
  const json = JSON.stringify(payload, null, 2);

  if (
    typeof window !== 'undefined' &&
    typeof window.showSaveFilePicker === 'function'
  ) {
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: fileName,
        types: [
          {
            description: 'Motif JSON 备份',
            accept: { 'application/json': ['.json'] },
          },
        ],
      });
      const writable = await handle.createWritable();
      await writable.write(new Blob([json], { type: 'application/json;charset=utf-8' }));
      await writable.close();
      return { method: 'picker', fileName: handle.name };
    } catch (error) {
      if (error?.name === 'AbortError') {
        return { canceled: true };
      }
      // Fall through to a regular browser download if the picker is blocked.
    }
  }

  downloadJson(payload, fileName);
  return { method: 'download', fileName };
}

export const importFileSizeLimit = MAX_IMPORT_BYTES;
