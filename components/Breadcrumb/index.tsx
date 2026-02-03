'use client'

import { Breadcrumbs, Typography } from '@mui/material'
import type { BreadcrumbsProps as MuiBreadcrumbsProps } from '@mui/material'
import Link from 'next/link'
import type { ReactNode } from 'react'

import { Breadcrumb } from '@/types'
import { ROUTES } from '@/common'
import { useIsMobile } from '@/hooks'
import { useTranslation } from '@/lib/i18n'

type BreadcrumbsProps = MuiBreadcrumbsProps & {
  items: Breadcrumb[]
  current: ReactNode
}

const Component = ({ items, current, ...rest }: BreadcrumbsProps) => {
  const { t } = useTranslation()
  const isMobile = useIsMobile()

  return (
    <Breadcrumbs maxItems={isMobile ? 2 : 5} {...rest} sx={{ mb: 4, ...rest.sx }}>
      <Link href={ROUTES.HOME}>
        <Typography color="textPrimary" sx={{ fontSize: 13 }}>
          {t('NAVIGATION.HOME')}
        </Typography>
      </Link>

      {items.map((item) => {
        if (item.route) {
          return (
            <Link key={item.route} href={item.route}>
              <Typography color="textPrimary" sx={{ fontSize: 13 }}>
                {item.label}
              </Typography>
            </Link>
          )
        }
        return (
          <Typography key={item.label} color="textSecondary" sx={{ fontSize: 13 }}>
            {item.label}
          </Typography>
        )
      })}

      {typeof current === 'string' ? (
        <Typography color="textSecondary" sx={{ fontSize: 13 }}>
          {current}
        </Typography>
      ) : (
        current
      )}
    </Breadcrumbs>
  )
}

export default Component
