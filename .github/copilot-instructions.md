# Copilot / AI Agent Quick Instructions

Short, actionable guidance to help an AI coding agent be productive in this repo.

## Big picture (what this repo is)
- **Frontend SPA** built with Vite + React (TypeScript) and Tailwind. See the project intro: [README.md](README.md#L1-L40).
- **Design / deployment hooks**: the repo integrates with Lovable (automatic commits) and includes a build-time ChatGPT export generator. See Vite plugin usage: [vite.config.ts](vite.config.ts#L1-L120).

## Major components & boundaries
- `src/pages` — route-level pages (many are lazy-loaded for code-splitting). Example lazy-loading pattern: [src/App.tsx](src/App.tsx#L1-L50).
- `src/components` — UI & layout building blocks; `Navigation`/`Footer` are intentionally synchronous for fast FCP (see `MainLayout` in [src/App.tsx](src/App.tsx#L1-L50)).
- `src/contexts` — global contexts (Auth, Performance, ProviderAuth).
- `src/components/performance` — performance-specific helpers (CriticalCSS, PrefetchManager, etc.).

## Important integration points
- Lovable: `lovable-tagger` is enabled in dev to tag components (see import and usage in [vite.config.ts](vite.config.ts#L1-L120)). Changes may be auto-synced via Lovable.
- ChatGPT export: a custom plugin writes `public/chatgpt-export.txt` at build time. Admin UI fetches it (see [scripts/generate-chatgpt-export.js](scripts/generate-chatgpt-export.js#L1-L40) and [src/pages/admin/CodeExport.tsx](src/pages/admin/CodeExport.tsx#L1-L40)).
- PWA + runtime caching is configured in `vite.config.ts` (fonts, Supabase caching). Adjust cache rules there.
- Supabase SDK is a runtime dependency (`@supabase/supabase-js` in [package.json](package.json#L1-L40)).

## Developer workflows (commands)
- Install: `npm i` — see [README.md](README.md#L20-L40).
- Dev server: `npm run dev` (Vite server listens on `::` port `8080` per [vite.config.ts](vite.config.ts#L1-L120)).
- Build: `npm run build` (triggers ChatGPT export and PWA generation via Vite plugins).
- Preview: `npm run preview`.
- Lint: `npm run lint` (ESLint).

## Project-specific conventions & patterns
- Code-splitting by route: the app keeps a small critical bundle (navigation, footer, IndexPremium) and lazy-loads other pages. See route imports in [src/App.tsx](src/App.tsx#L1-L50).
- React Query defaults: global `QueryClient` is configured for longer stale times and disabled refetch-on-window-focus to keep snapshot stability for screenshots and performance testing — see [src/App.tsx](src/App.tsx#L317-L322).
- Tailwind + shadcn-ui style system is used; `src/index.css` + `tailwind.config.ts` form the design system.
- Plugins run during buildStart: the repository auto-generates a ChatGPT export and includes a dev-only `componentTagger` (lovable). Be careful when changing plugin behaviour — it affects both local builds and the exported artifacts.

## Quick examples (copy-paste patterns)
- Start dev server (local):

```bash
npm i
npm run dev
```

- Build (generate export + PWA):

```bash
npm run build
```

- Inspect React Query defaults (use this when changing caches): [src/App.tsx](src/App.tsx#L317-L322).

## CI, Build & Exports
- CI workflow: see `.github/workflows/ci.yml`. Key points:
  - Runs on pushes to `main` and `loop/**`, and on pull requests.
  - Uses **Node 20**, then runs `npm install --force` and `npm run build`.
  - If your changes affect build-time artifacts (PWA, chatgpt export), ensure the build completes locally before opening a PR.
- Local build & preview:
  - Build: `npm run build`
  - Preview the production build locally: `npm run preview`
- Regenerate ChatGPT export manually (no full build required):

```bash
node scripts/generate-chatgpt-export.js
```

  - This writes `public/chatgpt-export.txt`. Note: the file is generated and typically listed in `.gitignore`.
  - The admin UI reads this file (see `src/pages/admin/CodeExport.tsx`) — when changing how exports are generated, update that admin tooling as needed.
- Environment variables: the CI job sets placeholder `SUPABASE_URL` / `SUPABASE_KEY` envs; if your change requires real keys, add them to GitHub Secrets and/or set them locally for testing.
- Lint: `npm run lint` (run before PR).
- Commit & PR guidance:
  - Use branch names like `feat/<area>` or `chore/<area>` and commit prefixes such as `feat:`, `fix:`, `chore:` (repo uses these conventions).
  - CI runs the build — ensure `npm run build` succeeds before opening a PR.

## Where to look first for common tasks
- Add a new route or page: `src/pages` + update routing in [src/App.tsx](src/App.tsx#L1-L50).
- Update global styles / design tokens: `src/index.css`, `tailwind.config.ts`.
- Change build behavior or caching: `vite.config.ts`.
- Troubleshoot exports used by admin tools: `public/chatgpt-export.txt` (generated) and `scripts/generate-chatgpt-export.js`.

## Notes for AI agents
- Preserve lazy-loading and QueryClient defaults unless you understand performance implications (screenshots, A/B flows rely on consistent caching).
- Do not remove the `componentTagger` usage without checking Lovable integration — it tags components used in the design system workflow.
- When editing routes, respect the comment hints in `src/App.tsx` (e.g., admin login must come before other admin routes).

If any area is unclear or you'd like more examples (e.g., typical PR contents, CI/CD details, or example component structure), tell me which part to expand.
