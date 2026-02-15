// Simple case (FNB, Comdirect, ING) - just column indices
const fnb = createParser({
  id: ParserId.FNB,
  bankName: 'FNB',
  accountType: 'Credit Card',
  currency: Currency.ZAR,
  expectedHeaderRowIndex: 4,
  expectedHeaders: ['Date', 'Amount', 'Balance', 'Description'],
  dateFormat: 'yyyy/MM/dd',
  columns: { date: 0, description: 3, value: 1 },
})

// Custom value extraction (Capitec, Lloyds) - resolveValue hook
const capitec = createParser({
  id: ParserId.CAPITEC,
  bankName: 'Capitec',
  accountType: 'Savings',
  currency: Currency.ZAR,
  expectedHeaderRowIndex: 0,
  expectedHeaders: [...],
  dateFormat: 'yyyy-MM-dd HH:SS',
  columns: { date: 3, description: 4 },
  resolveValue: (row) => {
    const valIn = row[8].trim()
    const valOut = row[9].trim()
    const valFee = row[10].trim()
    return valIn || valOut || valFee || '0'
  },
})

// German number format
const comdirectGiro = createParser({
  ...
  numberFormat: 'german',
  columns: { date: 1, description: 3, value: 4 },
})


valueGetter
valueFormatter

categoryGetter
categoryFormatter
