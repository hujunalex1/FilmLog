export function formatLongDate(dateString) {
  if (!dateString) return '';
  const date = new Date(`${dateString}T12:00:00`);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('zh-CN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function formatShortDate(dateString) {
  if (!dateString) return '';
  const date = new Date(`${dateString}T12:00:00`);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('zh-CN', {
    day: 'numeric',
    month: 'long',
  }).format(date);
}

export function getWatchedYear(entry) {
  if (!entry) return 0;
  if (entry.watchedAt) {
    const year = Number(String(entry.watchedAt).slice(0, 4));
    if (Number.isFinite(year)) return year;
  }
  const year = Number(entry.watchedYear);
  return Number.isFinite(year) ? year : 0;
}

export function formatWatchedWhen(entry, { short = false } = {}) {
  if (!entry) return '';
  if (entry.watchedAt) {
    return short ? formatShortDate(entry.watchedAt) : formatLongDate(entry.watchedAt);
  }
  if (entry.watchedYear) return `${entry.watchedYear} 年`;
  return '';
}

export function formatAverage(value) {
  if (!Number.isFinite(value) || value <= 0) return '—';
  return value.toFixed(1);
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function createId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `entry-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function computeStats(entries) {
  const watched = entries.filter((entry) => entry.status === 'watched');
  const rated = watched.filter((entry) => Number(entry.rating) > 0);
  const currentYear = new Date().getFullYear();
  const thisYear = watched.filter((entry) => getWatchedYear(entry) === currentYear);

  return {
    watched: watched.length,
    watchlist: entries.filter((entry) => entry.status === 'watchlist').length,
    favorites: entries.filter((entry) => entry.favorite).length,
    averageRating:
      rated.length > 0
        ? rated.reduce((total, entry) => total + Number(entry.rating), 0) /
          rated.length
        : 0,
    thisYear: thisYear.length,
  };
}

export function filterEntries(entries, activeFilter, query, activeView) {
  let result = entries;

  if (activeView === 'watchlist' || activeFilter === 'watchlist') {
    result = result.filter((entry) => entry.status === 'watchlist');
  } else if (activeFilter === 'watched') {
    result = result.filter((entry) => entry.status === 'watched');
  } else if (activeFilter === 'favorites') {
    result = result.filter((entry) => entry.favorite);
  }

  const trimmed = query.trim().toLowerCase();
  if (trimmed) {
    result = result.filter((entry) =>
      [
        entry.title,
        entry.director,
        entry.year,
        entry.watchedYear,
        entry.note,
        entry.synopsis,
        ...(entry.genres ?? []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(trimmed),
    );
  }

  return result;
}

export function sortEntries(entries, sortBy) {
  const copy = [...entries];
  if (sortBy === 'rating') {
    return copy.sort(
      (a, b) =>
        Number(b.rating) - Number(a.rating) ||
        a.title.localeCompare(b.title, 'zh-CN'),
    );
  }
  if (sortBy === 'title') {
    return copy.sort((a, b) => a.title.localeCompare(b.title, 'zh-CN'));
  }
  return copy.sort((a, b) => {
    const aWatched = a.status === 'watched';
    const bWatched = b.status === 'watched';
    if (aWatched !== bWatched) return aWatched ? -1 : 1;

    if (!aWatched) {
      return String(b.addedAt || '').localeCompare(String(a.addedAt || ''));
    }

    const aYear = getWatchedYear(a);
    const bYear = getWatchedYear(b);
    if (aYear !== bYear) return bYear - aYear;

    // Within the same year, exact watch dates come before year-only records.
    return String(b.watchedAt || '').localeCompare(String(a.watchedAt || ''));
  });
}

