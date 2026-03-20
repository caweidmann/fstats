Always use pnpm.
Be extremely concise in all your responses.

## Project Overview

fstats is a privacy-focused CSV bank statement parser built with Next.js 16. All processing is client-side using IndexedDB via LocalForage. TanStack Query for state management. Supports South African and European banks.

## Commands

```bash
pnpm dev          # Development (Turbopack)
pnpm build        # Production (Webpack, NOT Turbopack)
pnpm start        # Run production build
pnpm lint         # Linting
pnpm test         # Testing (Vitest)
```

## Tech Stack

Next.js 16 (App Router) | React 19 | TypeScript 5.9 | MUI v7 + Emotion | TanStack Query v5 | PapaParse | Chart.js + react-chartjs-2 | zod v4 (`z.iso.datetime()` syntax) | react-hook-form | react-dropzone | big.js | date-fns v4 | i18next | localforage | lodash | usehooks-ts | Vitest | @serwist/next

## Architecture

### Feature Modules (`m-{feature}/`)

Two-layer structure:
- **API Layer** (`api/`) - LocalForage operations, data transformation (At Rest string <-> In Memory Big), pure async functions
- **Service Layer** (`service/`) - TanStack Query hooks, cache management, business logic

### Data Access Rules

- Components use service hooks from `m-*/service/` (e.g., `useFiles`, `useMutateAddFile`)
- Components must NOT import API layer directly
- Don't use React Context for async state — use TanStack Query
- LocalStorage for ephemeral state only (e.g., selected file IDs)

### Import Order (enforced via Prettier)

1. Third-party -> 2. `@/types` & `@/types-enums` -> 3. `@/common` -> 4. `@/components` -> 5. `@/context` -> 6. `@/m-*` -> 7. `@/hooks` -> 8. `@/styles` -> 9. `@/utils` -> 10. `@/lib` -> 11. `@/public` -> 12. Relative

## Code Style

- No semicolons, single quotes, trailing commas, 120-char width
- Arrow function components only, named `Component`, default export
- `import type` for type-only imports
- Named exports for everything except components
- Component files: `index.tsx` (exports), `actions.ts` (logic), `styled.ts` (styles via `ui()` function)
- Pages are thin orchestrators (<60 lines), delegate to `./components`
- Keep files small (50-100 lines for components), extract when >100 lines
- Keep logic local until used 3+ times

## Core Constraints

- All data processing is **client-side only** — no data uploads, no tracking, no accounts
- Use `Big` from `@/lib/w-big` for monetary calculations (never native numbers)
- Dates in storage must be ISO strings (`DateTimeString`)
- Support light/dark themes and EN/DE locales

## Adding a New Bank Parser

Parsers live in `/utils/Parser/banks/`. `ParserId` is in `/types-enums/index.ts`.

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
