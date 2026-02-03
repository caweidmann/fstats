import { ROUTES } from '@/common'
import { i18n } from '@/lib/i18n'

export const getActiveRouteLabel = (pathname: string) => {
  let activeLabel = ''

  switch (pathname) {
    case ROUTES.HOME:
      activeLabel = i18n.t('NAVIGATION.HOME')
      break
    default:
      console.warn(`Route label not defined! ${pathname}`)
  }

  return activeLabel
}
