import { useEffect, useState } from 'react';
import { ArrowUpIcon } from './Icons';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 480);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="focus-ring fixed bottom-6 right-6 z-30 flex h-10 w-10 items-center justify-center rounded-full border border-hairline bg-panel text-mid shadow-[0_8px_24px_rgba(0,0,0,0.65)] transition-all duration-200 hover:border-hi/30 hover:text-hi active:scale-95"
      aria-label="返回页面顶部"
      title="返回顶部"
    >
      <ArrowUpIcon className="h-4 w-4" />
    </button>
  );
}
