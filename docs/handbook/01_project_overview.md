# Project Overview

Agentick-FE is the frontend application for Agentick, an AI-assisted project management platform. It supports project planning, task execution, schedules, team collaboration, inbox workflows, and AI-powered estimation/risk experiences.

Agentick is designed to be proactive rather than only a passive task tracker. The product combines execution data, work schedules, effort tracking, and AI analysis to surface deadline risk early and improve estimation quality over time.

## Frontend Responsibilities

- Render the dashboard app shell and team/project navigation.
- Provide task, project, team, schedule, inbox, and AI-agent user interfaces.
- Integrate with core and AI APIs through Ky and TanStack Start server functions.
- Use TanStack Router loaders to avoid request waterfalls.
- Keep server-state behavior consistent through TanStack Query.
- Keep UI state predictable with standardized loading, error, and empty states.

## Main Domains

- Auth and current user context
- Teams and team members
- Projects and project members
- Tasks, task detail, task lists, task board, and task config
- Schedules and work-time patterns
- Events and calendar views
- Inbox and invitations
- Agent, risk analysis, and estimation workflows

## Product Capabilities

- Team and project workspaces with role-based access.
- Kanban board and list views for task execution.
- Custom project metadata: statuses, task types, priorities, tags, and phases.
- Effort tracking with estimated and actual hours.
- Work schedule configuration to calculate realistic available working time.
- Calendar and event surfaces for meetings, focus time, and task-linked events.
- Inbox, notifications, and invitation flows.
- AI estimation suggestions based on historical and semantic task context.
- AI risk dashboard with risk scores, drivers, recommendations, and alerts.
- Background AI workflows for morning scans, evening summaries, and outreach reminders.

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
VITE_APP_NAME="Agentick"
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
