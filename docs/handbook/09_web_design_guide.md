# 🎨 Web Design UI/UX — Practical Field Guide

> Synthesized from **Laws of UX** (lawsofux.com) + real-world technical principles.  
> Only rules with **genuine impact** on web design are included.  
> Pareto Principle in action: 20% of knowledge → 80% of results.

---

## PART 1 — VISUAL HIERARCHY

> **The foundation of every web design.** If users don't know where to look first, the design has already failed.

### 1.1 The Four Core Hierarchy Tools

Guide the user's eye using a combination of:

| Tool | Importance | How to use |
|------|-----------|------------|
| **Size** | ★★★★★ | Larger = more important |
| **Weight** | ★★★★☆ | Bold = focal point, Regular = background |
| **Color** | ★★★★☆ | Vivid color = primary action |
| **Position** | ★★★☆☆ | Top / left = read first |
| **White Space** | ★★★★☆ | Space around = importance |

### 1.2 The "De-emphasize" Technique

> ⚠️ Common mistake: only making the primary element **bigger**. The better move: **dim everything around it**.

```
❌ Wrong: Increase heading to 48px → not enough contrast
✅ Right:  Keep heading at 32px + reduce surrounding opacity to 50% → sharp contrast
```

**In practice:**
- Secondary text (metadata, captions): `opacity: 0.5` or color `#666`
- Neutral text (body): `opacity: 0.75` or color `#444`
- Primary text (headings, CTAs): `opacity: 1.0` or color `#111`

### 1.3 Von Restorff Effect — Highlight the Right Thing

> *"When multiple similar objects are present, the one that differs is most likely to be remembered."*

**Web application:**
- The primary CTA must be **entirely different in color** from all other buttons
- Use **only 1 accent color** per screen — using more cancels them all out
- Never place two buttons of equal visual weight side by side

### 1.4 Serial Position Effect — Position = Memory

> *"Users best remember the first and last items in a series."*

**Web application:**
- Navigation: place the most important items at the **far left and far right**
- Pricing table: place the recommended plan in the **middle** (make it visually stand out) — not first or last
- Footer CTA: always end the page with a clear, actionable element

---

## PART 2 — TYPOGRAPHY

> UI is mostly **text and buttons**. Typography is the single most important skill.

### 2.1 Type Scale System

**Base rules:**
- Base font: **16px** (web), **14px** (information-dense dashboards)
- Scale up/down in **2px increments** from the base

**Practical scale for web:**

```
12px  — Caption, footnote, badge
14px  — Small text, helper text
16px  — Body (BASE)
18px  — Body large, lead text
20px  — Subtitle, card title
24px  — Section heading (H3)
32px  — Page heading (H2)
48px  — Hero heading (H1)
64px  — Display / Landing page statement
```

> [!IMPORTANT]
> Cap at **5–6 font sizes** per website. Dashboards should not exceed **24px** for the largest heading.

### 2.2 Optimizing Large Headings

The larger the heading, the "rougher" it looks without fine-tuning:

```css
/* Professional heading */
h1 {
  font-size: 48px;
  font-weight: 700;
  letter-spacing: -0.02em;   /* -2% — critical! */
  line-height: 1.1;           /* 110% */
}

h2 {
  font-size: 32px;
  letter-spacing: -0.015em;
  line-height: 1.2;
}

/* Body text — leave natural */
p {
  font-size: 16px;
  letter-spacing: 0;
  line-height: 1.6;           /* 160% — most readable */
}
```

### 2.3 Line Height & Margin — The "Automatic" Principle

> Let `line-height` create natural spacing — **don't manually add margin-bottom** to every paragraph.

```css
/* Do this */
p { line-height: 1.6; }
p + p { margin-top: 1em; } /* Only add spacing between consecutive paragraphs */

/* Not this */
p { margin-bottom: 24px; line-height: 1.2; } /* Hard to control */
```

### 2.4 REM Units — Required for Accessibility

```css
/* ✅ Correct */
html { font-size: 16px; }
h1 { font-size: 3rem; }    /* = 48px */
p  { font-size: 1rem; }    /* = 16px */

/* ❌ Wrong — users cannot scale this */
h1 { font-size: 48px; }
```

### 2.5 Miller's Law — Limit Line Width

> *"The average person can only keep 7 (±2) items in working memory."*

**Application:** The ideal body text width is **45–75 characters per line**.

```css
p {
  max-width: 65ch;  /* ch = width of the "0" character */
}
```

---

## PART 3 — LAYOUT & SPACING

### 3.1 The 4-Point Grid System

> Every spacing value must be a **multiple of 4**.

```
4px   — Micro spacing (icon gap, badge padding)
8px   — Small spacing (button Y padding)
12px  — Button X padding
16px  — Base spacing, card padding, content block gap
24px  — Card gap, content block spacing
32px  — Section spacing (mobile)
48px  — Section spacing (desktop)
64px  — Large section divider
96px  — Hero / landing section padding
```

**Why?** Easy to halve (8→4→2), easy to double (8→16→32), consistent across the entire page.

### 3.2 Responsive Grid

| Breakpoint | Columns | Gutter | Margin |
|-----------|---------|--------|--------|
| Mobile (<768px) | 4 cols | 16px | 16px |
| Tablet (768–1024px) | 8 cols | 24px | 24px |
| Desktop (>1024px) | 12 cols | 32px | 32–64px |

### 3.3 Law of Proximity — Spacing = Relationship

> *"Objects near each other tend to be grouped together."*

**Practical rule:**
```
Label ↔ Input:             8px   (same group)
Input ↔ Input:             16px  (related)
Form section ↔ section:    32px  (separate groups)
```

> [!TIP]
> Spacing **inside** a group must always be **smaller** than spacing **between** groups. Violate this and users won't know what belongs with what.

### 3.4 Law of Common Region — Clear Boundaries

> *"Elements sharing an area with a clearly defined boundary are perceived as a group."*

**Application:**
- **Cards** are the most common grouping pattern on the web — use `border`, `background`, or `shadow`
- Don't create a card with just `border-radius` and no distinct `background`
- Form fieldsets, tooltips, modals — all need clear boundaries

### 3.5 White Space

> White space is not "wasted space" — it's your **most powerful design tool**.

**Principles:**
- Doubling internal padding → immediately looks more premium
- Less content + more white space = higher trust (e.g. Apple.com)
- More content + less white space = more information density (e.g. dashboards, news)

---

## PART 4 — COLOR SYSTEM

### 4.1 Use HSL Instead of HEX/RGB

> HSL (Hue, Saturation, Lightness) lets you **directly adjust brightness** — incredibly powerful for hierarchy.

```css
/* Instead of: */
--primary: #3B82F6;

/* Use: */
--primary-h: 217;
--primary-s: 91%;
--primary-l: 60%;
--primary: hsl(var(--primary-h), var(--primary-s), var(--primary-l));

/* Variants become trivial */
--primary-light: hsl(var(--primary-h), var(--primary-s), 80%);
--primary-dark:  hsl(var(--primary-h), var(--primary-s), 40%);
```

### 4.2 Semantic Color System

| Color | Meaning | Use when |
|-------|---------|----------|
| 🔵 **Blue** | Trust, information, primary action | Links, primary button, info state |
| 🔴 **Red** | Danger, error | Delete, error, destructive action |
| 🟡 **Yellow/Amber** | Warning, caution | Warning, pending, caution state |
| 🟢 **Green** | Success, safety | Success, active, confirmed |
| ⚫ **Gray** | Neutral, background | Disabled, secondary, background |

> [!WARNING]
> Never use red for anything that isn't an error or danger — users have a conditioned reflex to this color.

### 4.3 Dark Mode — The Correct Formula

**Key principle:** In dark mode, create depth through **lightness** (not shadows).

```css
/* Light Mode */
--bg-base:      hsl(0, 0%, 100%);   /* #FFFFFF */
--bg-surface:   hsl(0, 0%, 97%);    /* Card background */
--bg-elevated:  hsl(0, 0%, 94%);    /* Modal, dropdown */

/* Dark Mode — cards are LIGHTER than background, not darker */
--bg-base:      hsl(220, 13%, 10%); /* Base background */
--bg-surface:   hsl(220, 13%, 14%); /* Card = lighter */
--bg-elevated:  hsl(220, 13%, 18%); /* Modal = lighter still */
```

**Light ↔ Dark conversion formula:**
```
Dark Lightness (L_dark) = 100 - L_light
```

### 4.4 Contrast and Accessibility

- **Minimum:** Normal text vs background — contrast ratio ≥ **4.5:1** (WCAG AA)
- **Large text (≥18px bold / ≥24px):** ≥ **3:1**
- Never rely **solely on color** to communicate information — add an icon or text label

---

## PART 5 — COMPONENTS & INTERACTION

### 5.1 Fitts's Law — Touch Target Size

> *"Time to acquire a target is a function of its distance and size."*

**Minimum size standards:**

```css
/* Button */
button {
  min-height: 44px;    /* Apple HIG minimum */
  min-width: 44px;
  padding: 12px 20px;
}

/* Inline link */
a { line-height: 1.6; } /* No extra padding needed */

/* Icon button */
.icon-btn {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

### 5.2 Hick's Law — Reduce Choices

> *"More choices = slower decisions."*

**Web application:**
- Navigation: **max 7 items** (Miller's Law + Hick's Law combined)
- Pricing page: **max 3–4 plans** — more causes decision paralysis
- Forms: hide non-essential fields — show only when needed
- Dropdown: if > 7 options → switch to search/autocomplete

### 5.3 Doherty Threshold — Feedback Must Be < 400ms

> *"Productivity soars when neither the user nor the machine has to wait."*

**Response time standards:**

| Time | User perception | Solution |
|------|----------------|---------|
| 0–100ms | Instant | Hover, button press — must hit this |
| 100–300ms | Near-instant | Transitions, toggles |
| 300–1000ms | Slight wait | Show loading spinner |
| > 1000ms | Noticeable wait | Show skeleton screen + progress |
| > 10s | Frustration | Break into steps, async updates |

```css
/* Hover transitions must be fast */
button { transition: all 150ms ease; }

/* Page transitions can be slightly slower */
.page { transition: opacity 300ms ease; }
```

### 5.4 Signifiers — The UI Must "Speak"

> *A good UI tells users exactly what they can do.*

**Checklist for every interactive element:**
- [ ] **Default** — Normal state
- [ ] **Hover** — `cursor: pointer` + visual feedback
- [ ] **Active/Pressed** — Slight scale-down or darker shade
- [ ] **Focus** — Clear `outline` (for keyboard users)
- [ ] **Disabled** — `opacity: 0.4` + `cursor: not-allowed`
- [ ] **Loading** — Spinner or skeleton (if async)

```css
button {
  background: hsl(217, 91%, 60%);
  cursor: pointer;
  transition: all 150ms ease;

  &:hover        { background: hsl(217, 91%, 55%); }
  &:active       { transform: scale(0.98); }
  &:focus-visible { outline: 2px solid hsl(217, 91%, 60%); outline-offset: 2px; }
  &:disabled     { opacity: 0.4; cursor: not-allowed; }
}
```

### 5.5 Micro-interactions — Small but Mighty

**Animations you should have:**
- ✅ Button press: `scale(0.97)` over 100ms
- ✅ Form validation error: shake animation
- ✅ Toggle/Switch: smooth 200ms transition
- ✅ Notification toast: slide in from bottom
- ✅ Loading skeleton: shimmer effect

**Animations to avoid:**
- ❌ Overly elaborate page transitions (> 500ms)
- ❌ Scroll animations on every single element
- ❌ Looping animations with no end state

```css
/* Always respect prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
  * {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
  }
}
```

---

## PART 6 — UX LAWS APPLIED DIRECTLY TO WEB

### 6.1 Jakob's Law — Don't Reinvent the Familiar

> *"Users prefer your site to work the same way as all the other sites they already know."*

**Conventions you must not break:**
- Logo top-left → clicking it returns to homepage
- Navigation at the top or left sidebar
- Search button uses a magnifying glass icon
- Links are blue, visited links are purple
- Form submit button is at the **bottom** of the form, not the top

> [!CAUTION]
> Breaking convention is only acceptable when you have clear research data proving the new approach performs better.

### 6.2 Law of Prägnanz — As Simple as Possible

> *"The mind interprets ambiguous stimuli in the simplest form possible."*

**Application:**
- Icons must be recognizable at **16×16px** — if not, pick a different icon
- User avatars use circles — the brain recognizes "faces" faster in round shapes
- Progress bars beat percentage text — shapes convey information faster

### 6.3 Aesthetic-Usability Effect — Beautiful = Feels Easier

> *"Users often perceive aesthetically pleasing design as more usable."*

**Critical implication:**
- Invest in visual quality **even before usability is perfect** — users will be more patient
- However: don't let beautiful design **hide usability issues** during testing

### 6.4 Peak-End Rule — What Users Actually Remember

> *"People judge an experience based on how they felt at its most intense point and at its end."*

**Key "peaks" to design with special care:**
- 🎉 **After successful sign-up** — celebrate it (confetti, animation)
- ✅ **After checkout completes** — clear confirmation + "what's next"
- ❌ **When hitting a 404/500 error** — never leave a blank page — design a memorable error page
- 👋 **When leaving the page** — exit intent or offboarding message

### 6.5 Zeigarnik Effect — The Unfinished Task

> *"People remember uncompleted tasks better than completed ones."*

**Application:**
- **Profile completion bar**: "Complete your profile — 60% done"
- **Onboarding checklist**: show completed and remaining steps
- **Infinite scroll prompt**: "See 5 more articles"
- **Form autosave**: "Draft saved" → users want to come back and finish

### 6.6 Postel's Law — Be Flexible with Input

> *"Be liberal in what you accept."*

**Form design application:**
- Phone numbers: accept `0901234567`, `090-123-4567`, and `+84901234567`
- Auto-format as the user types — don't throw a format error
- Search: accept typos, use fuzzy matching
- Date input: accept multiple formats, display back in a canonical format

### 6.7 Goal-Gradient Effect — Clear Progress = Higher Completion

> *"The closer to the goal, the faster users work."*

**Application:**
- Multi-step forms: always show "Step 2 of 4" or a progress bar
- Checkout: break into small steps with clear indicators
- Onboarding: "Just 1 more step!"

---

## PART 7 — IMAGES & MEDIA

### 7.1 Text on Images — Always Use an Overlay

```css
/* Linear gradient overlay — the standard approach */
.hero-image {
  position: relative;
}

.hero-image::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(0, 0, 0, 0.7) 100%
  );
}

/* Progressive blur (more modern feel) */
.card-image {
  mask-image: linear-gradient(to bottom, black 50%, transparent 100%);
}
```

### 7.2 Icon Sizing

- Icon next to text: match the `line-height` of accompanying text (typically **24px**)
- Standalone icon (inside button): **20–24px**
- Decorative/large icon: **32–48px**
- Always set explicit `width` and `height` — never let icons scale freely

### 7.3 Consistent Aspect Ratios

```css
/* Card images always maintain their ratio */
.card-image {
  aspect-ratio: 16 / 9;   /* or 4/3, 1/1 */
  object-fit: cover;
}
```

---

## PART 8 — PRE-LAUNCH CHECKLIST

### ✅ Visual Hierarchy
- [ ] Is there clearly 1 focal point per screen?
- [ ] Have secondary texts been de-emphasized?
- [ ] Does the CTA button visually outrank all other buttons?

### ✅ Typography
- [ ] Using ≤ 6 font sizes?
- [ ] Large headings have negative letter-spacing?
- [ ] Font sizes use REM units?
- [ ] Line length ≤ 75 characters?

### ✅ Spacing & Layout
- [ ] All spacing values are multiples of 4?
- [ ] Inner-group spacing < between-group spacing?
- [ ] Responsive tested at all 3 breakpoints?

### ✅ Color
- [ ] Text color meets 4.5:1 contrast ratio?
- [ ] Color is not the sole carrier of information?
- [ ] Dark mode cards are lighter than the background, not darker?

### ✅ Interaction
- [ ] All buttons have 5 states (default / hover / active / focus / disabled)?
- [ ] All async actions have a loading state?
- [ ] Animations respect `prefers-reduced-motion`?
- [ ] Touch targets are at least 44×44px?

### ✅ UX
- [ ] Multi-step forms have a progress indicator?
- [ ] Success and error states are specifically designed?
- [ ] Navigation follows convention (logo left, search right)?
- [ ] Forms accept flexible input formats?

---

## 📌 TL;DR — 10 Golden Rules

1. **De-emphasize to emphasize** — Dim the surroundings instead of just enlarging the main element
2. **Spacing = Relationships** — Close = related; inner-group spacing < between-group spacing
3. **1 CTA, 1 accent color** — More than 1 cancels each other out
4. **Use only 5–6 font sizes** — More = chaos; fewer = monotony
5. **Negative letter-spacing on large headings** — `-0.02em` or tighter looks professional
6. **Touch targets ≥ 44px** — Never make a button smaller than a fingertip
7. **Feedback in < 400ms** — If no result yet, show a loading state
8. **Flexible forms** — Accept multiple formats, normalize silently
9. **Dark mode = cards lighter than background** — Shadows don't work in the dark
10. **Convention first, creativity second** — Don't break familiar patterns without strong reason

---

*📚 Sources: [lawsofux.com](https://lawsofux.com/) (Jon Yablonski) · Typography Guidelines (Sajid) · UX Principles (Kole Jain)*
