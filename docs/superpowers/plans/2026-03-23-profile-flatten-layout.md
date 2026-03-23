# Profile Flatten Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Flatten the dashboard profile page into a single continuous form surface with no inner grouped cards while keeping the top spacing fix and current save/upload behavior.

**Architecture:** Keep all profile logic in the existing page component, remove inner section containers, and reflow the avatar and fields into one continuous layout. Reuse existing tokenized input/button styles so the page matches the rest of the dashboard.

**Tech Stack:** Next.js app router, React client component, Tailwind utility classes, shared `Button` component

---

### Task 1: Flatten Profile Page Layout

**Files:**
- Modify: `src/app/(dashboard)/dashboard/(app)/profile/page.jsx`

- [ ] Remove inner grouping containers and section-card styling.
- [ ] Keep one outer form shell with a simple header row and completion indicator.
- [ ] Convert the avatar area into one flat row with preview, upload field, and helper copy.
- [ ] Reflow the remaining inputs into one continuous responsive grid with bio full width.
- [ ] Keep the shared save button and verify the page lints cleanly.
