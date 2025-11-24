import * as Localization from 'expo-localization';
import i18n from 'i18next';
import 'intl-pluralrules';
import { initReactI18next } from 'react-i18next';

import resources from '@/locales';

const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: (callback: (lang: string) => void) => {
    // We can also add logic to save/load language preference from AsyncStorage here
    const locales = Localization.getLocales();
    const bestLanguage = locales[0]?.languageCode ?? 'es';
    callback(bestLanguage);
  },
  init: () => {},
  cacheUserLanguage: () => {},
};

i18n
  .use(initReactI18next)
  .use(languageDetector as any)
  .init({
    resources,
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
