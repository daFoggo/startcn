# UX Principles

This file preserves the high-value UX rules from the previous Laws of UX field guide. Keep implementation-specific spacing and token rules in `09_web_design_guide.md`; keep product and interaction judgment here.

## Visual Hierarchy

Use size, weight, color, position, and whitespace to create one clear focal point per screen.

- Emphasize by de-emphasizing surrounding content, not only by making the primary element larger.
- Use muted foreground tokens for metadata, helper text, and secondary descriptions.
- Avoid two primary actions with equal visual weight in the same decision area.
- The most important navigation or action should be easy to find at the start or end of a scan path.

## Proximity And Grouping

Users infer relationships from distance and boundaries.

- Related controls should be closer to each other than to unrelated controls.
- Use cards, borders, backgrounds, or fieldsets when a group needs an explicit boundary.
- Do not rely on radius alone to imply grouping.
- Spacing implementation details belong in `09_web_design_guide.md`.

## Choice And Cognitive Load

Hick's Law and Miller's Law are review heuristics for dense screens.

- Keep primary navigation concise.
- If a picker has many options, prefer search or autocomplete over a long menu.
- Break complex forms into sections or steps when all fields do not need to be visible at once.
- Keep body copy line length constrained enough to scan comfortably.

## Familiar Patterns

Follow common product conventions unless there is a clear reason not to.

- Navigation belongs in the app shell, sidebar, or top bar.
- Search should use the standard search affordance.
- Destructive actions need clear destructive styling and confirmation when consequences are hard to reverse.
- Forms submit from the bottom of the form flow.

## Feedback And Async UI

Doherty Threshold: users need visible feedback quickly.

- Immediate interactions should show hover, active, focus, disabled, and loading states.
- If work takes noticeable time, show a spinner, skeleton, progress, or pending state.
- Every async UI still follows the loading, error, empty, and valid-data rules in `05_ui_state_patterns.md`.
- Do not silently turn failed data into empty data.

## Touch And Targeting

Targets must be easy to acquire.

- Icon-only actions need accessible names and enough hit area.
- Dense controls are acceptable in tables, calendars, sidebars, and toolbars, but the interaction target still needs to be deliberate.
- Do not shrink controls only to make a layout fit; fix the layout or hierarchy first.

## Forms And Input Tolerance

Postel's Law applies to user input.

- Accept common input formats when possible and normalize internally.
- Validate with clear, specific errors near the field.
- Disable submit actions when submit-critical dependencies are loading or errored.
- Use progressive disclosure for uncommon or advanced fields.

## Progress And Completion

Goal-gradient and Zeigarnik effects are useful for multi-step flows.

- Show progress for multi-step onboarding, setup, or checkout-style flows.
- Make completed and remaining steps visible.
- Preserve draft state when losing progress would be frustrating.
- End success states with a clear next action.

## Aesthetic Usability

Polished UI feels easier to use, but polish must not hide correctness issues.

- Empty, error, and success states should be intentionally designed.
- Color must not be the only way information is communicated.
- Use semantic theme tokens rather than raw colors.
- Accessibility and state clarity outrank decorative effects.

## Review Checklist

- Is there one clear focal point per screen?
- Are secondary elements visually quieter than primary elements?
- Are related elements grouped by proximity or boundary?
- Are choices reduced or searchable where the list is long?
- Are interactions giving visible feedback quickly?
- Are destructive and submit-critical actions protected?
- Are form errors specific and close to the field?
- Does the screen use familiar product conventions unless it has a documented reason not to?
