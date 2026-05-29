# AnnoBot Resident Product

This page captures the current product direction for the AnnoBot frontend. It should be read before building resident-facing project, dashboard, configuration, annotation, or Telegram entry flows.

## Product Summary

AnnoBot is a resident-facing annotation assistant for smart-building research studies. It helps occupants label sensor-detected events with minimal burden by combining passive sensor evidence, learned household patterns, Telegram questions, and a web dashboard for review and fallback answering.

The frontend currently focuses on the resident side only. Researcher project creation, researcher activity configuration, and whole-study analytics are out of scope for the near-term mock/build unless explicitly requested.

## Core Domain Model

```text
Research Unit
`-- Project
    |-- Activities
    |   `-- Activity definition
    |       |-- What: behavior being studied
    |       |-- Where: inferred sensor context, such as circuit, GPS, or Wi-Fi zone
    |       |-- When: time windows and scenario rules
    |       |-- Who: occupant pattern and appliance mapping
    |       |-- What to label: information slots and label spaces
    |       |-- Comfort questions: subjective check-ins
    |       `-- When to ask: quiet hours, daily budget, escalation policy
    `-- Households
        `-- Members
            `-- Annotations
```

Researchers define activities and annotation goals for a project. Residents participate through households and members. The system records annotations per member while retaining provenance for whether a slot came from a user answer, sensor automation, model inference, calendar data, or a pending question.

## Product Principles

- Ask only when useful: high-confidence events should be auto-labelled and logged without interrupting the resident.
- Every question must carry context: time, place, duration, sensor value, and why the system is asking should be visible when relevant.
- Residents correct the system, not configure the research: researcher-defined activity schema is read-only in the resident app.
- Household routing is learned, not hard-assigned: the system may prefer the member who usually performs an activity, but every prompt needs a "not me, send to..." path.
- Exceptions are first-class: if another member performs a normally learned activity, record it as an exception and do not overwrite the long-running pattern immediately.
- Missing slots are never silently lost: unanswered required slots stay queued for the next eligible prompt window or recap.

## Multi-Member Household Handling

Households can have multiple members and activity patterns are probabilistic. For example, a member may usually do laundry in the morning, but another member can occasionally do it.

Expected behavior:

- Learn routing from historical confirmations.
- Prefer asking the most likely member for the detected event.
- Provide a "not me, send to another member" action.
- When the redirected member confirms, update the event as an exception or weak signal instead of replacing the established pattern.
- Expose member routing in resident configuration so residents can inspect and adjust who usually does what.

## Entry Flow

Telegram is the primary low-friction interaction surface. The web app is the resident dashboard, review surface, and fallback answering surface.

```text
Telegram bot
|-- /dashboard            -> open the web dashboard; if the resident has one project, go directly to it
|-- /dashboard [project]  -> open that project detail page
`-- Inline question       -> answer in Telegram without opening the web app

Direct web access
`-- Auth screen
    |-- Continue with Telegram
    `-- Account login fallback
```

If a resident belongs to multiple projects and no project is specified, the web app should show the project list.

## Resident Screens

### Auth

The auth screen offers Telegram OIDC as the preferred login path and account login as fallback. Telegram auth implementation details live in `08_telegram_login.md`.

### Project List

Shown when the resident has multiple projects or direct navigation is not project-specific.

Each project card should show:

- Project name and research unit.
- Participation status, such as active or ended.
- Pending questions today.
- Overall coverage percentage.

### Project Detail

The resident project detail should be organized around four tabs:

1. Dashboard
2. Configuration
3. Annotation Logs
4. About Project

Current route names may still be placeholders from the base template. Prefer evolving them toward these resident concepts instead of preserving generic "home/setup/annotation" wording when implementing product UI.

## Dashboard Tab

The dashboard is the resident's high-level view of today's annotation state.

Required sections:

- Cross-activity overview with today's total events split by AUTO, YOU, and PENDING.
- Overall coverage percentage.
- A prominent pending-question banner when there are questions waiting; residents can answer directly on the web as a Telegram fallback.
- Per-activity cards stacked vertically, not hidden behind an activity switcher.
- Each activity card shows activity-specific stats such as energy, water, wait time, sleep score, or similar study-specific metrics.
- Each activity card includes a compact recent event timeline with 3 to 5 events tagged AUTO, YOU, or LATER/PENDING.
- A "view all" path should open or navigate to logs filtered for that activity.

## Configuration Tab

Configuration has two clearly separated zones.

Researcher-defined, read-only for residents:

- Activity list and descriptions.
- Information slots for each activity.
- Privacy policy for which sensor evidence can be quoted in chat.

Resident override, editable:

- Connected devices with status and add/remove controls.
- Quiet hours.
- Daily question limit.
- Scenario overrides such as away, guests at home, or silent mode today.
- Member routing patterns.

Resident configuration is about consent, interruption control, devices, scenarios, and household routing. It is not the researcher studio.

## Annotation Logs Tab

Logs are the audit trail of the annotation dataset from the resident perspective.

Filter by:

- Activity.
- Date.
- Source: YOU, AUTO, or PENDING.

Each log entry should include:

- Timestamp and activity type.
- Sensor context chip, for example: `kitchen - 19:08 - 12 min - 1.8 kW`.
- Bot question, or "Auto-resolved, no question asked".
- User response or assigned label.
- Source badge: YOU SAID, BOT INFERRED, SENSOR AUTO, CALENDAR, or PENDING.
- Edit action for resident correction.
- Expandable slot checklist summary for the event.

## About Project Tab

About Project is the resident-facing project information page.

It should include:

- Project description and research goals.
- Research unit information.
- Study timeline.
- Activities being tracked.
- Full privacy policy.
- Leave project action.

Use an `AlertDialog` for destructive leave confirmation. Do not use `window.confirm()`.

## Annotation Flow

```text
Sensor event detected
`-- Bot evaluates confidence
    |-- High, above 0.85
    |   `-- Auto-label, write log, do not ask
    |-- Medium
    |   `-- Ask resident through Telegram or web pending queue
    `-- Low or new pattern
        `-- Ask resident with fuller sensor context

Resident receives question
|-- Choose quick action
|-- Type free text
|-- Skip, then queue for recap
|-- Not me, redirect to another household member
`-- Why are you asking?, then show sensor evidence

After answer
`-- Post-event summary
    |-- Coverage ring: filled slots / required slots
    |-- Slot checklist with source per slot
    `-- Missing slots queued for the next eligible prompt
```

## Source And Provenance Labels

Use clear resident-facing labels for how each annotation was produced:

- YOU SAID: direct resident answer.
- BOT INFERRED: learned/model inference from prior confirmations.
- SENSOR AUTO: high-confidence passive sensor resolution.
- CALENDAR: calendar-derived context.
- PENDING: still needs resident input.
- LATER: intentionally deferred by quiet hours, daily budget, skip, or scenario policy.

These labels are part of the product contract because transparency and correction are central to the research value.

## Near-Term Mock Scope

Build resident-side mock/UI coverage for:

- Auth screen.
- Project list.
- Dashboard with overview and per-activity cards.
- Configuration with read-only research definition and resident overrides.
- Annotation logs with filters, source badges, edit, and expand summary.
- About Project.
- Chat or annotation interface for web fallback pending questions.

Do not build researcher project creation, activity authoring, researcher study analytics, or dataset export unless the task explicitly expands scope.

## Relationship To Earlier Mockups

The earlier simple UI mock demonstrated useful interaction pieces:

- Activity-specific chat questions with context chips.
- Quick-action chips and free-text fallback.
- Daily activity stats.
- Post-conversation coverage summary and slot checklist.

For the current resident product, adapt those pieces into project-level navigation. Activities should appear as cards and filters inside a project, not as the top-level workspace switcher.

The slide deck and research proposal remain useful as conceptual background for context-aware prompting, declarative study configuration, scenario policy, provenance, and interactive learning. They should not be treated as a mandate to build researcher-side screens in the resident frontend scope.

## Open Product Decisions

- Exact API payload shape for projects, activities, households, members, event logs, and pending questions.
- Whether web pending answers reuse the same backend endpoint as Telegram answers.
- How aggressively member routing changes after repeated exceptions.
- Whether "About Project" is a fourth project tab or a secondary route under project settings on narrow layouts.
- Final naming for route paths: current placeholders are `/home`, `/setup`, and `/annotation`; product language points toward dashboard, configuration, logs, and about.
