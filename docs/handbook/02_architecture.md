# Architecture

startcn uses feature-based frontend architecture with route-level orchestration.

## Directory Map

```text
src/
|-- components/
|   |-- ui/           # shadcn-style primitives and molecules
|   |-- common/       # reusable organisms
|   |-- layout/       # app shell components
|   `-- decorations/  # non-core decorative components
|-- configs/          # environment and config objects
|-- constants/        # shared constants and option lists
|-- features/         # feature modules
|-- hooks/            # shared hooks
|-- lib/              # cross-cutting setup and helpers
|-- routes/           # TanStack Router route tree
|-- stores/           # global client state
`-- types/            # shared TypeScript types
```

## Architecture Principles

- A feature owns its own schemas, query options, mutations, server functions, and feature-specific components.
- Routes compose features into pages and decide which data is critical.
- Shared components in `components/common` must be reusable across multiple features.
- Layout components in `components/layout` are app-shell concerns, not feature-specific concerns.
- Cross-cutting library setup belongs in `src/lib`.

## Feature Boundary

Standard feature shape:

```text
src/features/[feature]/
|-- components/
|-- server.ts
|-- functions.ts
|-- queries.ts
|-- schemas.ts
`-- index.ts
```

Responsibilities:

| File | Responsibility |
|---|---|
| `server.ts` | Server-only IO and Ky/API calls |
| `functions.ts` | `createServerFn` wrappers and validation |
| `queries.ts` | Query key factories, `queryOptions`, mutation hooks |
| `schemas.ts` | Zod schemas and exported types |
| `components/` | Feature UI |
| `index.ts` | Client-safe public API |

## Barrel Rule

Feature internals are private by default.

Use:

```ts
import { userMeQueryOptions } from "@/features/users"
```

Avoid:

```ts
import { userMeQueryOptions } from "@/features/users/queries"
```

Exception: direct imports may be used when there is an intentional internal boundary, but do not make that the default.

Never export `server.ts` or modules marked with `"@tanstack/react-start/server-only"` from `index.ts`.

## Route Orchestration

Routes own page-level composition:

- Pull widgets from multiple features.
- Decide required vs secondary data.
- Add route-level `errorComponent` / `notFoundComponent` where needed.
- Keep feature modules decoupled from each other.

Feature A should not import Feature B's page widget just to compose a route. Put that composition in `src/routes`.

## Feature Data Boundary

Feature components should not fetch data from another feature.

If a component in `src/features/[feature]/components` needs data owned by another feature, move that data dependency to a route, layout, or route-local container and pass it down through props. Pass all relevant states, not only the successful data:

- data
- loading state
- error state
- error object, when UI copy needs `getErrorMessage`
- callbacks for cross-feature actions

Avoid fetching cross-feature data directly in layout/presentation components:

```tsx
const { data: user } = useQuery(userMeQueryOptions)
```

Prefer route/layout orchestration (e.g. in `routes/dashboard/route.tsx`):

```tsx
const user = useQuery(userMeQueryOptions)

return (
  <AppSidebar
    user={user.data}
    isUserLoading={user.isLoading}
    isUserError={user.isError}
    userError={user.error}
  />
)
```

Allowed coupling:

- feature-local mutation hooks inside the same feature
- own-feature queries for deliberately self-contained widgets
- type-only imports from another feature's public barrel
- aggregate schemas that model backend aggregate payloads
- query key imports for cache invalidation
- callbacks or injected adapters for cross-feature workflows

When a feature component renders a cross-feature workflow, such as a member invite dialog requiring user search or an inbox item accepting an invitation, inject the searched data and action callbacks from the route/container instead of importing the other feature's query or mutation hook.

Common boundary patterns:

- App shell sidebar (`AppSidebar`) and `UserProfile` receive user context and logout callbacks via props from `routes/dashboard/route.tsx`.
- Feature components receive user-specific options, roles, or configurations from route loaders/containers.
- Table columns that need global user context or specific configuration values are created by column factory functions, receiving context as arguments.

## QueryClient Lifecycle

The app must not use a request-shared module singleton `QueryClient` for user data.

Expected shape:

- `src/lib/query-client.ts` exports `createQueryClient()`.
- `src/router.tsx` creates a fresh client inside `getRouter()`.
- Router context and `QueryProvider` receive the same client.
- Auth clear/sign-out flows clear the active `useQueryClient()` instance.

## Error Boundaries

Use nested route boundaries for important app areas so one section failure does not replace the whole app shell.

Recommended areas:

- `/dashboard`
- `/dashboard/overview`
- `/dashboard/team`
- `/dashboard/inbox`
- `/dashboard/schedules`
- `/dashboard/settings`
