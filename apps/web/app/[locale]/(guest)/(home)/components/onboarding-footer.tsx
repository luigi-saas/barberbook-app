import Link from 'next/link';

const NAV_LINKS = [
  { label: 'Privacy Policy', href: '/legal/privacy' },
  { label: 'Terms of Service', href: '/legal/terms' },
  { label: 'Contact Us', href: '/contact' },
  { label: 'Careers', href: '/careers' },
];

export function OnboardingFooter() {
  return (
    <footer className="w-full border-t border-[#6b452b] bg-bb-espresso">
      <div className="mx-auto max-w-[1280px] px-12 py-10">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <span className="font-sans text-lg font-black uppercase tracking-tight text-white">
            BarberBook.ma
          </span>

          {/* Nav links */}
          <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-sans text-sm uppercase tracking-[1.4px] text-bb-tan transition hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Copyright */}
          <p className="text-right font-sans text-sm uppercase tracking-[1.4px] text-bb-tan">
            © 2024 Makhzen Grooming.
            <br />
            Handcrafted Moroccan Tradition.
          </p>
        </div>
      </div>
    </footer>
  );
}
