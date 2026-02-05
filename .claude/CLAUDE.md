# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **Guiding Principle — Offline First.** This is a zero-backend PWA. All parsing, storage, and state live on the device. Every feature decision must preserve full offline functionality — never introduce a network dependency for core behaviour.

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

A **Next.js 16 App Router** app (React 19, TypeScript, MUI 7). All CSV parsing and data storage happen client-side — there is no backend. The app is an **offline-first PWA** via Serwist — see the [PWA](#pwa) section below.

### Page Flow

```
/ (landing) → /data (upload CSV files) → /stats (view parsed tables)
                        ↕
               /settings (app settings)
```

An `app/not-found.tsx` page covers unmatched routes. All navigation between pages is **client-side** (Next.js `useRouter`) — no full-page reloads, which keeps in-memory state intact inside the PWA window.

Routes are defined in [common/routes.ts](common/routes.ts).

### Provider Hierarchy

Defined in [app/layout.tsx](app/layout.tsx). Nesting order matters:

```
AppRouterCacheProvider   ← MUI + Next.js cache glue
  ThemeProvider          ← MUI dark/light (default: system). Theme in styles/theme.ts
    SettingsProvider     ← Reads all settings from localStorage on mount (synchronous).
                            Fires off initStorage() for one-time session cleanup.
                            Exposes useSettings() hook → { settings, setSetting }.
      LanguageProvider   ← i18n init. Reads saved locale from localStorage.
        Layout           ← Header / nav / footer chrome
```

`InitColorSchemeScript` (MUI) is rendered inside `ThemeProvider` to hydrate the colour-scheme attribute before paint. Vercel `Analytics` and `SpeedInsights` are mounted at `<body>` level in production only — they are the only components that touch the network, and only for telemetry.

### Settings — [lib/settings.ts](lib/settings.ts)

Single source of truth for all app settings. Each setting is one entry in `SETTING_DEFS`:

```ts
const SETTING_DEFS = {
  persist: { key: 'fstats-persist', default: false },
  // add new settings here — types, read, write, and the provider all pick them up
}
```

Settings are stored in `localStorage` (synchronous reads, always available — no async init needed). `SettingsProvider` exposes them via `useSettings()`:

```ts
const { settings, setSetting } = useSettings()
setSetting('persist', true)  // writes to localStorage + updates context
```

**`persist` and offline behaviour:** when `persist` is `false` (default), all stored files are wiped once at the start of each new PWA session — see [Storage Layer](#storage-layer--libstoragests) for the session-marker mechanism. This is the only setting that affects what survives an app-window close.

### Storage Layer — [lib/storage.ts](lib/storage.ts)

Plain exported functions wrapping `localforage` (IndexedDB → WebSQL → localStorage fallback). No class. **All writes go to the device — nothing leaves it.**

- **One-time init:** `initStorage()` returns a cached promise. It runs exactly once per session: if persist is OFF and no session marker exists in `sessionStorage`, it clears all stored files and the saved selection. The session marker survives page refreshes but is cleared when the PWA window closes.
- **Every storage function calls `await initStorage()` internally** — callers never need to invoke it explicitly. After the first call it resolves immediately.
- `setSelectedFiles` / `getSelectedFiles` is how the upload page communicates which files to show on the stats page (via IndexedDB, not URL params or state).

`FileData` shape: `{ id, name, size, lastModified, data, uploadedAt, status, error? }`. `uploadedAt` is stamped with `Date.now()` at store time and surfaced on the data page.

### File Upload & Parsing Flow

All parsing happens **on-device, in a Web Worker** — no data ever leaves the browser.

1. [hooks/useFileUpload.ts](hooks/useFileUpload.ts) wraps `react-dropzone`. On mount it restores persisted files from IndexedDB (via `getAllFiles`, which internally awaits `initStorage` — so the restore always runs after any session cleanup). The data page also exposes a **folder picker** (File System Access API) as an alternative to drag-and-drop.
2. Dropping a file whose name already exists automatically replaces the previous entry in IndexedDB — no duplicates accumulate.
3. New files are stored with status `uploading`, then parsed via [hooks/useFileParser.ts](hooks/useFileParser.ts).
4. `useFileParser` looks up the parser from the registry in [utils/FileParser/index.ts](utils/FileParser/index.ts) and invokes it. Adding a new parser (format or bank-specific) is one entry in the `PARSERS` map plus a parser file.
5. On parse completion the full row data is written back to IndexedDB (status → `complete`). The file list persists across refreshes with no network required.
6. When the user clicks through to stats, selected file IDs are written via `setSelectedFiles`, then the app navigates client-side to `/stats`.
7. The stats page reads those IDs from IndexedDB, loads each file, and renders paginated tables — max 10 visible columns with left/right navigation, and configurable rows per page (10 / 25 / 50 / 100).

**Selection semantics on `/data`:** `selectedFiles` is either `null` (meaning *all* files are selected — the smart default after restoration) or a `Set<string>` of explicit IDs. An `initialLoadDone` ref gates the save-to-IndexedDB effect so it never fires before the load effect has finished restoring state — critical in a PWA where the window may reopen with persisted data. See also the [Race Condition Guard](#race-condition-guard) in the PWA section.

### Parser Registry — [utils/FileParser/index.ts](utils/FileParser/index.ts)

```ts
const PARSERS = {
  csv: parseCsvFile,
  // add new parsers here — ParserType is derived from the keys automatically
}
```

Each parser conforms to `ParserFn`: `(file: File, options: ParserOptions) => void`. `ParserOptions` provides `onComplete(data)` and `onError(error)` callbacks. The CSV parser uses PapaParse with `worker: true` for non-blocking parsing (the worker runs as an in-memory blob — no extra network fetch required).

---

## PWA

> **This is the most important section.** The app is an offline-first PWA. Every feature must work without a network connection. When in doubt, check that your change does not silently depend on the network.

All data lives in IndexedDB on the device — no server requests are made during normal use.

### Service Worker — [app/sw.ts](app/sw.ts)

Configured via Serwist in [next.config.js](next.config.js):

| Option | Value | Why |
|---|---|---|
| `skipWaiting` | `true` | New service worker activates immediately across all tabs |
| `clientsClaim` | `true` | Newly activated SW controls all existing tabs right away |
| `navigationPreload` | `true` | Network request fires in parallel with SW boot — no startup delay |
| `cacheOnNavigation` | `true` | Pages and RSC payloads are cached on first visit → full offline after that |
| `reloadOnOnline` | `false` | Intentionally disabled — reloading on network restore would wipe in-memory React state (file list, selections) for no benefit |

Runtime caching (`defaultCache`) strategies:

| Asset class | Strategy |
|---|---|
| Pages / RSC payloads | NetworkFirst (serves from cache when offline) |
| Static assets (fonts, images) | StaleWhileRevalidate |
| Immutable chunks (hashed filenames) | CacheFirst |

### Manifest — [app/manifest.ts](app/manifest.ts)

Generated at build time via Next.js `MetadataRoute.Manifest`. Key values:

| Field | Value |
|---|---|
| `display` | `standalone` |
| `start_url` | `/` |
| `orientation` | `portrait-primary` |
| Icons | 192 × 192 and 512 × 512 PNGs in `public/img/` |

### Session Cleanup and `sessionStorage`

When `persist` is OFF, files are cleared once at the start of each new PWA session (i.e. after the window is closed and reopened). `sessionStorage` is the marker — it survives refreshes but is cleared when the PWA window closes.

> **iOS note:** Safari < 16.4 had a bug where `sessionStorage` was cleared on navigation inside a PWA. Fixed in 16.4+. If older-iOS support is needed, move the session marker to IndexedDB.

### Race Condition Guard

`app/data/page.tsx` uses an `initialLoadDone` ref to gate the save-to-IndexedDB effect. Without it, the save effect fires on mount with `null` (initial state) and races against the load effect that reads the persisted selection. In a PWA where the user closes and reopens the app, this would silently drop their selection.

---

### Styling

- Each page with custom layout styles has a co-located `styled.ts` (e.g. [app/data/styled.ts](app/data/styled.ts)) that exports MUI `styled()` components.
- Global theme lives in [styles/theme.ts](styles/theme.ts) using MUI CSS-variables theme. Palette colors are in [styles/colors.ts](styles/colors.ts) as the `Color` object.
- Layout constants (nav height, footer height, container max-width, z-indices) live in [common/misc.ts](common/misc.ts) as the `LAYOUT` object. Shared limits like `MAX_UPLOAD_FILE_SIZE` (5 MB) are in the same file under `MISC`.
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
- **British English** for all client-facing copy (labels, descriptions, button text, error messages). American English is fine in variable names, comments, and code.
- Commit messages use conventional commits: `feat:`, `fix:`, `chore:`, `style:`, `refactor:`.

## CI / Deployment

| Branch | Workflow | Effect |
|---|---|---|
| Feature branch (PR → develop) | `build-branch.yml` | Build only, no deploy |
| `develop` | `build-and-deploy-staging.yml` | Patch version bump → Vercel staging |
| `main` | `build-and-deploy-production.yml` | Minor version bump → Vercel production → merges main back into develop |

Version bumping and git tagging are handled by the workflows automatically.
