## Plan — Import MASSIVA & visual polish pass

### Step 1 — Import the project into the sandbox

The sandbox currently holds the blank Lovable TanStack starter. I'll replace it with the contents of `MASSIVA_PROJECT_5.zip`:

- Remove starter files that don't belong (`src/routes/index.tsx` placeholder, default `src/styles.css`).
- Copy every file from the zip into the project (`src/`, `package.json`, `vite.config.ts`, `wrangler.jsonc`, `components.json`, `tsconfig.json`, `eslint.config.js`, `bunfig.toml`).
- Install dependencies (`bun install`) and let the dev server rebuild — `routeTree.gen.ts` regenerates from the new `src/routes/` files automatically.
- Verify build is clean before touching any UI.

No architecture changes. No file restructuring. Existing structure preserved:

```text
src/
  routes/        index, ai, comparer, debouches, resultats, a-propos, specialite.$id
  components/massiva/   ~30 feature components (ai/, detail/, form/, landing/, results/, shared/)
  components/ui/        shadcn primitives
  data/specialties.ts
  i18n/                 I18nProvider + translations (FR/AR/EN)
  lib/                  aiSimulator, compareStorage, mockDetailData, probability, storage
```

### Step 2 — Audit pass (read-only, before any edit)

Walk every route + key component to inventory polish opportunities. Captured as notes, no code changes yet:

1. `/` (landing) — hero, ProblemSolution, FeaturePreview, Testimonials, FaqSection, FutureVision
2. `/ai` — chat-style flow (ChatBubble, TypingDots, AiLoadingSteps, AiResultDashboard)
3. `/resultats` — ResultsFilters, ResultsSummaryBanner, SpecialtyCard grid
4. `/comparer` — CompareSelector, CompareModal, CompareRadar, CompareAnalyzing
5. `/specialite/$id` — DetailModal, ThresholdChart, EmploymentDonut, SalaryBlock, CareerTimeline, ReviewsBlock
6. `/debouches`, `/a-propos`
7. Cross-cutting: Header, LanguageSwitcher, ThemeToggle, ProbabilityRing/Badge, ConfidenceBadge, Sparkline

For each, note: spacing rhythm, typography scale consistency, dark-mode contrast, semantic token usage (any hard-coded hex/RGB sneaking in?), border-radius consistency with `--radius`, hover/focus states, empty/loading states, RTL layout integrity for Arabic.

### Step 3 — Visual/UI refinement (the only area you asked me to focus on)

Surgical, presentation-only edits. No business-logic, data, or i18n string changes unless a string is broken.

Polish targets, in priority order:

1. **Design-token hygiene** — replace any stray hardcoded colors with semantic tokens (`--primary`, `--success`, `--warning`, `--danger`, `--critical`, `--info`, `--muted-foreground`, etc. already defined in `styles.css`). Same for dark mode.
2. **Typography & spacing rhythm** — unify heading scale, line-heights, section paddings (`py-16 sm:py-20`), max-widths across landing sections; tighten card paddings on mobile.
3. **Card & surface treatment** — consistent `rounded-xl`/`rounded-2xl`, border opacity, `shadow-soft`/`shadow-lift` usage, backdrop-blur glass cards.
4. **Hero / landing polish** — gradient text contrast in dark mode, badge alignment, CTA button heights, feature-mini-cards equal height.
5. **Charts (Recharts)** — apply theme colors via CSS vars, axis/grid contrast in dark mode, tooltip styling using shadcn tokens, donut/radar label legibility.
6. **AI flow (`/ai`)** — chat bubble shadows, typing dots motion easing, loading steps progression rhythm, result dashboard hierarchy.
7. **Specialty detail** — modal sizing on mobile, threshold chart axis, salary/employment blocks alignment, career timeline connector polish.
8. **Compare** — radar legend, selector chip states, analyzing animation pacing.
9. **Header / nav** — active-link indicator, language switcher menu styling, theme toggle icon transition.
10. **Focus & a11y micro-polish** (visual only) — `:focus-visible` rings consistent with `--ring`, hover states on all interactive cards.
11. **Motion polish** — unify Framer Motion `transition` defaults (duration, easing) into a small shared constant; avoid janky stagger on slower devices.
12. **RTL spot-check** — make sure icon/arrow directions and paddings mirror correctly for Arabic.

### Step 4 — Verification

After polish, walk through each route in the preview (desktop + mobile viewport), light + dark mode, and FR/AR/EN to confirm nothing regressed. Report back with a per-route summary of what changed.

### Out of scope (will not touch)

- No new routes, no removed components, no data-shape changes.
- No new dependencies.
- No backend / Lovable Cloud work.
- No i18n key additions (unless a missing key is found during audit — will flag, not invent copy).
