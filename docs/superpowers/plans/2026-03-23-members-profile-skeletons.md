# Members And Profile Skeletons Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the members page text loader and add matching initial-load skeletons to both members and profile pages.

**Architecture:** Keep all loading logic inside the existing page components, add lightweight skeleton components local to each file, and gate them on the existing store loading signals. The members page also swaps the pending-invites loading text for invite-row skeletons so the whole page uses one loading language.

**Tech Stack:** Next.js app router, React client components, Tailwind utility classes, shared dashboard store hooks

---

### Task 1: Add Members/Profile Initial Skeletons

**Files:**
- Modify: `src/app/(dashboard)/dashboard/(app)/w/[workspaceId]/members/page.jsx`
- Modify: `src/app/(dashboard)/dashboard/(app)/profile/page.jsx`

- [ ] Add a full-page members skeleton and use it instead of the current `Loading members...` text block.
- [ ] Replace pending-invites loading text with invite-row skeletons in the members page.
- [ ] Add an initial profile skeleton that matches the flattened profile layout and gate it on store loading.
- [ ] Keep existing page behavior and only change loading presentation.
- [ ] Run targeted lint verification on both files.
