# 📦 Archive - Legacy Flows & Components

This directory contains archived code from the Relo-OS 2026 consolidation.

**DO NOT DELETE** - These files are kept for reference and potential rollback.

## What's Here

### `/flows-legacy/`
48+ Umzugsofferten flow variants (V1-V9) that were used during A/B testing.
All traffic now routes to the Golden Flow V10 at `/umzugsofferten`.

### `/funnels-legacy/`
Legacy funnel component folders (funnel-v1, funnel-v1b, etc.)
Replaced by unified Relo-OS 6-phase architecture.

### `/pages-legacy/`
Archived page variants that are no longer in active use.

## When This Was Archived

Date: January 2026
Reason: Relo-OS 2026 Consolidation Sprint
Decision: Technical debt reduction, single entry point strategy

## Redirects

All legacy URLs redirect to `/umzugsofferten` via 301 redirects in `public/_redirects`.

## Rollback

If needed, files can be restored by moving them back to their original locations
and updating App.tsx routes.
