import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Fragment } from 'react';
import LocaleSwitcher from './_component/LocaleSwitcher';

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <Fragment>
      <NextIntlClientProvider>{children}</NextIntlClientProvider>
      <LocaleSwitcher currentLocale={locale} />
    </Fragment>
  );
}
