'use client';

import { useState } from 'react';

export default function ShareButton() {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const pageUrl = typeof window !== 'undefined' ? window.location.href : '';

    if (!pageUrl) return;

    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleShare}
        className="flex items-center gap-2 border border-outline-variant bg-white px-4 py-2 text-on-surface transition-colors hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
      >
        <span className="material-symbols-outlined">share</span>
        <span className="text-[11px] font-bold uppercase tracking-[0.05em]">
          Share
        </span>
      </button>

      {copied && (
        <span className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded bg-slate-900 px-3 py-1 text-xs font-medium text-white shadow-lg dark:bg-slate-100 dark:text-slate-900">
          Link copied to clipboard
        </span>
      )}
    </div>
  );
}
