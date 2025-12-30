# Copilot / AI Agent Instructions for Umzugscheckv2

Purpose: give actionable, repository-specific guidance so an AI coding agent can be productive immediately.

- **Big picture**: Frontend-only monorepo-style app built with Vite + React + TypeScript. Primary entry is `src/App.tsx` (routing, providers, performance wrappers). See [ARCHITECTURE.md](ARCHITECTURE.md) for full rationale.
- **Tech stack**: `React 18`, `TypeScript`, `Vite`, `Tailwind CSS`, `shadcn-ui`, `TanStack Query` (server state), `Supabase` (backend), `Zod` for validation.

- **Where to start (files to read first)**:
  - `ARCHITECTURE.md` — canonical architecture, dataflows and conventions.
  - `package.json` — build/test scripts (`npm run dev`, `npm run build`, `npm run preview`, `npm run lint`).
  - `src/App.tsx` — app shell: providers, routing, lazy-loading conventions, and admin vs main layout behaviour.
  - `src/main.tsx` — bootstrap (mounts `App`).
  - `supabase/migrations/` — DB shape and RLS expectations.

- **Important patterns & conventions (do this in code changes)**:
  - Routing: routes are defined centrally in `src/App.tsx`; admin routes are detected by `location.pathname.startsWith('/admin')`. Keep admin login route first in admin routes.
  - Code-splitting: use `React.lazy(() => import("./pages/...") )` for pages. Follow existing lazy import style and `.then(m => ({ default: m.SomeExport }))` for named exports.
  - Providers & state: server state via `@tanstack/react-query`, client session in `src/contexts/*` (e.g., `AuthContext`, `ProviderAuthContext`). Wrap changes with the same provider hooks.
  - UI: `shadcn/ui` primitives live under `src/components/ui`. Follow `class-variance-authority` variants pattern (see `ARCHITECTURE.md` and examples in `src/components/*`).
  - Validation: prefer `zod` schemas for form validation — look for `leadSchema` patterns in `src/`.
  - Performance utilities: `CriticalCSS`, `PrefetchManager`, `ResourceHints`, `PerformanceMonitor` are present and may need care when changing SSR/preload behaviour.

- **Development workflows / commands**:
  - Install: `npm i`
  - Dev server: `npm run dev` (Vite dev server)
  - Production build: `npm run build` (also `npm run build:dev` exists for dev-mode build)
  - Preview production: `npm run preview`
  - Lint: `npm run lint` (ESLint)
  - No test script discovered — run unit or integration tests only if you add them and wire them into `package.json`.

- **Integration points & external dependencies to watch**:
  - Supabase: data access and RLS are critical. Check `supabase/migrations/` for schema and RLS rules before schema-affecting changes.
  - Lovable integration: repo is linked to Lovable — edits may be synced externally; CI/CD and preview deployments can be managed via Lovable.
  - Analytics & funnels: `src/components/AnalyticsTracker`, `FunnelModeProvider`, and related hooks are central to conversion flows — avoid removing telemetry without replacement.

- **Project-specific gotchas**:
  - Many dynamic and region routes exist (e.g., `/umzugsfirmen/:canton`, `/umzugsofferten-:variant`). Add new route aliases carefully to avoid shadowing.
  - Lazy imports sometimes include a `.catch` wrapper that reloads on chunk errors — preserve that pattern where used (see `FlowDeepAnalysis` import in `src/App.tsx`).
  - Admin area detection is path-based — changes to that logic affect routing globally.
  - UI components and core navigation are intentionally synchronous for FCP (e.g., `Navigation`, `Footer` are imported directly in `App.tsx`). Keep critical UI synchronous.

- **Code style & naming**:
  - Components: `PascalCase.tsx` (e.g., `CompanyCard.tsx`)
  - Hooks: `usePrefix` camelCase (e.g., `useCompanyData.ts`)
  - Types: `PascalCase` with `.types.ts` suffix where used.
  - Use `cva` patterns for variants (`class-variance-authority`).

- **When editing routes or major layout pieces**:
  - Update `src/App.tsx` only after reading `ARCHITECTURE.md` and verifying lazy load and provider order.
  - Verify that `MainLayout` still includes `Navigation`, `ScrollProgressBar`, `Footer` and mobile wrappers.
  - Confirm your changes do not break the admin-route-first and login ordering.

- **Examples to reference in PRs / patches**:
  - Lazy-loading a page: `const SomePage = lazy(() => import('./pages/SomePage'))` (consistent with existing imports).
  - Preserving chunk-reload logic: see the `FlowDeepAnalysis` import in `src/App.tsx`.
  - Zod schema example: look for `leadSchema` references in `src/` and `ARCHITECTURE.md`.

If anything above is unclear or you want deeper examples (component-level patterns, common utils under `src/lib/`, or how Supabase calls are wrapped), tell me which area to expand and I will iterate.
# Docker has specific installation instructions for each operating system.
# Please refer to the official documentation at https://docker.com/get-started/

# Pull the Node.js Docker image:
docker pull node:24-alpine

# Create a Node.js container and start a Shell session:
docker run -it --rm --entrypoint sh node:24-alpine

# Verify the Node.js version:
node -v # Should print "v24.12.0".

# Verify npm version:
npm -v # Should print "11.6.2".

# Inside the container, navigate to your project directory.