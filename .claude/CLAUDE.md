# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

fstats is a privacy-focused CSV bank statement parser built with Next.js 16. All CSV parsing and data storage happens entirely client-side using IndexedDB via LocalForage—no data is uploaded to servers. The app uses TanStack Query for client-side data management and supports multiple South African and European banks.

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
```

**Note**: There are currently no tests in this project (`pnpm test` will just echo a message).

## Architecture

### Directory Structure

- **`/app`** - Next.js App Router pages and layouts (Routes: `/`, `/data`, `/stats`, `/settings`)
- **`/components`** - Reusable UI components and provider components (StorageProvider, QueryProvider, ThemeProvider, LanguageProvider, ChartProvider)
- **`/m-stats-file`** - Stats file management module (api/, service/)
- **`/types`** - TypeScript type definitions (global.ts, parser.ts, services/, lib/)
- **`/types-enums`** - Enum-like constants (ColorMode, UserLocale, ParserId, DateFormat, WeekStartsOn, StatsFileStatus)
- **`/utils`** - Domain-organized utilities (Date/, File/, FileParser/, Parsers/, Features/, LocalStorage/, Logger/, Misc/)
- **`/lib`** - Third-party library configs (i18n.ts, localforage.ts, tanstack-query.ts, chartjs.ts, w-big.ts, w-lodash.ts)
- **`/common`** - App-wide constants (misc.ts, routes.ts, config.ts)
- **`/hooks`** - Custom React hooks (useIsDarkMode, useIsMobile, useUserPreferences, useFileHelper, useDarkModeMetaTagUpdater)
- **`/styles`** - Global styles and MUI theme configuration
- **`/_data`** - Sample CSV files for testing (excluded from build)

### Modular Architecture (Feature Modules)

Complex features are organized into self-contained modules with a two-layer structure:

```
m-{feature-name}/
├── api/              # Layer 1: Data Access
│   ├── queries.ts    # CRUD operations (getFiles, addFile, etc.)
│   ├── helper.ts     # Data transformation (At Rest ↔ In Memory)
│   └── index.ts      # Public API exports
└── service/          # Layer 2: Service Layer
    ├── hooks.ts      # TanStack Query hooks (useFiles, useMutateAddFile)
    ├── keys.ts       # Query key factory
    ├── helper.ts     # Service-level helper functions
    └── index.ts      # Public service exports
```

**Layer Responsibilities**:
1. **API Layer** - LocalForage/API operations, data transformation, pure async functions (no React hooks)
2. **Service Layer** - React Query hooks, cache management, optimistic updates, service-level business logic

**Importing Rules**:
```typescript
// ✅ Components use service hooks
import { useFiles, useMutateAddFile } from '@/m-stats-file/service'

// ❌ Don't import API in components (use service hooks instead)
import { getFiles } from '@/m-stats-file/api'  // Wrong for components

// ✅ API can be used in server actions/utils
import { getFiles } from '@/m-stats-file/api'  // OK in non-React code
```

### Data Flow Architecture

```
Component → Service Hook → API Layer → LocalForage → IndexedDB
            (hooks.ts)      (queries.ts)  (lib)
```

**State Management**:
- **TanStack Query** - Async/server state (files from IndexedDB) with caching and automatic refetching
- **LocalStorage** - User preferences (via `usehooks-ts` `useLocalStorage`)
- **React Context** - NOT used (replaced by TanStack Query + providers)

**Provider Hierarchy** (app/layout.tsx):
```tsx
<StorageProvider>              {/* Initializes LocalForage */}
  <QueryProvider>              {/* TanStack Query client */}
    <ThemeProvider>            {/* MUI theme + color mode */}
      <LanguageProvider>       {/* i18next */}
        <ChartProvider>        {/* Chart.js config */}
          <Layout>{children}</Layout>
        </ChartProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryProvider>
</StorageProvider>
```

**Data Transformation** (At Rest ↔ In Memory):
- **At Rest**: `value: string` (serializable for IndexedDB)
- **In Memory**: `value: Big` (precise decimal arithmetic)
- Helper functions (`syncStatsFile`, `parseStatsFile`) handle conversion

### Import Order

Enforced via Prettier plugin:
1. Third-party modules
2. `@/types` and `@/types-enums`
3. `@/common`
4. `@/components`
5. `@/m-*` (feature modules)
6. `@/hooks`
7. `@/styles`
8. `@/utils`
9. `@/lib`
10. `@/public`
11. Relative imports (`./` or `../`)

## Adding a New Bank Parser

**Currently Implemented Parsers**: CAPITEC (Savings), COMDIRECT (Giro)

To add a new bank parser:

1. **Add ParserId** to `types-enums/index.ts`:
```typescript
export const ParserId = {
  CAPITEC: 'capitec__savings',
  COMDIRECT_GIRO: 'comdirect__giro',
  NEW_BANK: 'new_bank__account_type', // New
} as const
```

2. **Create parser** `utils/Parsers/NewBank/account-type.ts`:
```typescript
import type { ParsedContentRow, Parser } from '@/types'
import { ParserId } from '@/types-enums'
import { isEqual } from '@/utils/Misc'
import { Big } from '@/lib/w-big'
import { toDisplayDate } from '../../Date'

export const NewBankAccountType: Parser = {
  id: ParserId.NEW_BANK,
  bankName: 'New Bank',
  accountType: 'Account Type',
  expectedHeaderRowIndex: 0,
  expectedHeaders: ['Date', 'Description', 'Amount', 'Balance'],

  detect: (input) => {
    return isEqual(input.data[NewBankAccountType.expectedHeaderRowIndex], NewBankAccountType.expectedHeaders)
  },

  parse: (input, locale) => {
    const rowsToParse = input.data
      .slice(NewBankAccountType.expectedHeaderRowIndex + 1)
      .filter((row) => row.length === NewBankAccountType.expectedHeaders.length)

    return rowsToParse.map((row) => {
      const [date, description, amount] = row
      return {
        date: toDisplayDate(date, locale, { formatFrom: 'dd/MM/yyyy', formatTo: 'dd/MM/yyyy' }),
        description,
        value: Big(amount || 0),
      }
    })
  },
}
```

3. **Export** from `utils/Parsers/NewBank/index.ts`:
```typescript
export { NewBankAccountType } from './account-type'
```

4. **Register** in `utils/Parsers/index.ts`:
```typescript
import { NewBankAccountType } from './NewBank'

export const AVAILABLE_PARSERS = {
  [ParserId.CAPITEC]: CapitecSavings,
  [ParserId.COMDIRECT_GIRO]: ComdirectGiro,
  [ParserId.NEW_BANK]: NewBankAccountType, // Register
} satisfies Record<ParserId, Parser>
```

## Working with TanStack Query

### Reading Data
```typescript
import { useFiles } from '@/m-stats-file/service'

const Component = () => {
  const { data: files = [], isLoading, error } = useFiles()

  if (isLoading) return <Loading />
  if (error) return <Error error={error} />
  return <FileList files={files} />
}
```

### Writing Data
```typescript
import { useMutateAddFile } from '@/m-stats-file/service'

const Component = () => {
  const { mutate: addFile, isPending } = useMutateAddFile()

  const handleSubmit = (data) => {
    addFile(data, {
      onSuccess: (result) => console.log('Added:', result),
      onError: (error) => console.error('Failed:', error)
    })
  }

  return <Form onSubmit={handleSubmit} disabled={isPending} />
}
```

**Available Mutations**: `useMutateAddFile`, `useMutateAddFiles`, `useMutateUpdateFile`, `useMutateUpdateFiles`, `useMutateRemoveFile`, `useMutateRemoveFiles`, `useMutateRemoveAllFiles`

### Cache Management

TanStack Query automatically invalidates cache after mutations. Query keys:
```typescript
export const statsFileKey = {
  all: ['stats-file'] as const,
  detail: (id: string) => ['stats-file', id] as const,
}
```

## Technology Stack

- **Framework**: Next.js 16.1.6 (App Router, Turbopack dev / Webpack production)
- **React**: 19.2.4 | **TypeScript**: 5.9.3
- **UI**: MUI v7 with Emotion
- **Data Fetching**: @tanstack/react-query v5
- **CSV Parsing**: PapaParse
- **Charts**: Chart.js with react-chartjs-2
- **Forms**: react-hook-form with zod
- **File Upload**: react-dropzone
- **Number Precision**: big.js | **Date**: date-fns v4
- **i18n**: next-i18next, i18next, react-i18next
- **Storage**: localforage (IndexedDB)
- **Utilities**: lodash, usehooks-ts
- **PWA**: @serwist/next

## Code Organization Patterns

### File Structure Principles

**Golden Rule**: Less code in correct places > overwhelming single files with lots of code.

**Locality Rule**: Keep logic close to where it's used. Only extract to global when used 3+ times.

```
DirectoryName/
├── index.ts(x)        # Public API: exports only
├── utils.ts           # Implementation
├── actions.ts(x)      # Component-specific logic (COMMON)
├── styled.ts          # MUI styles (COMMON)
├── components/        # Sub-components when needed
└── [domain].ts        # Optional domain-specific files
```

### Component Pattern

```typescript
'use client' // Only if needed

import { Box, Typography } from '@mui/material'
import type { StatsFile } from '@/types'
import { useMutateRemoveFile } from '@/m-stats-file/service'
import { ui } from './styled'

type ComponentProps = {
  file: StatsFile
}

const Component = ({ file }: ComponentProps) => {
  const sx = ui()
  const { mutate: removeFile } = useMutateRemoveFile()

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
- Arrow function syntax
- Name it `Component` (not descriptive names)
- Extract sub-components when >100 lines
- Most components have `actions.ts` and `styled.ts`

### Page Pattern

Pages are **thin orchestrators**:

```typescript
'use client'
import { PageWrapper } from '@/components'
import { useFileHelper } from '@/hooks'
import { StatsPage } from './components'

const Page = () => {
  const { selectedFiles } = useFileHelper()

  if (!selectedFiles.length) {
    return <PageWrapper>No data</PageWrapper>
  }

  return <StatsPage />
}

export default Page
```

**Rules**: Keep page.tsx under 60 lines, no complex logic, delegate to `./components`

### Hook Pattern

**Hook Hierarchy**:
1. **Service Hooks** (`m-*/service/hooks.ts`) - TanStack Query hooks
2. **Composition Hooks** (`/hooks/*.ts`) - Combine service hooks + derived data
3. **Utility Hooks** (`/hooks/*.ts`) - Simple reusable hooks

```typescript
// Composition hook
import { useLocalStorage } from 'usehooks-ts'
import { MISC } from '@/common'
import { useFiles } from '@/m-stats-file/service'

export const useFileHelper = () => {
  const [selectedFileIds] = useLocalStorage(MISC.LS_SELECTED_FILE_IDS_KEY, [])
  const { data: files = [] } = useFiles()

  return {
    files,
    selectedFiles: files.filter(f => selectedFileIds.includes(f.id)),
    errorFiles: files.filter(f => f.error),
  }
}
```

### Styling Pattern

```typescript
// styled.ts
export const ui = () => ({
  container: {
    py: 2,
    px: 3,
    borderRadius: 1,
  },
  card: (isActive: boolean) => ({
    opacity: isActive ? 1 : 0.6,
    cursor: 'pointer',
  }),
})

// Usage in component
import { ui } from './styled'
const Component = () => {
  const sx = ui()
  return <Box sx={sx.container}>...</Box>
}
```

### User Preferences Pattern

```typescript
import { useLocalStorage } from 'usehooks-ts'
import { MISC } from '@/common'

const Component = () => {
  const [colorMode, setColorMode] = useLocalStorage(MISC.LS_COLOR_MODE_KEY, 'system')
  return <Settings colorMode={colorMode} onColorModeChange={setColorMode} />
}
```

## Common Anti-Patterns to Avoid

❌ **Don't call API directly from components**
```typescript
// BAD
import { getFiles } from '@/m-stats-file/api'
const Component = () => {
  const [files, setFiles] = useState([])
  useEffect(() => { getFiles().then(setFiles) }, [])
}

// GOOD
import { useFiles } from '@/m-stats-file/service'
const Component = () => {
  const { data: files = [] } = useFiles()
}
```

❌ **Don't use React Context for async state**
```typescript
// BAD - Context for file data
const FileContext = createContext()

// GOOD - Use TanStack Query
const { data: files = [] } = useFiles()
```

❌ **Don't manually manage cache**
```typescript
// BAD
const addFile = async (file) => {
  await addFileAPI(file)
  const newFiles = await getFiles() // Manual refetch
  setFiles(newFiles)
}

// GOOD
const { mutate: addFile } = useMutateAddFile() // Auto-invalidates cache
```

❌ **Don't put business logic in page.tsx** - Delegate to components

❌ **Don't prematurely extract to global utils** - Keep local until used 3+ times

## Quick Reference

### Common Imports
```typescript
// Types
import type { StatsFile, ParsedContentRow } from '@/types'
import { ParserId, StatsFileStatus } from '@/types-enums'

// Service hooks
import { useFiles, useMutateAddFile } from '@/m-stats-file/service'

// Composition hooks
import { useFileHelper, useIsDarkMode, useUserPreferences } from '@/hooks'

// Utils
import { formatDate, toDisplayDate } from '@/utils/Date'
import { AVAILABLE_PARSERS } from '@/utils/Parsers'
import { Big } from '@/lib/w-big'

// Constants
import { MISC, ROUTES, CONFIG } from '@/common'

// User preferences
import { useLocalStorage } from 'usehooks-ts'
```

### Where to Put New Code

1. **New feature with data persistence?** → Create `/m-{feature}/` with api/service layers
2. **Reusable UI component?** → Add to `/components/ComponentName/`
3. **Utility function used 3+ times?** → Add to `/utils/DomainName/`
4. **Composition of service hooks?** → Add to `/hooks/useHookName.ts`
5. **Component-specific logic?** → Add to component's `actions.ts`
6. **Styling?** → Add to component's `styled.ts`
7. **Type definition?** → Add to `/types/` or `/types-enums/`
8. **Constant?** → Add to `/common/`
9. **Bank parser?** → Add to `/utils/Parsers/BankName/`
10. **Provider?** → Add to `/components/{Name}Provider/`

### Decision Tree

```
Need to fetch/store data?
├─ Yes → Use TanStack Query
│   ├─ File-related CRUD → Use m-stats-file hooks
│   └─ New feature → Create m-{feature}/ module with api/service layers
└─ No → Is it used 3+ times?
    ├─ Yes → Move to /utils or /hooks
    └─ No → Keep in component's actions.ts
```

## Important Rules

### Core Principles
- All data processing is **client-side only**
- Use `Big` from `@/lib/w-big` for monetary calculations (never native numbers)
- Dates in storage must be ISO strings (`DateTimeString`)
- Support light/dark themes and EN/DE locales
- Privacy-first: no tracking, no accounts, no data uploads

### Architecture Patterns
- **Use TanStack Query for data fetching** - Don't use React Context for async state
- **Feature modules** (`m-*/`) for complex features with data persistence
- **Service hooks** for data access, **composition hooks** for convenience
- **Transform data** between "at rest" (strings) and "in memory" (Big.js)
- **Provider components** for initialization only, not state management

### Development Guidelines
- Use `pnpm` (never npm/yarn)
- Turbopack for dev, Webpack for production builds
- Maintain import order as defined in `.prettierrc`
- Keep files focused and small (50-100 lines for components)
- Separate concerns: no mixed component/data/calculation logic

### Data Access Rules
- ✅ Components use service hooks from `m-*/service/`
- ✅ Service hooks use API layer from `m-*/api/`
- ❌ Components should NOT import API layer directly
- ❌ Don't use React Context for async/server state
- ❌ Don't bypass service hooks to call API directly

### Code Style
- **ESLint**: TypeScript and React rules
- **Prettier**: 120 char line width, no semicolons, single quotes, trailing commas
- **React**: Arrow function components only
- **TypeScript**: Strict mode, `import type` for type-only imports
- **Exports**: Named exports (except components use default export)
