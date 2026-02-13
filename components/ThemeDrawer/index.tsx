'use client'

import { Box, List } from '@mui/material'
import { useColorScheme } from '@mui/material/styles'

import { ColorMode } from '@/types-enums'
import { useUserPreferences } from '@/hooks'

import { ThemeDrawerListItem } from './components'

type ThemeDrawerProps = {
  onOptionSelected: VoidFunction
}

export const getThemeSelectOptions = () => {
  return [{ value: ColorMode.SYSTEM }, { value: ColorMode.LIGHT }, { value: ColorMode.DARK }]
}

const Component = ({ onOptionSelected }: ThemeDrawerProps) => {
  const { setMode } = useColorScheme()
  const selectOptions = getThemeSelectOptions()
  const { setColorMode } = useUserPreferences()

  const onClick = (mode: ColorMode) => {
    setMode(mode)
    setColorMode(mode)
    onOptionSelected()
  }

  return (
    <List sx={{ pt: 0 }}>
      {selectOptions.map((option) => (
        <ThemeDrawerListItem key={option.value} mode={option.value} onClick={() => onClick(option.value)} />
      ))}
    </List>
  )
}

export default Component
