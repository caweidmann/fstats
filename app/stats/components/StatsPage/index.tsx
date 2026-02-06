'use client'

import { Card, CardHeader, Grid } from '@mui/material'
import { useForm } from 'react-hook-form'

import { PageWrapper } from '@/components'
import { Select } from '@/components/FormFieldsControlled'
import { useFileHelper } from '@/hooks'
import { AVAILABLE_PARSERS } from '@/utils/Parsers'

import { getBankSelectOptions } from './actions'

type LocalForm = {
  selectedId: string
}

const Component = () => {
  const { selectedFiles } = useFileHelper()
  const bankOptions = getBankSelectOptions(selectedFiles)
  const defaultValues: LocalForm = {
    selectedId: bankOptions[0].value,
  }
  const localForm = useForm<LocalForm>({ defaultValues })
  const selectedBankId = localForm.watch('selectedId')
  const filteredFiles =
    selectedBankId === 'all'
      ? selectedFiles
      : selectedBankId === 'unknown'
        ? selectedFiles.filter((file) => !file.parserId)
        : selectedFiles.filter((file) => file.parserId === selectedBankId)

  return (
    <PageWrapper>
      <Grid container spacing={2}>
        <Grid size={2}>
          <Select<LocalForm, LocalForm['selectedId']>
            control={localForm.control}
            name="selectedId"
            options={bankOptions}
            fullWidth
          />
        </Grid>
        {/* <Grid size={2}>Date range</Grid> */}
        {/* <Grid size={2}>Display currency</Grid> */}
        {/* <Grid size={2}>Compress x-axis</Grid> */}
        {/* <Grid size={2}>Combine datasets</Grid> */}

        {filteredFiles.map((file) => {
          const rowCount = file.parserId ? file.parsedContentRows.length : file.rawParseResult?.data.length
          const columnCount = file.parserId
            ? AVAILABLE_PARSERS[file.parserId].expectedHeaders.length
            : file.rawParseResult?.data[0]?.length

          return (
            <Grid key={file.id} size={12}>
              <Card>
                <CardHeader title={file.file.name} subheader={`${rowCount} rows, ${columnCount} columns`} />
              </Card>
            </Grid>
          )
        })}
      </Grid>
    </PageWrapper>
  )
}

export default Component
