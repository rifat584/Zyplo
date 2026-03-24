# Home Page UI Polish Design

**Date:** 2026-03-24

**Goal:** Refine the `/` homepage into a more cohesive, professional-grade marketing page while preserving the current cyan/indigo Zyplo identity and most of the existing section structure.

**Primary outcome:** The landing page should feel intentionally designed from top to bottom, with stronger consistency in layout rhythm, surfaces, CTA behavior, and content flow across desktop and mobile.

## Constraints

- Keep the current cyan/indigo brand direction.
- Do not redesign the entire homepage from scratch.
- Keep the existing section order unless a small local adjustment clearly improves flow.
- Remove the `Explore Automation` CTA from the automation section.
- Keep the newsletter subscribe UI visible in the footer, but do not implement its functionality in this pass.
- Keep the floating public-page `Ctrl+K` command button behavior, but polish it so it feels integrated with the marketing page rather than distracting from it.
- Use semantic color tokens where they improve clarity without breaking the current look.
- Use the shared custom `Button` component for the hero CTA pair, including `Get started free` and `View demo`.

## Non-Goals

- No subscribe backend or email capture logic.
- No major content rewrite of the entire homepage.
- No brand shift away from the existing Zyplo visual identity.
- No large product or feature additions.

## Current Problems

The current homepage already has a strong top half, but it loses consistency and polish as it progresses. The major issues are:

- inconsistent spacing, containers, and section pacing
- CTA styles that do not all use the same shared system
- mixed use of hardcoded colors and tokenized colors
- a lower half that feels more generic than the stronger upper/middle product-story sections
- mobile hero balance issues
- a footer and floating command affordance that need better integration with the marketing shell

## Design Direction

The page should keep its current bright cyan/indigo energy, but become more disciplined and premium. The design direction is:

- lighter, cleaner surfaces driven by existing semantic tokens
- more consistent structure between sections
- less one-off styling drift between components
- stronger hierarchy in the lower half
- better continuity from hero to trust to product proof to closing FAQ/footer

This is a refinement pass, not a reinvention.

## System Decisions

### Layout Rhythm

The homepage should use a single, consistent layout rhythm:

- standardized content width across marketing sections
- standardized horizontal padding across breakpoints
- standardized vertical spacing between sections
- fewer abrupt changes between compact and oversized sections

The goal is to make the page feel like one narrative flow instead of a stack of individually styled blocks.

### CTA System

All marketing CTAs should follow one shared language:

- reuse the shared `Button` component where appropriate
- make primary actions visibly consistent
- make secondary actions quieter but still intentional
- remove CTAs that lead nowhere

This pass specifically includes:

- converting the hero CTAs to the shared button system
- removing the automation CTA entirely
- keeping the footer subscribe control visual-only for now

### Color Policy

Semantic tokens should be used more consistently, but only where they carry real meaning.

- `primary` and `secondary` remain the core brand emphasis colors
- `success` can be used for positive completion, healthy states, or productivity cues
- `info` can be used for helpful system hints or informative accents
- `warning` and `destructive` should only appear when caution is actually implied

Hardcoded whites, grays, and hex values should be reduced where safe to do so, especially in homepage sections that already map well to `background`, `surface`, `card`, `border`, and related tokens.

### Surface Language

Sections should feel related through a shared visual system:

- aligned radius choices
- aligned border softness
- consistent shadow intensity
- cleaner transitions between plain backgrounds, textured surfaces, and premium showcase cards

The page should still have variety, but the variety should feel curated.

## Section Design

### 1. Marketing Shell: Navbar, Floating `Ctrl+K`, Footer

The shared shell should become more integrated and cohesive.

**Navbar**

- keep the current general layout and identity
- refine spacing, contrast, and button alignment
- make sure the navbar CTA language matches the rest of the homepage

**Floating `Ctrl+K` button**

- keep the floating public-page command button behavior
- reduce the sense that it is competing with the marketing page
- polish placement, visual weight, and token usage so it feels like an intentional utility layer
- make sure it behaves cleanly across desktop and mobile

**Footer**

- keep the current information architecture
- align the footer more closely with the homepage surface language
- keep the subscribe input and button visible
- leave subscribe functionality untouched
- reduce placeholder/generic feel where possible without adding backend scope

### 2. Hero

The hero should remain bold and product-forward, but become more reliable and better balanced.

- motion should enhance the hero, not be required for the hero to feel complete
- the copy should read clearly on first paint
- the product mock should remain strong, but not overpower the message on mobile
- the hero CTA pair should use the shared custom button system
- desktop spacing should feel more connected between copy and image
- mobile ordering and spacing should prioritize message clarity and actionability

### 3. Trust Strip and Feature Section

The transition from the hero into trust and product proof should be tighter and more deliberate.

**Trust strip**

- keep the logo marquee concept
- reframe its language so it reads more like ecosystem/integration trust, not literal “partners,” unless the content is updated to match
- keep it visually calm and credibility-focused

**Feature section**

- preserve the current grid as a strong product-proof moment
- align its spacing and heading treatment more closely with the rest of the page
- keep the current product-driven feel while improving continuity from the hero

### 4. Workflow

The workflow section should stay interactive and explanatory, but feel cleaner and more token-driven.

- keep the stepper interaction
- simplify mixed contrast treatments where possible
- make the active state feel clear and premium
- use semantic color only when it reinforces meaning
- keep this section as a clean narrative explanation of how work moves through Zyplo

### 5. Time Tracking

This section should remain the most premium showcase block, but with slightly calmer visual noise.

- preserve the sense of depth and polish
- reduce any styling that makes it feel detached from the rest of the homepage
- align token usage more cleanly with the homepage system
- keep it feature-rich without overwhelming the page rhythm

### 6. Command Palette

The command palette section should continue to sell keyboard-first workflow, but the mock and surrounding structure should feel more complete.

- keep the section in the middle story sequence
- strengthen the right-side demo density so it feels worth the space it occupies
- align heading, label, and accent intensity with neighboring sections
- preserve the section’s keyboard-driven identity without making it visually noisy

### 7. Testimonials

This section needs to feel more credible and less like a UI demo.

- remove fake loading behavior
- keep the social-proof purpose
- simplify motion and improve hierarchy
- make the cards feel cleaner and more intentional

The goal is quiet credibility, not extra effects.

### 8. Stats

The stats section should support trust, not interrupt the page rhythm.

- keep it as proof content
- simplify or tune any styling that feels too decorative relative to the information
- maintain the premium look while improving narrative continuity from testimonials into automation

### 9. Automation

The automation section should become a concise supporting capability section.

- keep the cards
- remove the `Explore Automation` CTA entirely
- improve visual framing so the section still feels complete without a button
- use tokenized colors and spacing more consistently

### 10. FAQ

The FAQ should become a confident closing section instead of a large, sparse ending.

- tighten spacing and layout density
- improve accordion affordance and hierarchy
- make the section feel like a deliberate final stop before the footer

## Component and Responsibility Boundaries

This polish pass should keep logic local to the existing homepage and shared marketing components whenever possible.

- page-wide spacing and shell consistency should be handled in shared marketing layout/components
- section-specific refinements should stay within each section component
- button consistency should come from the shared button primitive rather than one-off custom CTA markup
- semantic color adoption should be done incrementally and safely, section by section

## Data Flow and Behavior

This pass is primarily presentational. Existing behavior should remain stable unless explicitly adjusted as part of polish.

Expected behavior changes:

- hero CTAs move to shared button rendering
- automation dead CTA is removed
- floating public-page `Ctrl+K` button remains, but its visual treatment may change

Expected behavior that stays unchanged:

- footer subscribe remains non-functional
- existing navigation destinations remain intact
- section ordering remains broadly the same

## Error Handling and Risk Notes

Because this is a UI polish pass, the main risks are visual regressions rather than business-logic failures.

Areas to watch:

- hero first-paint reliability and motion timing
- mobile layout balance in the hero and shell
- preserving accessibility and visible focus states while changing CTA styling
- keeping semantic color usage meaningful rather than decorative
- avoiding token substitutions that accidentally flatten the current visual identity

## Testing and Verification

Success should be verified through a combination of build validation and visual checks.

Required verification for this pass:

- production build succeeds
- desktop and mobile layouts remain usable and intentional
- no dead CTA remains in automation
- hero CTAs use the shared button system
- semantic color updates do not introduce obvious contrast or hierarchy regressions
- floating public-page `Ctrl+K` button still works and feels integrated
- footer subscribe UI remains visible and intact

## Recommended Implementation Order

1. Marketing shell, shared button usage, floating command button polish, footer
2. Hero
3. Trust strip and feature section
4. Workflow
5. Time tracking
6. Command palette section
7. Testimonials
8. Stats
9. Automation
10. FAQ

## Approval Summary

This design keeps option 2 from the brainstorming phase:

- preserve the current cyan/indigo identity
- refine the system rather than replace it
- improve section flow and professionalism
- keep the floating public-page `Ctrl+K` button
- remove the dead automation CTA
- keep footer subscribe visual-only

This spec is the blueprint for the implementation plan that follows.
