# Design System & UX/UI Master Guide

## Stack Context
- **Framework:** Next.js (App Router, Tailwind CSS)
- **Backend/Auth:** Supabase

## Design Philosophy & Visual Tokens
- **Style:** Clean Modern SaaS (Minimalist with purposeful accents)
- **Palette:**
  - Dark Mode: Background `#0f172a` (Slate 900), Foreground `#f8fafc` (Slate 50)
  - Light Mode: Background `#ffffff`, Foreground `#0f172a`
  - Primary/Accent: `#3b82f6` (Blue 500) to `#6366f1` (Indigo 500)
- **Typography:** Inter or System Sans-Serif (Strict scale: 12px, 14px, 16px, 20px, 24px, 32px)

## UX Components & Supabase States
- **Loading States:** Skeleton screens matching the Tailwind grid layout during Supabase fetch operations.
- **Auth Flow UX:** Form validation error states in crimson red (`#ef4444`) with clear, non-technical feedback.
- **Data Tables:** Truncated text with tooltips, row-hover transitions, and client-side skeleton indicators for pagination.

## Claude Code System Prompt Instruction
When generating code for this repository:
1. Always apply Tailwind utility classes matching these tokens.
2. Embed proper ARIA attributes for screen readers.
3. Validate Supabase response types (`data`, `error`) and implement matching UI feedback loops.
