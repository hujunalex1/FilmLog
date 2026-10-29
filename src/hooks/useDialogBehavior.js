import { useEffect, useRef } from 'react';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'button:not([disabled]):not([hidden])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'iframe',
  'object',
  'embed',
  '[contenteditable="true"]',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export function useDialogBehavior({ open, onClose }) {
  const dialogRef = useRef(null);
  const restoreRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return undefined;

    restoreRef.current = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    const focusTimer = window.setTimeout(() => {
      const preferred = dialogRef.current?.querySelector('[data-autofocus]');
      if (preferred instanceof HTMLElement) {
        preferred.focus();
      } else if (dialogRef.current) {
        dialogRef.current.focus();
      }
    }, 60);

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCloseRef.current?.();
        return;
      }

      if (event.key !== 'Tab') return;

      const dialog = dialogRef.current;
      if (!dialog) return;

      const candidates = Array.from(
        dialog.querySelectorAll(FOCUSABLE_SELECTOR),
      ).filter(
        (element) =>
          element.offsetParent !== null &&
          element.getAttribute('aria-hidden') !== 'true' &&
          window.getComputedStyle(element).visibility !== 'hidden',
      );

      if (candidates.length === 0) {
        event.preventDefault();
        dialog.focus();
        return;
      }

      const first = candidates[0];
      const last = candidates[candidates.length - 1];

      if (
        event.shiftKey &&
        (document.activeElement === first || document.activeElement === dialog)
      ) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;

      const restoreTarget = restoreRef.current;
      if (restoreTarget instanceof HTMLElement) {
        window.setTimeout(() => restoreTarget.focus?.(), 0);
      }
    };
  }, [open]);

  return dialogRef;
}
