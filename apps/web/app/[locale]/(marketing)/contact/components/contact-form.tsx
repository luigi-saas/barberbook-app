'use client';

import { cn } from '@repo/design-system/lib/utils';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { contact } from '../actions/contact';

export function ContactForm() {
  const t = useTranslations('web.contact');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const valid = name.trim().length >= 2 && /.+@.+\..+/.test(email) && message.trim().length >= 5;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!valid || sending) return;
    setSending(true);
    setError(null);
    const result = await contact(name.trim(), email.trim(), message.trim());
    if (result.error) {
      setError(result.error);
      setSending(false);
      return;
    }
    setSent(true);
    setSending(false);
  };

  const inputClass =
    'w-full rounded-2xl border-2 border-bb-cream-border bg-white px-4 py-3.5 font-sans text-sm text-bb-espresso placeholder:text-bb-on-surface-muted/50 transition focus:border-bb-espresso-gold focus:outline-none';

  if (sent) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-4 rounded-[1.75rem] border border-bb-success/20 bg-bb-success/5 p-10 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-bb-success/10">
          <span
            className="material-symbols-outlined text-3xl text-bb-success"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            check_circle
          </span>
        </div>
        <h2 className="font-display text-2xl font-bold text-bb-espresso">{t('successTitle')}</h2>
        <p className="text-sm text-bb-on-surface-muted">{t('successText')}</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold text-bb-espresso">{t('name')}</span>
        <input
          className={inputClass}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          minLength={2}
          autoComplete="name"
        />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold text-bb-espresso">{t('email')}</span>
        <input
          className={inputClass}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold text-bb-espresso">{t('message')}</span>
        <textarea
          className={cn(inputClass, 'min-h-[140px] resize-none')}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          minLength={5}
          maxLength={2000}
        />
      </label>

      {error && (
        <p className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-xs font-bold text-red-600">
          {t('errorTitle')} — {error}
        </p>
      )}

      <button
        type="submit"
        disabled={!valid || sending}
        className={cn(
          'mt-2 w-full rounded-2xl py-4 font-bold transition',
          valid && !sending
            ? 'bg-bb-espresso-gold text-white shadow-[0_8px_20px_-8px_rgba(119,90,25,0.45)] hover:bg-bb-espresso-gold-deep'
            : 'cursor-not-allowed bg-bb-cream-border text-bb-on-surface-muted',
        )}
      >
        {sending ? t('sending') : t('send')}
      </button>
    </form>
  );
}
