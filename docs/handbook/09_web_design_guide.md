# Design System Rules

This is the canonical source for project-level visual design, spacing, and dashboard page layout rules. Do not duplicate these rules in other handbook pages. Link here instead.

For product-level UX principles such as hierarchy, feedback, Hick's Law, Jakob's Law, and form behavior, see `10_ux_principles.md`.

## Source Inputs

- shadcn/base-nova theming: color and radius tokens are semantic CSS variables such as `background`, `foreground`, `primary`, `border`, `ring`, and `radius`. shadcn does not define a project spacing hierarchy for us.
- `C:/Users/Foggo/Downloads/ui_spacing_rules_guide.svg`: the reference emphasizes an 8pt or 4pt grid, asymmetric horizontal/vertical padding, internal spacing smaller than external spacing, proximity hierarchy, and smaller margins as UI depth increases.
- Supabase dashboard pattern: full-width shell, centered content container, responsive horizontal padding.

## Scope

- Treat `src/components/ui/*` as upstream shadcn primitives. Do not change those files for app spacing unless the project intentionally forks the primitive.
- Apply these rules to `src/components/common/*`, `src/components/layout/*`, feature components, and routes.
- Dense surfaces may stay compact when density is the point: tables, calendars, sidebars, editor toolbars, icon toolbars, breadcrumbs, and inline metadata.

## Tokens

The project uses Tailwind's 4px base scale. Prefer Tailwind tokens over arbitrary values.

| Value | Tailwind | Use |
| --- | --- | --- |
| 2px | `0.5` | Rare optical nudges only |
| 4px | `1` | Label-to-input, tight helper text, tiny internal rhythm |
| 8px | `2` | Icon-to-text, compact item gaps, button vertical padding |
| 12px | `3` | Compact horizontal padding, compact card rows |
| 16px | `4` | Field-to-field gaps, default content gaps |
| 24px | `6` | Card/container padding, related block gaps, route padding at tablet |
| 32px | `8` | Section gaps inside a dashboard page |
| 40px | `10` | Desktop container side padding |
| 48px+ | `12+` | Large section separation and page-level breathing room |

Avoid arbitrary spacing, sizing, font sizes, and z-indexes. Exceptions must be layout constraints that Tailwind does not express well, such as `calc(...)` viewport math or a documented fixed content width.

## Padding Rules

- Text controls should have more horizontal padding than vertical padding.
- Preferred ratios are 2:1 or close to it: `px-4 py-2`, `px-6 py-3`, `px-3 py-2` for compact controls.
- Avoid `p-2` on custom button-like or chip-like controls with text. Equal padding is acceptable for square icon buttons and very dense table/calendar cells.
- Cards and major content containers default to `p-6` when they own real page content. Compact cards or rows can use `px-3 py-2` or `px-4 py-3`.

## Proximity Rules

Spacing communicates relationship. Internal spacing must be less than or equal to the external spacing that separates the component from neighboring components.

| Relationship | Preferred spacing |
| --- | --- |
| Label -> input | 4-8px |
| Icon -> text | 8px |
| Field -> field | 16px |
| Related row -> related row | 12-16px |
| Card/block -> card/block | 24-32px |
| Section -> section | 32-48px |

As UI goes deeper, margins shrink: page spacing is largest, section spacing is smaller, card spacing is smaller again, and inline spacing is the smallest.

## Dashboard Page Container

Dashboard layout uses three layers:

1. Page shell: full width. Sidebar, app header, borders, and background are not max-width constrained.
2. Content container: centered with `mx-auto`, responsive side padding, and an optional max width.
3. Page content: cards, forms, tables, and feature UI following the spacing rules above.

Use `AppPageContainer` for dashboard routes:

```tsx
<AppPageContainer size="default">
  <Outlet />
</AppPageContainer>
```

Container sizes:

| Size | Max width | Use |
| --- | --- | --- |
| `small` | `max-w-192` / 768px | Narrow settings/forms |
| `default` | `max-w-300` / 1200px | Normal dashboard pages |
| `large` | `max-w-400` / 1600px | Wide analytics/table-heavy pages |
| `full` | none | Deliberately full-width dense tools |

Default container rhythm is `px-4 py-6 lg:px-6 xl:px-10` with a `gap-8` vertical stack.

Dashboard content routes should not repeat a page title when the app shell already provides sidebar navigation and breadcrumbs. Use local headings only for sections inside the page.

## Component Composition

- Prefer `flex flex-col gap-*` over `space-y-*` for component layout.
- Use `Empty`, `EmptyHeader`, `EmptyMedia`, `EmptyTitle`, and `EmptyContent` for main empty states.
- Use compact helper text only in compact spaces where full empty composition would harm layout.
- Icons inside shadcn controls should usually rely on control styling. Use `data-icon` and avoid manual size classes unless the icon is outside a controlled primitive.
- Icon-only buttons require `aria-label` or screen-reader text.
- Do not remove focus rings.

## Review Checklist

- Is every spacing value on the Tailwind 4px scale unless explicitly justified?
- Are custom text controls using horizontal padding greater than vertical padding?
- Is internal spacing smaller than the external spacing around the component?
- Do page sections use 32-48px separation instead of a flat small gap everywhere?
- Does a dashboard route use `AppPageContainer` instead of hand-rolled route padding/max-width?
- Has the route avoided a duplicate title when breadcrumbs/sidebar already identify the page?
- Are compact exceptions limited to dense UI surfaces?
- Are app components relying on shadcn/base-nova semantic color/radius tokens instead of raw values?
