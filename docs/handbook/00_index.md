# Agentick-FE Handbook

This folder is the canonical documentation set for the current frontend architecture and development rules.

This handbook replaces the older root-level `docs/*.md` set. Prefer this handbook when implementing new work or reviewing refactors.

## Reading Order

| Order | Document | Purpose |
|---|---|---|
| 1 | `01_project_overview.md` | Product scope, frontend role, and tech stack |
| 2 | `02_architecture.md` | App architecture, feature boundaries, route orchestration |
| 3 | `03_feature_development.md` | How to build or refactor a feature module |
| 4 | `04_tanstack_start_query_router.md` | TanStack Start, Router, Query, Ky, SSR data rules |
| 5 | `05_ui_state_patterns.md` | Loading, error, empty, compact UI, and form action states |
| 6 | `06_quality_rules.md` | Consistency rules, checks, and review expectations |
| 7 | `07_development_checklist.md` | Practical development and review checklist |

## Mandatory Agent Rule Files

The `.agents/rules/` files are enforcement-oriented and should stay aligned with this handbook:

- `.agents/rules/1_development_and_architecture.md`
- `.agents/rules/2_ui-design-system.md`
- `.agents/rules/3_code_quality_and_standards.md`
- `.agents/rules/4_tanstack_query_start_router.md`

## Core Decisions

- Feature modules own feature-local code; routes own cross-feature page composition.
- Feature components receive cross-feature data and actions through props/callbacks; routes or layout containers own those dependencies.
- `server.ts` is server-only and never exported from feature barrels.
- Query functions return valid data or throw. Failed queries are not empty states.
- Route loaders decide criticality: `ensureQueryData` blocks, `prefetchQuery` warms cache.
- Critical data uses Suspense and route error boundaries.
- Optional widgets use local `useQuery` states.
- Ky v2 error normalization is centralized in `src/lib/ky.ts`.
- UI state handling is mandatory for every async UI surface.
- Compact UI is allowed only when full `Alert` or `Empty` would break layout flow.
- Submit-critical dependency queries must block actions while loading or errored.
