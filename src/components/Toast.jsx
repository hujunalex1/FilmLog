import { CheckIcon, CloseIcon } from './Icons';

export default function Toast({ toast, onDismiss }) {
  if (!toast) return null;

  return (
    <div
      key={toast.id}
      role="status"
      aria-live="polite"
      className="animate-toast-in fixed bottom-6 left-1/2 z-[70] flex w-max max-w-[calc(100vw-32px)] -translate-x-1/2 items-center gap-3 border border-hairline bg-elevated px-4 py-3 text-[12px] font-medium text-hi shadow-[0_10px_24px_-6px_rgba(0,0,0,0.7)]"
    >
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-accent-ink">
        <CheckIcon className="h-3.5 w-3.5" />
      </span>
      <span className="min-w-0">{toast.message}</span>
      <button
        type="button"
        onClick={onDismiss}
        className="focus-ring -mr-1 ml-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-low transition-colors hover:bg-white/5 hover:text-hi"
        aria-label="关闭提示"
      >
        <CloseIcon className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
