import { ChevronDownIcon, CloseIcon, SearchIcon } from './Icons';
import { filters, sortOptions } from '../data/content';

export default function JournalToolbar({
  heading,
  query,
  onQueryChange,
  activeFilter,
  onFilterChange,
  sortBy,
  onSortChange,
  resultCount,
}) {
  return (
    <>
      <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span className="h-px w-7 bg-accent" aria-hidden="true" />
            <p className="text-[9.5px] font-bold uppercase tracking-[.2em] text-low">
              观影手记
            </p>
          </div>
          {/* deslop-ignore-next-line 07 */}
          <h2 className="mt-3 font-serif text-[clamp(2.6rem,4.5vw,4rem)] leading-[0.95] tracking-[-0.025em] text-hi">
            {heading}
          </h2>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-low" />
            <input
              type="search"
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="搜索片名、导演、短评或年份"
              aria-label="搜索观影记录"
              className="focus-ring h-10 w-full border border-hairline bg-elevated pl-9 pr-9 text-[12px] text-hi placeholder:text-low/70 transition-colors duration-200 focus:border-accent sm:w-[244px] [&::-webkit-search-cancel-button]:hidden"
            />
            {query && (
              <button
                type="button"
                onClick={() => onQueryChange('')}
                className="focus-ring absolute right-1.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-low transition-colors hover:bg-white/5 hover:text-hi"
                aria-label="清除搜索"
              >
                <CloseIcon className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(event) => onSortChange(event.target.value)}
              aria-label="排序方式"
              className="focus-ring h-10 w-full appearance-none border border-hairline bg-elevated pl-3.5 pr-9 text-[11px] font-medium text-mid transition-colors duration-200 hover:text-hi focus:border-accent sm:w-[190px]"
            >
              {sortOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-low" />
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4 border-b border-hairline">
        <div
          className="-mb-px flex flex-wrap gap-x-5 gap-y-2 sm:flex-nowrap sm:gap-[33px]"
          role="group"
          aria-label="筛选观影记录"
        >
          {filters.map((filter) => {
            const active = activeFilter === filter.id;
            return (
              <button
                key={filter.id}
                type="button"
                aria-pressed={active}
                onClick={() => onFilterChange(filter.id)}
                className={`focus-ring relative shrink-0 whitespace-nowrap pb-3.5 pt-1 text-[12px] font-semibold tracking-[.08em] transition-colors duration-250 sm:text-[13px] ${
                  active ? 'text-hi' : 'text-low hover:text-mid'
                }`}
              >
                {filter.label}
                <span
                  className={`absolute inset-x-0 -bottom-px h-[3px] bg-accent transition-opacity duration-250 ${
                    active ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              </button>
            );
          })}
        </div>

        <p className="hidden shrink-0 pb-3.5 text-[9.5px] font-bold tracking-[.12em] text-low sm:block">
          {String(resultCount).padStart(2, '0')} 条记录
        </p>
      </div>
    </>
  );
}
