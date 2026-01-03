# Copilot / AI Agent Quick Instructions

Short, actionable guidance to help an AI coding agent be productive in this repo.

## Big picture (what this repo is)
- **Purpose**: This project is a **moving assistant platform** designed to streamline relocation processes. It provides tools for comparing moving companies, scheduling, and managing logistics.
- **Frontend SPA**: Built with Vite + React (TypeScript) and Tailwind for a modern, responsive UI.
- **Backend Integration**: Relies on Supabase for database and serverless functions.
- **Design/Deployment Hooks**: Integrates with Lovable for component tagging and includes a build-time ChatGPT export generator. See Vite plugin usage: [vite.config.ts](vite.config.ts#L1-L120).

## Major components & boundaries
- `src/pages`: Route-level pages, many of which are lazy-loaded for performance. Example: [src/App.tsx](src/App.tsx#L1-L50).
- `src/components`: Reusable UI and layout components. Key examples:
  - `Navigation` and `Footer`: Synchronous for fast initial load.
  - `CantonComparisonWidget`: Encapsulates logic for comparing cantons.
- `src/contexts`: Global contexts for managing state (e.g., Auth, Performance).
- `src/components/performance`: Performance helpers like `CriticalCSS` and `PrefetchManager`.

## Important integration points
- **Lovable**: Auto-tags components for design system workflows. See [vite.config.ts](vite.config.ts#L1-L120).
- **ChatGPT Export**: Generates `public/chatgpt-export.txt` at build time. Used by admin tools (see [scripts/generate-chatgpt-export.js](scripts/generate-chatgpt-export.js#L1-L40)).
- **Supabase**: Provides database and serverless functions. Key files:
  - `supabase/config.toml`: Local configuration.
  - `supabase/functions/`: Custom serverless functions.
- **PWA**: Configured in `vite.config.ts` for runtime caching (e.g., fonts, Supabase).

## Developer workflows (commands)
- **Install dependencies**: `npm i`
- **Start dev server**: `npm run dev` (Vite server on `::` port `8080`).
- **Build for production**: `npm run build` (includes ChatGPT export and PWA generation).
- **Preview production build**: `npm run preview`.
- **Lint code**: `npm run lint`.
- **Run unit tests**: `npm test`.
- **Run integration tests**: `npm run test:integration` (for Supabase functions).

## Project-specific conventions & patterns
- **Code-Splitting**: Routes are lazy-loaded to optimize performance. See [src/App.tsx](src/App.tsx#L1-L50).
- **React Query Defaults**: Configured for longer stale times and disabled refetch-on-window-focus. See [src/App.tsx](src/App.tsx#L317-L322).
- **Tailwind + shadcn-ui**: Forms the design system. Key files: `src/index.css`, `tailwind.config.ts`.
- **Build Plugins**: Auto-generates ChatGPT export and includes a dev-only `componentTagger`.

## CI, Build & Exports
- **CI Workflow**: Defined in `.github/workflows/ci.yml`. Key points:
  - Runs on pushes to `main` and `loop/**` branches.
  - Uses Node 20.
  - Executes `npm install --force` and `npm run build`.
- **Regenerate ChatGPT Export**:

```bash
node scripts/generate-chatgpt-export.js
```

- **Environment Variables**: Set `SUPABASE_URL` and `SUPABASE_KEY` locally or in GitHub Secrets.

## Debugging Tips
- **Supabase**: Use the CLI to inspect logs and test functions locally. Example: `supabase start`.
- **Runtime Caching**: Check `vite.config.ts` for caching rules.
- **Component Debugging**: Use React DevTools to inspect state and props.

## External Dependencies
- **Supabase**: Database and serverless functions.
- **Lovable**: Component tagging for design workflows.

## Code Quality
- **Linting**: Run `npm run lint` to check for errors. Fix with `npm run lint --fix`.
- **Formatting**: Ensure consistent formatting with Prettier.
