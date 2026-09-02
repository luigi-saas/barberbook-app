'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

export function CopyReference({ reference }: { reference: string }) {
  const t = useTranslations('web.guest.booking');
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`#BB-${reference}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable (permissions/insecure context) — silently ignore.
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-bb-cream-border bg-white px-4 py-1.5 text-xs font-semibold text-bb-espresso transition hover:bg-bb-cream"
    >
      <span className="material-symbols-outlined text-[14px]">
        {copied ? 'check' : 'content_copy'}
      </span>
      {copied ? t('ref.copied') : t('ref.copy')}
    </button>
  );
}
