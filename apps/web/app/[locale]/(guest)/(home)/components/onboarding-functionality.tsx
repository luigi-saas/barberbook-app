import { useTranslations } from 'next-intl';
import { BellRing, CreditCard, MapPin, Calendar, ChevronRight, Lock } from 'lucide-react';

export function OnboardingFunctionality() {
  const t = useTranslations('web.home.onboarding.functionality');

  return (
    <section className="w-full bg-bb-cream py-32">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-20 px-8">
        {/* Header */}
        <div className="flex flex-col items-center gap-4 text-center">
          <h2 className="font-sans text-[36px] font-bold uppercase leading-10 tracking-[-0.025em] text-bb-espresso">
            {t('title')}
          </h2>
          <p className="font-sans text-lg text-bb-espresso/60">{t('description')}</p>
        </div>

        {/* Bento grid — 6 cols × 2 rows, 680px tall */}
        <div className="grid h-[680px] grid-cols-6 grid-rows-2 gap-8">
          {/* Mirror Calendar — left half, full height */}
          <div className="col-[1/span_3] row-[1/span_2] flex flex-col overflow-hidden rounded-[48px] border border-[rgba(229,222,214,0.5)] bg-white p-px shadow-[0px_12px_40px_0px_rgba(43,20,15,0.05)]">
            {/* Text content */}
            <div className="flex flex-col gap-4 px-12 pt-12">
              <div className="flex size-16 items-center justify-center rounded-full bg-bb-espresso/5">
                <Calendar className="size-5 text-bb-espresso" />
              </div>
              <div className="flex flex-col gap-4 pt-4">
                <h3 className="font-display text-[30px] font-bold leading-9 text-bb-espresso">
                  {t('mirrorCalendarTitle')}
                </h3>
                <p className="max-w-[384px] font-sans text-lg leading-[1.625] text-bb-espresso/60">
                  {t('mirrorCalendarDescription')}
                </p>
              </div>
            </div>
            {/* Inline calendar UI mockup */}
            <div className="mt-auto flex items-end px-8">
              <div className="w-full overflow-hidden rounded-tl-[40px] rounded-tr-[40px] border-l border-r border-t border-[rgba(229,222,214,0.4)] bg-[#fcfaf8] shadow-[0px_-25px_50px_-12px_rgba(0,0,0,0.25)]">
                {/* UI Header */}
                <div className="flex items-center justify-between border-b border-[rgba(229,222,214,0.3)] bg-white px-6 py-6">
                  <div className="flex flex-col gap-1">
                    <span className="font-display text-[10px] font-bold uppercase tracking-[1px] text-bb-espresso/40">
                      Digital Concierge
                    </span>
                    <span className="font-display text-xl font-bold text-bb-espresso">
                      Friday, Oct 24
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex size-8 items-center justify-center rounded-full bg-bb-espresso/5">
                      <ChevronRight className="size-3 rotate-180 text-bb-espresso/40" />
                    </div>
                    <div className="flex size-8 items-center justify-center rounded-full bg-bb-espresso/5">
                      <ChevronRight className="size-3 text-bb-espresso/40" />
                    </div>
                  </div>
                </div>
                {/* Time Slots */}
                <div className="flex flex-col gap-4 p-6">
                  {/* 09:00 — divider row */}
                  <div className="flex items-center gap-4">
                    <span className="w-12 shrink-0 font-display text-xs font-semibold text-bb-espresso/30">
                      09:00
                    </span>
                    <div className="h-px flex-1 bg-[rgba(229,222,214,0.4)]" />
                  </div>
                  {/* 10:00 — available slot */}
                  <div className="flex items-center gap-4">
                    <span className="w-12 shrink-0 font-display text-xs font-semibold text-bb-espresso/30">
                      10:00
                    </span>
                    <div className="flex flex-1 items-center justify-between rounded-full border border-[rgba(153,99,33,0.2)] bg-[rgba(153,99,33,0.05)] px-[17px] py-[13px]">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-display text-[11px] font-bold uppercase tracking-[1.2px] text-bb-espresso-gold">
                          Available Slot
                        </span>
                        <span className="font-display text-sm font-medium text-bb-espresso/70">
                          Master Artisan Ritual
                        </span>
                      </div>
                      <span className="text-xl font-light leading-none text-bb-espresso-gold">+</span>
                    </div>
                  </div>
                  {/* 11:30 — reserved slot */}
                  <div className="flex items-center gap-4">
                    <span className="w-12 shrink-0 font-display text-xs font-semibold text-bb-espresso/30">
                      11:30
                    </span>
                    <div className="flex flex-1 items-center justify-between rounded-full bg-bb-espresso px-4 py-3 shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-display text-[11px] font-bold uppercase tracking-[1.2px] text-white/60">
                          Reserved
                        </span>
                        <span className="font-display text-sm font-medium text-white">
                          Classic Scissor Cut
                        </span>
                      </div>
                      <div className="flex size-8 items-center justify-center rounded-full bg-white/10">
                        <Lock className="size-[9px] text-white" />
                      </div>
                    </div>
                  </div>
                  {/* Bottom divider */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 shrink-0" />
                    <div className="h-px flex-1 bg-[rgba(229,222,214,0.4)]" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right top: Smart Reminders + Secure Checkout side-by-side */}
          <div className="col-[4/span_3] row-start-1 grid grid-cols-2 gap-8">
            {/* Smart Reminders */}
            <div className="flex flex-col justify-between rounded-[40px] border border-[rgba(229,222,214,0.5)] bg-white p-[41px] shadow-[0px_12px_20px_rgba(43,20,15,0.05)]">
              <div className="flex size-16 items-center justify-center rounded-full bg-[rgba(153,99,33,0.1)]">
                <BellRing className="size-6 text-bb-espresso-gold" />
              </div>
              <div className="flex flex-col gap-[7px]">
                <h4 className="font-sans text-xl font-bold leading-7 text-bb-espresso">
                  {t('smartReminders')}
                </h4>
                <p className="font-sans text-sm leading-[22.75px] text-bb-espresso/60">
                  {t('smartRemindersDescription')}
                </p>
              </div>
            </div>

            {/* Secure Checkout */}
            <div className="flex flex-col justify-between rounded-[40px] border border-[rgba(229,222,214,0.5)] bg-white p-[41px] shadow-[0px_12px_20px_rgba(43,20,15,0.05)]">
              <div className="flex size-16 items-center justify-center rounded-full bg-[rgba(74,90,62,0.1)]">
                <CreditCard className="size-6 text-[#4a5a3e]" />
              </div>
              <div className="flex flex-col gap-[7px]">
                <h4 className="font-sans text-xl font-bold leading-7 text-bb-espresso">
                  {t('secureCheckout')}
                </h4>
                <p className="font-sans text-sm leading-[22.75px] text-bb-espresso/60">
                  {t('secureCheckoutDescription')}
                </p>
              </div>
            </div>
          </div>

          {/* Lounge Finder — right bottom, full width */}
          <div className="col-[4/span_3] row-start-2 flex items-center gap-8 rounded-[40px] border border-[rgba(229,222,214,0.5)] bg-white p-[41px] shadow-[0px_12px_20px_rgba(43,20,15,0.05)]">
            <div className="flex size-24 shrink-0 items-center justify-center rounded-full bg-bb-espresso/5">
              <MapPin className="size-8 text-bb-espresso" />
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="font-sans text-2xl font-bold text-bb-espresso">
                {t('loungeFinderTitle')}
              </h4>
              <p className="max-w-[293px] font-sans text-lg leading-[1.625] text-bb-espresso/60">
                {t('loungeFinderDescription')}
              </p>
            </div>
            <div className="ml-auto shrink-0">
              <ChevronRight className="size-3.5 text-bb-espresso/40" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
