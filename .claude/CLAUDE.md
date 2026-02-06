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

- **`/types-enums`** - Enum-like constants with TypeScript types (ColorMode, UserLocale, SupportedParsers, DateFormat, WeekStartsOn)

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
Each bank has a parser in `utils/Parsers/{BankName}/index.ts` that exports a `Parser` object with:
- `headers: string[]` - Expected CSV column headers
- `parse: (input, locale) => ParsedContentRow[]` - Function to transform CSV rows

The parsing flow:
1. User uploads CSV files via `/data` page
2. `FileParser/utils.ts` uses PapaParse to parse raw CSV
3. Headers are matched against registered parsers (e.g., CapitecSavings)
4. Matching parser transforms rows into `ParsedContentRow[]` with `{ date, description, value }`
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

To add support for a new bank (e.g., FNB):

1. Create `utils/Parsers/FNB/index.ts`:
```typescript
import type { Parser } from '@/types'
import { Big } from '@/lib/w-big'
import { toDisplayDate } from '../../Date'

export const FnbCreditCard: Parser = {
  headers: ['Date', 'Description', 'Amount', 'Balance'], // Match bank's CSV headers exactly

  parse: (input, locale) => {
    return input.data.slice(1).map((row: string[]) => {
      const [date, description, amount, balance] = row
      return {
        date: toDisplayDate(date, locale, { formatFrom: 'dd/MM/yyyy', formatTo: 'dd/MM/yyyy HH:SS' }),
        description,
        value: Big(amount || 0),
      }
    })
  },
}
```

2. Export from `utils/Parsers/index.ts`:
```typescript
export * from './Capitec'
export * from './FNB'
```

3. Register in `utils/FileParser/utils.ts`:
```typescript
import { CapitecSavings, FnbCreditCard } from '../Parsers'

// In parseFile function:
if (isEqual(rawParseResult.data[0], FnbCreditCard.headers)) {
  parserId = SupportedParsers.FNB
  parsedContentRows = FnbCreditCard.parse(rawParseResult, locale)
}
```

4. Add format to `types-enums/index.ts`:
```typescript
export const SupportedParsers = {
  UNKNOWN: 'unknown',
  CAPITEC: 'capitec',
  FNB: 'fnb',
} as const
```

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

## Code Style

- **ESLint**: Configured with TypeScript and React rules (see `eslint.config.js`)
- **Prettier**: 120 char line width, no semicolons, single quotes, trailing commas
- **React**: Arrow function components only
- **TypeScript**: Strict mode enabled, use type imports (`import type`)

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
