import { CloseIcon, TrashIcon } from './Icons';
import { resolveEntryCover } from '../data/covers';
import ArtworkPlaceholder from './ArtworkPlaceholder';
import { useDialogBehavior } from '../hooks/useDialogBehavior';

export default function ConfirmDialog({
  title = '确认删除',
  description = '此操作不可撤销。该电影记录及相关的短评、评分等数据将被永久删除。',
  confirmLabel = '删除记录',
  cancelLabel = '取消',
  danger = true,
  entry = null,
  onConfirm,
  onClose,
}) {
  const dialogRef = useDialogBehavior({ open: true, onClose });
  const artwork = entry ? resolveEntryCover(entry) : null;

  return (
    <div
      className="animate-scrim-in fixed inset-0 z-50 flex items-center justify-center p-4 bg-[rgba(6,6,8,0.78)] overscroll-contain"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-desc"
        className="animate-modal-in relative w-full max-w-[440px] border border-hairline bg-panel p-6 shadow-[0_24px_50px_rgba(0,0,0,0.85)] outline-none"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full ${
                danger
                  ? 'bg-[#d58b7e]/15 text-[#d58b7e]'
                  : 'bg-accent/15 text-accent'
              }`}
            >
              <TrashIcon className="h-3.5 w-3.5" />
            </span>
            <span
              className={`text-[10.5px] font-bold tracking-[.14em] uppercase ${
                danger ? 'text-[#d58b7e]' : 'text-accent'
              }`}
            >
              {title}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="focus-ring flex h-7 w-7 items-center justify-center rounded-full text-low transition-colors duration-200 hover:bg-white/5 hover:text-hi"
            aria-label="关闭"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>

        <h3
          id="confirm-dialog-title"
          className="mt-4 text-[17px] font-semibold leading-snug tracking-[-0.01em] text-hi"
        >
          {entry ? (
            <>
              确定要从手记中删除《
              <span className="text-[#fbf8f1]">{entry.title}</span>》吗？
            </>
          ) : (
            title
          )}
        </h3>

        {entry && (
          <div className="mt-4 flex items-center gap-3.5 border border-hairline bg-canvas/70 p-2.5">
            <div className="relative aspect-[16/9] w-20 shrink-0 overflow-hidden bg-thumb">
              {artwork?.still ? (
                <img
                  src={artwork.still}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <ArtworkPlaceholder title={entry.title} variant="card" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold text-hi">
                {entry.title}
              </p>
              <p className="mt-0.5 truncate text-[11px] text-low">
                {[entry.year, entry.director].filter(Boolean).join(' · ') ||
                  '未注明导演/年份'}
              </p>
              {entry.status === 'watched' && Number(entry.rating) > 0 && (
                <p className="mt-0.5 text-[10px] font-semibold text-accent">
                  ★ {Number(entry.rating).toFixed(1)} 分
                </p>
              )}
            </div>
          </div>
        )}

        <p
          id="confirm-dialog-desc"
          className="mt-3.5 text-[12.5px] leading-[1.65] text-mid"
        >
          {description}
        </p>

        <div className="mt-6 flex items-center justify-end gap-3 pt-2">
          <button
            data-autofocus
            type="button"
            onClick={onClose}
            className="focus-ring border border-hairline px-4 py-2.5 text-[11.5px] font-semibold tracking-[.06em] text-mid transition-colors duration-200 hover:border-hi/25 hover:text-hi"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`focus-ring inline-flex items-center gap-2 px-4 py-2.5 text-[11.5px] font-bold tracking-[.06em] text-white transition-all duration-200 active:scale-[.98] ${
              danger
                ? 'bg-[#a83a2d] shadow-[0_2px_12px_rgba(168,58,45,0.35)] hover:bg-[#bd4335]'
                : 'bg-accent text-accent-ink hover:bg-[#c18f50]'
            }`}
          >
            {danger && <TrashIcon className="h-3.5 w-3.5" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
