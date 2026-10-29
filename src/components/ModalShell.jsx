import { useId } from 'react';
import { CloseIcon } from './Icons';
import { useDialogBehavior } from '../hooks/useDialogBehavior';

const widths = {
  sm: 'max-w-[560px]',
  md: 'max-w-[760px]',
  lg: 'max-w-[900px]',
};

export default function ModalShell({
  title,
  onClose,
  size = 'md',
  children,
  describedBy,
}) {
  const dialogRef = useDialogBehavior({ open: true, onClose });
  const generatedId = useId();
  const titleId = `modal-title-${generatedId}`;

  return (
    <div
      className="animate-scrim-in fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-[rgba(6,6,8,.72)]"
      role="presentation"
    >
      <div
        className="flex min-h-full items-start justify-center px-0 py-0 sm:px-8 sm:py-[26px] lg:px-24"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) onClose();
        }}
      >
        <section
          ref={dialogRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={describedBy}
          className={`animate-modal-in relative flex max-h-[100dvh] w-full ${widths[size] ?? widths.md} flex-col overflow-hidden bg-panel shadow-modal outline-none sm:max-h-[calc(100dvh-52px)]`}
        >
          <header className="relative z-20 flex shrink-0 items-center justify-center bg-accent px-16 py-5">
            <div className="min-w-0 text-center">
              <h2
                id={titleId}
                className="truncate text-[13px] font-bold tracking-[.14em] text-accent-ink"
              >
                {title}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="focus-ring focus-ring-ink absolute right-[22px] top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-accent-ink transition-[background-color,transform] duration-250 ease-expo hover:bg-accent-ink/10 active:scale-[.94]"
              aria-label="关闭弹窗"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
            {children}
          </div>
        </section>
      </div>
    </div>
  );
}
