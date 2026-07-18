export const envConfigs: Record<string, string> = {
  app_url: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
  app_name: process.env.NEXT_PUBLIC_APP_NAME ?? 'HanziSheets',
  app_description:
    process.env.NEXT_PUBLIC_APP_DESCRIPTION ??
    'Printable bilingual Chinese writing worksheets',
  app_logo: process.env.NEXT_PUBLIC_APP_LOGO ?? '/logo.png',
  locale: process.env.NEXT_PUBLIC_DEFAULT_LOCALE ?? 'en',
};
