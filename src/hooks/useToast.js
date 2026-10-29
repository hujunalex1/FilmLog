import { useCallback, useEffect, useRef, useState } from 'react';

export function useToast() {
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);

  const dismiss = useCallback(() => {
    window.clearTimeout(timerRef.current);
    setToast(null);
  }, []);

  const showToast = useCallback((message, options = {}) => {
    window.clearTimeout(timerRef.current);
    const opts = typeof options === 'string' ? { tone: options } : options;
    const duration = opts.duration ?? (opts.action ? 4200 : 3200);
    setToast({
      id: Date.now(),
      message,
      tone: opts.tone || 'default',
      action: opts.action,
    });
    timerRef.current = window.setTimeout(() => setToast(null), duration);
  }, []);

  useEffect(
    () => () => {
      window.clearTimeout(timerRef.current);
    },
    [],
  );

  return { toast, showToast, dismissToast: dismiss };
}
