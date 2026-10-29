import { CloudIcon, DataTransferIcon, LogoMark, ArrowUpRightIcon } from './Icons';
import { brand } from '../data/content';

export default function Footer({ onOpenData, onOpenAccount, user }) {
  return (
    <footer id="about" className="border-t border-hairline">
      <div className="mx-auto max-w-[1500px] px-5 py-10 md:px-8 lg:px-[34px]">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <LogoMark className="h-6 w-6 text-accent" />
              <span className="text-[17px] font-bold tracking-[-0.02em] text-hi">
                {brand.name}
                <span className="text-accent">.</span>
              </span>
            </div>
            <p className="mt-3 max-w-[44ch] text-[11.5px] leading-[1.6] text-low">
              一本私人观影手记。登录后可同步到 Supabase；未登录时记录保存在这台设备的浏览器里，缺少剧照的条目会使用文字占位画面。
            </p>
          </div>

          <div className="flex flex-col items-start gap-4 md:items-end">
            <p className="text-[9px] font-bold tracking-[.13em] text-low">
              {brand.tagline} · 第 04 卷
            </p>
            <div className="flex flex-wrap items-center gap-5">
              <p className="text-[10px] text-low">由 React 与 Tailwind CSS 构建</p>
              <button
                type="button"
                onClick={onOpenAccount}
                className="focus-ring inline-flex items-center gap-1.5 text-[9px] font-semibold tracking-[.1em] text-mid transition-colors duration-200 hover:text-hi"
              >
                <CloudIcon className="h-3 w-3" />
                云同步
              </button>
              <button
                type="button"
                onClick={onOpenData}
                className="focus-ring inline-flex items-center gap-1.5 text-[9px] font-semibold tracking-[.1em] text-mid transition-colors duration-200 hover:text-hi"
              >
                <DataTransferIcon className="h-3 w-3" />
                导入 / 导出
              </button>
              <button
                type="button"
                onClick={() =>
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }
                className="focus-ring inline-flex items-center gap-1.5 text-[9px] font-semibold tracking-[.1em] text-mid transition-colors duration-200 hover:text-hi"
              >
                返回顶部
                <ArrowUpRightIcon className="h-3 w-3 -rotate-45" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-hairline pt-5">
          <p className="text-[9px] tracking-[.1em] text-low">
            © 2026 Motif — 学习项目 {/* deslop-ignore 15 */}
          </p>
          <p className="text-[9px] tracking-[.1em] text-low">
            {user ? '本地缓存 + Supabase 云同步' : '未登录时仅保存在浏览器本地'}
          </p>
        </div>
      </div>
    </footer>
  );
}
