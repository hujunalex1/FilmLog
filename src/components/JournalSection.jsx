import { useEffect, useState } from 'react';
import EmptyState from './EmptyState';
import EntryCard from './EntryCard';
import JournalToolbar from './JournalToolbar';
import { HeartIcon, SearchIcon } from './Icons';

const PAGE_SIZE = 16;

export default function JournalSection({
  heading,
  entries,
  totalCount,
  query,
  onQueryChange,
  activeFilter,
  onFilterChange,
  sortBy,
  onSortChange,
  activeView,
  onOpen,
  onEdit,
  onToggleFavorite,
  onToggleStatus,
  onDelete,
  onLogFilm,
  onResetFilters,
}) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const hasEntries = entries.length > 0;
  const shownEntries = entries.slice(0, visibleCount);
  const hasMore = entries.length > visibleCount;

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [query, activeFilter, activeView, sortBy]);

  const emptyCopy = query
    ? {
        title: '没有找到相关记录',
        description:
          '换个片名、导演，或短评里的关键词试试。其余记录还在。',
        actionLabel: '清除搜索',
        onAction: () => onQueryChange(''),
        icon: SearchIcon,
      }
    : activeFilter === 'favorites'
      ? {
          title: '还没有电影住进心里',
          description:
            '在任意记录上点一下心形，就能把想再看一遍的电影留在这里。',
          actionLabel: '浏览全部记录',
          onAction: onResetFilters,
          icon: HeartIcon,
        }
      : activeFilter === 'watchlist' || activeView === 'watchlist'
        ? {
            title: '暂时没有等你的电影',
            description:
              '把想看的电影先放进来，它会在合适的时候提醒你。',
            actionLabel: '记录一部电影',
            onAction: onLogFilm,
            icon: HeartIcon,
          }
        : activeFilter === 'watched'
          ? {
              title: '手记的第一页还是空白',
              description:
                '从你记得的第一部电影开始，把这本手记写下去。',
              actionLabel: '记录第一部电影',
              onAction: onLogFilm,
              icon: HeartIcon,
            }
          : {
              title: '你的第一个镜头，写在这里',
              description:
                '留下一部电影、一次评分，和一句想记住的话。所有内容只保存在本机。',
              actionLabel: '记录第一部电影',
              onAction: onLogFilm,
              icon: HeartIcon,
            };

  return (
    <section
      id="journal"
      className="mx-auto max-w-[1500px] scroll-mt-24 px-5 pb-24 pt-14 md:px-8 lg:px-[34px]"
    >
      <JournalToolbar
        heading={heading}
        query={query}
        onQueryChange={onQueryChange}
        activeFilter={activeFilter}
        onFilterChange={onFilterChange}
        sortBy={sortBy}
        onSortChange={onSortChange}
        resultCount={entries.length}
      />

      {hasEntries ? (
        <div className="mt-9 grid grid-cols-1 gap-x-[26px] gap-y-10 sm:grid-cols-2 sm:gap-y-[52px] xl:grid-cols-4">
          {shownEntries.map((entry, index) => (
            <EntryCard
              key={entry.id}
              entry={entry}
              index={index}
              onOpen={onOpen}
              onEdit={onEdit}
              onToggleFavorite={onToggleFavorite}
              onToggleStatus={onToggleStatus}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        <div className="mt-9">
          <EmptyState {...emptyCopy} />
        </div>
      )}

      {hasMore && (
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
            className="focus-ring inline-flex items-center gap-2 border border-hairline px-5 py-3 text-[10.5px] font-semibold tracking-[.1em] text-mid transition-colors duration-250 hover:border-hi/25 hover:text-hi"
          >
            加载更多
            <span className="text-low">还有 {entries.length - visibleCount} 条</span>
          </button>
        </div>
      )}

      {hasEntries && totalCount > 0 && (
        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-hairline pt-5">
          <p className="text-[9.5px] font-bold uppercase tracking-[.16em] text-low">
            显示 {String(shownEntries.length).padStart(2, '0')} /{' '}
            {String(totalCount).padStart(2, '0')} 条记录
          </p>
          <p className="text-[10px] tracking-[.03em] text-low">
            每部看完的电影，都值得一句话。
          </p>
        </div>
      )}
    </section>
  );
}
