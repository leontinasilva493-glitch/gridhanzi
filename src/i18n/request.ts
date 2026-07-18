import { getRequestConfig } from 'next-intl/server';

import { defaultLocale, localeMessagesPaths } from '@/config/locale';

import { routing } from '@/core/i18n/config';

// Vite's dynamic-import-vars can't resolve `@/` alias inside template literals,
// so eager-glob all locale JSONs and look up by computed key. import.meta.glob
// is Vite-only; this file path only exists on the vinext (Cloudflare) branch.
const messageModules = import.meta.glob<{ default: Record<string, unknown> }>(
  '../config/locale/messages/*/*.json'
);

export async function loadMessages(
  path: string,
  locale: string = defaultLocale
) {
  const primaryKey = `../config/locale/messages/${locale}/${path}.json`;
  const fallbackKey = `../config/locale/messages/${defaultLocale}/${path}.json`;

  const loader = messageModules[primaryKey] ?? messageModules[fallbackKey];
  if (!loader) return {};

  try {
    return (await loader()).default;
  } catch {
    const fb = messageModules[fallbackKey];
    if (!fb || fb === loader) return {};
    try {
      return (await fb()).default;
    } catch {
      return {};
    }
  }
}

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as string)) {
    locale = routing.defaultLocale;
  }

  if (['zh-CN'].includes(locale)) {
    locale = 'zh';
  }

  try {
    const allMessages = await Promise.all(
      localeMessagesPaths.map((path) => loadMessages(path, locale))
    );

    const messages: Record<string, any> = {};

    localeMessagesPaths.forEach((path, index) => {
      const localMessages = allMessages[index];
      const keys = path.split('/');
      let current: Record<string, any> = messages;

      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = localMessages;
    });

    return { locale, messages };
  } catch {
    return {
      locale: defaultLocale,
      messages: {},
    };
  }
});
