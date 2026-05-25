# Agentick-FE Agent Instructions

This file is the fast entry point for agents working in Agentick-FE. Keep it short. The detailed source of truth lives in `.agents/rules/` and `docs/handbook/`.

## Read Order

1. `.agents/rules/1_development_and_architecture.md`
2. `.agents/rules/2_ui-design-system.md`
3. `.agents/rules/4_tanstack_query_start_router.md`
4. `docs/handbook/00_index.md`
5. The handbook page that matches the task:
   - `docs/handbook/02_architecture.md`
   - `docs/handbook/03_feature_development.md`
   - `docs/handbook/04_tanstack_start_query_router.md`
   - `docs/handbook/05_ui_state_patterns.md`
   - `docs/handbook/06_quality_rules.md`

## Core Architecture Rules

- The app uses feature-based architecture under `src/features/`.
- Routes in `src/routes/` are the orchestration layer. Cross-feature page composition belongs in routes, not inside one feature importing another feature's UI arbitrarily.
- Feature components should not fetch cross-feature data. Move cross-feature `useQuery` / `useSuspenseQuery` / `useSuspenseQueries` calls to routes or layout/container components, then pass data plus loading/error state through props.
- Components inside a feature may use their own feature mutation hooks and may use own-feature queries only for deliberately self-contained widgets. If a query depends on another feature, route/layout orchestration must own it.
- Cross-feature workflows, such as invite dialogs needing user search or inbox items accepting invitations, should receive injected data/callbacks instead of importing another feature's query or mutation hook directly.
- Feature barrels (`index.ts`) are client-safe public APIs. Never export `server.ts` or server-only modules from a feature barrel.
- Use the `@/*` alias for imports instead of long relative paths.

## Feature Data Boundary

Use this standard shape when adding or refactoring server-state features:

```text
src/features/[feature]/
|-- components/
|-- server.ts       # server-only logic, imports "@tanstack/react-start/server-only"
|-- functions.ts    # createServerFn wrappers
|-- queries.ts      # query keys, queryOptions, mutations
|-- schemas.ts      # Zod schemas and exported types
`-- index.ts        # client-safe public API
```

## TanStack Rules

- TanStack Query, Router, Start, and Form are the approved stack for server state, routing, server functions, and forms.
- Query functions must resolve valid data or throw. Do not return `null`, `[]`, `{ error }`, or fallback objects for API failures.
- Use `queryOptions` factories and feature query key factories.
- Critical route data: `loader` + `context.queryClient.ensureQueryData(...)` + `useSuspenseQuery` or `useSuspenseQueries`.
- Secondary/optional widgets: `prefetchQuery` or local `useQuery`, with local loading/error/empty states.
- Required Suspense query options should not use `enabled`; optional/search/inline component queries may use `enabled`.
- Shared mutation hooks own cache invalidation, optimistic updates, rollback, and direct cache writes.
- Components own toast, dialog state, navigation, and local UI side effects.
- Do not use a module-level `QueryClient` singleton for SSR user data. Use `createQueryClient()` per router/request lifecycle and pass the same instance to Router context and `QueryClientProvider`.

## Ky Rules

- Use `src/lib/ky.ts` for backend HTTP calls.
- This project uses Ky v2 and keeps API roots on `prefix`; do not introduce `prefixUrl`.
- Ky throws `HTTPError` for non-2xx responses. Let those errors propagate into TanStack Query unless handling a deliberate domain case.
- Normalize generic backend error messages once in `src/lib/ky.ts` with `beforeError`.
- In Ky v2, use `HTTPError.data` in `beforeError`; do not call `error.response.json()` there.
- UI and mutation callbacks should use `getErrorMessage(error, fallback)` from `src/lib/error.ts`.

## UI State Rules

Every async UI must distinguish loading, error, and valid empty data.

For main content and lists:

- Loading: use `<Skeleton>` with a hardcoded layout matching the expected content.
- Error: use `<Alert variant="destructive">` and `getErrorMessage(error, fallback)`.
- Empty: use full `<Empty>` composition with `EmptyHeader`, `EmptyMedia`, `EmptyTitle`, and actionable `EmptyContent`.

For compact spaces such as sidebars, headers, inline rows, badges, small widgets, and combobox helper areas:

- Loading still needs at least an inline `<Skeleton>`.
- Error uses a tiny icon such as `AlertCircle` plus `text-xs text-destructive`.
- Empty uses minimal helper text such as `text-xs text-muted-foreground`.
- Do not silently hide optional query failures by defaulting failed data to `[]` or `null`.
- If a query feeds submit-critical defaults, selection options, `user_id`, `team_id`, `order`, or permissions, disable the action while loading or errored.

## UI System Rules

- Use existing components from `@/components/ui`, `@/components/common`, `@/components/layout`, and `@/components/decorations` before creating new components.
- Use lucide-react only for icons.
- Do not hardcode raw colors, custom spacing, custom font sizes, or custom z-indexes.
- Do not use `<Badge>` for interactive filters.
- Do not use `window.confirm()`; use `AlertDialog`.
- Do not use `react-hook-form`; use `@tanstack/react-form`.
- Icon-only buttons require `aria-label` or screen-reader text.
- Inputs must support default, focus, error, disabled, and readonly states.
- Use `aria-invalid` for error states.
- Do not remove focus rings.
- Animations must respect `motion-safe:` / `motion-reduce:`.

## Quality Rules

- Prefer small, scoped changes that match existing code patterns.
- Do not revert user changes unless explicitly asked.
- Run checks after major multi-file work:
  - `pnpm typecheck`
  - `pnpm build`
  - `pnpx @biomejs/biome check --write`
- Do not run expensive checks repeatedly for tiny edits unless requested.

## Documentation Pointers

- Project handbook: `docs/handbook/00_index.md`
- Architecture: `docs/handbook/02_architecture.md`
- Feature development: `docs/handbook/03_feature_development.md`
- TanStack/Ky patterns: `docs/handbook/04_tanstack_start_query_router.md`
- UI state patterns: `docs/handbook/05_ui_state_patterns.md`
- Quality rules: `docs/handbook/06_quality_rules.md`
- Development checklist: `docs/handbook/07_development_checklist.md`
