# Dashboard Avatar Image-First Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make dashboard avatars prefer real profile images wherever image data already exists, while keeping the current gradient/initials fallback everywhere else.

**Architecture:** Reuse the existing shared `Avatar` component as the single image-first rule, then update dashboard call sites to pass `src` when member or session image data is already available. Do not change backend responses or invent new avatar fields.

**Tech Stack:** Next.js app router, React client components, Tailwind utility classes, shared dashboard UI components

---

### Task 1: Wire Avatar Sources Into Dashboard Call Sites

**Files:**
- Modify: `src/app/(dashboard)/dashboard/(app)/w/[workspaceId]/members/page.jsx`
- Modify: `src/components/dashboard/ui.jsx`
- Modify: `src/components/board/TaskDetailsModal.jsx`

- [ ] Confirm which dashboard UIs already have avatar/image fields available.
- [ ] Keep `Avatar` using image-first behavior and make its image fallback styling robust.
- [ ] Pass member avatar URLs into the shared `Avatar` component on the members page.
- [ ] Update any hand-rolled dashboard initials/avatar bubbles that already have image data available.
- [ ] Run targeted lint verification on touched files.
