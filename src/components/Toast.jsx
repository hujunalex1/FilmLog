import { CheckIcon, CloseIcon } from './Icons';

export default function Toast({ toast, onDismiss }) {
  if (!toast) return null;

  const isWarning =
    toast.tone === 'warning' ||
    toast.tone === 'error' ||
    /未登录|无法|失败|请先登录/i.test(toast.message);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[100] flex items-center justify-center p-4 overscroll-contain"
      role="presentation"
    >
      <div
        key={toast.id}
        role="status"
        aria-live="polite"
        className="pointer-events-auto animate-toast-center flex max-w-[min(520px,calc(100vw-32px))] items-center gap-3.5 border border-hairline bg-panel px-5 py-3.5 text-[12.5px] font-medium text-hi shadow-[0_24px_60px_rgba(0,0,0,0.88)]"
      >
        <span
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
            isWarning
              ? 'bg-[#d58b7e]/20 text-[#e06c58]'
              : 'bg-accent text-accent-ink'
          }`}
          aria-hidden="true"
        >
          {isWarning ? '!' : <CheckIcon className="h-3.5 w-3.5" />}
        </span>

        <span className="min-w-0 leading-snug">{toast.message}</span>

        {toast.action && (
          <button
            type="button"
            onClick={() => {
              onDismiss();
              toast.action.onClick?.();
            }}
            className="focus-ring shrink-0 bg-accent px-3 py-1 text-[11px] font-bold text-accent-ink transition-colors hover:bg-[#c18f50] active:scale-95"
          >
            {toast.action.label}
          </button>
        )}

        <button
          type="button"
          onClick={onDismiss}
          className="focus-ring -mr-1 ml-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-low transition-colors hover:bg-white/5 hover:text-hi"
          aria-label="关闭提示"
        >
          <CloseIcon className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
