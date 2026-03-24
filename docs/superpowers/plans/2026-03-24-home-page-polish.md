# Home Page UI Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the approved `/` homepage polish design so the landing page feels cohesive, professional, and consistent while preserving Zyplo's current cyan/indigo visual identity.

**Architecture:** Keep the existing homepage section structure and shared marketing shell, then refine the page in reading order. Standardize layout rhythm, CTA behavior, and token usage through shared primitives first, then polish individual sections with minimal structural churn. Because the repo does not have a dedicated homepage UI test harness, verification for this pass relies on the existing `eslint` and production build checks plus desktop/mobile visual captures of the rendered page.

**Tech Stack:** Next.js App Router, React client components, Tailwind CSS v4, Framer Motion, shared `Button` component, semantic color tokens in `src/app/globals.css`

---

## Baseline Notes

- Approved design spec: `docs/superpowers/specs/2026-03-24-home-page-polish-design.md`
- Existing lint baseline: `npm run lint` succeeds with pre-existing warnings in unrelated files. Do not expand scope to fix those warnings during this homepage pass.
- Existing build baseline: `npm run build` succeeds.
- Keep the floating public-page `Ctrl+K` command button. Polish it; do not remove it.
- Keep the footer subscribe UI visual-only. Do not add backend behavior.

### Task 1: Establish Shared Homepage Layout And CTA Guardrails

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/components/container/MainContainer.jsx`
- Modify: `src/app/(main)/layout.jsx`
- Modify: `src/components/ui/button.jsx`

- [ ] Review the approved spec and re-open the current homepage components before editing shared primitives.
- [ ] Update `src/components/container/MainContainer.jsx` so the main marketing container uses one consistent width/padding strategy that can be reused across homepage sections.
- [ ] Update `src/app/(main)/layout.jsx` so the shared marketing layout uses tokenized background/foreground classes instead of one-off white/slate combinations wherever safe.
- [ ] Update `src/components/ui/button.jsx` so the shared button system cleanly supports homepage primary and secondary CTAs without relying on custom raw anchor/button styling in sections.
- [ ] Add or tune shared token-driven utility rules in `src/app/globals.css` only where they reduce repeated one-off homepage styling without introducing a new design system.
- [ ] Run: `npm run lint`
Expected: PASS with the same pre-existing warnings only.
- [ ] Run: `npm run build`
Expected: PASS with a successful production build.
- [ ] Commit:

```bash
git add src/app/globals.css src/components/container/MainContainer.jsx src/app/\(main\)/layout.jsx src/components/ui/button.jsx
git commit -m "refactor: standardize homepage layout and CTA primitives"
```

### Task 2: Polish The Shared Marketing Shell

**Files:**
- Modify: `src/components/layout/Navbar/Navbar.jsx`
- Modify: `src/components/layout/Footer/Footer.jsx`
- Modify: `src/components/dashboard/CommandPalette.jsx`
- Modify: `src/components/Shared/Logo/Logo.jsx`

- [ ] Refine `src/components/layout/Navbar/Navbar.jsx` to align spacing, contrast, and CTA styling with the shared homepage button system while preserving the current navigation structure and behavior.
- [ ] Keep the navbar theme toggle, search trigger, auth CTA logic, and resource navigation intact while reducing class-level styling drift.
- [ ] Update the floating public-page `Ctrl+K` button in `src/components/dashboard/CommandPalette.jsx` so it feels integrated with the marketing page instead of visually fighting the content. Do not remove the behavior.
- [ ] Refine `src/components/layout/Footer/Footer.jsx` so it matches the homepage surface language more closely, keeps the subscribe UI intact, and avoids dead CTA patterns.
- [ ] Adjust `src/components/Shared/Logo/Logo.jsx` only if needed to improve consistency between navbar/footer brand presentation.
- [ ] Run: `npm run lint`
Expected: PASS with only the pre-existing warnings.
- [ ] Run: `npm run build`
Expected: PASS.
- [ ] Commit:

```bash
git add src/components/layout/Navbar/Navbar.jsx src/components/layout/Footer/Footer.jsx src/components/dashboard/CommandPalette.jsx src/components/Shared/Logo/Logo.jsx
git commit -m "feat: polish homepage shell and floating command trigger"
```

### Task 3: Refine The Hero And Upper-Page Flow

**Files:**
- Modify: `src/components/Home/Hero/Hero.jsx`
- Modify: `src/components/Home/Hero/HeroAppMock.jsx`
- Modify: `src/components/marquee/PartnerMarquee.jsx`
- Modify: `src/components/Home/FeatureSection/FeatureSection.jsx`
- Modify: `src/components/Home/FeatureSection/FeatureGrid.jsx`
- Modify: `src/app/(main)/page.jsx`

- [ ] Update `src/components/Home/Hero/Hero.jsx` so the hero copy remains strong on first paint, the mobile ordering favors message clarity, and both CTAs use the shared `Button` component.
- [ ] Keep the current cyan/indigo energy in the hero, but reduce reliance on motion for readability and tighten spacing between the copy block and product visual.
- [ ] Tune `src/components/Home/Hero/HeroAppMock.jsx` only if it is used or if its styling should better match the rest of the refined homepage system.
- [ ] Update `src/components/marquee/PartnerMarquee.jsx` so the trust strip language reads as ecosystem/integration credibility instead of literal partner messaging, unless the content is updated to truly match “partners.”
- [ ] Refine `src/components/Home/FeatureSection/FeatureSection.jsx` and `src/components/Home/FeatureSection/FeatureGrid.jsx` so the handoff from hero to trust strip to product proof feels more deliberate and visually consistent.
- [ ] Adjust `src/app/(main)/page.jsx` only if section wrappers/order need a small local change for spacing rhythm or better flow.
- [ ] Run: `npm run lint`
Expected: PASS with only the pre-existing warnings.
- [ ] Run: `npm run build`
Expected: PASS.
- [ ] Commit:

```bash
git add src/components/Home/Hero/Hero.jsx src/components/Home/Hero/HeroAppMock.jsx src/components/marquee/PartnerMarquee.jsx src/components/Home/FeatureSection/FeatureSection.jsx src/components/Home/FeatureSection/FeatureGrid.jsx src/app/\(main\)/page.jsx
git commit -m "feat: refine homepage hero and upper flow"
```

### Task 4: Unify Workflow And Time-Tracking Showcase Sections

**Files:**
- Modify: `src/components/Home/WorkFlow/WorkflowStepper.jsx`
- Modify: `src/components/Home/TimeTracking/TimeTracking.jsx`

- [ ] Refine `src/components/Home/WorkFlow/WorkflowStepper.jsx` so the section keeps its interactivity but uses cleaner token-driven contrast and more consistent active-state styling.
- [ ] Keep the workflow story and stepper behavior intact while reducing the sense that the section is styled in isolation from the rest of the page.
- [ ] Refine `src/components/Home/TimeTracking/TimeTracking.jsx` so it remains the most premium product showcase block, but with calmer visual noise and better consistency with the shared homepage surface language.
- [ ] Apply semantic colors inside these sections only where meaning is clear, such as positive status cues or helpful emphasis.
- [ ] Run: `npm run lint`
Expected: PASS with only the pre-existing warnings.
- [ ] Run: `npm run build`
Expected: PASS.
- [ ] Commit:

```bash
git add src/components/Home/WorkFlow/WorkflowStepper.jsx src/components/Home/TimeTracking/TimeTracking.jsx
git commit -m "feat: unify workflow and time-tracking sections"
```

### Task 5: Strengthen The Command Palette Story Section

**Files:**
- Modify: `src/components/Home/CommandPaletteSection/CommandPaletteSection.jsx`

- [ ] Refine `src/components/Home/CommandPaletteSection/CommandPaletteSection.jsx` so the section keeps its keyboard-first identity while feeling more complete and visually balanced.
- [ ] Increase the usefulness and perceived density of the right-side command palette demo so the section earns its space without feeling empty.
- [ ] Align heading hierarchy, accent intensity, and supporting CTA styling with the neighboring product-story sections.
- [ ] Run: `npm run lint`
Expected: PASS with only the pre-existing warnings.
- [ ] Run: `npm run build`
Expected: PASS.
- [ ] Commit:

```bash
git add src/components/Home/CommandPaletteSection/CommandPaletteSection.jsx
git commit -m "feat: polish homepage command palette section"
```

### Task 6: Upgrade Social Proof And Proof-By-Numbers Sections

**Files:**
- Modify: `src/components/Home/Testimonials/Testimonials.jsx`
- Modify: `src/components/Home/Stats/Stats.jsx`

- [ ] Remove fake loading behavior from `src/components/Home/Testimonials/Testimonials.jsx` and simplify the section so it reads as credible social proof rather than a UI demo.
- [ ] Preserve the testimonial carousel purpose while improving card hierarchy, motion restraint, and overall polish.
- [ ] Refine `src/components/Home/Stats/Stats.jsx` so it supports trust and continuity instead of feeling like a decorative interruption in the narrative.
- [ ] Run: `npm run lint`
Expected: PASS with only the pre-existing warnings.
- [ ] Run: `npm run build`
Expected: PASS.
- [ ] Commit:

```bash
git add src/components/Home/Testimonials/Testimonials.jsx src/components/Home/Stats/Stats.jsx
git commit -m "feat: improve homepage testimonials and stats"
```

### Task 7: Finish The Lower Half With Automation And FAQ

**Files:**
- Modify: `src/components/Home/Automation/Automation.jsx`
- Modify: `src/components/Home/FAQ/FAQ.jsx`

- [ ] Update `src/components/Home/Automation/Automation.jsx` so the section reads as a concise supporting capability section and remove the dead `Explore Automation` CTA entirely.
- [ ] Refine automation card layout, spacing, and token usage so the section still feels complete without a button.
- [ ] Update `src/components/Home/FAQ/FAQ.jsx` so the FAQ becomes a denser, more confident closing section with clearer accordion affordance and less empty-feeling spacing.
- [ ] Run: `npm run lint`
Expected: PASS with only the pre-existing warnings.
- [ ] Run: `npm run build`
Expected: PASS.
- [ ] Commit:

```bash
git add src/components/Home/Automation/Automation.jsx src/components/Home/FAQ/FAQ.jsx
git commit -m "feat: polish homepage automation and faq sections"
```

### Task 8: Whole-Page Integration And Visual Verification

**Files:**
- Verify: `src/app/(main)/page.jsx`
- Verify: `src/app/(main)/layout.jsx`
- Verify: `src/components/layout/Navbar/Navbar.jsx`
- Verify: `src/components/layout/Footer/Footer.jsx`
- Verify: `src/components/dashboard/CommandPalette.jsx`
- Verify: homepage section components touched in Tasks 3-7

- [ ] Run: `npm run lint`
Expected: PASS with only the known pre-existing warnings.
- [ ] Run: `npm run build`
Expected: PASS.
- [ ] Start a production preview:

```bash
npm start -- --hostname 127.0.0.1 --port 3002
```

Expected: server starts successfully on `http://127.0.0.1:3002`

- [ ] Capture a desktop verification image:

```bash
google-chrome --headless --disable-gpu --no-sandbox --hide-scrollbars --virtual-time-budget=5000 --window-size=1440,7000 --screenshot=/tmp/home-page-polish-desktop.png http://127.0.0.1:3002
```

Expected: screenshot file is written successfully.

- [ ] Capture a mobile verification image:

```bash
google-chrome --headless --disable-gpu --no-sandbox --hide-scrollbars --virtual-time-budget=5000 --window-size=390,2400 --screenshot=/tmp/home-page-polish-mobile.png http://127.0.0.1:3002
```

Expected: screenshot file is written successfully.

- [ ] Review the rendered homepage against the spec and confirm:
- hero CTAs use the shared button system
- automation CTA is removed
- footer subscribe UI is still present
- floating public-page `Ctrl+K` button remains and feels integrated
- desktop and mobile layouts both feel intentional
- no section feels visually disconnected from the rest of the page

- [ ] Commit:

```bash
git add src/app/\(main\)/page.jsx src/app/\(main\)/layout.jsx src/app/globals.css src/components/container/MainContainer.jsx src/components/ui/button.jsx src/components/layout/Navbar/Navbar.jsx src/components/layout/Footer/Footer.jsx src/components/dashboard/CommandPalette.jsx src/components/Shared/Logo/Logo.jsx src/components/Home/Hero/Hero.jsx src/components/Home/Hero/HeroAppMock.jsx src/components/marquee/PartnerMarquee.jsx src/components/Home/FeatureSection/FeatureSection.jsx src/components/Home/FeatureSection/FeatureGrid.jsx src/components/Home/WorkFlow/WorkflowStepper.jsx src/components/Home/TimeTracking/TimeTracking.jsx src/components/Home/CommandPaletteSection/CommandPaletteSection.jsx src/components/Home/Testimonials/Testimonials.jsx src/components/Home/Stats/Stats.jsx src/components/Home/Automation/Automation.jsx src/components/Home/FAQ/FAQ.jsx
git commit -m "feat: complete homepage polish pass"
```
