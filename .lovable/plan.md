
# Relo-OS Phase Implementation Plan

## Current Status Assessment

After thoroughly exploring the codebase, here's what's already implemented:

### Implemented Components

| Phase | Component | Status |
|-------|-----------|--------|
| **Phase 1: ROUTE** | `RouteInitializer` | Complete - Address capture, date selection, floor/lift details |
| **Phase 2: INVENTORY** | `InventoryOrchestrator` | Complete - LiDAR + Video scanning, Digital Twin generation |
| **Phase 3: QUOTE** | `QuoteOrchestrator` | Complete - Service tiers, dynamic pricing, guaranteed price |
| **Phase 4: BOOKING** | `BookingOrchestrator` | Complete - Provider matching (QWB), Smart Escrow with Stripe |
| **Phase 5: MOVING** | `MovingOrchestrator` | Complete - GPS tracking, ETA updates, crew communication |
| **Phase 6: COMPLETE** | `CompleteOrchestrator` | Partial - Handover protocol, signatures, escrow release |

### Missing Components (to be implemented)

**Phase 6 - Swiss Admin Autopilot:**
- `SwissAdminAutopilot` component (commented out in index.ts)
- `EUmzugCHIntegration` component
- `SwissPostReminder` component
- `SerafeNotification` component

**After-Move Care:**
- `AfterMoveCareMap` exists but not integrated into Phase 6
- `PostMoveSurvey` exists but needs Phase 6 integration
- Neighborhood discovery features missing from Complete flow

**Full Journey Orchestrator:**
- No unified journey orchestrator that connects all 6 phases
- No persistent journey state management

---

## Implementation Plan

### Task 1: Swiss Admin Autopilot Component
Create the main Swiss Admin Autopilot component that orchestrates all Swiss-specific administrative tasks.

**New file:** `src/components/relo-os/phase-6-complete/SwissAdminAutopilot.tsx`

**Features:**
- Task checklist with progress tracking
- eUmzugCH deep-link integration
- Swiss Post forwarding reminder (T-7)
- Serafe notification link
- Status persistence in database

```text
+------------------------------------------+
|  Swiss Admin Autopilot                   |
|  Progress: 2/4 complete                  |
|  [===========            ]  50%          |
+------------------------------------------+
|  [x] eUmzugCH - Ummeldung               |
|  [x] Swiss Post - Nachsendeauftrag      |
|  [ ] Serafe - Adressänderung            |
|  [ ] Third-party notifications          |
+------------------------------------------+
```

### Task 2: eUmzugCH Integration Component
Create a dedicated component for Swiss electronic move registration.

**New file:** `src/components/relo-os/phase-6-complete/EUmzugCHIntegration.tsx`

**Features:**
- Commune lookup (based on postal code)
- eUmzugCH participation check
- Pre-filled deep-link generation
- Fallback instructions for non-digital communes
- Integration with existing `eumzug-ch.ts` library

### Task 3: Swiss Post Reminder Component
Create a reminder component for address forwarding service.

**New file:** `src/components/relo-os/phase-6-complete/SwissPostReminder.tsx`

**Features:**
- T-7 day countdown before move date
- Cost estimation display
- Pre-filled deep-link to Swiss Post
- Mark as complete functionality

### Task 4: After-Move Care Integration
Integrate existing `AfterMoveCareMap` into Phase 6 completion flow.

**Modifications:**
- Update `CompleteOrchestrator.tsx` to add "After Move Care" tab
- Add neighborhood discovery section
- Integrate `PostMoveSurvey` for feedback collection

### Task 5: Unified Journey Orchestrator
Create a master orchestrator that manages the complete 6-phase journey.

**New file:** `src/components/relo-os/JourneyOrchestrator.tsx`

**Features:**
- Phase navigation with progress tracking
- State persistence across sessions
- Conditional phase skipping (e.g., skip inventory for simple moves)
- Mobile-optimized stepper UI

### Task 6: Database Schema for Journey State
Create database tables to persist journey progress.

**New tables:**
- `relo_journeys` - Main journey tracking
- `relo_journey_phases` - Per-phase completion data

### Task 7: Phase 6 Complete Index Update
Update the phase-6-complete index to export all new components.

---

## Technical Details

### File Structure After Implementation

```text
src/components/relo-os/
├── phase-6-complete/
│   ├── index.ts (updated with new exports)
│   ├── SwissAdminAutopilot.tsx (NEW)
│   ├── EUmzugCHIntegration.tsx (NEW)
│   ├── SwissPostReminder.tsx (NEW)
│   ├── SerafeNotification.tsx (NEW)
│   └── AfterMoveCareSection.tsx (NEW)
├── JourneyOrchestrator.tsx (NEW)
└── ... (existing files)
```

### Database Schema

```sql
-- Journey tracking table
CREATE TABLE relo_journeys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  lead_id UUID REFERENCES leads(id),
  current_phase TEXT NOT NULL DEFAULT 'route',
  archetype TEXT, -- overwhelmed_professional, family_manager, etc.
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  -- Phase data stored as JSON
  route_data JSONB,
  inventory_data JSONB,
  quote_data JSONB,
  booking_data JSONB,
  moving_data JSONB,
  complete_data JSONB
);

-- Swiss Admin tasks tracking
CREATE TABLE swiss_admin_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  journey_id UUID REFERENCES relo_journeys(id),
  task_type TEXT NOT NULL, -- eumzug, swiss_post, serafe, etc.
  status TEXT DEFAULT 'pending',
  completed_at TIMESTAMPTZ,
  deep_link TEXT,
  notes TEXT
);
```

### Component Dependencies

- Existing: `AfterMoveCareMap`, `PostMoveSurvey`, Swiss integration libs
- UI: Tabs, Progress, Badge, Button (all from existing UI kit)
- State: React Query for server state, local state for UI

---

## Implementation Order

1. **Task 6** - Database schema (foundation for persistence)
2. **Task 2** - eUmzugCH Integration (core Swiss feature)
3. **Task 3** - Swiss Post Reminder
4. **Task 1** - Swiss Admin Autopilot (combines 2 & 3)
5. **Task 4** - After-Move Care Integration
6. **Task 7** - Phase 6 Index Update
7. **Task 5** - Journey Orchestrator (connects everything)

---

## Mobile-First Considerations

- All new components will use existing responsive patterns
- Touch targets minimum 52px
- Bottom sheet navigation for mobile journey steps
- Swipeable phase transitions using framer-motion
- Sticky progress indicator at top

---

## Estimated Effort

| Task | Complexity | Est. Time |
|------|------------|-----------|
| Database Schema | Low | 15 min |
| eUmzugCH Integration | Medium | 30 min |
| Swiss Post Reminder | Low | 15 min |
| Swiss Admin Autopilot | Medium | 30 min |
| After-Move Care Integration | Medium | 25 min |
| Phase 6 Index Update | Low | 5 min |
| Journey Orchestrator | High | 45 min |

**Total estimated implementation time: ~2.5 hours**
