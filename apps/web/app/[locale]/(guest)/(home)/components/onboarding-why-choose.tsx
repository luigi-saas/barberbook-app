import { useTranslations } from 'next-intl';

const BARBER_WORKING_IMAGE = 'https://www.figma.com/api/mcp/asset/c21d07c1-4eb1-4a8f-a6ff-358632d6c148';
const CLASSIC_TOOLS_IMAGE = 'https://www.figma.com/api/mcp/asset/0cd567e2-364e-4362-9a32-78a385a2094a';

const FEATURE_ICONS = [
  /* scissors */
  <svg key="scissors" width="15" height="19" viewBox="0 0 15 19" fill="none" aria-hidden="true">
    <circle cx="4" cy="4" r="3" stroke="#2b140f" strokeWidth="1.5" />
    <circle cx="4" cy="15" r="3" stroke="#2b140f" strokeWidth="1.5" />
    <path d="M6.5 6L13 13M6.5 13L13 6" stroke="#2b140f" strokeWidth="1.5" strokeLinecap="round" />
  </svg>,
  /* clock */
  <svg key="clock" width="19" height="19" viewBox="0 0 19 19" fill="none" aria-hidden="true">
    <circle cx="9.5" cy="9.5" r="8" stroke="#2b140f" strokeWidth="1.5" />
    <path d="M9.5 5.5v4l2.5 2.5" stroke="#2b140f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
  /* star */
  <svg key="star" width="17" height="20" viewBox="0 0 17 20" fill="none" aria-hidden="true">
    <path d="M8.5 1l2.09 6.26H17l-5.45 3.9 2.09 6.26L8.5 13.5l-5.14 3.92 2.09-6.26L0 7.26h6.41L8.5 1z" stroke="#2b140f" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>,
];

export function OnboardingWhyChoose() {
  const t = useTranslations('web.home.onboarding.whyChoose');
  const features = t.raw('features') as Array<{ title: string; description: string }>;

  return (
    <section className="w-full bg-white py-32">
      <div className="mx-auto grid max-w-[1280px] grid-cols-12 gap-20 px-8">
        {/* Left — text */}
        <div className="col-span-5 flex flex-col gap-10 self-center">
          <h2 className="font-sans text-4xl font-bold leading-[1.25] text-bb-espresso">
            {t('title1')}
            <br />
            <span className="italic text-bb-espresso-gold">{t('title2')}</span>
          </h2>

          <div className="flex flex-col gap-12">
            {features.map((feature, i) => (
              <div key={feature.title} className="flex gap-8">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-bb-cream">
                  {FEATURE_ICONS[i]}
                </div>
                <div className="flex flex-col gap-3">
                  <h4 className="font-sans text-xl font-bold leading-7 text-bb-espresso">
                    {feature.title}
                  </h4>
                  <p className="font-sans text-lg leading-7 text-bb-espresso/60">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — image grid */}
        <div className="col-span-7 grid grid-cols-2 gap-8 self-center">
          {/* Left column — offset down */}
          <div className="flex flex-col gap-8 pt-16">
            <div className="overflow-hidden rounded-[40px] shadow-[var(--bb-shadow-onboarding)]">
              <img
                src={BARBER_WORKING_IMAGE}
                alt="Barber at work"
                className="h-[400px] w-full object-cover"
              />
            </div>
            <div className="flex flex-col gap-2 rounded-[40px] bg-bb-espresso p-10">
              <p className="text-center font-sans text-[60px] font-black leading-none text-bb-cream">
                {t('ritualsCount')}
              </p>
              <p className="text-center font-sans text-xs font-medium uppercase tracking-[1.2px] text-bb-cream/70">
                {t('ritualsLabel')}
              </p>
            </div>
          </div>

          {/* Right column — offset up */}
          <div className="flex flex-col gap-8 pb-16">
            <div className="flex flex-col gap-2 rounded-[40px] bg-bb-espresso-gold p-10">
              <p className="text-center font-sans text-[60px] font-black leading-none text-white">
                {t('ratingCount')}
              </p>
              <p className="text-center font-sans text-xs font-medium uppercase tracking-[1.2px] text-white/80">
                {t('ratingLabel')}
              </p>
            </div>
            <div className="overflow-hidden rounded-[40px] shadow-[var(--bb-shadow-onboarding)]">
              <img
                src={CLASSIC_TOOLS_IMAGE}
                alt="Classic barber tools"
                className="h-[400px] w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
