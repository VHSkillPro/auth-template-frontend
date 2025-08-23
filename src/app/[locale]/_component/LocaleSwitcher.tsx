'use client';
import { flagsPath, routing } from '@/i18n/routing';
import { Avatar, FloatButton } from 'antd';
import FloatButtonGroup from 'antd/es/float-button/FloatButtonGroup';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

export default function LocaleSwitcher({
  currentLocale,
}: {
  currentLocale: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  /**
   * Handles the change of locale in the application.
   *
   * @param newLocale - The new locale to be set (e.g., 'en', 'fr', 'es').
   */
  const handleLocaleChange = (newLocale: string) => {
    if (newLocale === currentLocale) {
      return;
    }

    startTransition(() => {
      const newPath = `/${newLocale}${pathname.substring(
        pathname.indexOf('/', 1)
      )}?${searchParams.toString()}`;
      router.replace(newPath);
    });
  };

  return (
    <FloatButtonGroup
      trigger="click"
      icon={<Avatar size={20} src={flagsPath[currentLocale]} />}
    >
      {routing.locales.map(
        (loc) =>
          loc !== currentLocale && (
            <FloatButton
              key={loc}
              icon={<Avatar size={20} src={flagsPath[loc]} />}
              onClick={() => handleLocaleChange(loc)}
            />
          )
      )}
    </FloatButtonGroup>
  );
}
