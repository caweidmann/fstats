import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next, Trans, useTranslation } from 'react-i18next'

import { UserLocale } from '@/types-enums'
import en from '@/public/locales/en.json'

const resources = {
  [UserLocale.EN]: { translation: en },
} as const

export const initTranslations = () => {
  i18n
    .use(initReactI18next)
    .use(LanguageDetector)
    .init({
      resources,
      fallbackLng: UserLocale.EN,
      detection: {
        order: ['localStorage'],
        caches: ['localStorage'],
      },
      interpolation: {
        escapeValue: false,
      },
    })
}

export { Trans, useTranslation, i18n }
