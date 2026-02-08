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

# Sitemap generation (runs automatically after build)
pnpm postbuild
```

**Note**: There are currently no tests in this project (`pnpm test` will just echo a message).

## Architecture

### Directory Structure

- **`/app`** - Next.js App Router pages and layouts
  - Routes: `/` (home), `/data` (file upload), `/stats` (analysis), `/settings`
  - Each route is a directory with `page.tsx`, optional `styled.ts`, and `actions.tsx`

- **`/components`** - Reusable UI components
  - Provider components: `StorageProvider`, `QueryProvider`, `ThemeProvider`, `LanguageProvider`, `ChartProvider`
  - UI components: `Layout`, `PageWrapper`, `BarChart`, `LineChart`, various drawers and form fields

- **`/m-stats-file`** - Stats file management module (following modular architecture pattern)
  - `api/` - Data access layer with LocalForage CRUD operations
    - `queries.ts` - Database operations (getFiles, addFile, updateFile, removeFile, etc.)
    - `helper.ts` - Data transformation between "at rest" (stored) and "in memory" (with Big.js) formats
  - `service/` - Service layer with React Query hooks
    - `hooks.ts` - TanStack Query hooks (useFiles, useMutateAddFile, etc.)
    - `keys.ts` - Query key factory for cache management
    - `helper.ts` - Service-level helper functions
  - `core/` - Core domain logic (currently empty, reserved for business logic)

- **`/m-user`** - User preferences module (modular architecture pattern)
  - `m-user/` - User domain types and logic
  - `m-user-api/` - User API layer
  - `m-user-service/` - User service hooks
  - `m-user-utility/` - User utility functions

- **`/types`** - TypeScript type definitions organized by domain
  - `global.ts` - App-wide types (DateRange, SelectOption, etc.)
  - `parser.ts` - Parser-related types
  - `utils.ts` - Utility types
  - `services/` - Service-specific types
    - `stats-file.ts` - StatsFile and StatsFileAtRest types
    - `parsed-content-row.ts` - ParsedContentRow types
  - `lib/` - Library-specific type extensions
    - `papaparse.ts` - PapaParse type extensions
    - `react-dropzone.ts` - React Dropzone type extensions

- **`/types-enums`** - Enum-like constants with TypeScript types (ColorMode, UserLocale, ParserId, DateFormat, WeekStartsOn, StatsFileStatus)

- **`/utils`** - Domain-organized utility functions
  - `Date/` - Date formatting and manipulation
  - `File/` - File validation and handling
  - `FileParser/` - CSV parsing orchestration
  - `Parsers/` - Bank-specific parsers (Capitec, Comdirect)
  - `Features/` - Feature flags and feature utilities
  - `LocalStorage/` - LocalStorage helpers
  - `Logger/` - Console logging utilities
  - `Misc/` - Miscellaneous utilities

- **`/lib`** - Third-party library configurations and wrappers
  - `i18n.ts` - i18next configuration
  - `localforage.ts` - LocalForage initialization and DB instance
  - `tanstack-query.ts` - TanStack Query client configuration
  - `chartjs.ts` - Chart.js configuration
  - `w-big.ts` - big.js wrapper
  - `w-lodash.ts` - lodash wrapper

- **`/common`** - App-wide constants
  - `misc.ts` - MISC constants (localStorage keys, formats, etc.)
  - `routes.ts` - ROUTES constants
  - `config.ts` - CONFIG constants (feature flags, env-based config)

- **`/hooks`** - Custom React hooks
  - `useIsDarkMode.ts` - Dark mode detection
  - `useIsMobile.ts` - Mobile device detection
  - `useUserPreferences.ts` - User preference management
  - `useFileHelper.ts` - File helper hook (wraps useFiles from m-stats-file)
  - `useDarkModeMetaTagUpdater.ts` - Meta tag updater for dark mode

- **`/styles`** - Global styles and MUI theme configuration

- **`/_data`** - Sample CSV files for testing (not part of the app, excluded from build)

### Understanding the Modular Architecture

**Feature Modules Pattern** (`m-{feature-name}/`):
The app uses a modular architecture where complex features are organized into self-contained modules with a consistent three-layer structure:

```
m-stats-file/                    # Feature module for stats file management
├── api/                         # Layer 1: Data Access Layer
│   ├── index.ts                 # Exports all API functions
│   ├── queries.ts               # CRUD operations (getFiles, addFile, etc.)
│   └── helper.ts                # Data transformation helpers
├── service/                     # Layer 2: Service Layer
│   ├── index.ts                 # Exports all service hooks
│   ├── hooks.ts                 # React Query hooks (useFiles, useMutateAddFile)
│   ├── keys.ts                  # Query key factory for cache management
│   └── helper.ts                # Service-level helpers
└── core/                        # Layer 3: Business Logic Layer
    └── {domain-logic}.ts        # Pure business logic (domain-specific)
```

**Layer Responsibilities**:

1. **API Layer** (`api/`):
   - Direct interaction with data sources (LocalForage, external APIs)
   - CRUD operations that return promises
   - Data transformation between storage and in-memory formats
   - Pure async functions, no React hooks
   - Example: `getFiles()`, `addFile(file)`, `syncStatsFile(file)`

2. **Service Layer** (`service/`):
   - React Query hooks that wrap API calls
   - Cache management and invalidation logic
   - Optimistic updates and error handling
   - Query key factories for consistent cache keys
   - Example: `useFiles()`, `useMutateAddFile()`, `statsFileKey.all`

3. **Core Layer** (`core/`):
   - Pure business logic functions
   - Domain-specific calculations and validations
   - No side effects, no API calls, no React hooks
   - Easily testable
   - Example: calculations, formatters, validators specific to the domain

**When to Create a Feature Module**:
- Feature requires data persistence (LocalForage/API)
- Feature needs complex state management with caching
- Feature has significant business logic
- Feature will be reused across multiple pages/components

**When NOT to Create a Feature Module**:
- Simple UI-only components → Use `/components`
- Simple utilities → Use `/utils`
- Shared hooks without data fetching → Use `/hooks`

**Importing from Modules**:
```typescript
// ✅ CORRECT: Import from service layer in components
import { useFiles, useMutateAddFile } from '@/m-stats-file/service'

// ❌ WRONG: Don't import API layer directly in components
import { getFiles } from '@/m-stats-file/api'  // Components should use hooks, not direct API calls

// ✅ CORRECT: API layer can be used in server components or non-React code
import { getFiles } from '@/m-stats-file/api'  // OK in server actions or utility functions
```

**Current Feature Modules**:
- `m-stats-file/` - File management (upload, parse, store, retrieve CSV files)
- `m-user/` - User preferences and settings (planned/in development)

### Key Architectural Patterns

**Modular Architecture (Feature Modules)**:
The app uses a modular architecture pattern where major features are organized into self-contained modules (e.g., `m-stats-file/`, `m-user/`). Each module follows a consistent structure:
```
m-{feature-name}/
├── api/           # Data access layer (LocalForage operations)
├── service/       # Service layer (React Query hooks)
└── core/          # Core business logic (domain-specific)
```

This pattern provides:
- Clear separation of concerns (data access, service hooks, business logic)
- Easier testing and maintenance
- Better code organization for complex features
- Scalability for adding new feature modules

**Parser System**:
Each bank has a parser in `utils/Parsers/{BankName}/{account-type}.ts` that exports a `Parser` object with:
- `id: ParserId` - Unique parser identifier
- `bankName: string` - Display name of the bank
- `accountType: string` - Type of account (e.g., "Savings", "Giro")
- `expectedHeaderRowIndex: number` - Row index where headers are located
- `expectedHeaders: string[]` - Expected CSV column headers
- `detect: (input) => boolean` - Function to identify if CSV matches this parser
- `parse: (input, locale) => ParsedContentRow[]` - Function to transform CSV rows

**File Processing Flow**:
1. User uploads CSV files via `/data` page (using react-dropzone)
2. `FileParser/utils.ts` uses PapaParse to parse raw CSV
3. Each registered parser's `detect()` method is called to identify the matching parser
4. Matching parser's `parse()` method transforms rows into `ParsedContentRow[]` with `{ date, description, value }`
5. File is passed through `m-stats-file/api/helper.ts` `syncStatsFile()` to convert Big.js values to strings
6. File is stored in IndexedDB via `m-stats-file/api/queries.ts` `addFile()`
7. TanStack Query cache is invalidated, triggering UI updates

**Data Management Flow (TanStack Query + LocalForage)**:
```
Component → Service Hook → API Layer → LocalForage → IndexedDB
            (hooks.ts)      (queries.ts)  (lib)
```

1. **Components** call service hooks (e.g., `useFiles()`, `useMutateAddFile()`)
2. **Service hooks** (`m-stats-file/service/hooks.ts`) use TanStack Query's `useQuery` and `useMutation`
3. **API layer** (`m-stats-file/api/queries.ts`) performs CRUD operations using LocalForage
4. **Helper functions** (`m-stats-file/api/helper.ts`) transform data:
   - `syncStatsFile()` - Converts in-memory format (with Big.js) to storage format (strings)
   - `parseStatsFile()` - Converts storage format (strings) to in-memory format (with Big.js)
5. TanStack Query handles caching, optimistic updates, and cache invalidation

**State Management**:
- **TanStack Query** for server-state/async data (files from IndexedDB)
  - Manages caching, background refetching, and cache invalidation
  - Query keys (`statsFileKey.all`, `statsFileKey.detail(id)`) for cache management
- **LocalStorage** (via `usehooks-ts` `useLocalStorage`) for user preferences
  - Color mode, locale, date format, selected file IDs
- **React Context** is NOT used (replaced by provider components and TanStack Query)

**Provider Hierarchy** (in `app/layout.tsx`):
```tsx
<StorageProvider>              {/* Initializes LocalForage */}
  <QueryProvider>              {/* TanStack Query client */}
    <ThemeProvider>            {/* MUI theme + color mode */}
      <LanguageProvider>       {/* i18next */}
        <ChartProvider>        {/* Chart.js configuration */}
          <Layout>
            {children}
          </Layout>
        </ChartProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryProvider>
</StorageProvider>
```

**Number Handling**:
Uses `big.js` (via `/lib/w-big.ts` wrapper) for precise decimal arithmetic. All monetary values are:
- **In Memory**: `NumberBig` (type alias for `Big`) - used in components and calculations
- **At Rest**: `string` - stored in IndexedDB for serialization
- Helper functions handle conversion between formats

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

## Working with TanStack Query

The app uses **TanStack Query (React Query)** for all data fetching and caching. Files are stored in IndexedDB via LocalForage, and TanStack Query manages the client-side cache.

### Data Flow Architecture

```
Component
    ↓
Service Hook (useFiles, useMutateAddFile)
    ↓
TanStack Query (useQuery, useMutation)
    ↓
API Layer (getFiles, addFile)
    ↓
LocalForage
    ↓
IndexedDB
```

### Query Hooks (Reading Data)

Use query hooks from `m-stats-file/service` to read data:

```typescript
import { useFiles, useFile } from '@/m-stats-file/service'

const Component = () => {
  // Get all files
  const { data: files = [], isLoading, error } = useFiles()

  // Get single file
  const { data: file } = useFile(fileId)

  return <div>...</div>
}
```

**Query Hook Features**:
- Automatic caching with smart cache invalidation
- Background refetching
- Loading and error states
- Automatic retries on failure
- Optimistic updates

### Mutation Hooks (Writing Data)

Use mutation hooks to create, update, or delete data:

```typescript
import { useMutateAddFile, useMutateRemoveFile } from '@/m-stats-file/service'

const Component = () => {
  const { mutate: addFile, isPending } = useMutateAddFile()
  const { mutate: removeFile } = useMutateRemoveFile()

  const handleAdd = () => {
    addFile(newFile, {
      onSuccess: (data) => {
        console.log('File added:', data)
      },
      onError: (error) => {
        console.error('Failed to add file:', error)
      }
    })
  }

  return <button onClick={handleAdd} disabled={isPending}>Add File</button>
}
```

**Available Mutations**:
- `useMutateAddFile()` - Add single file
- `useMutateAddFiles()` - Add multiple files
- `useMutateUpdateFile()` - Update single file
- `useMutateUpdateFiles()` - Update multiple files
- `useMutateRemoveFile()` - Remove single file
- `useMutateRemoveFiles()` - Remove multiple files
- `useMutateRemoveAllFiles()` - Remove all files

### Cache Management

TanStack Query automatically handles cache invalidation. When you perform a mutation, the relevant queries are automatically refetched:

```typescript
// After adding a file, the useFiles() query is automatically invalidated
const { mutate: addFile } = useMutateAddFile()
addFile(newFile) // This will trigger useFiles() to refetch
```

**Query Keys** (defined in `m-stats-file/service/keys.ts`):
```typescript
export const statsFileKey = {
  all: ['stats-file'] as const,
  detail: (id: string) => ['stats-file', id] as const,
}
```

### Data Transformation Pattern

Files are stored in two formats:
1. **At Rest** (`StatsFileAtRest`) - Stored in IndexedDB with `value: string`
2. **In Memory** (`StatsFile`) - Used in components with `value: Big`

**Helper functions** handle transformation (in `m-stats-file/api/helper.ts`):
```typescript
// Before storing: Big → string
export const syncStatsFile = (file: StatsFile): StatsFileAtRest => {
  return {
    ...file,
    parsedContentRows: file.parsedContentRows.map(row => ({
      ...row,
      value: row.value.toString()  // Big → string
    }))
  }
}

// After retrieving: string → Big
export const parseStatsFile = (file: StatsFileAtRest): StatsFile => {
  return {
    ...file,
    parsedContentRows: file.parsedContentRows.map(row => ({
      ...row,
      value: Big(row.value)  // string → Big
    }))
  }
}
```

### Adding a New Feature Module

To add a new feature module (e.g., `m-categories/`):

1. **Create module structure**:
```bash
m-categories/
├── api/
│   ├── index.ts
│   ├── queries.ts    # CRUD operations
│   └── helper.ts     # Data transformation
├── service/
│   ├── index.ts
│   ├── hooks.ts      # React Query hooks
│   └── keys.ts       # Query keys
└── core/
    └── ...           # Business logic
```

2. **Define types** in `/types/services/category.ts`:
```typescript
export type Category = {
  id: string
  name: string
  // ...
}

export type CategoryAtRest = {
  // Storage format (strings instead of Big, etc.)
}
```

3. **Create API layer** (`api/queries.ts`):
```typescript
import { db } from '@/lib/localforage'

export const getCategories = async (): Promise<Category[]> => {
  // Fetch from LocalForage
}

export const addCategory = async (category: Category): Promise<Category> => {
  // Add to LocalForage
}
```

4. **Create service layer** (`service/hooks.ts`):
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getCategories, addCategory } from '../api'
import { categoryKey } from './keys'

export const useCategories = () => {
  return useQuery({
    queryKey: categoryKey.all,
    queryFn: getCategories,
  })
}

export const useMutateAddCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKey.all })
    },
  })
}
```

5. **Use in components**:
```typescript
import { useCategories, useMutateAddCategory } from '@/m-categories/service'

const Component = () => {
  const { data: categories = [] } = useCategories()
  const { mutate: addCategory } = useMutateAddCategory()

  return <div>...</div>
}
```

## Technology Stack

- **Framework**: Next.js 16.1.6 (App Router, React Server Components, Turbopack dev / Webpack production)
- **React**: 19.2.4
- **TypeScript**: 5.9.3
- **UI**: MUI (Material-UI) v7 with Emotion
- **Data Fetching**: @tanstack/react-query v5 (TanStack Query)
- **CSV Parsing**: PapaParse
- **Charts**: Chart.js with react-chartjs-2 and chartjs-plugin-annotation
- **Forms**: react-hook-form with zod validation
- **File Upload**: react-dropzone
- **Number Precision**: big.js
- **Date**: date-fns v4
- **i18n**: next-i18next, i18next, react-i18next, i18next-browser-languagedetector
- **Storage**: localforage (IndexedDB/WebSQL/LocalStorage)
- **Utilities**: lodash, usehooks-ts
- **PWA**: @serwist/next, serwist
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
import { useMutateRemoveFile } from '@/m-stats-file/service'

import { ui } from './styled' // If styled.ts exists

type ComponentProps = {
  file: StatsFile
}

const Component = ({ file }: ComponentProps) => {
  const sx = ui() // From styled.ts
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

### Provider Components Pattern (`/components/*Provider/`)

**Note**: The app no longer uses React Context for state management. Instead, it uses **TanStack Query** for async/server state and **provider components** for initialization and configuration.

Provider components are simple wrappers that:
- Initialize third-party libraries
- Configure global providers (Query, Theme, i18n)
- Handle loading states during initialization
- No state management or complex logic

**Provider Component Pattern**:
```typescript
'use client'

import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'

import { initStorage } from '@/lib/localforage'

type StorageProviderProps = {
  children: ReactNode
}

const Component = ({ children }: StorageProviderProps) => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      await initStorage()
      setIsLoading(false)
    }
    init()
  }, [])

  if (isLoading) {
    return null
  }

  return children
}

export default Component
```

**Current Provider Components**:
- `StorageProvider` - Initializes LocalForage on mount
- `QueryProvider` - Wraps app with TanStack Query client
- `ThemeProvider` - MUI theme configuration and color mode
- `LanguageProvider` - i18next initialization
- `ChartProvider` - Chart.js global configuration

**Rules**:
- Providers should be thin wrappers (no business logic)
- For data management, use TanStack Query (not Context)
- For user preferences, use `usehooks-ts` `useLocalStorage`
- Only create providers for library initialization or configuration

### Hook Pattern (`/hooks/**/`)

Hooks in `/hooks/` are **composition hooks** that combine service hooks, local state, and derived data for convenience.

```typescript
'use client'

import { useLocalStorage } from 'usehooks-ts'

import { MISC } from '@/common'
import { useFiles } from '@/m-stats-file/service'

export const useFileHelper = () => {
  const [selectedFileIds, setSelectedFileIds] = useLocalStorage<string[]>(MISC.LS_SELECTED_FILE_IDS_KEY, [])
  const { data: files = [], isLoading: isLoadingFiles } = useFiles()

  const selectedFiles = files.filter((file) => selectedFileIds.includes(file.id))
  const selectableFiles = files.filter((file) => !file.error)
  const errorFiles = files.filter((file) => file.error)
  const unknownFiles = files.filter((file) => !file.parserId)

  return {
    files,
    isLoadingFiles,
    selectedFiles,
    selectableFiles,
    errorFiles,
    unknownFiles,
    selectedFileIds,
    setSelectedFileIds,
  }
}
```

**Hook Hierarchy**:
1. **Service Hooks** (`m-*/service/hooks.ts`) - TanStack Query hooks for data fetching
   - Example: `useFiles()`, `useMutateAddFile()`
2. **Composition Hooks** (`/hooks/*.ts`) - Combine service hooks with derived state
   - Example: `useFileHelper()` combines `useFiles()` + localStorage + filtering
3. **Utility Hooks** (`/hooks/*.ts`) - Simple, reusable hooks
   - Example: `useIsDarkMode()`, `useIsMobile()`

**Rules**:
- One hook per file
- Use `use` prefix
- Keep hooks focused on a single concern
- Composition hooks should use service hooks, not call API directly
- Export from `/hooks/index.ts`

**When to create a composition hook**:
- Multiple components need the same combination of service hooks + derived data
- You need to combine TanStack Query hooks with localStorage or other state
- The composition logic is complex or used 3+ times

**When NOT to create a composition hook**:
- For data fetching → Use service hooks from `m-*/service/`
- For one-off derived data → Calculate directly in component
- For simple utilities → Use `/utils/` functions

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

## Common Patterns and Best Practices

### Reading Data Pattern

```typescript
// In Component
import { useFiles } from '@/m-stats-file/service'

const Component = () => {
  const { data: files = [], isLoading, error } = useFiles()

  if (isLoading) return <Loading />
  if (error) return <Error error={error} />

  return <FileList files={files} />
}
```

### Writing Data Pattern

```typescript
// In Component
import { useMutateAddFile } from '@/m-stats-file/service'

const Component = () => {
  const { mutate: addFile, isPending } = useMutateAddFile()

  const handleSubmit = (data: StatsFile) => {
    addFile(data, {
      onSuccess: (result) => {
        // Success handling
      },
      onError: (error) => {
        // Error handling
      }
    })
  }

  return <Form onSubmit={handleSubmit} disabled={isPending} />
}
```

### Composition Hook Pattern

When multiple components need the same derived data:

```typescript
// hooks/useFileHelper.ts - Combines service hook with derived data
export const useFileHelper = () => {
  const { data: files = [] } = useFiles()
  const [selectedFileIds] = useLocalStorage('selectedFileIds', [])

  // Derive data
  const selectedFiles = files.filter(f => selectedFileIds.includes(f.id))
  const errorFiles = files.filter(f => f.error)

  return { files, selectedFiles, errorFiles, selectedFileIds }
}

// In Components - use composition hook for convenience
const Component = () => {
  const { selectedFiles, errorFiles } = useFileHelper()
  return <div>...</div>
}
```

### User Preferences Pattern

Use `useLocalStorage` from `usehooks-ts` for user preferences:

```typescript
import { useLocalStorage } from 'usehooks-ts'
import { MISC } from '@/common'

const Component = () => {
  const [colorMode, setColorMode] = useLocalStorage(MISC.LS_COLOR_MODE_KEY, 'system')
  const [locale, setLocale] = useLocalStorage(MISC.LS_LOCALE_KEY, 'en')

  return <Settings colorMode={colorMode} onColorModeChange={setColorMode} />
}
```

### Data Transformation Pattern

Always transform between storage and in-memory formats in the API layer:

```typescript
// m-stats-file/api/helper.ts

// Storage format (serializable)
export type StatsFileAtRest = {
  parsedContentRows: Array<{
    value: string  // Serializable
  }>
}

// In-memory format (with Big.js)
export type StatsFile = {
  parsedContentRows: Array<{
    value: Big  // Non-serializable, precise math
  }>
}

// Transform before storing
export const syncStatsFile = (file: StatsFile): StatsFileAtRest => ({
  ...file,
  parsedContentRows: file.parsedContentRows.map(row => ({
    ...row,
    value: row.value.toString()  // Big → string
  }))
})

// Transform after retrieving
export const parseStatsFile = (file: StatsFileAtRest): StatsFile => ({
  ...file,
  parsedContentRows: file.parsedContentRows.map(row => ({
    ...row,
    value: Big(row.value)  // string → Big
  }))
})
```

### Error Handling Pattern

```typescript
const Component = () => {
  const { mutate: addFile, isPending, error } = useMutateAddFile()

  const handleSubmit = (data: StatsFile) => {
    addFile(data, {
      onError: (error) => {
        console.error('Failed to add file:', error)
        // Show error toast/snackbar
      },
      onSuccess: (result) => {
        // Success handling
      }
    })
  }

  return (
    <>
      {error && <Alert severity="error">{error.message}</Alert>}
      <Form onSubmit={handleSubmit} disabled={isPending} />
    </>
  )
}
```

### Loading States Pattern

```typescript
const Component = () => {
  const { data: files = [], isLoading } = useFiles()
  const { mutate: addFile, isPending: isAdding } = useMutateAddFile()

  // Show loading on initial fetch
  if (isLoading) {
    return <PageWrapper><Skeleton /></PageWrapper>
  }

  // Disable button while mutating
  return (
    <div>
      <FileList files={files} />
      <Button onClick={handleAdd} disabled={isAdding}>
        Add File
      </Button>
    </div>
  )
}
```

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
6. **New feature module** → Create new module in `/m-{feature}/` with api/service/core structure
7. **New bank parser** → Create new directory in `/utils/Parsers/BankName/`
8. **New provider** → Create provider component in `/components/{Name}Provider/`

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
// GOOD: Use service hooks and utils
import { useFiles } from '@/m-stats-file/service'
import { calculateComplexStats } from '@/utils/Stats'

const Component = () => {
  const { data: files = [] } = useFiles()
  const stats = calculateComplexStats(files)
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

---

❌ **DON'T**: Call API directly from components
```typescript
// BAD: Bypassing service layer
import { getFiles } from '@/m-stats-file/api'

const Component = () => {
  const [files, setFiles] = useState([])

  useEffect(() => {
    getFiles().then(setFiles)
  }, [])

  return <FileList files={files} />
}
```

✅ **DO**: Use service hooks
```typescript
// GOOD: Use TanStack Query hooks from service layer
import { useFiles } from '@/m-stats-file/service'

const Component = () => {
  const { data: files = [], isLoading } = useFiles()

  if (isLoading) return <Loading />
  return <FileList files={files} />
}
```

---

❌ **DON'T**: Use React Context for async/server state
```typescript
// BAD: Context for file data
const FileContext = createContext()

export const FileProvider = ({ children }) => {
  const [files, setFiles] = useState([])

  useEffect(() => {
    getFiles().then(setFiles)
  }, [])

  return <FileContext.Provider value={{ files }}>{children}</FileContext.Provider>
}
```

✅ **DO**: Use TanStack Query for data management
```typescript
// GOOD: TanStack Query handles caching, loading, refetching
import { useFiles } from '@/m-stats-file/service'

const Component = () => {
  const { data: files = [], isLoading } = useFiles()
  return <FileList files={files} />
}
```

---

❌ **DON'T**: Manually manage cache invalidation
```typescript
// BAD: Manual cache management
const Component = () => {
  const [files, setFiles] = useState([])

  const addFile = async (file) => {
    await addFileAPI(file)
    // Manually refetch
    const newFiles = await getFiles()
    setFiles(newFiles)
  }
}
```

✅ **DO**: Let TanStack Query handle cache invalidation
```typescript
// GOOD: Automatic cache invalidation
const Component = () => {
  const { data: files = [] } = useFiles()
  const { mutate: addFile } = useMutateAddFile()  // Automatically invalidates cache

  return <FileList files={files} onAdd={addFile} />
}
```

## Quick Reference

### Common Import Patterns

```typescript
// Types
import type { StatsFile, ParsedContentRow } from '@/types'
import { ParserId, StatsFileStatus } from '@/types-enums'

// Service hooks (data fetching)
import { useFiles, useMutateAddFile, useMutateRemoveFile } from '@/m-stats-file/service'

// Composition hooks (convenience)
import { useFileHelper, useIsDarkMode, useIsMobile, useUserPreferences } from '@/hooks'

// Utils
import { formatDate, toDisplayDate } from '@/utils/Date'
import { AVAILABLE_PARSERS } from '@/utils/Parsers'
import { Big } from '@/lib/w-big'

// Constants
import { MISC, ROUTES, CONFIG } from '@/common'

// Components
import { PageWrapper, BarChart, LineChart } from '@/components'

// MUI
import { Box, Typography, Button } from '@mui/material'

// User preferences
import { useLocalStorage } from 'usehooks-ts'
```

### File Organization Checklist

When adding new code, ask yourself:

1. **Is this a new feature with data persistence?**
   - → Create feature module in `/m-{feature}/` with api/service/core

2. **Is this a reusable UI component?**
   - → Add to `/components/ComponentName/`

3. **Is this a utility function used 3+ times?**
   - → Add to `/utils/DomainName/`

4. **Is this a composition of service hooks?**
   - → Add to `/hooks/useHookName.ts`

5. **Is this component-specific logic?**
   - → Add to component's `actions.ts` file

6. **Is this styling?**
   - → Add to component's `styled.ts` file

7. **Is this a type definition?**
   - → Add to `/types/` (domain-specific) or `/types-enums/` (constants)

8. **Is this a constant?**
   - → Add to `/common/` (MISC, ROUTES, CONFIG)

9. **Is this a bank parser?**
   - → Add to `/utils/Parsers/BankName/`

10. **Is this a provider for library initialization?**
    - → Add to `/components/{Name}Provider/`

### Architecture Decision Tree

```
Need to fetch/store data?
├─ Yes → Use TanStack Query
│   ├─ Simple CRUD → Use existing m-stats-file hooks
│   └─ New feature → Create new m-{feature}/ module
│
└─ No → Is it async?
    ├─ Yes → Use React hooks (useState, useEffect)
    └─ No → Is it used 3+ times?
        ├─ Yes → Move to /utils or /hooks
        └─ No → Keep in component's actions.ts
```

## Important Notes

### Core Principles

- All data processing is **client-side only**—never add server-side file processing
- Use `Big` from `@/lib/w-big` for all monetary calculations (never native numbers)
- Dates in storage must be ISO strings (`DateTimeString`)
- Support both light and dark themes (using MUI theme provider)
- Support EN and DE locales (with proper i18n via next-i18next)
- Respect user privacy: no tracking, no accounts, no data uploads

### Architecture Patterns

- **Use TanStack Query for data fetching** - Don't use React Context for async state
- **Feature modules** (`m-*/`) for complex features with data persistence
- **Service hooks** for data access, **composition hooks** (`/hooks/`) for convenience
- **Transform data** between "at rest" (strings) and "in memory" (Big.js) formats
- **Provider components** for initialization only, not for state management

### Development Guidelines

- Service worker (Serwist) is disabled in development mode
- Production builds use webpack (not turbopack) for better optimization
- Development mode uses Turbopack for faster iteration
- All constants should be in `common/` directory (MISC, ROUTES, CONFIG)
- Maintain import order as defined in `.prettierrc`
- **Keep files focused**: Split large components/utils into smaller, focused files
- **Separate concerns**: Don't mix component logic with data fetching or calculations
- **Favor many small files over few large files**: Easier to navigate and maintain

### Data Access Rules

- ✅ Components use service hooks from `m-*/service/`
- ✅ Service hooks use API layer from `m-*/api/`
- ❌ Components should NOT import API layer directly
- ❌ Don't use React Context for async/server state (use TanStack Query)
- ❌ Don't bypass service hooks to call API directly in components
