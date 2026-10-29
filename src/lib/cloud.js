import { supabase } from './supabase';

function toSafeString(value) {
  return typeof value === 'string' ? value : value == null ? '' : String(value);
}

function toYear(value) {
  const year = Number(value);
  return Number.isFinite(year) && year > 1800 ? Math.round(year) : null;
}

function toRow(entry, userId) {
  return {
    user_id: userId,
    id: entry.id,
    title: toSafeString(entry.title).trim(),
    year: toYear(entry.year),
    director: toSafeString(entry.director),
    runtime: toSafeString(entry.runtime),
    genres: Array.isArray(entry.genres)
      ? entry.genres.map(toSafeString).filter(Boolean)
      : [],
    country: toSafeString(entry.country),
    language: toSafeString(entry.language),
    status: entry.status === 'watchlist' ? 'watchlist' : 'watched',
    rating: Math.max(0, Math.min(5, Number(entry.rating) || 0)),
    watched_at: entry.watchedAt || null,
    watched_year: entry.status === 'watchlist' ? null : toYear(entry.watchedYear),
    added_at: entry.addedAt || null,
    favorite: Boolean(entry.favorite),
    rewatches: Math.max(0, Number(entry.rewatches) || 0),
    still: toSafeString(entry.still),
    poster: toSafeString(entry.poster),
    synopsis: toSafeString(entry.synopsis),
    note: toSafeString(entry.note),
  };
}

function fromRow(row) {
  return {
    id: row.id,
    title: row.title,
    year: row.year ?? '',
    director: row.director ?? '',
    runtime: row.runtime ?? '',
    genres: Array.isArray(row.genres) ? row.genres : [],
    country: row.country ?? '',
    language: row.language ?? '',
    status: row.status === 'watchlist' ? 'watchlist' : 'watched',
    rating: Number(row.rating) || 0,
    watchedAt: row.watched_at ?? '',
    watchedYear: row.watched_year ?? '',
    addedAt: row.added_at ?? '',
    favorite: Boolean(row.favorite),
    rewatches: Number(row.rewatches) || 0,
    still: row.still ?? '',
    poster: row.poster ?? '',
    synopsis: row.synopsis ?? '',
    note: row.note ?? '',
  };
}

function ensureClient() {
  if (!supabase) {
    throw new Error('Supabase 尚未配置。');
  }
  return supabase;
}

export async function fetchCloudEntries() {
  const client = ensureClient();
  const { data, error } = await client
    .from('entries')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data ?? []).map(fromRow);
}

export async function syncCloudEntries(userId, entries) {
  const client = ensureClient();
  const rows = (Array.isArray(entries) ? entries : []).map((entry) =>
    toRow(entry, userId),
  );

  if (rows.length > 0) {
    const { error: upsertError } = await client
      .from('entries')
      .upsert(rows, { onConflict: 'user_id,id' });
    if (upsertError) throw upsertError;
  }

  const { data: existing, error: readError } = await client
    .from('entries')
    .select('id')
    .eq('user_id', userId);
  if (readError) throw readError;

  const currentIds = new Set(rows.map((row) => row.id));
  const staleIds = (existing ?? [])
    .map((row) => row.id)
    .filter((id) => !currentIds.has(id));

  if (staleIds.length > 0) {
    const { error: deleteError } = await client
      .from('entries')
      .delete()
      .eq('user_id', userId)
      .in('id', staleIds);
    if (deleteError) throw deleteError;
  }

  return rows.length;
}

export function formatAuthError(error) {
  const message = error?.message ?? '';

  if (/invalid login credentials/i.test(message)) {
    return '邮箱或密码不正确。';
  }
  if (/email not confirmed/i.test(message)) {
    return '邮箱还没有确认。请先在 Supabase 控制台把该用户设为已确认，或完成邮箱确认后再登录。';
  }
  if (/password should be at least 6 characters/i.test(message)) {
    return '密码至少需要 6 位。';
  }
  if (/unable to validate email address/i.test(message)) {
    return '邮箱格式不正确。';
  }
  if (/failed to fetch|networkerror|network request failed/i.test(message)) {
    return '网络连接失败，请检查网络后重试。';
  }
  if (/rate limit/i.test(message)) {
    return '尝试次数过多，请稍后再试。';
  }

  return message || '操作失败，请稍后再试。';
}
