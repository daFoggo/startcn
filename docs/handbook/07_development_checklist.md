# Development Checklist

This checklist is focused on implementation and review. It intentionally avoids product model documentation.

## Before Coding

- Identify the feature owner under `src/features/`.
- Check whether the route should orchestrate multiple features.
- Decide whether data is critical route data or secondary widget data.
- Check existing `@/components/ui`, `@/components/common`, and feature components before creating new UI.
- Check existing query key factories and query options before adding new keys.

## Feature Boundary

- `server.ts` is server-only and imports `"@tanstack/react-start/server-only"`.
- `functions.ts` wraps server logic with `createServerFn`.
- `queries.ts` owns query keys, `queryOptions`, and mutation hooks.
- `schemas.ts` owns Zod schemas and exported types.
- `index.ts` exports only client-safe public API.
- Do not export `server.ts` from feature barrels.
- Avoid cross-feature coupling inside feature modules; compose cross-feature pages in routes.
- Do not call another feature's query or mutation hook from a feature component for page composition.
- Move cross-feature data loading/actions to routes, layouts, or route-local containers, then pass data, loading/error state, and callbacks through props.
- Use column factories with injected context instead of querying inside table cells.
- Use relative imports inside a feature instead of importing that same feature through its public barrel.

## Data Fetching

- Query functions return valid data or throw.
- Do not use `catch -> return null`, `catch -> return []`, or `{ error }` payloads for API failures.
- Critical route data uses `ensureQueryData` and Suspense.
- Secondary widgets use `prefetchQuery` or local `useQuery`.
- Optional/search/inline queries may use `enabled`.
- Suspense query options should not use `enabled`.
- 404 handling should be deliberate: known missing route resources can become `notFound()`, unknown errors rethrow.

## UI State

- Every local `useQuery` surface needs loading and error states.
- Add empty state only for valid empty data.
- Main content uses `Skeleton`, destructive `Alert`, and full `Empty` composition.
- Compact spaces use inline `Skeleton`, tiny icon/error text, and compact helper empty text.
- Do not hide failed queries by defaulting to `[]`, `null`, hidden UI, or fallback values.
- If a query feeds submit-critical data, disable the action while loading or errored.

Submit-critical examples:

- current user id
- team/project id dependency
- member/search options
- permission/role checks
- config ordering/default values
- participant lists

## Mutations

- Shared mutation hooks own invalidation, optimistic updates, rollback, and cache writes.
- Components own toast, dialog state, navigation, local status, and form reset.
- Use `mutateAsync` only when composing follow-up side effects.
- Await invalidation when pending state should include cache refresh.
- Use query key factories for invalidation.

## Forms

- Use `@tanstack/react-form`.
- Use Zod validators at the form level.
- Use `Field`, `FieldLabel`, `FieldError`, and `aria-invalid`.
- Use `form.Subscribe` for submit button state.
- Do not use `react-hook-form`.
- Do not use `window.confirm()`.

## Ky and Error Messages

- Use `src/lib/ky.ts` for API calls.
- Keep Ky v2 API roots on `prefix`.
- Use Ky `beforeError` and `HTTPError.data` for generic backend message normalization.
- Do not parse `error.response.json()` in components or feature fetchers for generic messages.
- UI and mutation catch blocks use `getErrorMessage(error, fallback)`.

## UI System

- Use lucide-react only.
- Do not hardcode raw colors, arbitrary spacing, arbitrary font sizes, or arbitrary z-indexes.
- Use design tokens and Tailwind scale.
- Icon-only buttons require accessible labels.
- Inputs must support default, focus, error, disabled, and readonly states.
- Do not remove focus rings.
- Use `motion-safe:` / `motion-reduce:` for animations.

## Review Checklist

- Does the change preserve feature boundaries?
- Are cross-feature data dependencies owned by routes/layouts instead of feature components?
- Are cross-feature workflows injected through props/callbacks instead of direct query/mutation imports?
- Does server-state code throw on failure?
- Are route loaders aligned with Suspense usage?
- Is `useSuspenseQuery` backed by `ensureQueryData`?
- Is `enabled` used only for optional/search/inline queries?
- Are all local query states represented?
- Are failed queries prevented from becoming fake empty data?
- Should any local widget data be route-critical instead?
- Are submit-critical dependency failures blocking actions?
- Are mutation side effects split correctly between hooks and components?
- Are invalidations using key factories?
- Are UI components using existing primitives and composition rules?
- Are errors displayed through `getErrorMessage`?
- Did you run the appropriate checks for the size of the change?
