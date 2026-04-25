import type { Dictionary } from "@repo/internationalization";
import { getMessages, setRequestLocale } from 'next-intl/server';
import { createMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";
import { ContactForm } from "./components/contact-form";

interface ContactProps {
  params: {
    locale: string;
  };
}

export const generateMetadata = async ({ params }: ContactProps): Promise<Metadata> => {
  const { locale } = params;
  const messages = await getMessages({ locale }) as unknown as Dictionary;
  return createMetadata(messages.web.contact.meta);
};

const Contact = async ({ params }: ContactProps) => {
  setRequestLocale(params.locale);
  const messages = await getMessages({ locale: params.locale }) as unknown as Dictionary;
  return <ContactForm dictionary={messages} />;
};

export default Contact;
