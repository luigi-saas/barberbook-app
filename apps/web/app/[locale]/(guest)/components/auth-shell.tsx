import { getTranslations } from "next-intl/server";
import Link from "next/link";

interface AuthShellProperties {
  readonly locale: string;
  readonly mode: "login" | "signup";
}

/**
 * Shared shell for /login and /sign-up.
 *
 * Customer accounts are Phase 1 of the roadmap (Clerk <-> UserRole mapping):
 * until that lands, the page offers the two paths that work today — guest
 * booking (no account needed) and the shop dashboard (Clerk lives there).
 * When real customer auth arrives, replace the body with <SignIn />/<SignUp />
 * from Clerk, keeping this shell.
 */
export const AuthShell = async ({ locale, mode }: AuthShellProperties) => {
  const t = await getTranslations({ locale, namespace: "web.guest.auth" });
  const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/sign-in`;
  const isLogin = mode === "login";

  return (
    <main className="flex min-h-screen flex-col bg-bb-cream lg:flex-row">
      {/* Brand panel */}
      <div className="relative hidden flex-1 flex-col justify-between overflow-hidden bg-bb-espresso p-12 text-bb-cream lg:flex">
        <span className="sr-only">BarberBook.ma</span>
        <div className="space-y-4">
          <h2 className="font-display text-4xl font-extrabold leading-tight tracking-tight">
            {isLogin ? t("brand.titleLogin") : t("brand.titleSignup")}
          </h2>
          <p className="max-w-md text-bb-cream/70">{t("brand.subtitle")}</p>
        </div>
        <p className="text-xs text-bb-cream/40">{t("brand.tagline")}</p>
      </div>

      {/* Form panel */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-1">
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-bb-espresso">
              {isLogin ? t("login.title") : t("signup.title")}
            </h1>
            <p className="text-bb-warm-muted">{isLogin ? t("login.subtitle") : t("signup.subtitle")}</p>
          </div>

          <div className="space-y-4">
            <Link
              href={`/${locale}/explore`}
              className="block rounded-2xl border border-bb-cream-border bg-white p-5 shadow-sm transition-all hover:border-bb-gold hover:shadow-md"
            >
              <p className="font-display text-lg font-bold text-bb-espresso">{t("customer.title")}</p>
              <p className="mt-1 text-sm text-bb-warm-muted">{t("customer.description")}</p>
              <p className="mt-3 text-sm font-semibold text-bb-espresso-gold">{t("customer.cta")} →</p>
            </Link>

            <a
              href={dashboardUrl}
              className="block rounded-2xl border border-bb-cream-border bg-white p-5 shadow-sm transition-all hover:border-bb-gold hover:shadow-md"
            >
              <p className="font-display text-lg font-bold text-bb-espresso">{t("owner.title")}</p>
              <p className="mt-1 text-sm text-bb-warm-muted">{t("owner.description")}</p>
              <p className="mt-3 text-sm font-semibold text-bb-espresso-gold">{t("owner.cta")} →</p>
            </a>
          </div>

          <p className="text-center text-sm text-bb-warm-muted">
            {isLogin ? t("login.footer") : t("signup.footer")}{" "}
            <Link
              href={`/${locale}/${isLogin ? "sign-up" : "login"}`}
              className="font-semibold text-bb-espresso-gold hover:underline"
            >
              {isLogin ? t("signup.cta") : t("login.cta")}
            </Link>
          </p>

          <Link
            href={`/${locale}`}
            className="block text-center text-sm text-bb-warm-muted hover:text-bb-espresso"
          >
            ← {t("backHome")}
          </Link>
        </div>
      </div>
    </main>
  );
};
