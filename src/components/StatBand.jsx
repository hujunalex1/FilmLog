import { StarIcon } from './Icons';
import { formatAverage } from '../lib/format';

export default function StatBand({ stats }) {
  const items = [
    {
      label: '已看',
      value: String(stats.watched).padStart(2, '0'),
      detail: '手记里的电影',
    },
    {
      label: '今年',
      value: String(stats.thisYear).padStart(2, '0'),
      detail: '今年看过',
    },
    {
      label: '平均评分',
      value: formatAverage(stats.averageRating),
      detail: '仅统计已评分',
      icon: true,
    },
    {
      label: '待看',
      value: String(stats.watchlist).padStart(2, '0'),
      detail: '等待入场',
    },
  ];

  return (
    <section id="stats" className="scroll-mt-24 border-b border-hairline" aria-label="观影统计">
      <div className="mx-auto grid max-w-[1500px] grid-cols-2 md:grid-cols-4">
        {items.map((item, index) => (
          <div
            key={item.label}
            className={[
              'px-5 py-7 md:px-7 lg:px-9',
              index % 2 === 1 ? 'border-l border-hairline' : '',
              index >= 2 ? 'border-t border-hairline md:border-t-0' : '',
              index > 0 ? 'md:border-l md:border-hairline' : '',
            ].join(' ')}
          >
            <p className="text-[9.5px] font-bold tracking-[.18em] text-low">
              {item.label}
            </p>
            {/* deslop-ignore-next-line 07 */}
            <p className="mt-2 flex items-baseline gap-1.5 font-serif text-[42px] leading-none tracking-[-.02em] text-hi">
              {item.value}
              {item.icon && (
                <StarIcon filled className="mb-1.5 h-3.5 w-3.5 text-accent" />
              )}
            </p>
            <p className="mt-2 text-[10px] tracking-[.03em] text-low">
              {item.detail}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
