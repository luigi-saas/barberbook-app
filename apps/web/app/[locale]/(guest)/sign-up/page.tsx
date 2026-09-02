import { setRequestLocale } from "next-intl/server";
import { AuthShell } from "../components/auth-shell";

interface SignUpPageProps {
  params: Promise<{ locale: string }>;
}

const SignUpPage = async ({ params }: SignUpPageProps) => {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AuthShell locale={locale} mode="signup" />;
};

export default SignUpPage;
