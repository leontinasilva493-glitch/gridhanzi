export const envConfigs: Record<string, string> = {
  app_url: process.env.NEXT_PUBLIC_APP_URL ?? 'https://gridhanzi.org',
  app_name: process.env.NEXT_PUBLIC_APP_NAME ?? 'GridHanzi',
  app_description:
    process.env.NEXT_PUBLIC_APP_DESCRIPTION ??
    'Printable Chinese character practice sheets with Hanzi, Pinyin, tracing, and writing grids',
  app_logo:
    process.env.NEXT_PUBLIC_APP_LOGO ?? '/gridhanzi-icon-512.png',
  locale: process.env.NEXT_PUBLIC_DEFAULT_LOCALE ?? 'en',
};
