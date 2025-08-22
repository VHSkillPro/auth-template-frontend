import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'vi'],

  // Used when no locale matches
  defaultLocale: 'en',
});

// Paths to the flag icons for each locale
export const flagsPath: Record<string, string> = {
  en: '/flags/en.svg',
  vi: '/flags/vi.svg',
};
