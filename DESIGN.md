---
version: "alpha"
name: "anno-bot-fe"
description: "Operational dashboard design system for Anno Bot. Built on shadcn/base-nova, Tailwind CSS v4, semantic CSS variables, Google Sans, and a compact dashboard rhythm."
colors:
  background: "#FAFCFE"
  foreground: "#101C25"
  card: "#FFFFFF"
  card-foreground: "#101C25"
  popover: "#FFFFFF"
  popover-foreground: "#101C25"
  primary: "#3BA6F1"
  primary-foreground: "#FAFCFE"
  secondary: "#E6F0F8"
  secondary-foreground: "#083E61"
  muted: "#EEF4FA"
  muted-foreground: "#5D6B77"
  accent: "#DFEDF9"
  accent-foreground: "#002440"
  destructive: "#D74745"
  border: "#DBE2E9"
  input: "#DBE2E9"
  ring: "#3BA6F1"
  chart-1: "#3BA6F1"
  chart-2: "#7FDEA1"
  chart-3: "#FFBC3A"
  chart-4: "#B68CFF"
  chart-5: "#FC7185"
  dark-background: "#0D1217"
  dark-foreground: "#F6F9FC"
  dark-card: "#171E24"
  dark-secondary: "#252F37"
  dark-muted: "#1F282F"
  dark-accent: "#2A3741"
typography:
  body:
    fontFamily: "Google Sans Variable"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: "1.5rem"
    letterSpacing: "0em"
  body-sm:
    fontFamily: "Google Sans Variable"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: "1rem"
    letterSpacing: "0em"
  label:
    fontFamily: "Google Sans Variable"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: "1.25rem"
    letterSpacing: "0em"
  section-title:
    fontFamily: "Google Sans Variable"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: "1.5rem"
    letterSpacing: "0em"
  page-title:
    fontFamily: "Google Sans Variable"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: "1.75rem"
    letterSpacing: "0em"
  code:
    fontFamily: "Google Sans Code Variable"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: "1.5rem"
    letterSpacing: "0em"
rounded:
  sm: "0.375rem"
  md: "0.5rem"
  lg: "0.625rem"
  xl: "0.875rem"
  2xl: "1.125rem"
spacing:
  0.5: "2px"
  1: "4px"
  2: "8px"
  3: "12px"
  4: "16px"
  6: "24px"
  8: "32px"
  10: "40px"
  12: "48px"
  page-x-mobile: "16px"
  page-x-tablet: "24px"
  page-x-desktop: "40px"
  page-y: "24px"
  section-gap: "32px"
components:
  app-page-container:
    padding: "{spacing.page-y} {spacing.page-x-mobile}"
    width: "100%"
  app-page-container-default:
    width: "1200px"
  app-page-container-small:
    width: "768px"
  app-page-container-large:
    width: "1600px"
  button-default:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.lg}"
    height: "32px"
    padding: "8px 16px"
    typography: "{typography.label}"
  button-compact:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.secondary-foreground}"
    rounded: "{rounded.md}"
    height: "28px"
    padding: "6px 12px"
    typography: "{typography.body-sm}"
  card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.card-foreground}"
    rounded: "{rounded.xl}"
    padding: "{spacing.6}"
  input:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
    height: "32px"
    padding: "8px 12px"
  sidebar:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    width: "256px"
  focus-ring:
    backgroundColor: "{colors.ring}"
    width: "3px"
---

## Overview

Anno Bot is a compact operational dashboard. The design should feel quiet, precise, and work-focused: dense enough for repeated use, but not cramped. It uses shadcn/base-nova primitives, Tailwind CSS v4 utilities, semantic CSS variables in `src/styles.css`, and @tabler/icons-react.

The runtime source of truth for theme values remains `src/styles.css`. The hex colors above are sRGB approximations of the current OKLCH CSS variables so tools that consume DESIGN.md can reason about contrast and component usage.

Related handbook sources:

- `docs/handbook/05_ui_state_patterns.md` defines loading, error, empty, and valid-data UI expectations.
- `docs/handbook/09_web_design_guide.md` is the canonical implementation guide for spacing, dashboard containers, and design-system usage.
- `docs/handbook/10_ux_principles.md` preserves product UX heuristics such as hierarchy, proximity, feedback, Hick's Law, Jakob's Law, and form tolerance.

When changing UI or UX, follow those handbook docs together with this file. `DESIGN.md` gives agents token values and visual identity; the handbook gives project-specific implementation rules.

## Colors

Use semantic tokens, not raw color classes. Components should refer to `bg-background`, `text-foreground`, `bg-card`, `border-border`, `ring-ring`, `bg-primary`, and their foreground pairs.

- Primary blue is reserved for high-emphasis actions, selected states, active accents, focus rings, and chart-1.
- Secondary, muted, and accent surfaces create quiet dashboard structure without competing with primary actions.
- Destructive is reserved for dangerous actions and error states.
- Sidebar tokens mirror the app background and accent system so the shell reads as one continuous product surface.
- Dark mode uses the same semantic token names with darker surfaces and lighter foregrounds. Do not create separate dark-only component APIs.

## Typography

Use Google Sans for UI and Google Sans Code for code. Keep dashboard type restrained:

- `body` is the default dashboard text rhythm.
- `body-sm` is for metadata, helper text, compact rows, breadcrumbs, and table controls.
- `label` is for labels, compact button text, and menu items.
- `section-title` is for local section headings inside a route.
- `page-title` should be rare inside dashboard routes because sidebar navigation and breadcrumbs already provide page context.

Letter spacing should remain `0em` unless a component has a specific, reviewed reason.

## Layout

Dashboard pages use a full-width shell and a centered content container:

- Shell: sidebar, header, borders, and background run full width.
- Content: `AppPageContainer` owns `mx-auto`, responsive side padding, max width, and vertical rhythm.
- Default route container: 1200px max width.
- Small container: 768px for narrow forms/settings.
- Large container: 1600px for analytics and table-heavy pages.
- Full container: no max width for deliberately dense tools.

Default dashboard route padding is 16px on mobile, 24px on tablet, 40px on desktop, and 24px vertical. Page content stacks with a 32px section gap.

## Elevation & Depth

Prefer borders, surface tokens, and subtle contrast over heavy shadows. Cards, popovers, dropdowns, and dialogs should use semantic surfaces:

- Cards use `card` and `card-foreground`.
- Popovers and menus use `popover` and `popover-foreground`.
- Focus rings use `ring`; do not remove focus states.
- Dense tables and calendars can use border lines and muted backgrounds to create structure without extra elevation.

## Shapes

The base radius is 0.625rem. Derived radii follow the shadcn scale in `src/styles.css`:

- `rounded-md` and `rounded-lg` are the default control shapes.
- Cards and larger containers can use `rounded-xl`.
- Avoid oversized pill shapes unless the primitive is intentionally a badge, chip, or avatar-like element.
- Do not add radius without a clear boundary. A region should also have a surface, border, or spacing relationship.

## Components

Use existing primitives before creating new UI:

- `src/components/ui/*` is upstream shadcn/base-nova style. Do not fork it for ordinary page spacing.
- `src/components/common/*` and feature components should compose primitives with project spacing rules.
- Text controls should use horizontal padding greater than vertical padding, usually close to 2:1.
- Cards that own real page content default to 24px padding.
- Forms use small label-to-input gaps, 16px field gaps, and 32-48px section gaps.
- Empty states use `Empty`, `EmptyHeader`, `EmptyMedia`, `EmptyTitle`, and `EmptyContent` for main content.
- Icons use @tabler/icons-react only. Icons inside shadcn controls should usually rely on control styling or `data-icon`.

## Do's and Don'ts

Do:

- Use semantic CSS variables and Tailwind token utilities.
- Use `AppPageContainer` for dashboard route content.
- Keep internal spacing smaller than external spacing.
- Use `flex flex-col gap-*` rather than `space-y-*`.
- Distinguish loading, error, empty, and valid data states.
- Keep dense exceptions limited to tables, calendars, sidebars, toolbars, breadcrumbs, and inline metadata.

Don't:

- Do not hardcode raw colors, arbitrary spacing, arbitrary font sizes, or arbitrary z-indexes.
- Do not repeat page titles inside dashboard content when breadcrumbs and sidebar already identify the route.
- Do not use `<Badge>` for interactive filters.
- Do not use window-level confirms for destructive actions; use `AlertDialog`.
- Do not remove focus rings or rely on color alone for meaning.
- Do not introduce a new icon set.
