

# Mobile UX Fix: UnifiedABToggle

## Problem
The A/B toggle panel is not mobile-optimized on 390px viewports:
- Panel position `bottom-24 left-4 right-4` can overlap with sticky CTAs
- Tab labels at `text-[10px]` are cramped in 4-column grid
- `max-h-[50vh]` may not leave enough room on small screens with keyboard/bottom bars
- The floating button at `bottom: calc(safe-area + 96px)` may collide with other fixed elements
- Nav variant text truncation at `max-w-[180px]` doesn't adapt to screen width
- Legend sections add unnecessary scroll weight on mobile

## Changes

**File: `src/components/homepage/UnifiedABToggle.tsx`**

1. **Panel positioning** — Make panel full-width on mobile with proper safe-area spacing:
   - Change to `fixed bottom-0 left-0 right-0 sm:bottom-24 sm:left-4 sm:right-auto sm:w-[400px]`
   - Add `rounded-t-2xl sm:rounded-2xl` for mobile bottom-sheet feel
   - Reduce `max-h-[50vh]` to `max-h-[60vh]` on mobile (more room since anchored to bottom)

2. **Floating toggle button** — Reposition for mobile:
   - Move from `bottom: calc(safe-area + 96px)` to `bottom: calc(safe-area + 72px)` to avoid overlap with sticky CTA
   - Increase touch target: `py-2.5 px-3` and min-height 44px

3. **Tab grid** — Improve touch targets:
   - `TabsList`: add `h-auto min-h-[44px]`
   - `TabsTrigger`: increase to `text-xs py-2` with `min-h-[40px]`

4. **Nav variant buttons** — Fix text overflow:
   - Replace `max-w-[180px]` with `max-w-[calc(100%-60px)]` to be viewport-relative
   - Ensure all buttons have `min-h-[44px]` touch targets

5. **Legend sections** — Collapse on mobile:
   - Hide legends by default on mobile with `hidden sm:block` or wrap in a collapsible
   - Keep them visible on desktop

6. **Backdrop** — Ensure z-index consistency and proper dismiss area

