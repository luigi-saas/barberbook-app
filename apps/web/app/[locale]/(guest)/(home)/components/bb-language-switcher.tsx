'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/design-system/components/ui/dropdown-menu';
import { cn } from '@repo/design-system/lib/utils';
import { Languages } from 'lucide-react';
import { useParams, usePathname, useRouter } from 'next/navigation';

const languages = [
  { label: '🇫🇷 Français', value: 'fr' },
  { label: '🇬🇧 English', value: 'en' },
  { label: '🇸🇦 العربية', value: 'ar' },
];

export function BBLanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const current = languages.find((l) => l.value === params.locale);

  const switchLanguage = (locale: string) => {
    const defaultLocale = 'fr';
    let newPathname = pathname;

    if (
      !pathname.startsWith(`/${params.locale}`) &&
      params.locale === defaultLocale
    ) {
      newPathname = `/${params.locale}${pathname}`;
    }

    newPathname = newPathname.replace(`/${params.locale}`, `/${locale}`);
    router.push(newPathname);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            'flex items-center gap-1.5 rounded-full px-3 py-1.5',
            'font-sans text-sm font-medium text-bb-espresso/60 transition-colors',
            'hover:bg-bb-espresso/5 hover:text-bb-espresso',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bb-espresso/20',
          )}
        >
          <Languages className="size-4 shrink-0" />
          <span className="hidden sm:inline">{current?.label ?? '🌐'}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="min-w-[140px] rounded-2xl border border-bb-cream-border bg-bb-cream p-1 shadow-[var(--bb-shadow-onboarding)]"
      >
        {languages.map(({ label, value }) => (
          <DropdownMenuItem
            key={value}
            onClick={() => switchLanguage(value)}
            className={cn(
              'cursor-pointer rounded-xl px-3 py-2 font-sans text-sm text-bb-espresso',
              'focus:bg-bb-espresso/5 focus:text-bb-espresso',
              value === params.locale && 'font-semibold',
            )}
          >
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
