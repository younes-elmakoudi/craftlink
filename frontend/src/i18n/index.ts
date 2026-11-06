import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

/**
 * Translation files are discovered automatically:
 *   src/i18n/locales/<lang>.json                   -> namespace "common"
 *   src/features/<feature>/locales/<lang>.json     -> namespace "<feature>"
 * Each feature owns its files, so two developers never edit the same JSON.
 */
const files = import.meta.glob<Record<string, unknown>>('../**/locales/*.json', {
  eager: true,
  import: 'default',
});

export const SUPPORTED_LANGUAGES = ['en', 'fr', 'es'] as const;
export type AppLanguage = (typeof SUPPORTED_LANGUAGES)[number];

const resources: Record<string, Record<string, Record<string, unknown>>> = {};
for (const [path, content] of Object.entries(files)) {
  const match = path.match(/locales\/([a-z]{2})\.json$/);
  if (!match) continue;
  const lang = match[1];
  const feature = path.match(/features\/([^/]+)\//);
  const ns = feature ? feature[1] : 'common';
  (resources[lang] ??= {})[ns] = content;
}

const stored = localStorage.getItem('craftlink.lang');
const initial = SUPPORTED_LANGUAGES.includes(stored as AppLanguage)
  ? (stored as AppLanguage)
  : 'en';

void i18n.use(initReactI18next).init({
  resources,
  lng: initial,
  fallbackLng: 'en',
  defaultNS: 'common',
  interpolation: { escapeValue: false }, // React already escapes
});

export function setLanguage(lang: AppLanguage): void {
  localStorage.setItem('craftlink.lang', lang);
  document.documentElement.lang = lang;
  void i18n.changeLanguage(lang);
}

document.documentElement.lang = initial;
export default i18n;
