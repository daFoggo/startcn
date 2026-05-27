# UI State Patterns

This document is the canonical UI rule set for async data, loading, error, empty states, and compact surfaces.

## Principle

Failed data is not empty data.

Every async UI must distinguish:

- loading
- error
- valid empty
- valid data

Do not hide failed queries by defaulting to `[]`, `null`, empty UI, or harmless-looking fallback values.

## Standard Main Content Pattern

Use this for pages, lists, tables, grids, cards, and large content panels.

| State | Component | Rule |
|---|---|---|
| Loading | `<Skeleton>` | Hardcode count/layout to match expected content. Do not map unstable indexes from fetched data. |
| Error | `<Alert variant="destructive">` | Use `getErrorMessage(error, fallback)`. |
| Empty | `<Empty>` | Use full composition with `EmptyHeader`, `EmptyMedia`, `EmptyTitle`, and actionable `EmptyContent`. |

Example:

```tsx
if (isLoading) return <UserListSkeleton />

if (isError) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="size-4" />
      <AlertDescription>
        {getErrorMessage(error, "Could not load users.")}
      </AlertDescription>
    </Alert>
  )
}

if (users.length === 0) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <UsersIcon />
        </EmptyMedia>
        <EmptyTitle>No users yet</EmptyTitle>
        <EmptyDescription>Add or invite users to start collaborating.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent> // only display when you have action button, dont display if only has description
        <Button>Invite user</Button>
      </EmptyContent>
    </Empty>
  )
}
```

## Compact UI Exceptions

Use compact state UI only when a full `Alert` or `Empty` would break layout flow:

- sidebars
- headers
- inline status rows
- table cells
- badges
- small widgets
- combobox helper areas
- popover rows

Compact loading:

```tsx
<Skeleton className="h-4 w-24" />
```

Compact error:

```tsx
<div className="flex items-center gap-1.5 text-xs text-destructive">
  <AlertCircle className="size-3.5 shrink-0" />
  <span>{getErrorMessage(error, "Could not load data.")}</span>
</div>
```

Compact empty:

```tsx
<p className="text-xs text-muted-foreground">No items yet.</p>
```

## Submit-Critical Query Rule

Some optional-looking queries still feed critical form data. These must block actions while loading or errored.

Examples:

- current user for `user_id`
- user search options
- permission / authorization checks

Rule:

- show a loading state
- show an error state
- disable submit/action when the dependency is loading or errored
- do not fallback to `order: 0`, `user_id: ""`, empty options, or hidden avatars as if the query succeeded

Common failure modes to avoid:

- failed member query -> hidden avatars
- failed user search -> empty search results
- failed config query -> `order: 0`
- failed current user query -> `user_id: ""`

## Suspense vs Local UI

Critical route data:

- route loader uses `ensureQueryData`
- component uses `useSuspenseQuery`
- route error boundary owns error UI

Optional widget data:

- component uses `useQuery`
- component owns loading/error/empty UI

## Empty State Rules

Only show empty UI when the server returned valid empty data.

Do not show empty state when:

- query errored
- auth dependency failed
- required route param is missing
- search API failed
- config query failed

## Loading Rules

- Use `<Skeleton>`, not custom `animate-pulse` markup.
- Hardcode skeleton count and layout.
- Skeleton should preserve layout dimensions and avoid content jumps.
- For compact spaces, an inline skeleton is enough.

## Error Copy

Use:

```ts
getErrorMessage(error, "Fallback message")
```

Do not parse backend payloads in components. Ky normalization already gives readable messages.
