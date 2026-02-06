'use client'

import { ArrowBack } from '@mui/icons-material'
import { Box, Button, Card, CardHeader, Grid, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

import { ROUTES } from '@/common'
import { PageWrapper } from '@/components'
import { Select } from '@/components/FormFieldsControlled'
import { useFileHelper } from '@/hooks'
import { AVAILABLE_PARSERS } from '@/utils/Parsers'

import { getBankSelectOptions } from './actions'

type LocalForm = {
  selectedId: string
}

const Component = () => {
  const router = useRouter()
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

  console.log('selectedFiles', selectedFiles)
  console.log('selectedBankId', selectedBankId)

  return (
    <PageWrapper>
      <Grid container spacing={2}>
        <Grid size={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h4">Stats</Typography>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onMouseEnter={() => router.prefetch(ROUTES.DATA)}
              onClick={() => router.push(ROUTES.DATA)}
            >
              Back
            </Button>
          </Box>
        </Grid>

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
