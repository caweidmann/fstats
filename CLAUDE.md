# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

| Command | Description |
|---|---|
| `pnpm dev` | Start dev server (Next.js + Turbopack) on localhost:3000 |
| `pnpm build` | Production build (webpack) — also runs `next-sitemap` as a postbuild step |
| `pnpm lint` | ESLint via Next.js |
| `pnpm tsc --noEmit` | Type-check without emitting |
| `pnpm start` | Serve the production build |

The `test` script is a placeholder — no test suite exists yet.

## Architecture

A **Next.js 16 App Router** app (React 19, TypeScript, MUI 7). All CSV parsing and data storage happen client-side — there is no backend. The app is a PWA via Serwist.

### Page Flow

```
/ (landing) → /data (upload CSV files) → /stats (view parsed tables)
                        ↕
               /settings (toggle persist)
```

Routes are defined in [common/routes.ts](common/routes.ts).

### Provider Hierarchy

Defined in [app/layout.tsx](app/layout.tsx). Nesting order matters:

```
AppRouterCacheProvider   ← MUI + Next.js cache glue
  ThemeProvider          ← MUI dark/light (default: system). Theme in styles/theme.ts
    PersistProvider      ← IndexedDB persist toggle. Exposes usePersist() hook.
                            On mount: clears stored files if persist is OFF.
      LanguageProvider   ← i18n init. Reads saved locale from localStorage.
        Layout           ← Header / nav / footer chrome
```

### Storage Layer — [lib/storage/indexedDB.ts](lib/storage/indexedDB.ts)

`StorageService` wraps `localforage` (IndexedDB → WebSQL → localStorage fallback).

- Each app session gets a unique session ID; every file is tagged with it.
- Old sessions are auto-cleaned: **30 days** if persist is on, **24 hours** if off.
- `setSelectedFiles` / `getSelectedFiles` is how the upload page communicates which files to show on the stats page (via IndexedDB, not URL params or state).
- The persist toggle is stored in both IndexedDB and `localStorage` so it can be read synchronously before IndexedDB is ready.

### File Upload & Parsing Flow

1. [hooks/useFileUpload.ts](hooks/useFileUpload.ts) wraps `react-dropzone`. On mount it restores persisted files from IndexedDB.
2. Selected files are stored in IndexedDB with status `uploading`, then parsed via [hooks/useFileParser.ts](hooks/useFileParser.ts).
3. `useFileParser` delegates to [lib/parsers/csvParser.ts](lib/parsers/csvParser.ts), which runs PapaParse with `worker: true` for non-blocking parsing.
4. When the user clicks through to stats, selected file IDs are written via `setSelectedFiles`, then the app navigates to `/stats`.
5. The stats page reads those IDs, loads each file from IndexedDB, and renders paginated tables (max 10 columns and configurable rows per page).

### Styling

- Each page with custom layout styles has a co-located `styled.ts` (e.g. [app/data/styled.ts](app/data/styled.ts)) that exports MUI `styled()` components.
- Global theme lives in [styles/theme.ts](styles/theme.ts) using MUI CSS-variables theme. Palette colors are in [styles/colors.ts](styles/colors.ts) as the `Color` object.
- `reactStrictMode` is intentionally `false` in [next.config.js](next.config.js).
- `console.log` (but not warn/error/info) is stripped in production builds via the same config.

### i18n

Translation files live in `public/locales/{locale}.json`. Only `en` is wired up. A `DE` enum value exists in [types-enums/index.ts](types-enums/index.ts) but the German resource file is not loaded. Selected language is persisted to `localStorage`.

### Feature Flags

[utils/Features/feature_flags.ts](utils/Features/feature_flags.ts) exports a `FEATURES` record. Currently only `wip: false`. Gate any work-in-progress code paths behind this.

## Code Style & Conventions

- **No semicolons**, single quotes, trailing commas, 120-char print width (`.prettierrc`).
- **Import order** is enforced by the prettier sort-imports plugin:
  third-party → `@/types` → `@/types-enums` → `@/common` → `@/components` → `@/hooks` → `@/styles` → `@/utils` → `@/lib` → relative paths.
- Path alias: `@/*` resolves to the project root.
- Components must be arrow functions (ESLint rule).
- Commit messages use conventional commits: `feat:`, `fix:`, `chore:`, `style:`, `refactor:`.

## CI / Deployment

| Branch | Workflow | Effect |
|---|---|---|
| Feature branch (PR → develop) | `build-branch.yml` | Build only, no deploy |
| `develop` | `build-and-deploy-staging.yml` | Patch version bump → Vercel staging |
| `main` | `build-and-deploy-production.yml` | Minor version bump → Vercel production → merges main back into develop |

Version bumping and git tagging are handled by the workflows automatically.
