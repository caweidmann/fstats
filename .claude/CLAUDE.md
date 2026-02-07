# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

fstats is a privacy-focused CSV bank statement parser built with Next.js 16. All CSV parsing and data storage happens entirely client-side using IndexedDB—no data is uploaded to servers. The app supports multiple South African and European banks.

## Development Commands

**Package Manager**: This project uses `pnpm` (version 10.28.2). Always use `pnpm`, never `npm` or `yarn`.

```bash
# Development (uses Turbopack)
pnpm dev

# Production build (uses webpack, NOT turbopack)
pnpm build

# Run production build locally
pnpm start

# Linting
pnpm lint

# Sitemap generation (runs automatically after build)
pnpm postbuild
```

**Note**: There are currently no tests in this project (`pnpm test` will just echo a message).

## Architecture

### Directory Structure

- **`/app`** - Next.js App Router pages and layouts
  - Routes: `/` (home), `/data` (file upload), `/stats` (analysis), `/settings`
  - Each route is a directory with `page.tsx`, optional `styled.ts`, and `actions.tsx`

- **`/components`** - Reusable UI components (Layout, Theme/Language providers, etc.)

- **`/types`** - TypeScript type definitions (organized by domain: global.ts, stats-file.ts, utils.ts)

- **`/types-enums`** - Enum-like constants with TypeScript types (ColorMode, UserLocale, ParserId, DateFormat, WeekStartsOn)

- **`/utils`** - Domain-organized utility functions:
  - `Date/` - Date formatting and manipulation
  - `File/` - File validation and handling
  - `FileParser/` - CSV parsing orchestration
  - `Parsers/` - Bank-specific parsers (currently only Capitec)
  - `LocalStorage/` - LocalStorage helpers
  - `Logger/` - Console logging utilities
  - `Misc/` - Miscellaneous utilities

- **`/lib`** - Third-party library configurations (i18n, localforage, big.js wrapper)

- **`/common`** - App-wide constants (`MISC`, `ROUTES`, `LAYOUT`, `CONFIG`)

- **`/context`** - React Context providers:
  - `Storage/` - File management context using LocalForage

- **`/hooks`** - Custom React hooks (useIsDarkMode, useIsMobile, useUserPreferences, useFileHelper, etc.)

- **`/styles`** - Global styles and MUI theme configuration

- **`/data`** - Sample CSV files for testing (not part of the app)

### Key Architectural Patterns

**Parser System**:
Each bank has a parser in `utils/Parsers/{BankName}/{account-type}.ts` that exports a `Parser` object with:
- `id: ParserId` - Unique parser identifier
- `bankName: string` - Display name of the bank
- `accountType: string` - Type of account (e.g., "Savings", "Giro")
- `expectedHeaderRowIndex: number` - Row index where headers are located
- `expectedHeaders: string[]` - Expected CSV column headers
- `detect: (input) => boolean` - Function to identify if CSV matches this parser
- `parse: (input, locale) => ParsedContentRow[]` - Function to transform CSV rows

The parsing flow:
1. User uploads CSV files via `/data` page
2. `FileParser/utils.ts` uses PapaParse to parse raw CSV
3. Each registered parser's `detect()` method is called to identify the matching parser
4. Matching parser's `parse()` method transforms rows into `ParsedContentRow[]` with `{ date, description, value }`
5. Files are stored in IndexedDB via `context/Storage`

**State Management**:
- React Context for global state (Storage context for files)
- LocalStorage for user preferences (locale, color mode, persist data, selected file IDs)
- LocalForage (IndexedDB) for file data storage

**Number Handling**:
Uses `big.js` (via `/lib/w-big.ts` wrapper) for precise decimal arithmetic. All monetary values are `NumberBig` (type alias for `Big`).

**Date Handling**:
Uses `date-fns` with support for multiple formats (defined in `types-enums/index.ts`). All dates in storage use ISO format (`DateTimeString`).

### Import Order

The project enforces a specific import order via Prettier plugin:
1. Third-party modules
2. `@/types` and `@/types-enums`
3. `@/common`
4. `@/components`
5. `@/context`
6. `@/hooks`
7. `@/styles`
8. `@/utils`
9. `@/lib`
10. Relative imports (`./` or `../`)

Imports are auto-sorted with blank lines between groups.

## Adding a New Bank Parser

To add support for a new bank (e.g., FNB Credit Card):

1. **Add ParserId** to `types-enums/index.ts`:
```typescript
export const ParserId = {
  // South African Banks
  CAPITEC: 'capitec__savings',
  FNB_CREDIT: 'fnb__credit_card', // Add new parser ID
  // German Banks
  COMDIRECT_GIRO: 'comdirect__giro',
} as const
```

2. **Create parser file** `utils/Parsers/FNB/credit-card.ts`:
```typescript
import type { ParsedContentRow, Parser } from '@/types'
import { ParserId } from '@/types-enums'
import { isEqual } from '@/utils/Misc'
import { Big } from '@/lib/w-big'

import { toDisplayDate } from '../../Date'

export const FnbCreditCard: Parser = {
  id: ParserId.FNB_CREDIT,
  bankName: 'FNB',
  accountType: 'Credit Card',
  expectedHeaderRowIndex: 0,
  expectedHeaders: ['Date', 'Description', 'Amount', 'Balance'],

  detect: (input) => {
    return isEqual(input.data[FnbCreditCard.expectedHeaderRowIndex], FnbCreditCard.expectedHeaders)
  },

  parse: (input, locale) => {
    const rowsToParse = input.data
      .slice(FnbCreditCard.expectedHeaderRowIndex + 1)
      .filter((row) => row.length === FnbCreditCard.expectedHeaders.length)

    return rowsToParse.map((row) => {
      const [date, description, amount, balance] = row

      const data: ParsedContentRow = {
        date: toDisplayDate(date, locale, {
          formatFrom: 'dd/MM/yyyy',
          formatTo: 'dd/MM/yyyy',
        }),
        description,
        value: Big(amount || 0),
      }

      return data
    })
  },
}
```

3. **Export from** `utils/Parsers/FNB/index.ts`:
```typescript
export * from './credit-card'
```

4. **Export bank from** `utils/Parsers/index.ts`:
```typescript
import type { Parser } from '@/types'
import { ParserId } from '@/types-enums'

import { CapitecSavings } from './Capitec'
import { ComdirectGiro } from './Comdirect'
import { FnbCreditCard } from './FNB' // Add import

export const AVAILABLE_PARSERS = {
  [ParserId.CAPITEC]: CapitecSavings,
  [ParserId.COMDIRECT_GIRO]: ComdirectGiro,
  [ParserId.FNB_CREDIT]: FnbCreditCard, // Register parser
} satisfies Record<ParserId, Parser>
```

That's it! The parser will automatically be detected and used when matching CSV files are uploaded.

## Technology Stack

- **Framework**: Next.js 16 (App Router, React Server Components)
- **React**: 19.2.4
- **TypeScript**: 5.9.3
- **UI**: MUI (Material-UI) v7 with Emotion
- **CSV Parsing**: PapaParse
- **Number Precision**: big.js
- **Date**: date-fns
- **i18n**: next-i18next, i18next, react-i18next
- **Storage**: localforage (IndexedDB/WebSQL/LocalStorage)
- **PWA**: @serwist/next
- **Hosting**: Vercel
- **Analytics**: @vercel/analytics, @vercel/speed-insights

## Code Organization Patterns

### File Structure Principles

**Golden Rule**: Less code in correct places > overwhelming single files with lots of code.

**Locality Rule**: Keep logic close to where it's used. Only extract to global when used 3+ times.

Each directory follows a consistent structure:
```
DirectoryName/
├── index.ts(x)        # Public API: exports only (named exports preferred)
├── utils.ts           # Implementation: helper functions
├── actions.ts(x)      # Component-specific logic (COMMON - most components have this)
├── styled.ts          # MUI styling functions (COMMON - most components have this)
├── components/        # Optional: sub-components when component needs more logic
└── [domain].ts        # Optional: domain-specific files (e.g., formatters.ts)
```

**Typical Component Structure**:
```
ComponentName/
├── index.tsx          # Component implementation
├── actions.ts         # Logic specific to THIS component only
├── styled.ts          # Styles specific to THIS component only
└── components/        # Sub-components when component grows complex
    ├── index.ts       # Export sub-components
    └── SubComponent/
        ├── index.tsx
        ├── actions.ts
        └── styled.ts
```

### Page Structure (`/app/**/page.tsx`)

Pages should be **thin orchestrators** that delegate to components:

```typescript
'use client'

import { PageWrapper } from '@/components'
import { useFileHelper } from '@/hooks'

import { StatsPage } from './components'

const Page = () => {
  const { selectedFiles } = useFileHelper()

  // Simple conditional logic only
  if (!selectedFiles.length) {
    return <PageWrapper>No data</PageWrapper>
  }

  // Delegate to component for actual implementation
  return <StatsPage />
}

export default Page
```

**Pattern Rules**:
- Keep page.tsx under 60 lines
- No complex logic—delegate to `./components`
- Extract heavy components to `./components/{ComponentName}/index.tsx`
- Each route can have `page.tsx`, `styled.ts`, and optionally `actions.tsx`

### Component Structure

**Top-level components** (`/components/**`):
```
ComponentName/
├── index.tsx          # Main component (default export)
├── styled.ts          # MUI sx objects (optional)
├── components/        # Sub-components (optional)
│   ├── index.ts       # Export sub-components
│   └── SubComponent/
│       ├── index.tsx
│       └── styled.ts
```

**Page-level components** (`/app/**/components/**`):
Follow same structure as top-level components but are specific to that route.

**Component File Pattern**:
```typescript
'use client' // Only if needed

import { Box, Typography } from '@mui/material'

import type { StatsFile } from '@/types'
import { useStorage } from '@/context/Storage'

import { ui } from './styled' // If styled.ts exists

type ComponentProps = {
  file: StatsFile
}

const Component = ({ file }: ComponentProps) => {
  const sx = ui() // From styled.ts
  const { removeFiles } = useStorage()

  return (
    <Box sx={sx.container}>
      <Typography>{file.file.name}</Typography>
    </Box>
  )
}

export default Component
```

**Rules**:
- Default export only
- Props type defined inline or above component
- Use arrow function syntax
- Name it `Component` (not descriptive names)
- Extract sub-components when a component exceeds ~100 lines
- Keep render logic simple—extract logic to `actions.ts` or `components/` subfolder
- **Most components should have `actions.ts` and `styled.ts`** for separation of concerns

### Styling Pattern (`styled.ts`)

MUI styles are defined in `styled.ts` files using a function pattern:

```typescript
export const ui = () => {
  return {
    container: {
      py: 2,
      px: 3,
      borderRadius: 1,
    },

    // Functions for dynamic styles
    card: (isActive: boolean) => ({
      opacity: isActive ? 1 : 0.6,
      cursor: 'pointer',
    }),
  }
}
```

**Usage in component**:
```typescript
import { ui } from './styled'

const Component = () => {
  const sx = ui()
  return <Box sx={sx.container}>...</Box>
}
```

### Utility Structure (`/utils/**/`)

Each utility domain follows this pattern:
```
DomainName/
├── index.ts           # Public API: export * from './...'
├── utils.ts           # Main implementation
├── formatters.ts      # Optional: specific concern (formatters, validators, etc.)
```

**index.ts** (exports only):
```typescript
export * from './formatters'
export * from './utils'
```

**utils.ts** (implementation):
```typescript
import { parse } from 'date-fns'

import type { SortOrder, SystemDateString } from '@/types'
import { MISC } from '@/common'

export const sortByDate = (dateA: SystemDateString, dateB: SystemDateString, orderBy: SortOrder): number => {
  const timeA = parse(dateA, MISC.SYSTEM_DATE_FORMAT, new Date()).getTime()
  const timeB = parse(dateB, MISC.SYSTEM_DATE_FORMAT, new Date()).getTime()
  return orderBy === 'asc' ? timeA - timeB : timeB - timeA
}
```

**Rules**:
- Pure functions only (no side effects)
- Each function should do one thing well
- Export individual functions (not default export)
- Group related functions in domain-specific files

### Type Organization (`/types/**/`)

Types are organized by domain:
```
types/
├── index.ts           # export * from './...'
├── global.ts          # App-wide types (DateRange, SelectOption, etc.)
├── stats-file.ts      # Domain-specific types (StatsFile, ParsedContentRow)
└── utils.ts           # Context, hook, and utility types (Parser, StorageContextState)
```

**Type Definition Pattern**:
```typescript
import type { ReactNode } from 'react'
import { z } from 'zod'

// Use Zod for runtime validation
export const zDateRange = z.object({
  start: z.date(),
  end: z.date().nullable(),
})
export type DateRange = z.infer<typeof zDateRange>

// Standard TypeScript types
export type SelectOptionWithType<T> = {
  value: T
  label: ReactNode
  labelSecondary?: ReactNode
}
```

**Rules**:
- Use `type` over `interface` for consistency
- Use Zod for types that need runtime validation
- Separate "at rest" types (storage) from "in memory" types (with Big.js)
- Use `import type` for type-only imports

### Enum/Constant Pattern (`/types-enums/**/`)

Use `as const` pattern for type-safe enums:

```typescript
export const ColorMode = {
  SYSTEM: 'system',
  LIGHT: 'light',
  DARK: 'dark',
} as const

export type ColorMode = (typeof ColorMode)[keyof typeof ColorMode]
```

**Exception**: Use traditional `enum` only when needed (e.g., `Currency`).

### Context Pattern (`/context/**/`)

Each context follows this structure:
```
ContextName/
├── index.ts           # export { ContextProvider, useContext }
├── context.tsx        # Context implementation
└── helper.ts          # Helper functions for context
```

**context.tsx pattern**:
```typescript
'use client'

import { createContext, useContext, useMemo } from 'react'
import type { ReactNode } from 'react'

import type { StorageContextState } from '@/types'

const StorageContext = createContext<StorageContextState | null>(null)

type StorageContextProviderProps = {
  children: ReactNode
}

export const StorageProvider = ({ children }: StorageContextProviderProps) => {
  // State and logic here

  const value = useMemo(() => {
    return {
      // Context value
    }
  }, [/* dependencies */])

  return <StorageContext.Provider value={value}>{children}</StorageContext.Provider>
}

export const useStorage = () => {
  const context = useContext(StorageContext)
  if (!context) {
    throw new Error('Please ensure to wrap your component in a "StorageProvider"!')
  }
  return context
}
```

**Rules**:
- Export both Provider and hook from same file
- Always wrap value in `useMemo`
- Hook should throw error if used outside provider
- Keep context logic minimal—delegate complex logic to utils

### Hook Pattern (`/hooks/**/`)

Hooks are simple, single-purpose files:

```typescript
'use client'

import { useStorage } from '@/context/Storage'

export const useFileHelper = () => {
  const { files, selectedFileIds } = useStorage()

  const selectedFiles = files.filter((file) => selectedFileIds.includes(file.id))
  const errorFiles = files.filter((file) => file.error)

  return {
    selectedFiles,
    errorFiles,
  }
}
```

**Rules**:
- One hook per file
- Use `use` prefix
- Keep hooks focused on a single concern
- Export from `/hooks/index.ts`

### Action/Helper Files (`actions.ts` or `actions.tsx`)

**Most components have an `actions.ts` file** for component-specific logic.

```typescript
import type { BankSelectOption, StatsFile } from '@/types'
import { AVAILABLE_PARSERS } from '@/utils/Parsers'

export const getBankSelectOptions = (selectedFiles: StatsFile[]): BankSelectOption[] => {
  // Implementation specific to this component
}

export const calculateChartOptions = (theme: Theme, isDarkMode: boolean) => {
  // Chart configuration specific to this component
}
```

**When to use `actions.ts` in component**:
- Functions used ONLY by this component
- Functions that use component-specific types
- Business logic that doesn't need to be shared yet
- Helper functions for formatting/calculating data for THIS component

**When to move to global `/utils` or `/hooks`**:
- **Rule of 3**: Only when logic is used in 3+ different places in the app
- Example: If 3 different components need `formatCurrency()`, move to `/utils/Currency/`

**When NOT to use**:
- Already-reusable functions → check if `/utils` has it first
- React hooks with state → use component's `components/` subfolder or local hooks

### Constants Pattern (`/common/**/`)

App-wide constants organized by domain:
```
common/
├── index.ts           # export * from './...'
├── misc.ts            # MISC constants
├── routes.ts          # ROUTES constants
└── layout.ts          # LAYOUT constants (if needed)
```

**Example**:
```typescript
// common/routes.ts
export const ROUTES = {
  HOME: '/',
  DATA: '/data',
  STATS: '/stats',
  SETTINGS: '/settings',
} as const
```

### Parser Pattern (`/utils/Parsers/**/`)

Each bank parser follows this structure:
```
BankName/
├── index.ts           # export * from './account-type'
└── account-type.ts    # Parser implementation (e.g., savings.ts, giro.ts)
```

**Parser Implementation**:
```typescript
import type { ParsedContentRow, Parser } from '@/types'
import { ParserId } from '@/types-enums'
import { Big } from '@/lib/w-big'

import { toDisplayDate } from '../../Date'

export const CapitecSavings: Parser = {
  id: ParserId.CAPITEC,
  bankName: 'Capitec',
  accountType: 'Savings',
  expectedHeaderRowIndex: 0,
  expectedHeaders: ['Nr', 'Account', 'Posting Date', /* ... */],

  detect: (input) => {
    return isEqual(input.data[CapitecSavings.expectedHeaderRowIndex], CapitecSavings.expectedHeaders)
  },

  parse: (input, locale) => {
    const rowsToParse = input.data
      .slice(CapitecSavings.expectedHeaderRowIndex + 1)
      .filter((row) => row.length === CapitecSavings.expectedHeaders.length)

    return rowsToParse.map((row) => {
      const [nr, account, postingDate, /* ... */] = row

      const data: ParsedContentRow = {
        date: toDisplayDate(transactionDate, locale, {
          formatTo: 'dd/MM/yyyy',
          formatFrom: 'yyyy-MM-dd HH:SS',
        }),
        description,
        value: moneyIn ? Big(moneyIn) : Big(moneyOut).times(-1),
      }

      return data
    })
  },
}
```

**Rules**:
- Parser object must implement `Parser` type
- Use `detect()` method to identify matching CSV
- `parse()` must return `ParsedContentRow[]`
- Use `Big` for all monetary values
- Register parser in `utils/Parsers/index.ts` and `AVAILABLE_PARSERS`

## Code Style

- **ESLint**: Configured with TypeScript and React rules (see `eslint.config.js`)
- **Prettier**: 120 char line width, no semicolons, single quotes, trailing commas
- **React**: Arrow function components only (use `const Component = () => {}`)
- **TypeScript**: Strict mode enabled, always use `import type` for type-only imports
- **Naming**: Component files use `index.tsx`, export `default Component`
- **Exports**: Prefer named exports; use default export only for components

## When to Create New Files vs. Extend Existing

### Create a New File When:

1. **New component** → Create `ComponentName/index.tsx` + `actions.ts` + `styled.ts`
2. **Component exceeds ~100 lines** → Extract sub-component to `./components/SubComponent/`
3. **Component needs more complex logic** → Create `./components/` subfolder with sub-components
4. **New page/route** → Create new route directory in `/app/new-route/`
5. **Logic used 3+ times** → Create new utility in `/utils/NewDomain/` or hook in `/hooks/`
6. **New context** → Create new context directory in `/context/NewContext/`
7. **New bank parser** → Create new directory in `/utils/Parsers/BankName/`

### Add to Existing File When:

1. **Helper for THIS component only** → Add to component's `actions.ts` (used 1-2 times)
2. **Utility function fits existing domain** → Add to `/utils/ExistingDomain/utils.ts`
3. **Type fits existing domain** → Add to `/types/existing-domain.ts`
4. **Constant fits existing category** → Add to `/common/existing.ts`
5. **Enum value** → Add to existing enum in `/types-enums/index.ts`

### The "Rule of 3" for Extraction:

**Keep it local until used 3+ times**, then extract to global:

```
Used 1-2 times → Keep in component's actions.ts
Used 3+ times  → Move to /utils or /hooks or /components
```

**Example**:
- `formatBankName()` used only in `BankChip` → Keep in `BankChip/actions.ts`
- `formatCurrency()` used in `BankChip`, `Summary`, `StatsPage` → Move to `/utils/Currency/`

### File Size Guidelines:

- **Components**: 50-100 lines ideal, max 150 lines before extracting sub-components
- **Utils**: 100-200 lines per file, split by concern if larger
- **Types**: No strict limit, but group by domain
- **Pages**: 30-60 lines ideal (should be thin)

## Code Organization Philosophy

### Locality First, Extract When Needed

**Start local → Extract only when reused 3+ times**

1. **First component** → Logic in `ComponentName/actions.ts`
2. **Second component needs it** → Copy to second component's `actions.ts` (that's ok!)
3. **Third component needs it** → NOW extract to `/utils` or `/hooks`

**Why?**: Premature abstraction is worse than a little duplication. Wait until you see the pattern clearly.

### Component Growth Pattern

```
Simple Component (50 lines)
├── index.tsx
├── actions.ts    ← Component-specific helpers
└── styled.ts     ← Component-specific styles

↓ Component grows (100+ lines)

Complex Component
├── index.tsx     ← Orchestrator only
├── actions.ts    ← Shared helpers
├── styled.ts     ← Shared styles
└── components/   ← Sub-components with their own actions.ts & styled.ts
    ├── index.ts
    ├── SubComponentA/
    │   ├── index.tsx
    │   ├── actions.ts
    │   └── styled.ts
    └── SubComponentB/
        ├── index.tsx
        ├── actions.ts
        └── styled.ts
```

## Anti-Patterns to Avoid

❌ **DON'T**: Prematurely extract to global utils
```typescript
// BAD: Used once, but already in /utils
// utils/BankName/utils.ts
export const formatBankName = (name: string) => name.toUpperCase()

// Only used in BankChip component
```

✅ **DO**: Keep it local until used 3+ times
```typescript
// GOOD: Keep in component's actions.ts until reused
// components/BankChip/actions.ts
export const formatBankName = (name: string) => name.toUpperCase()
```

---

❌ **DON'T**: Put business logic in page.tsx
```typescript
// BAD: Heavy logic in page
const Page = () => {
  const [data, setData] = useState([])
  const processData = () => { /* 50 lines of logic */ }
  // ... lots of code
}
```

✅ **DO**: Extract to component or hook
```typescript
// GOOD: Delegate to component
const Page = () => {
  return <StatsPage />
}
```

---

❌ **DON'T**: Mix concerns in a single file
```typescript
// BAD: Component + complex calculations + data fetching
const Component = () => {
  const calculateComplexStats = () => { /* ... */ }
  const fetchData = () => { /* ... */ }
  // rendering logic
}
```

✅ **DO**: Separate concerns
```typescript
// GOOD: Use utils and hooks
import { calculateComplexStats } from '@/utils/Stats'
import { useDataFetcher } from '@/hooks'

const Component = () => {
  const data = useDataFetcher()
  const stats = calculateComplexStats(data)
  // clean rendering logic
}
```

---

❌ **DON'T**: Create monolithic utility files
```typescript
// BAD: utils/helpers.ts with 500 lines of unrelated functions
export const formatDate = () => {}
export const parseCSV = () => {}
export const validateEmail = () => {}
```

✅ **DO**: Organize by domain
```typescript
// GOOD: Separate domains
// utils/Date/utils.ts
export const formatDate = () => {}

// utils/FileParser/utils.ts
export const parseCSV = () => {}

// utils/Validation/utils.ts
export const validateEmail = () => {}
```

---

❌ **DON'T**: Deeply nest components
```typescript
// BAD: components/Layout/Header/Menu/Item/Button/Icon/index.tsx
```

✅ **DO**: Keep hierarchy flat
```typescript
// GOOD: components/Layout/components/MenuItem/index.tsx
```

---

❌ **DON'T**: Export default for utilities or types
```typescript
// BAD
export default function formatDate() {}
```

✅ **DO**: Use named exports
```typescript
// GOOD
export const formatDate = () => {}
```

---

❌ **DON'T**: Import from nested paths
```typescript
// BAD
import { formatDate } from '@/utils/Date/utils'
```

✅ **DO**: Import from index
```typescript
// GOOD
import { formatDate } from '@/utils/Date'
```

## Important Notes

- All data processing is **client-side only**—never add server-side file processing
- Use `Big` from `@/lib/w-big` for all monetary calculations (never native numbers)
- Dates in storage must be ISO strings (`DateTimeString`)
- Support both light and dark themes (using MUI theme + custom context)
- Support EN and DE locales (with proper i18n)
- Respect user privacy: no tracking, no accounts, no data uploads
- Service worker (Serwist) is disabled in development mode
- Production builds use webpack (not turbopack) for better optimization
- All constants should be in `common/` directory (MISC, ROUTES, etc.)
- Maintain import order as defined in `.prettierrc`
- **Keep files focused**: Split large components/utils into smaller, focused files
- **Separate concerns**: Don't mix component logic with data fetching or calculations
- **Favor many small files over few large files**: Easier to navigate and maintain
