import type { Dictionary } from "@repo/internationalization";
import { getMessages, setRequestLocale } from 'next-intl/server';
import { createMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";
import { ContactForm } from "./components/contact-form";

interface ContactProps {
  params: Promise<{
    locale: string;
  }>;
}

export const generateMetadata = async ({ params }: ContactProps): Promise<Metadata> => {
  const { locale } = await params;
  const messages = await getMessages({ locale }) as unknown as Dictionary;
  return createMetadata(messages.web.contact.meta);
};

const Contact = async ({ params }: ContactProps) => {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages({ locale }) as unknown as Dictionary;
  return <ContactForm dictionary={messages} />;
};

export default Contact;
