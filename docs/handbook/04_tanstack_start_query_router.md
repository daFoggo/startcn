# TanStack Start, Router, Query, and Ky Patterns

This is the canonical data-fetching pattern for startcn.

## Approved Stack

- TanStack Start for app/server function integration.
- TanStack Router for routes, loaders, route context, error boundaries, and not-found handling.
- TanStack Query for server-state caching, loading/error states, invalidation, retries, and mutations.
- Ky v2 for HTTP calls.
- Zod for validation.

Do not introduce another server-state cache layer.

## Query Function Contract

A query function must either return real data or throw an error.

In practice, this means:

- If the request succeeds, return the payload the UI should actually use.
- If the request fails for a real transport/server/auth problem, let the error bubble up.
- Only catch errors when you are intentionally translating a known domain case, such as `404 -> notFound()`.

Wrong:

```ts
try {
  const response = await api.get("users").json<TBaseResponse<TUser[]>>()
  return response.data
} catch (error) {
  console.error(error)
  return []
}
```

Correct:

```ts
const response = await api.get("users").json<TBaseResponse<TUser[]>>()
return response.data
```

This repo also has one related pattern for list endpoints: the server function may normalize a missing backend payload to an empty list, for example `return res ?? []`. That is not the same as swallowing an error in a `catch` block.

Only catch known domain cases:

```ts
try {
  return await fetchUserById(userId)
} catch (error) {
  if (isHTTPError(error) && error.response.status === 404) {
    throw notFound()
  }

  throw error
}
```

That pattern is used for detail resources in this repo: a missing user or key resource becomes `notFound()`, while everything else still fails normally so the route or UI can show the real error state.

## Query Keys

Each feature owns a key factory:

```ts
export const userKeys = {
  all: ["users"] as const,
  me: () => [...userKeys.all, "me"] as const,
  searches: () => [...userKeys.all, "search"] as const,
  search: (q: string) => [...userKeys.searches(), q] as const,
}
```

Use key factory prefixes for invalidation.

## Query Options

Export query options factories:

```ts
export const searchUsersQueryOptions = (q: string) =>
  queryOptions({
    queryKey: userKeys.search(q),
    queryFn: () => searchUsersFn({ data: { q } }),
  })
```

Use the same options in loaders, components, and cache APIs:

```ts
await context.queryClient.ensureQueryData(searchUsersQueryOptions(query))
const { data } = useSuspenseQuery(searchUsersQueryOptions(query))
queryClient.invalidateQueries({ queryKey: userKeys.searches() })
```

## Route Loader Policy

Routes decide criticality.

This is the core mental model:

- Critical data blocks route rendering with `ensureQueryData`.
- Secondary data may be prefetched, but its component must still render local states.
- Failed query data is never an empty state.
- Suspense must be backed by a loader guarantee.

| Data kind | Loader | Component |
|---|---|---|
| Critical route data | `ensureQueryData` | `useSuspenseQuery` / `useSuspenseQueries` |
| Secondary widget data | `prefetchQuery` | `useQuery` with local states |
| Optional/search/inline data | Usually no blocking loader | `useQuery` with `enabled` |

Do not use `useSuspenseQuery` for data that is only fire-and-forget prefetched.

## Suspense Rules

- Suspense query options should not include `enabled`.
- Route params are the precondition for critical route data.
- Use `enabled` for optional, search, and inline component-local queries.
- Missing critical resources should become `notFound()` only for known 404 cases.
- Unknown failures should propagate to the nearest route error boundary.

## Mutation Policy

```ts
const updateProfile = useMutation({
  mutationFn: updateProfileFn,
  onSuccess: async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: userKeys.me() }),
    ])
  },
})
```

Rules:

- Shared mutation hooks own cache correctness.
- Components own UX side effects.
- Avoid `toast` and `router.navigate` inside shared mutation hooks.
- Await invalidation when pending state should last until related cache updates finish.

## QueryClient Lifecycle

SSR-safe pattern:

```ts
export function getRouter() {
  const queryClient = createQueryClient()

  const router = createTanStackRouter({
    routeTree,
    context: { queryClient },
  })

  setupRouterSsrQueryIntegration({
    router,
    queryClient,
    wrapQueryClient: false,
  })

  return router
}
```

Rules:

- Do not import a module-level `queryClient` singleton for user data.
- Create QueryClient through `createQueryClient()`.
- Create it in the router/request lifecycle.
- Pass the same instance to router context and `QueryProvider`.
- Clear query caches from auth mutation and account-switch flows when the signed-in identity changes.

## Ky v2 Rules

Keep HTTP setup centralized in `src/lib/ky.ts`.

- Use `prefix` for API roots in this project.
- Do not introduce `prefixUrl`.
- Let Ky throw `HTTPError` for non-2xx responses.
- Use `beforeError` for generic backend error message normalization.
- Use `HTTPError.data` in `beforeError`.
- Do not call `error.response.json()` inside `beforeError`.
- Do not parse/clone response bodies in feature fetchers for generic error messages.
- UI should call `getErrorMessage(error, fallback)`.

Ky should normalize messages, not change control flow into success data.

Correct:

- `HTTPError` propagates.
- `beforeError` improves `error.message`.
- UI calls `getErrorMessage`.

Incorrect:

- feature server functions clone and parse response bodies for generic errors.
- query functions return fallback data after API failure.
- `beforeError` calls `error.response.json()` in Ky v2.
