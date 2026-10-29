import { useEffect, useRef, useState } from 'react';
import { MoreIcon } from './Icons';

export default function EntryMenu({ title, items, buttonClassName = '' }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const handlePointerDown = (event) => {
      if (
        !triggerRef.current?.contains(event.target) &&
        !menuRef.current?.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    const handleFocusOut = (event) => {
      if (
        !triggerRef.current?.contains(event.relatedTarget) &&
        !menuRef.current?.contains(event.relatedTarget)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('focusout', handleFocusOut);

    const focusTimer = window.setTimeout(() => {
      menuRef.current?.querySelector('[role="menuitem"]')?.focus();
    }, 10);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('focusout', handleFocusOut);
    };
  }, [open]);

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        className={`focus-ring flex h-7 w-7 items-center justify-center rounded-full text-low transition-colors duration-250 hover:bg-white/5 hover:text-hi ${buttonClassName}`}
        aria-label={`更多操作：${title}`}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <MoreIcon className="h-4 w-4" />
      </button>

      {open && (
        <div
          ref={menuRef}
          role="menu"
          className="absolute right-0 top-8 z-40 w-[196px] overflow-hidden border border-hairline bg-elevated py-1 shadow-[0_12px_28px_-6px_rgba(0,0,0,0.75)]"
        >
          {items.map((item, index) => (
            <div key={item.label}>
              {item.separator && index > 0 && (
                <div className="my-1 h-px bg-hairline" />
              )}
              <button
                type="button"
                role="menuitem"
                className={`focus-ring flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-[12.5px] font-medium transition-colors duration-150 ${
                  item.danger
                    ? 'text-[#d58b7e] hover:bg-[#d58b7e]/10'
                    : 'text-mid hover:bg-white/5 hover:text-hi'
                }`}
                onClick={() => {
                  setOpen(false);
                  item.onSelect?.();
                }}
              >
                {item.icon && <item.icon className="h-4 w-4 shrink-0" />}
                {item.label}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
