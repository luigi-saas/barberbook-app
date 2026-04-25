import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { BookingStepper } from '../components/booking-stepper';
import { BookingSessionSidebar } from '../components/booking-session-sidebar';

interface SummaryPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ barber?: string; service?: string; time?: string }>;
}

const SummaryPage = async ({ params, searchParams }: SummaryPageProps) => {
  const { locale } = await params;
  const { barber, service, time } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'web.guest.booking' });

  // Derive display values from query params (in production these come from session/db)
  const barberName = barber === 'any' ? t('anyAvailableTitle') : barber === 'yassine' ? 'Yassine El Mansouri' : barber === 'mehdi' ? 'Mehdi Benali' : 'Omar Tahiri';
  const barberAvatar = barber === 'yassine'
    ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&q=80'
    : barber === 'mehdi'
      ? 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&q=80'
      : undefined;

  const serviceMap: Record<string, { name: string; duration: string; tier: string; price: string }> = {
    c1: { name: 'Signature Royal Cut', duration: '45 min', tier: 'Premium Service', price: '250 MAD' },
    c2: { name: 'Classic Cut & Style', duration: '30 min', tier: 'Classic Service', price: '150 MAD' },
    b1: { name: 'Royal Beard Grooming', duration: '45 min', tier: 'Premium Service', price: '450 MAD' },
    b2: { name: 'Traditional Shave', duration: '30 min', tier: 'Classic Service', price: '200 MAD' },
    s1: { name: 'Argan Facial Ritual', duration: '60 min', tier: 'Spa Service', price: '350 MAD' },
    r1: { name: 'Full Grooming Ritual', duration: '90 min', tier: 'Signature Experience', price: '650 MAD' },
  };
  const selectedService = service ? serviceMap[service] : undefined;

  return (
    <main className="min-h-screen bg-bb-cream">
      <div className="mx-auto max-w-screen-xl px-6 pt-12 pb-20">
        {/* Stepper */}
        <div className="mb-12">
          <BookingStepper currentStep={4} />
        </div>

        {/* Two-column content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: header */}
          <div className="flex-1 space-y-8">
            <div className="flex flex-col gap-1">
              <h1 className="font-display text-4xl font-extrabold tracking-tight text-bb-espresso">
                {t('summary.title')}
              </h1>
              <p className="text-bb-on-surface-muted max-w-xl font-sans text-sm">
                {t('summary.subtitle')}
              </p>
            </div>

            {/* Booking receipt card */}
            <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-bb-cream-border">
              {/* Header strip */}
              <div className="bg-bb-espresso px-8 py-6">
                <p className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-bb-cream/50 mb-1">
                  {t('summary.receiptLabel')}
                </p>
                <p className="font-display text-2xl font-bold text-bb-cream">
                  BarberBook.ma
                </p>
              </div>

              {/* Detail rows */}
              <div className="px-8 py-6 flex flex-col gap-5">
                {/* Service */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-bb-gold-muted flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-bb-espresso-gold text-xl">spa</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-bb-on-surface-muted uppercase tracking-widest">
                      {t('sidebar.serviceLabel')}
                    </p>
                    <p className="font-bold text-bb-espresso">
                      {selectedService?.name ?? '—'}
                    </p>
                    {selectedService && (
                      <p className="text-xs text-bb-on-surface-muted">
                        {selectedService.duration} · {selectedService.tier}
                      </p>
                    )}
                  </div>
                </div>

                {/* Barber */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-bb-gold-muted flex items-center justify-center shrink-0 overflow-hidden">
                    {barberAvatar ? (
                      <img src={barberAvatar} alt={barberName} className="w-full h-full object-cover" />
                    ) : (
                      <span className="material-symbols-outlined text-bb-espresso-gold text-xl">person</span>
                    )}
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-bb-on-surface-muted uppercase tracking-widest">
                      {t('sidebar.barberLabel')}
                    </p>
                    <p className="font-bold text-bb-espresso">{barberName || '—'}</p>
                    <p className="text-xs text-bb-success font-medium">{t('sidebar.topRated')}</p>
                  </div>
                </div>

                {/* Time */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-bb-espresso-gold flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-white text-xl">schedule</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-bb-espresso-gold uppercase tracking-widest">
                      {t('sidebar.timeLabel')}
                    </p>
                    <p className="font-bold text-bb-espresso-gold">{time ?? '—'}</p>
                  </div>
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-bb-cream-border px-8 py-6 flex items-center justify-between">
                <div>
                  <p className="font-sans text-sm font-semibold text-bb-on-surface-muted">
                    {t('sidebar.total')}
                  </p>
                  <p className="text-xs text-bb-on-surface-muted/60 italic">{t('sidebar.vat')}</p>
                </div>
                <span className="font-display text-3xl font-black text-bb-espresso-gold">
                  {selectedService?.price ?? '— MAD'}
                </span>
              </div>
            </div>
          </div>

          {/* Right sidebar — auth gate */}
          <aside className="w-full lg:w-[400px]">
            <div className="sticky top-28 space-y-6">
              <div className="bg-white rounded-[2.5rem] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-bb-cream-border">
                <h3 className="font-display text-2xl font-black uppercase tracking-tight text-bb-espresso mb-6">
                  {t('sidebar.title')}
                </h3>

                {/* Summary rows — static review */}
                <div className="space-y-5 mb-8">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-bb-gold-muted flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-bb-espresso-gold">spa</span>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-bb-on-surface-muted uppercase tracking-widest">
                        {t('sidebar.serviceLabel')}
                      </p>
                      <h4 className="font-bold text-bb-espresso">{selectedService?.name ?? '—'}</h4>
                      {selectedService && (
                        <p className="text-xs text-bb-on-surface-muted">
                          {selectedService.duration} · {selectedService.tier}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-bb-gold-muted flex items-center justify-center shrink-0 overflow-hidden">
                      {barberAvatar ? (
                        <img src={barberAvatar} alt={barberName} className="w-full h-full object-cover" />
                      ) : (
                        <span className="material-symbols-outlined text-bb-espresso-gold">person</span>
                      )}
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-bb-on-surface-muted uppercase tracking-widest">
                        {t('sidebar.barberLabel')}
                      </p>
                      <h4 className="font-bold text-bb-espresso">{barberName || '—'}</h4>
                      <p className="text-xs text-bb-success font-medium">{t('sidebar.topRated')}</p>
                    </div>
                  </div>

                  <div className="flex gap-4 p-4 rounded-2xl bg-bb-gold-muted/30 border border-bb-espresso-gold/20">
                    <div className="w-10 h-10 rounded-xl bg-bb-espresso-gold flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-white text-xl">schedule</span>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-bb-espresso-gold uppercase tracking-widest">
                        {t('sidebar.timeLabel')}
                      </p>
                      <h4 className="font-bold text-bb-espresso-gold">{time ?? '—'}</h4>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="my-6 h-[2px] bg-bb-surface-elevated" />

                {/* Total */}
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <p className="text-sm font-semibold text-bb-on-surface-muted">{t('sidebar.total')}</p>
                    <p className="text-xs text-bb-on-surface-muted/60 italic">{t('sidebar.vat')}</p>
                  </div>
                  <span className="text-3xl font-black text-bb-espresso-gold">
                    {selectedService?.price ?? '— MAD'}
                  </span>
                </div>

                {/* Auth CTA */}
                <div className="space-y-4">
                  <div className="bg-bb-gold-muted/20 border border-bb-espresso-gold/20 rounded-2xl p-5 text-center">
                    <p className="text-sm font-medium text-bb-on-surface-muted mb-3">
                      {t('summary.authPrompt')}
                    </p>
                    <Link
                      href={`/${locale}/sign-in`}
                      className="w-full py-4 bg-bb-espresso-gold text-white rounded-2xl font-bold text-lg hover:scale-[0.98] transition-transform shadow-xl shadow-bb-gold/20 flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-xl">login</span>
                      {t('summary.signInToConfirm')}
                    </Link>
                    <p className="mt-3 text-[11px] text-bb-on-surface-muted">
                      {t('summary.noAccount')}{' '}
                      <Link href={`/${locale}/sign-up`} className="text-bb-espresso-gold font-bold underline">
                        {t('summary.signUpHere')}
                      </Link>
                    </p>
                  </div>

                  <div className="relative flex items-center">
                    <div className="flex-grow border-t border-bb-cream-border" />
                    <span className="flex-shrink mx-4 text-xs font-bold text-bb-on-surface-muted uppercase">
                      {t('summary.or')}
                    </span>
                    <div className="flex-grow border-t border-bb-cream-border" />
                  </div>

                  <Link
                    href={`/${locale}/booking/confirm`}
                    className="w-full py-4 border-2 border-bb-espresso-gold/20 text-bb-espresso-gold rounded-2xl font-bold hover:bg-bb-gold-muted/20 transition-all group flex items-center justify-center gap-2"
                  >
                    {t('summary.continueAsGuest')}
                    <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </Link>
                </div>

                <p className="mt-6 text-[10px] text-center text-bb-on-surface-muted/60 leading-relaxed px-4">
                  {t('termsPrefix')}{' '}
                  <a href="#" className="underline">{t('termsLink')}</a>{' '}
                  {t('cancellationSuffix')}
                </p>
              </div>

              {/* Flexibility policy */}
              <div className="p-6 bg-bb-success/5 rounded-3xl border border-bb-success/10 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-bb-success/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span
                    className="material-symbols-outlined text-bb-success text-xl"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    info
                  </span>
                </div>
                <div>
                  <h5 className="font-bold text-sm text-bb-success">{t('flexibilityPolicyTitle')}</h5>
                  <p className="text-xs text-bb-on-surface-muted mt-1 leading-relaxed">
                    {t('flexibilityPolicyText')}
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default SummaryPage;
