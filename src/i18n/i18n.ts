import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
// Languages
import translation_en from './en/translation.json';
import translation_es from './es/translation.json';

i18n
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  // Note: Not needed if `lng` is set
  // .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    debug: true, // TODO: Set to false in production
    fallbackLng: 'en',
    lng: "en", // Not needed if using LanguageDetector
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: {
      en: {
        translation: translation_en,
      },
      es: {
        translation: translation_es,
      }
    }
  });

export default i18n;
