
# Paid Acquisition Launch Module for Command Center

## Overview

Integrate the Swiss Growth Research Unit findings directly into the existing `/internal/command-center` as a new dedicated section. This creates a single operational hub for launching and managing the Feierabend-umzug.ch paid acquisition machine.

---

## Current State Analysis

### Command Center Architecture (Already Exists)
The `/internal/command-center` already has:
- **GlobalStatusBar**: SCALE/HOLD/STOP indicator
- **KillSwitchAlerts**: 7 automated guardrails (CPL > 90, CM2 < 20%, etc.)
- **OperatorDecisionPanel**: Daily action recommendations
- **ExecutiveSnapshot**: 7d/30d KPIs
- **UnitEconomicsPanel**: Multi-brand calculator (Feierabend, Express, Helden, Marketplace)
- **LeadScoringSimulator**: Lead routing brain
- **DistributionEngine**: Partner auction system
- **RoadmapTracker**: 12-week execution plan (already includes "Launch first Google Ads")
- **FinanceControlPanel**: Cash runway tracking

### Existing Infrastructure
- `paid_media_campaigns` table (platform, campaign_id, status, daily_budget)
- `paid_media_daily_metrics` table
- `ai_task_queue` table for implementation tasks
- `PaidMediaControl` page at `/internal/paid-media-control` (standalone)

---

## Integration Plan

### New Section: "8. Paid Launch Cockpit"
Add a new collapsible section to the Command Center after Section 7 (Finance).

```
+------------------------------------------+
|  8. PAID LAUNCH COCKPIT                  |
|  Status: PRE-LAUNCH | 3/20 tasks done    |
+------------------------------------------+
|  [Quick Stats]                           |
|  Budget: CHF 1,000 test | Daily: CHF 33  |
|  Est. Clicks: 125-200 | Est. CPL: CHF 5-8|
+------------------------------------------+
|  [P0 Blockers - 5 items]                 |
|  [ ] Create /danke thank-you page        |
|  [ ] Add gclid to contact_submissions    |
|  [ ] Verify GA4 events firing            |
|  [ ] Configure Consent Mode v2           |
|  [ ] Verify trust claims                 |
+------------------------------------------+
|  [Campaign Structure]                    |
|  - Zürich Premium (CHF 600)              |
|  - Zug Premium (CHF 300)                 |
|  - Specialist (CHF 100)                  |
+------------------------------------------+
```

---

## Implementation Tasks

### Task 1: Database Schema Extension
Create a `paid_launch_checklist` table for tracking P0/P1/P2 implementation tasks.

**Schema:**
```sql
CREATE TABLE paid_launch_checklist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site TEXT NOT NULL, -- 'feierabend' | 'umzugscheck' | 'both'
  priority TEXT NOT NULL, -- 'p0' | 'p1' | 'p2'
  category TEXT NOT NULL, -- 'tracking' | 'landing' | 'copy' | 'dev' | 'ops'
  title TEXT NOT NULL,
  goal TEXT,
  change_description TEXT,
  acceptance_criteria TEXT[],
  owner TEXT, -- 'dev' | 'tracking' | 'copy' | 'ops'
  complexity TEXT, -- 's' | 'm' | 'l'
  status TEXT DEFAULT 'todo', -- 'todo' | 'in_progress' | 'done' | 'blocked'
  blocked_reason TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### Task 2: Create PaidLaunchCockpit Component
**New file:** `src/components/internal/command-center/PaidLaunchCockpit.tsx`

**Features:**
- Pre-populated with all 20+ tickets from the research
- Visual progress bar (P0 items block launch)
- Quick-filter by category (tracking, dev, copy)
- Mark as done with single click
- "Copy to AI Queue" button to send to `ai_task_queue`
- Campaign structure preview with budget allocation

### Task 3: Create KeywordClustersPanel Component
**New file:** `src/components/internal/command-center/KeywordClustersPanel.tsx`

Display the keyword architecture:
- Cluster name, example keywords, intent stage
- Suggested landing page (clickable)
- Negative keywords list
- Can export to Google Ads Editor format

### Task 4: Create CompetitorIntelPanel Component
**New file:** `src/components/internal/command-center/CompetitorIntelPanel.tsx`

Searchable/sortable table of 30+ competitors:
- Name, region, positioning, CTA strategy
- Last updated timestamp
- Link to source

### Task 5: Update Command Center Page
**Modify:** `src/pages/internal/CommandCenter.tsx`

Add Section 8 after Finance:
```tsx
<Section title="8. Paid Launch Cockpit" defaultOpen={true}>
  <SectionHelp icon={Rocket} {...COMMAND_CENTER_HELP.paidLaunch} />
  <PaidLaunchCockpit />
</Section>
```

### Task 6: Seed Checklist Data
Create migration with all 20+ tickets from the research report.

### Task 7: Add Help Documentation
Update `CommandCenterHelp.tsx` with new section documentation.

---

## File Structure After Implementation

```
src/components/internal/command-center/
├── PaidLaunchCockpit.tsx (NEW)
├── KeywordClustersPanel.tsx (NEW)
├── CompetitorIntelPanel.tsx (NEW)
├── CommandCenterHelp.tsx (updated)
├── index.ts (updated)
└── types.ts (updated)
```

---

## Data Flow

```
1. Research Data (static seed)
   └─> paid_launch_checklist table
       └─> PaidLaunchCockpit component
           └─> Task marked "done"
               └─> Refresh progress bar
               └─> If P0 complete → unlock "Launch Ads" button

2. Competitor Data (static seed)
   └─> Local JSON or DB table
       └─> CompetitorIntelPanel
           └─> Searchable table

3. Keyword Data (static seed)
   └─> Local JSON
       └─> KeywordClustersPanel
           └─> Export to Google Ads Editor
```

---

## UI/UX Details

### PaidLaunchCockpit Layout
- **Header Row**: Launch status badge, progress fraction, test budget display
- **Tabs**: P0 Blockers | P1 Optimization | P2 Enhancement | All Tasks
- **Task Card**: Checkbox, title, site badge, owner badge, complexity badge
- **Footer**: "Export All to AI Queue" button, "Mark All P0 Complete" (disabled until all done)

### Launch Readiness Logic
```tsx
const canLaunch = tasks.filter(t => t.priority === 'p0' && t.status !== 'done').length === 0;
```

When all P0 tasks are done:
- Show green "READY TO LAUNCH" badge
- Show "Open Google Ads" external link button
- Log audit event for launch authorization

---

## Integration with Existing Systems

### AI Task Queue Bridge
"Copy to AI Queue" button creates tasks in `ai_task_queue`:
```tsx
const copyToAIQueue = async (task: ChecklistItem) => {
  await supabase.from('ai_task_queue').insert({
    agent: 'copilot',
    title: `[PAID-LAUNCH] ${task.title}`,
    description: task.goal,
    prompt: task.change_description,
    target_files: inferTargetFiles(task),
    priority: task.priority === 'p0' ? 10 : task.priority === 'p1' ? 5 : 2,
    source: 'paid-launch-cockpit'
  });
};
```

### Kill Switch Integration
Extend `KillSwitchAlerts` to include:
- "No active campaigns" warning when P0 complete but ads not launched
- "Tracking incomplete" warning if GA4 events not verified

---

## Estimated Implementation Effort

| Task | Complexity | Est. Time |
|------|------------|-----------|
| Database schema | S | 15 min |
| Seed checklist data | S | 20 min |
| PaidLaunchCockpit component | M | 45 min |
| KeywordClustersPanel | S | 25 min |
| CompetitorIntelPanel | S | 25 min |
| Command Center page update | S | 10 min |
| Help documentation | S | 10 min |

**Total: ~2.5 hours**

---

## Mobile Considerations

- Tabs switch to horizontal scroll on mobile
- Task cards stack vertically
- Touch targets 52px+
- Progress bar spans full width
- "Launch" button sticky at bottom when visible

---

## Success Criteria

1. All 20+ implementation tickets visible in cockpit
2. P0 blockers clearly highlighted with red badges
3. Progress bar updates in real-time when tasks marked done
4. "Ready to Launch" appears when all P0 complete
5. Tasks can be exported to AI queue for automated implementation
6. Competitor intel searchable by name/region
7. Keyword clusters exportable to Google Ads Editor format
