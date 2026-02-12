'use client'

import { ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'

import { DateFormat } from '@/types-enums'
import { useUserPreferences } from '@/hooks'

import RadioButton from '../../../RadioButton'

interface DateFormatDrawerListItem {
  value: DateFormat
  label: string
  onClick: (dateFormat: DateFormat) => void
}

const Component = ({ value, label, onClick }: DateFormatDrawerListItem) => {
  const { dateFormat } = useUserPreferences()

  return (
    <ListItem disablePadding>
      <ListItemButton onClick={() => onClick(value)}>
        <ListItemIcon>{<RadioButton checked={value === dateFormat} />}</ListItemIcon>
        <ListItemText
          primary={label}
          slotProps={{
            primary: {
              variant: 'body1',
            },
          }}
        />
      </ListItemButton>
    </ListItem>
  )
}

export default Component
