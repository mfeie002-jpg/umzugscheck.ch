
# Unified Paid Media Control Center - Integration Plan

## Overview

Consolidate the **Paid Launch Cockpit** (from Command Center) with the existing **Paid Media Control** page (`/internal/paid-media-control`) to create a single, comprehensive operational hub for managing the Feierabend-umzug.ch paid acquisition machine.

---

## Current State Analysis

### Existing `/internal/paid-media-control` (8 tabs)

| Tab | Component | Purpose |
|-----|-----------|---------|
| Calculator | `FeierabendUnitEconomicsCalculator` / `UmzugscheckUnitEconomicsCalculator` | Unit economics modeling (CM2, CAC, ROAS) |
| Triage | `LeadTriageHelper` | Lead qualification decision tree |
| Scaling | `ScalingDecisionPanel` | GO/NO-GO matrix for scaling |
| Red Flags | `WeeklyRedFlagsPanel` | Early warning system (CPL spike, conversion drop) |
| Phone ROI | `PhoneSupportROIRules` | Call center ROI rules and time caps |
| GAV Labor | `GavLaborCalculator` | Swiss labor cost compliance |
| Cherries | `CherriesChaffRouter` | Lead routing (Feierabend vs Marketplace) |
| Yield | `SeasonalYieldManagement` | Dynamic pricing by season/day |

### New Components (from Paid Launch Cockpit)

| Component | Purpose |
|-----------|---------|
| `PaidLaunchCockpit` | 21-task implementation checklist (P0/P1/P2), launch readiness |
| `KeywordClustersPanel` | 10 keyword clusters, Google Ads Editor export |
| `CompetitorIntelPanel` | 30+ competitor database with positioning analysis |

---

## Integration Plan

### New Tab Structure (11 tabs)

```
[Launch] [Keywords] [Competitors] [Calculator] [Triage] [Scaling] [Red Flags] [Phone] [GAV] [Cherries] [Yield]
```

Reorganized by workflow stage:

**Pre-Launch (New)**
1. **Launch Cockpit** - Implementation checklist, P0 blockers, readiness status
2. **Keywords** - Keyword clusters, negative lists, Ads Editor export
3. **Competitors** - Competitive intelligence database

**Operations (Existing)**
4. **Unit Economics** - Calculator (Feierabend/Umzugscheck toggle)
5. **Lead Triage** - Qualification decision tree
6. **Scaling** - GO/NO-GO decision matrix
7. **Red Flags** - Weekly early warning system
8. **Phone ROI** - Call center optimization rules
9. **GAV Labor** - Swiss compliance calculator
10. **Cherries** - Lead routing logic
11. **Yield** - Seasonal pricing management

---

## Implementation Tasks

### Task 1: Add New Tabs to PaidMediaControl
**Modify:** `src/pages/internal/PaidMediaControl.tsx`

Add three new tabs at the beginning:
```tsx
<TabsTrigger value="launch">
  <Rocket className="w-3.5 h-3.5" />
  Launch
</TabsTrigger>
<TabsTrigger value="keywords">
  <Search className="w-3.5 h-3.5" />
  Keywords
</TabsTrigger>
<TabsTrigger value="competitors">
  <Users className="w-3.5 h-3.5" />
  Intel
</TabsTrigger>
```

### Task 2: Import and Integrate Components
Add new TabsContent sections:
```tsx
import { PaidLaunchCockpit, KeywordClustersPanel, CompetitorIntelPanel } from '@/components/internal/command-center/paid-launch';

<TabsContent value="launch">
  <PaidLaunchCockpit />
</TabsContent>

<TabsContent value="keywords">
  <KeywordClustersPanel />
</TabsContent>

<TabsContent value="competitors">
  <CompetitorIntelPanel />
</TabsContent>
```

### Task 3: Update Header with Launch Status
Add a launch readiness indicator to the header:
```tsx
import { usePaidLaunchStats } from '@/hooks/usePaidLaunchChecklist';

// In header, show:
{canLaunch ? (
  <Badge className="bg-green-500">READY TO LAUNCH</Badge>
) : (
  <Badge variant="outline" className="border-amber-500 text-amber-600">
    PRE-LAUNCH ({stats.p0Done}/{stats.p0Total} P0)
  </Badge>
)}
```

### Task 4: Add Quick Actions Panel
Create a new floating panel showing critical P0 blockers:
- Display on all tabs when P0 tasks remain
- Quick-link to complete blocking tasks
- Shows launch countdown/readiness percentage

### Task 5: Responsive Tab Navigation
Update TabsList for better mobile experience:
- Use horizontal scroll on mobile
- Group tabs with dropdown on very small screens
- Add tab section headers (Pre-Launch | Operations)

### Task 6: Update Page Title & Subtitle
Change header to reflect unified purpose:
```tsx
<h1>Paid Media Control Center</h1>
<p>Launch Readiness • Unit Economics • Operations</p>
```

---

## Visual Design

### Header Layout
```
+----------------------------------------------------------+
| INTERNAL / CFO-COO                                        |
| Paid Media Control Center          [DIRECT] ○───● [MARKETPLACE]
| Launch • Economics • Operations    [🟡 PRE-LAUNCH: 3/6 P0] |
+----------------------------------------------------------+
```

### Tab Bar (Desktop)
```
┌────────┬──────────┬────────────┬────────────┬────────┬─────────┬───────────┬───────┬─────┬──────────┬───────┐
│ Launch │ Keywords │ Competitors│ Calculator │ Triage │ Scaling │ Red Flags │ Phone │ GAV │ Cherries │ Yield │
└────────┴──────────┴────────────┴────────────┴────────┴─────────┴───────────┴───────┴─────┴──────────┴───────┘
```

### Tab Bar (Mobile - Scrollable)
```
← [Launch] [Keywords] [Competitors] [Calc] [Triage] ... →
```

---

## Data Flow Integration

### Cross-Tab Connections

1. **Launch → Red Flags**: If tracking tasks incomplete, show warning in Red Flags
2. **Launch → Scaling**: Block "GO" decision if P0 blockers remain
3. **Keywords → Launch**: Mark keyword setup task complete when clusters reviewed
4. **Competitors → Launch**: Mark competitor intel task complete when reviewed

### Shared State
```tsx
// New context for launch status
interface PaidLaunchContext {
  stats: PaidLaunchStats;
  canLaunch: boolean;
  p0Blockers: PaidLaunchTask[];
}
```

---

## Technical Implementation

### Files to Modify

| File | Changes |
|------|---------|
| `src/pages/internal/PaidMediaControl.tsx` | Add 3 new tabs, launch status header, imports |
| `src/components/internal/command-center/paid-launch/index.ts` | Verify exports |
| `src/hooks/usePaidLaunchChecklist.ts` | Already exists, no changes |

### Files to Create

| File | Purpose |
|------|---------|
| `src/components/internal/paid-media/LaunchStatusBadge.tsx` | Reusable launch status indicator |
| `src/components/internal/paid-media/P0BlockerAlert.tsx` | Floating P0 alert for all tabs |

### Dependencies
- No new packages required
- Uses existing UI components and hooks

---

## Mobile-First Considerations

- Horizontal scrolling TabsList with snap points
- Launch status badge sticky in header
- P0 blocker alert as bottom sheet
- Touch targets 52px minimum
- Tab icons always visible, text hidden on mobile (except active)

---

## Success Criteria

1. ✅ All 11 tabs accessible from single page
2. ✅ Launch status visible in header on all tabs
3. ✅ P0 blockers alert shows until all complete
4. ✅ "Ready to Launch" state unlocks after P0 complete
5. ✅ Mobile-responsive with horizontal scroll
6. ✅ Existing calculator/triage/scaling functionality unchanged
7. ✅ Keywords exportable to Google Ads Editor
8. ✅ Competitor intel searchable

---

## Estimated Effort

| Task | Complexity | Est. Time |
|------|------------|-----------|
| Add new tabs to PaidMediaControl | S | 20 min |
| Launch status header badge | S | 15 min |
| P0 blocker floating alert | M | 25 min |
| Responsive tab improvements | S | 15 min |
| Cross-tab state connections | M | 30 min |
| Testing & polish | S | 15 min |

**Total: ~2 hours**
