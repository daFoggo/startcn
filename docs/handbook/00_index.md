# startcn Handbook

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
| 8 | `08_telegram_login.md` | Telegram OIDC sign-in and account linking flow |
| 9 | `09_web_design_guide.md` | Canonical design system, spacing, and dashboard container rules |
| 10 | `10_ux_principles.md` | Product UX principles retained from the Laws of UX field guide |

## Mandatory Agent Rule Files

Automation agents and coding assistants should read `AGENTS.md` at the project root first, which points directly to this handbook.

## Core Decisions

- Feature modules own feature-local code; routes own cross-feature page composition.
- Feature components receive cross-feature data and actions through props/callbacks; routes or layout containers own those dependencies.
- `server.ts` is server-only and never exported from feature barrels.
- Query functions return valid data or throw. Failed queries are not empty states.
- Route loaders decide criticality: `ensureQueryData` blocks, `prefetchQuery` warms cache.
- Critical data uses Suspense and route error boundaries.
- Optional widgets use local `useQuery` states.
- Ky v2 error normalization is centralized in `src/lib/ky.ts`.
- Telegram sign-in uses a callback route plus server function session update; account linking code is separate from settings pages.
- UI state handling is mandatory for every async UI surface.
- Compact UI is allowed only when full `Alert` or `Empty` would break layout flow.
- Submit-critical dependency queries must block actions while loading or errored.
- Design and spacing rules live in `09_web_design_guide.md`; other docs should link there instead of duplicating the rules.
- Product UX principles live in `10_ux_principles.md`; keep them separate from implementation spacing rules.
