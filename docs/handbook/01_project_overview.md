# Project Overview

startcn Base Boilerplate is the clean, minimal dashboard base template featuring authentication (Auth) and user management (Users) features, combined with a highly responsive, dynamic context-switching sidebar layout. It serves as a modern, premium starter kit for building robust and beautiful SaaS frontend web applications.

It is fully equipped with advanced pre-built utility components (Big Calendar, Data Table, Markdown Editor/Renderer, Multi-select Combobox) ready to accelerate your dashboard application development.

## Frontend Responsibilities

- Render the base dashboard app shell and flexible sidebar context switcher.
- Provide clean, robust user authentication (Login, Register, Session context, Logout).
- Integrate with core APIs through Ky and TanStack Start server functions.
- Use TanStack Router flat routing for optimal layout composition and loaders to avoid request waterfalls.
- Keep server-state behavior consistent through TanStack Query queryOptions factories.
- Keep UI state predictable with standardized loading, error, and empty states.

## Main Domains

- **Auth and User Context**: Pre-built authentication hooks (`src/features/auth/`), user session management, and current user retrieval.
- **Dynamic Dashboard App Shell**: A responsive sidebar (`AppSidebar`) equipped with a context-switching store to switch navigation panels (Main Menu vs System Settings) dynamically.
- **Flat Layout Routes**: Modern flat-structured routes directly under `/dashboard` (overview, schedules, inbox, team, and settings layouts) with clean redirection.
- **Reusable Utility Components**: Core feature-agnostic widgets in `components/common` (Big Calendar, Data Table, Markdown Editor/Renderer, Multi-select Combobox) to be utilized anywhere.

## Product Capabilities

- **Auth & Sessions**: Seamless session persistence and automatic token redirection.
- **Context-Switching Sidebar**: Sleek collapsible navigation sidebar with custom user profile card, team/organization switcher placeholders, and dynamic sub-menu panels.
- **Flat Redirections**: Unified `/dashboard` routing with `/dashboard/overview`, `/dashboard/schedules`, `/dashboard/inbox`, `/dashboard/team`, and a dedicated layout under `/dashboard/settings/*` (general, security, theme settings).
- **Asynchronous Standard UI**: Every data-bound container clearly defines and handles loading (custom skeletons), error (error alert boxes), and valid empty states.

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
| Icons | lucide-react |
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
- Lucide React: https://lucide.dev/guide/packages/lucide-react
