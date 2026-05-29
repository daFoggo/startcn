# Project Overview

AnnoBot is a resident-facing annotation assistant for smart-building research studies. It helps occupants label sensor-detected events with minimal burden by combining passive sensor evidence, learned household patterns, Telegram questions, and a web dashboard for review and fallback answering.

This frontend started from the startcn Base dashboard template. The base architecture, auth, layout, and reusable components remain useful, but product work should now treat AnnoBot resident workflows as the primary scope. See `11_annobot_resident_product.md` for the canonical resident-side product model and screen requirements.

## Frontend Responsibilities

- Render the resident dashboard app shell and project navigation.
- Provide robust authentication, including Telegram OIDC and account login fallback.
- Show resident project list, project dashboard, configuration, annotation logs, about project, and web fallback answering surfaces.
- Integrate with core APIs through Ky and TanStack Start server functions.
- Use TanStack Router flat routing for optimal layout composition and loaders to avoid request waterfalls.
- Keep server-state behavior consistent through TanStack Query queryOptions factories.
- Keep UI state predictable with standardized loading, error, and empty states.

## Main Domains

- **Auth and Telegram Entry**: Login, session context, Telegram OIDC callback, and Telegram bot entry redirects.
- **Resident Projects**: Project list, project detail loading, participation status, coverage, and pending questions.
- **Activities and Annotation Events**: Activity cards, event timelines, sensor context, source provenance, and slot checklists.
- **Resident Configuration**: Read-only researcher-defined study schema plus editable resident overrides such as quiet hours, devices, daily question budget, scenarios, and member routing.
- **Dynamic Dashboard App Shell**: Responsive sidebar and project-aware navigation.
- **Reusable Utility Components**: Core feature-agnostic widgets in `components/common` for data-heavy resident views where appropriate.

## Product Capabilities

- **Auth & Sessions**: Seamless session persistence, Telegram OIDC login, account login fallback, and automatic token redirection.
- **Project Routing**: `/dashboard` redirects to resident projects; Telegram can deep-link to a specific project or fall back to project list.
- **Resident Dashboard**: Cross-activity overview, pending questions, coverage, and per-activity cards with recent event timelines.
- **Annotation Review**: Filterable logs with sensor context, source badges, resident corrections, and expandable slot summaries.
- **Resident Controls**: Quiet hours, daily question limits, scenario overrides, connected devices, and member routing patterns.
- **Asynchronous Standard UI**: Every data-bound container clearly defines and handles loading, error, and valid empty states.

## Tech Stack

| Area | Technology |
|---|---|
| App framework | TanStack Start |
| Routing | TanStack Router |
| Server state | TanStack Query |
| Forms | TanStack Form |
| Tables | TanStack Table |
| HTTP client | Ky v2 |
| Validation | Zod |
| UI | React 19, shadcn/ui, Base UI/Radix-style components |
| Styling | Tailwind CSS v4 |
| Icons | @tabler/icons-react |
| Client state | Zustand |
| Testing | Vitest |
| Formatting/linting | Biome |
| Build tooling | Vite |

## Environment

Client environment variables are validated in `src/configs/env.ts`.

```env
VITE_API_CORE_URL=http://localhost:8000
VITE_API_AI_URL=http://localhost:8001
VITE_APP_NAME="startcn"
```

## External References

- TanStack Start: https://tanstack.com/start/latest/docs/framework/react/overview
- TanStack Router: https://tanstack.com/router/latest/docs/framework/react/overview
- TanStack Query: https://tanstack.com/query/latest/docs/framework/react/overview
- TanStack Form: https://tanstack.com/form/latest/docs/framework/react/overview
- TanStack Table: https://tanstack.com/table/latest/docs/introduction
- Ky: https://github.com/sindresorhus/ky
- Zod: https://zod.dev
- Tailwind CSS: https://tailwindcss.com/docs
- shadcn/ui: https://ui.shadcn.com/docs
- Base UI: https://base-ui.com/react/overview/quick-start
- Tabler Icons: https://tabler.io/docs/quickstart/react
