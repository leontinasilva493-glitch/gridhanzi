import { envConfigs } from '..';

export const localeNames: Record<string, string> = {
  en: 'English',
  zh: '中文',
};

export const locales = ['en', 'zh'];

export const defaultLocale = envConfigs.locale || 'en';

export const localePrefix = 'as-needed' as const;

export const localeDetection = false;

export const localeMessagesPaths: string[] = [];
