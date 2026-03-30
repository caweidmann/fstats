Always use pnpm.
Be extremely concise in all your responses.

## Project Overview

Privacy-focused CSV bank statement parser. All processing is client-side (IndexedDB via LocalForage). Supports South African and European banks.

## Architecture

### Feature Modules (`m-{feature}/`)

- **API Layer** (`api/`) — LocalForage operations, data transformation (At Rest string ↔ In Memory Big), pure async functions
- **Service Layer** (`service/`) — TanStack Query hooks, cache management, business logic

### Data Access Rules

- Components use service hooks from `m-*/service/` (e.g., `useFiles`, `useMutateAddFile`)
- Components must NOT import API layer directly
- Don't use React Context for async state — use TanStack Query
- LocalStorage for ephemeral state only (e.g., selected file IDs)

## Core Constraints

- All data processing is **client-side only** — no uploads, no tracking, no accounts
- Use `Big` from `@/lib/w-big` for monetary calculations (never native numbers)
- Dates in storage must be ISO strings (`DateTimeString`)
- Support light/dark themes and EN/DE locales

## Adding a New Bank Parser

Parsers live in `utils/Parser/banks/`. `ParserId` is in `types-enums/index.ts`.

1. Add `ParserId` entry in `types-enums/index.ts` + add to `zParserId` array
2. Create parser in `utils/Parser/banks/`:
```typescript
import { Currency, ParserId } from '@/types-enums'
import { createParser } from '@/utils/Parser'

export const new_bank__account = createParser({
  id: ParserId.NEW_BANK_ACCOUNT,
  bankName: 'New Bank',
  accountType: 'Account Type',
  currency: Currency.EUR,
  headerRowIndex: 0,
  columns: { date: 'Date', description: 'Description', amount: 'Amount', balance: 'Balance' } as const,
  dateFormat: 'dd/MM/yyyy',
  getters: { date: 'date', description: 'description', value: 'amount' },
  // Use functions for complex logic: value: (row) => parseGermanNumber(row.get('amount'))
})
```
3. Export from `utils/Parser/banks/index.ts`
4. Register in `utils/Parser/utils.ts` `AVAILABLE_PARSERS` record
