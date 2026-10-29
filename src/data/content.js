import { historyEntries } from './history';

export const brand = {
  name: 'Motif',
  wordmark: 'MOTIF',
  tagline: '私人观影手记',
};

export const navItems = [
  { id: 'journal', label: '手记' },
  { id: 'watchlist', label: '待看' },
  { id: 'stats', label: '统计' },
];

export const hero = {
  // deslop-ignore-next-line 10
  eyebrow: '私人观影手记 · 第 04 卷',
  headline: ['每一帧，', '都算数。'],
  description:
    '把看过的电影、当时的评分，以及想留住的那一句话，安静地收进这里。',
};

export const filters = [
  { id: 'all', label: '全部记录' },
  { id: 'watched', label: '已看' },
  { id: 'watchlist', label: '待看' },
  { id: 'favorites', label: '收藏' },
];

export const sortOptions = [
  { id: 'recent', label: '最近观看' },
  { id: 'rating', label: '评分最高' },
  { id: 'title', label: '标题排序' },
];

export const artworkOptions = [
  { id: 'still-01', src: '/stills/still-01.jpg', label: '暮色海面' },
  { id: 'still-02', src: '/stills/still-02.jpg', label: '图书馆回廊' },
  { id: 'still-03', src: '/stills/still-03.jpg', label: '绿色山谷' },
  { id: 'still-04', src: '/stills/still-04.jpg', label: '夜空' },
  { id: 'still-05', src: '/stills/still-05.jpg', label: '湖畔小屋' },
  { id: 'still-06', src: '/stills/still-06.jpg', label: '石廊' },
  { id: 'still-07', src: '/stills/still-07.jpg', label: '最后一束光' },
  { id: 'still-08', src: '/stills/still-08.jpg', label: '冬日山脊' },
];

// Imported historical viewing records (2018–2026).
export const seedEntries = historyEntries;

// These were the demo records shipped before the journal was emptied.
// They are filtered out of any existing localStorage so they do not reappear.
export const retiredSeedIds = [
  'glass-coast',
  'quiet-inheritance',
  'green-cathedral',
  'night-orchard',
  'lake-house',
  'afterlight',
  'room-of-salt',
  'winter-line',
];

export const emptyEntry = {
  title: '',
  year: new Date().getFullYear(),
  director: '',
  runtime: '',
  genres: '',
  country: '',
  language: '',
  status: 'watched',
  rating: 0,
  watchedAt: new Date().toISOString().slice(0, 10),
  watchedYear: new Date().getFullYear(),
  favorite: false,
  rewatches: 0,
  still: '/stills/still-01.jpg',
  poster: '/posters/poster-01.jpg',
  synopsis: '',
  note: '',
};
