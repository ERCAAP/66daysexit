import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from './locales/en.json';
import tr from './locales/tr.json';

const resources = {
  en: {
    translation: en,
  },
  tr: {
    translation: tr,
  },
};

const initI18n = async () => {
  let savedLanguage = await AsyncStorage.getItem('language');
  
  if (!savedLanguage) {
    // Use getLocales() for proper locale detection
    const locales = Localization.getLocales();
    const deviceLanguage = locales[0]?.languageCode || 'en';
    savedLanguage = ['en', 'tr'].includes(deviceLanguage) ? deviceLanguage : 'en';
  }

  await i18n.use(initReactI18next).init({
    resources,
    lng: savedLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });
};

// Initialize i18n immediately
initI18n().catch(console.error);

export const changeLanguage = async (language: string) => {
  await AsyncStorage.setItem('language', language);
  await i18n.changeLanguage(language);
};

export default i18n; 