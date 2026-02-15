import { sortBy } from 'lodash'

import type { SelectOptionWithType } from '@/types'
import { Currency } from '@/types-enums'
import { i18n } from '@/lib/i18n'

export const getCurrencySelectOptions = (): SelectOptionWithType<Currency>[] => {
  // @currency-updates
  const currencies = [
    { value: Currency.USD, label: Currency.USD, labelSecondary: i18n.t(`CURRENCY:${Currency.USD}`) },
    { value: Currency.EUR, label: Currency.EUR, labelSecondary: i18n.t(`CURRENCY:${Currency.EUR}`) },
    { value: Currency.GBP, label: Currency.GBP, labelSecondary: i18n.t(`CURRENCY:${Currency.GBP}`) },
    { value: Currency.CHF, label: Currency.CHF, labelSecondary: i18n.t(`CURRENCY:${Currency.CHF}`) },
    { value: Currency.SEK, label: Currency.SEK, labelSecondary: i18n.t(`CURRENCY:${Currency.SEK}`) },
    { value: Currency.BTC, label: Currency.BTC, labelSecondary: i18n.t(`CURRENCY:${Currency.BTC}`) },
    { value: Currency.CNY, label: Currency.CNY, labelSecondary: i18n.t(`CURRENCY:${Currency.CNY}`) },
    { value: Currency.RUB, label: Currency.RUB, labelSecondary: i18n.t(`CURRENCY:${Currency.RUB}`) },
    { value: Currency.JPY, label: Currency.JPY, labelSecondary: i18n.t(`CURRENCY:${Currency.JPY}`) },
    { value: Currency.INR, label: Currency.INR, labelSecondary: i18n.t(`CURRENCY:${Currency.INR}`) },
    { value: Currency.ZAR, label: Currency.ZAR, labelSecondary: i18n.t(`CURRENCY:${Currency.ZAR}`) },
  ]

  return sortBy(currencies, 'value')
}

export const getCurrencySelectOptionsSingle = (): SelectOptionWithType<Currency>[] => {
  // @currency-updates
  const currencies = [
    { value: Currency.USD, label: `${Currency.USD} - ${i18n.t(`CURRENCY:${Currency.USD}`)}` },
    { value: Currency.EUR, label: `${Currency.EUR} - ${i18n.t(`CURRENCY:${Currency.EUR}`)}` },
    { value: Currency.GBP, label: `${Currency.GBP} - ${i18n.t(`CURRENCY:${Currency.GBP}`)}` },
    { value: Currency.CHF, label: `${Currency.CHF} - ${i18n.t(`CURRENCY:${Currency.CHF}`)}` },
    { value: Currency.SEK, label: `${Currency.SEK} - ${i18n.t(`CURRENCY:${Currency.SEK}`)}` },
    { value: Currency.BTC, label: `${Currency.BTC} - ${i18n.t(`CURRENCY:${Currency.BTC}`)}` },
    { value: Currency.CNY, label: `${Currency.CNY} - ${i18n.t(`CURRENCY:${Currency.CNY}`)}` },
    { value: Currency.RUB, label: `${Currency.RUB} - ${i18n.t(`CURRENCY:${Currency.RUB}`)}` },
    { value: Currency.JPY, label: `${Currency.JPY} - ${i18n.t(`CURRENCY:${Currency.JPY}`)}` },
    { value: Currency.INR, label: `${Currency.INR} - ${i18n.t(`CURRENCY:${Currency.INR}`)}` },
    { value: Currency.ZAR, label: `${Currency.ZAR} - ${i18n.t(`CURRENCY:${Currency.ZAR}`)}` },
  ]

  return sortBy(currencies, 'value')
}

export const getCurrencyDisplay = (currency: Currency): string => {
  return i18n.t(`CURRENCY:${currency}`)
}

export const getCurrencySymbol = (currency: Currency): string => {
  // @currency-updates
  switch (currency) {
    case Currency.USD:
      return '$'
    case Currency.EUR:
      return '€'
    case Currency.GBP:
      return '£'
    case Currency.CHF:
      return 'CHF'
    case Currency.ZAR:
      return 'R'
    case Currency.BTC:
      return '₿'
    case Currency.JPY:
      return '¥'
    case Currency.CNY:
      return '¥'
    case Currency.INR:
      return '₹'
    case Currency.RUB:
      return '₽'
    case Currency.SEK:
      return 'kr'
    default:
      if (currency !== null) {
        console.warn(`No currency symbol found: "${currency}"`)
      }
      return ''
  }
}

export const getMaxDecimalsForCurrency = (currency: Currency): number => {
  switch (currency) {
    case Currency.BTC:
      return 8
    default:
      return 2
  }
}
