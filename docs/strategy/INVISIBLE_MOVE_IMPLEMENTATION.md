# Invisible Move Implementation Blueprint

> **Vision**: Erase the friction of relocation so completely that moving feels like teleportation.
> **North Star**: Perfect Moves Delivered (PMD) - 0 damage, on-time, <1h admin effort

---

## Gap Analysis: Current State vs Blueprint

### ✅ Already Implemented (Foundation Complete)

| Component | Location | Status |
|-----------|----------|--------|
| Video Inventory CV | `src/lib/video-inventory.ts` | Room scanning, item detection, volume estimation |
| Escrow Service | `src/lib/escrow-service.ts` | Full payment lifecycle with disputes |
| Dynamic Pricing | `src/lib/dynamic-pricing.ts` | Demand/seasonal/availability multipliers |
| Behörden API | `src/lib/behoerden-api.ts` | 11 service types, fee calculation |
| Quality Badge | `src/lib/quality-badge.ts` | 4-tier provider ranking |
| Trust Triumvirate | `src/lib/trust-triumvirate.ts` | Institutional/Social/Process scoring |
| Labor Illusion | Multiple flows | Animated loading with progress messages |
| Smart Router | `src/components/smart-router/` | PLZ-first progressive disclosure |
| Packing Service | `src/lib/packing-service.ts` | 4 tiers with cost calculation |
| Provider Onboarding | `src/lib/provider-onboarding.ts` | 5-step wizard |

### 🔴 Missing Components (To Be Implemented)

| Component | Priority | Description |
|-----------|----------|-------------|
| **MoveProject Orchestrator** | P0 | Central state machine managing entire journey |
| **Digital Twin Persistence** | P0 | Store video inventory in DB, not just session |
| **Real-time Tracking** | P1 | GPS truck tracking, photo proof |
| **eUmzugCH API Integration** | P1 | Actual government API calls |
| **Handover Protocol** | P1 | Cleaning acceptance workflow |
| **Provider Matching Algorithm** | P1 | Smart matching beyond basic filters |
| **Flow DSL Renderer** | P2 | JSON-driven dynamic funnel rendering |

---

## Phase 1: Journey Orchestration Layer (This Sprint)

### 1.1 MoveProject State Machine

```typescript
// src/lib/move-project.ts
type MoveProjectStatus = 
  | 'draft'           // User started but not completed
  | 'inventory_scan'  // Video scanning in progress
  | 'quote_ready'     // AI has calculated price
  | 'booking_pending' // User reviewing offers
  | 'booked'          // Escrow funded
  | 'scheduled'       // Moving day confirmed
  | 'in_transit'      // Move in progress
  | 'completed'       // Move done, awaiting confirmation
  | 'closed';         // All parties satisfied

interface MoveProject {
  id: string;
  userId?: string;
  status: MoveProjectStatus;
  
  // Phase 1: Scan
  origin: AddressDetails;
  destination: AddressDetails;
  moveDate: string;
  flexibility: 'exact' | 'flexible_week' | 'flexible_month';
  
  // Phase 2: Inventory
  inventorySessionId?: string;
  digitalTwin?: DigitalTwin;
  totalVolume: number;
  totalWeight: number;
  
  // Phase 3: Quote
  serviceTier: 'essential' | 'comfort' | 'premium';
  guaranteedPrice: number;
  priceBreakdown: PriceBreakdown;
  
  // Phase 4: Booking
  escrowId?: string;
  providerId?: string;
  providerName?: string;
  
  // Phase 5: Execution
  trackingUrl?: string;
  movingDayChecklist: ChecklistItem[];
  
  // Phase 6: Handover
  handoverProtocolId?: string;
  cleaningAccepted: boolean;
  depositReleased: boolean;
  
  // Meta
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}
```

### 1.2 Database Schema

```sql
-- move_projects table
CREATE TABLE public.move_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  status TEXT NOT NULL DEFAULT 'draft',
  
  -- Addresses
  origin_address JSONB NOT NULL DEFAULT '{}',
  destination_address JSONB NOT NULL DEFAULT '{}',
  move_date DATE,
  flexibility TEXT DEFAULT 'exact',
  
  -- Inventory (Digital Twin)
  inventory_session_id UUID REFERENCES estimate_sessions,
  digital_twin JSONB DEFAULT '{}',
  total_volume NUMERIC DEFAULT 0,
  total_weight NUMERIC DEFAULT 0,
  
  -- Quote
  service_tier TEXT DEFAULT 'comfort',
  guaranteed_price NUMERIC,
  price_breakdown JSONB DEFAULT '{}',
  
  -- Booking
  escrow_id UUID REFERENCES escrow_transactions,
  provider_id UUID REFERENCES service_providers,
  
  -- Execution
  tracking_url TEXT,
  moving_day_checklist JSONB DEFAULT '[]',
  
  -- Handover
  handover_protocol_id UUID,
  cleaning_accepted BOOLEAN DEFAULT false,
  deposit_released BOOLEAN DEFAULT false,
  
  -- Meta
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE public.move_projects ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own projects" 
ON public.move_projects FOR SELECT 
USING (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Users can create projects" 
ON public.move_projects FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update their own projects" 
ON public.move_projects FOR UPDATE 
USING (user_id = auth.uid() OR user_id IS NULL);

-- Index
CREATE INDEX idx_move_projects_status ON public.move_projects(status);
CREATE INDEX idx_move_projects_user ON public.move_projects(user_id);
```

### 1.3 Event-Driven Architecture

```typescript
// Analytics Events (flow-analytics.ts extension)
export const MOVE_PROJECT_EVENTS = {
  // Phase 1
  'project_created': { phase: 1, description: 'User started move project' },
  'address_entered': { phase: 1, description: 'Origin/destination captured' },
  
  // Phase 2
  'inventory_scan_started': { phase: 2, description: 'Video recording began' },
  'inventory_scan_completed': { phase: 2, description: 'AI analysis done' },
  'inventory_manual_adjusted': { phase: 2, description: 'User edited items' },
  
  // Phase 3
  'quote_generated': { phase: 3, description: 'Price calculated' },
  'quote_viewed': { phase: 3, description: 'User saw pricing' },
  'tier_selected': { phase: 3, description: 'Service tier chosen' },
  
  // Phase 4
  'checkout_initiated': { phase: 4, description: 'Payment flow started' },
  'escrow_funded': { phase: 4, description: 'Payment secured' },
  'booking_confirmed': { phase: 4, description: 'Provider assigned' },
  
  // Phase 5
  'move_day_started': { phase: 5, description: 'Truck dispatched' },
  'in_transit_update': { phase: 5, description: 'GPS ping received' },
  'move_completed': { phase: 5, description: 'All items delivered' },
  
  // Phase 6
  'handover_submitted': { phase: 6, description: 'Cleaning protocol uploaded' },
  'handover_accepted': { phase: 6, description: 'Landlord confirmed' },
  'review_submitted': { phase: 6, description: 'Customer rated move' },
  'escrow_released': { phase: 6, description: 'Provider paid' }
};
```

---

## Phase 2: Enhanced User Flows

### 2.1 Unified Entry Points

All entry points converge to single MoveProject:

| Entry | Path | Action |
|-------|------|--------|
| Homepage Hero | `/` | Create draft, go to Smart Router |
| Direct Video | `/video-offerte` | Create draft, start camera |
| WhatsApp | `wa.me/...` | Edge function creates draft |
| Quick Quote | `/schnell-offerte` | Minimal form, then enhance |

### 2.2 Smart Router Enhancement

```
Step 1: PLZ Entry (Hick's Law - minimal input)
    ↓
Step 2: Route Preview (Map visualization, distance calculated)
    ↓
Step 3: Room Count → Smart Routing
    - ≤ 2.5 Zi: Form Flow (Quick)
    - > 2.5 Zi: Video Scan (Accuracy)
    ↓
Step 4: Method Selection (Form/Video/Chat/WhatsApp)
    ↓
Step 5: Inventory Capture
    ↓
Step 6: Instant Price + Escrow CTA
```

---

## Phase 3: Provider Ecosystem

### 3.1 Real-time Availability

```typescript
interface ProviderAvailability {
  providerId: string;
  date: string;
  slots: {
    morning: boolean;   // 07:00-12:00
    afternoon: boolean; // 12:00-17:00
    evening: boolean;   // 17:00-20:00
  };
  crewAvailable: number;
  trucksAvailable: number;
  priceMultiplier: number; // 1.0 = normal, 1.2 = busy
}
```

### 3.2 Smart Matching Algorithm

```typescript
function matchProviders(project: MoveProject): RankedProvider[] {
  // 1. Filter by capability
  const capable = filterByCapability(project.totalVolume, project.origin.canton);
  
  // 2. Filter by availability
  const available = filterByDate(capable, project.moveDate);
  
  // 3. Score by quality
  const scored = available.map(p => ({
    ...p,
    matchScore: calculateMatchScore(p, project)
  }));
  
  // 4. Apply Quality-Weighted Bidding
  return applyQWB(scored);
}

function calculateMatchScore(provider: Provider, project: MoveProject): number {
  let score = 0;
  
  // Quality factors (40%)
  score += provider.rating * 8;           // Max 40
  
  // Price competitiveness (30%)
  score += (1 - provider.priceLevel) * 30;
  
  // Response time (20%)
  score += Math.max(0, 20 - provider.avgResponseHours);
  
  // Specialization (10%)
  if (project.totalVolume > 40 && provider.hasXLTruck) score += 10;
  if (project.hasFragile && provider.hasArtHandling) score += 10;
  
  return Math.min(100, score);
}
```

---

## Phase 4: Execution & Tracking

### 4.1 Moving Day Dashboard

Components needed:
- `MoveDayTracker.tsx` - Real-time status
- `TruckLocationMap.tsx` - GPS visualization
- `PhotoProofGallery.tsx` - Before/after photos
- `LiveChat.tsx` - Direct provider communication

### 4.2 Handover Protocol

```typescript
interface HandoverProtocol {
  id: string;
  moveProjectId: string;
  
  // Cleaning
  cleaningCompletedAt: string;
  cleaningPhotos: string[];
  cleaningCompany?: string;
  
  // Landlord Acceptance
  landlordName: string;
  landlordEmail: string;
  acceptanceStatus: 'pending' | 'accepted' | 'rejected';
  acceptedAt?: string;
  rejectionReason?: string;
  
  // Deposit
  depositAmount: number;
  depositReleased: boolean;
  releaseDate?: string;
}
```

---

## KPIs & Metrics (NSM: Perfect Moves Delivered)

| Metric | Target | Current | Gap |
|--------|--------|---------|-----|
| Trust Velocity (LP → Video) | <120s | ~180s | 60s |
| AI Accuracy (CV) | >95% | ~85% | 10% |
| Supply Liquidity (3+ Gold) | 80% | 40% | 40% |
| Conversion (Visit → Escrow) | >8% | ~3% | 5% |
| Anxiety NPS | 70+ | 55 | 15 |

---

## Implementation Priority

### Sprint 1 (This Week)
- [ ] Create `move_projects` table
- [ ] Build `MoveProjectService.ts`
- [ ] Connect Smart Router to MoveProject
- [ ] Add Digital Twin persistence

### Sprint 2
- [ ] Provider availability calendar
- [ ] Smart matching algorithm
- [ ] Enhanced video scan UI

### Sprint 3
- [ ] Moving day dashboard
- [ ] GPS tracking integration
- [ ] Photo proof system

### Sprint 4
- [ ] Handover protocol
- [ ] Automated escrow release
- [ ] Review collection

---

*Last Updated: January 2026*
*Document Owner: AI Architect*
