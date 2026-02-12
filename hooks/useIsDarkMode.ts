'use client'

import { useColorScheme } from '@mui/material/styles'

import { ColorMode } from '@/types-enums'

export const useIsDarkMode = () => {
  const { colorScheme } = useColorScheme()
  return colorScheme === ColorMode.DARK
}
