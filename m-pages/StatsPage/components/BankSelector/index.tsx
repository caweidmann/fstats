'use client'

import { useFormContext } from 'react-hook-form'

import type { BankSelectOption, StatsPageForm } from '@/types'
import { Select } from '@/components/FormFieldsControlled'

type BankSelectorProps = {
  options: BankSelectOption[]
}

const Component = ({ options }: BankSelectorProps) => {
  const { control } = useFormContext<StatsPageForm>()

  return (
    <Select<StatsPageForm, StatsPageForm['selectedId']>
      control={control}
      name="selectedId"
      options={options}
      fullWidth
      sx={{ borderRadius: 1.5 }}
    />
  )
}

export default Component
