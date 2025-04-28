import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";

import en from "./locales/en.json";
import hi from "./locales/hi.json";
import mr from "./locales/mr.json";

// Get the preferred language from the device settings
const getPreferredLanguage = () => {
  const locales = Localization.getLocales();
  if (locales.length > 0) {
    const languageCode = locales[0].languageCode;
    if (languageCode === "hi") return "hi";
    if (languageCode === "mr") return "mr";
  }
  return "en"; // Default to English
};

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    hi: { translation: hi },
    mr: { translation: mr },
  },
  lng: getPreferredLanguage(), // Set initial language based on device settings
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
