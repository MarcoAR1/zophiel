import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { translations, type Locale, LOCALE_LABELS, LOCALE_FLAGS } from './translations.js';

type TranslationKeys = keyof typeof translations.es;

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKeys, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

const STORAGE_KEY = 'zophiel_locale';

function detectLocale(): Locale {
  const stored = localStorage.getItem(STORAGE_KEY) as Locale | null;
  if (stored && stored in translations) return stored;

  const browserLang = navigator.language.split('-')[0];
  if (browserLang in translations) return browserLang as Locale;

  return 'es';
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(detectLocale);

  const setLocale = useCallback((newLocale: Locale) => {
    localStorage.setItem(STORAGE_KEY, newLocale);
    setLocaleState(newLocale);
  }, []);

  const t = useCallback(
    (key: TranslationKeys, params?: Record<string, string | number>): string => {
      let text = (translations[locale] as any)[key] || (translations.es as any)[key] || key;
      if (params) {
        Object.entries(params).forEach(([k, v]) => {
          text = text.replace(`{${k}}`, String(v));
        });
      }
      return text;
    },
    [locale]
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be inside I18nProvider');
  return ctx;
}

export { LOCALE_LABELS, LOCALE_FLAGS };
export type { Locale };
