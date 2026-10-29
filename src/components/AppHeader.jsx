import { DataTransferIcon, LogoMark, PlusIcon } from './Icons';
import { brand, navItems } from '../data/content';

export default function AppHeader({
  activeView,
  onNavigate,
  onLogFilm,
  onOpenData,
  onOpenAccount,
  user,
  cloudStatus,
}) {
  const cloudDot =
    cloudStatus === 'synced'
      ? 'bg-[#7f9b72]'
      : cloudStatus === 'loading' || cloudStatus === 'syncing'
        ? 'bg-accent'
        : cloudStatus === 'error'
          ? 'bg-[#d58b7e]'
          : 'bg-low';
  return (
    <header className="sticky top-0 z-30 border-b border-hairline bg-canvas">
      <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-5 px-5 py-4 md:px-8 lg:px-[34px]">
        <button
          type="button"
          onClick={() => onNavigate('journal')}
          className="focus-ring group flex shrink-0 items-center gap-2.5 rounded-sm"
          aria-label={`${brand.name} — 返回观影手记`}
        >
          <LogoMark className="h-[26px] w-[26px] text-accent transition-colors duration-300 group-hover:text-[#c18f50]" />
          <span className="text-[19px] font-bold tracking-[-0.02em] text-hi">
            {brand.name}
            <span className="text-accent">.</span>
          </span>
        </button>

        <nav className="hidden items-center gap-7 md:flex" aria-label="主导航">
          {navItems.map((item) => {
            const active = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`focus-ring relative py-2 text-[11.5px] font-semibold tracking-[.14em] transition-colors duration-250 ${
                  active ? 'text-hi' : 'text-low hover:text-mid'
                }`}
                aria-current={active ? 'page' : undefined}
              >
                {item.label}
                <span
                  className={`absolute inset-x-0 -bottom-0.5 h-[2px] bg-accent transition-opacity duration-250 ${
                    active ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              </button>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2.5 sm:gap-4">
          <button
            type="button"
            onClick={onOpenData}
            className="focus-ring inline-flex h-9 items-center justify-center gap-1.5 border border-hairline px-2 text-low transition-colors duration-200 hover:border-hi/20 hover:text-hi"
            aria-label="导入或导出数据"
            title="导入 / 导出数据"
          >
            <DataTransferIcon className="h-4 w-4" />
            <span className="hidden text-[10px] font-semibold tracking-[.08em] lg:inline">
              数据
            </span>
          </button>

          <button
            type="button"
            onClick={onLogFilm}
            className="focus-ring inline-flex items-center gap-2 bg-accent px-3 py-2.5 text-[11px] font-bold tracking-[.12em] text-accent-ink transition-[background-color,transform] duration-250 hover:bg-[#c18f50] active:scale-[.98] sm:px-4"
            aria-label="记录一部电影"
          >
            <PlusIcon className="h-4 w-4" />
            <span className="hidden sm:inline">记录电影</span>
          </button>

          <button
            type="button"
            onClick={onOpenAccount}
            className="focus-ring relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-hairline bg-[linear-gradient(160deg,#3b3c42,#232429)] text-[10px] font-semibold text-mid transition-colors duration-200 hover:border-hi/25 hover:text-hi"
            aria-label={
              user
                ? `账号与云同步：${user.email ?? '已登录'}`
                : '登录以同步云端'
            }
            title={user ? `云同步：${user.email ?? '已登录'}` : '云同步登录'}
          >
            我
            <span
              className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-canvas ${cloudDot}`}
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
    </header>
  );
}
