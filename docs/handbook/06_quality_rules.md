# Quality Rules

This document collects consistency and safety rules for startcn.

## Checks

Run these after larger changes or before merging:

```bash
pnpx @biomejs/biome check --write
pnpm typecheck
pnpm build
```

Do not run expensive checks repeatedly for every tiny edit unless requested.

## Code Safety

- Do not use non-null assertions (`!`) to bypass types.
- Use guard clauses, optional chaining, and safe fallbacks.
- Custom `<button>` elements need explicit `type`.
- Do not use `window.confirm()`; use `AlertDialog`.
- Do not remove focus rings.
- Do not introduce hidden runtime assumptions for route params or query data.

## Styling Rules

- Detailed design, spacing, and dashboard container rules live in `09_web_design_guide.md`.
- Product UX principles live in `10_ux_principles.md`.
- Do not hardcode raw colors such as `#fff`, `rgb(...)`, or `bg-[#...]`.
- Do not hardcode custom spacing such as `p-[15px]`.
- Do not hardcode custom font sizes such as `text-[15px]`.
- Do not hardcode custom z-index values such as `z-[999]`.
- Use Tailwind design tokens and project CSS variables.
- Use @tabler/icons-react only for icons.
- Do not mix English and Vietnamese in the same UI surface except proper nouns and technical terms.
- Do not use `<Badge>` for filters because badges do not provide interactive state.

## Component Rules

- Prefer existing `@/components/ui` and `@/components/common` components.
- Add a new component only when existing components cannot be composed cleanly.
- New reusable components should have `data-slot` on the root element.
- Components with two or more variants should use CVA.
- Icon-only buttons need `aria-label` or screen-reader text.
- Inputs must support default, focus, error, disabled, and readonly states.
- Use `aria-invalid` for error states.

## Motion Rules

- Animate transform, opacity, and color.
- Do not animate width, height, or padding.
- Respect reduced motion with `motion-safe:` and `motion-reduce:`.
- Use existing Tailwind/tw-animate-css utilities before adding custom keyframes.

## Review Rules

When reviewing code, prioritize:

1. Runtime bugs and user-visible regressions.
2. Query/data correctness.
3. Error handling and SSR safety.
4. Missing loading/error/empty states.
5. Cache invalidation and mutation side effects.
6. Accessibility and design-system violations.
7. Test or verification gaps.

## Documentation Rules

- Update handbook docs when a repeated pattern or project-wide rule changes.
- Keep design-system details centralized in `09_web_design_guide.md`.
- Keep product UX heuristics centralized in `10_ux_principles.md`.
- Keep `AGENTS.md` as an entry point, not as the full detailed manual.
- Keep historical docs in place until explicitly removed.
