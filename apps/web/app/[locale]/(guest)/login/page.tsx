import { setRequestLocale } from "next-intl/server";
import { AuthShell } from "../components/auth-shell";

interface LoginPageProps {
  params: Promise<{ locale: string }>;
}

const LoginPage = async ({ params }: LoginPageProps) => {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AuthShell locale={locale} mode="login" />;
};

export default LoginPage;
