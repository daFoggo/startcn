# startcn Base Boilerplate

startcn Base Boilerplate is a clean, minimal dashboard base template featuring authentication (Auth) and user management (Users) features, combined with a highly responsive, dynamic context-switching sidebar layout. It is equipped with advanced pre-built utility components (Big Calendar, Data Table, Markdown Editor/Renderer, Multi-select Combobox) ready to accelerate your dashboard application development.


## Tech Stack

- React 19
- TypeScript
- TanStack Start
- TanStack Router
- TanStack Query
- TanStack Form
- TanStack Table
- Ky v2
- Zod
- Tailwind CSS v4
- shadcn/ui with Base UI/Radix style components
- Zustand
- Vitest
- Biome

## Getting Started

### Prerequisites

- Node.js LTS
- pnpm
- Git

Install pnpm if needed:

```bash
npm install -g pnpm
```

### Install

```bash
git clone https://github.com/daFoggo/startcn.git
cd startcn
pnpm install
```

### Environment

Create `.env` from `.env.example` and configure the backend URLs:

```env
VITE_API_CORE_URL=http://localhost:8000
VITE_API_AI_URL=http://localhost:8001
VITE_APP_NAME="startcn"
```

The frontend builds API roots in `src/configs/env.ts`:

- `VITE_API_CORE_URL` -> core API
- `VITE_API_AI_URL` -> AI API

### Development

```bash
pnpm dev
```

The app runs on the Vite dev server, usually `http://localhost:3000`.

### Verification

Use these checks before merging larger work:

```bash
pnpm typecheck
pnpm build
pnpx @biomejs/biome check --write
```

## Project Structure

```text
src/
|-- components/          # shared UI, common organisms, layout
|-- configs/             # environment and app config
|-- constants/           # shared constants and option lists
|-- features/            # feature modules
|-- hooks/               # shared React hooks
|-- lib/                 # third-party setup and cross-cutting helpers
|-- routes/              # TanStack Router route tree and orchestration
|-- stores/              # global client state
`-- types/               # shared TypeScript types
```

Feature modules usually follow this shape:

```text
src/features/[feature]/
|-- components/
|-- server.ts
|-- functions.ts
|-- queries.ts
|-- schemas.ts
`-- index.ts
```

## Project Documentation

The current canonical documentation lives in `docs/handbook/`.

| Document | Purpose |
|---|---|
| [`docs/handbook/00_index.md`](docs/handbook/00_index.md) | Handbook index and reading order |
| [`docs/handbook/01_project_overview.md`](docs/handbook/01_project_overview.md) | Product overview, scope, and tech stack |
| [`docs/handbook/02_architecture.md`](docs/handbook/02_architecture.md) | Frontend architecture and boundaries |
| [`docs/handbook/03_feature_development.md`](docs/handbook/03_feature_development.md) | Feature module development rules |
| [`docs/handbook/04_tanstack_start_query_router.md`](docs/handbook/04_tanstack_start_query_router.md) | TanStack Start/Router/Query/Ky patterns |
| [`docs/handbook/05_ui_state_patterns.md`](docs/handbook/05_ui_state_patterns.md) | UI state, loading, error, empty, and compact patterns |
| [`docs/handbook/06_quality_rules.md`](docs/handbook/06_quality_rules.md) | Quality, consistency, and pre-merge checks |
| [`docs/handbook/07_development_checklist.md`](docs/handbook/07_development_checklist.md) | Practical development and review checklist |

## Tech Stack References

- [TanStack Start](https://tanstack.com/start/latest/docs/framework/react/overview)
- [TanStack Router](https://tanstack.com/router/latest/docs/framework/react/overview)
- [TanStack Query](https://tanstack.com/query/latest/docs/framework/react/overview)
- [TanStack Form](https://tanstack.com/form/latest/docs/framework/react/overview)
- [TanStack Table](https://tanstack.com/table/latest/docs/introduction)
- [Ky](https://github.com/sindresorhus/ky)
- [Zod](https://zod.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/docs)
- [Base UI](https://base-ui.com/react/overview/quick-start)
- [Tabler Icons React](https://tabler.io/docs/quickstart/react)

## Agent Instructions

Automation agents and coding assistants should read [`AGENTS.md`](AGENTS.md) first. Detailed rules are in `.agents/rules/` and the handbook documents above.
