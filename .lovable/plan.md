
# Swiss Relocation Operating System (SROS): Complete Implementation Plan

## Executive Summary

This plan details the development of missing components to transform umzugscheck.ch from a lead aggregator into Switzerland's **Category King** relocation platform. The strategic blueprint identifies 6 major pillars - our current implementation covers approximately **45%** of the vision.

---

## Current State Assessment

### What's Built (45%)
| Component | Status |
|-----------|--------|
| Living Cost Comparison | ✅ Complete |
| Tax Rate Integration (ESTV) | ✅ Complete |
| Disposal Planning (OpenERZ) | ✅ Complete |
| Recycling Center Lookup | ✅ Complete |
| Address Change Wizard (22+ institutions) | ✅ Complete |
| Swiss Post Forwarding Links | ✅ Complete |
| eUmzugCH Deep Links | ✅ Skeleton |
| Handover Protocol + Digital Signatures | ✅ Complete |
| Move Health Index + Canton Scores | ✅ Complete |
| Data Journalism (Flow Maps, Trends) | ✅ Complete |

### What's Missing (55%)
| Component | Priority |
|-----------|----------|
| Lebensdauertabelle Depreciation Engine | 🔴 HIGH |
| SBB Journey API Integration | 🔴 HIGH |
| Computer Vision Damage Assessment | 🟡 MEDIUM |
| geo.admin Environmental Data (Noise/Solar) | 🟡 MEDIUM |
| B2B Utility Switchboard API | 🟡 MEDIUM |
| Swiss Post Address Validation (MAT[CH]) | 🟢 LOW |
| Furniture Rescue Marketplace | 🟢 LOW |

---

## Phase 1: Lebensdauertabelle Depreciation Engine (Week 1-2)

The paritätische Lebensdauertabelle is mentioned in multiple vision documents but exists only as PDF. This is a **high-value differentiator** for the handover protocol.

### 1.1 Database Schema

Create a structured database of fixture lifespans:

```text
┌─────────────────────────────────────────────────────────────┐
│                   fixture_lifespans                          │
├─────────────────────────────────────────────────────────────┤
│ id (uuid)                                                    │
│ category (enum): walls, floors, kitchen, bathroom, etc.      │
│ item_de (text): "Dispersionfarbe", "Laminat", "Kühlschrank" │
│ item_fr (text): French translation                           │
│ lifespan_years (integer): 8, 15, 10                         │
│ source (text): "Paritätische Lebensdauertabelle 2024"       │
│ notes_de (text): Special conditions                         │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Depreciation Calculator Library

**File:** `src/lib/relo-os/swiss-integration/lebensdauer/index.ts`

```text
┌─────────────────────────────────────────────────────────────┐
│               DepreciationEngine                             │
├─────────────────────────────────────────────────────────────┤
│ + calculateResidualValue(item, installYear, currentYear)    │
│ + getLifespanForItem(category, itemName)                    │
│ + isNormalWear(age, lifespan) → boolean                     │
│ + generateHandoverReport(damages[])                          │
└─────────────────────────────────────────────────────────────┘

Formula: residualValue = 1 - (age / lifespan)
If age >= lifespan → residualValue = 0% (no tenant liability)
```

### 1.3 UI Component: Lebensdauer Calculator

**File:** `src/components/relo-os/LebensdauerCalculator.tsx`

Features:
- Category dropdown (Wände, Böden, Küche, Bad, etc.)
- Item selector with autocomplete
- Installation year input
- Real-time residual value calculation
- Visual progress bar showing depreciation
- "Kein Abzug" badge when 100% amortized
- Integration with HandoverProtocol.tsx

### 1.4 Data Seeding

Seed ~150 items from official Lebensdauertabelle:
- Walls: Dispersionfarbe (8y), Tapeten (12y), Abrieb (15y)
- Floors: Teppich (10y), Laminat (15y), Parkett (40y)
- Kitchen: Kühlschrank (10y), Herd (20y), Armatur (15y)
- Bathroom: Lavabo (25y), WC (30y), Dusche (20y)

---

## Phase 2: SBB Journey API Integration (Week 2-3)

This enables the "Commute Capital" algorithm from the blueprint.

### 2.1 Edge Function: SBB Journey Proxy

**File:** `supabase/functions/sbb-journey/index.ts`

```text
Endpoints:
POST /sbb-journey
  Request: { origin: "8001", destination: "3011", date: "2026-02-15" }
  Response: {
    duration_minutes: 75,
    transfers: 1,
    connections_per_hour: 4,
    first_departure: "05:32",
    last_departure: "23:45",
    monthly_pass_chf: 420
  }
```

SBB API endpoints to integrate:
- `v3/trips/by-origin-destination` - Journey planning
- Price API for Abonnement costs

### 2.2 Commute Capital Calculator

**File:** `src/lib/relo-os/commute-capital/index.ts`

```text
┌─────────────────────────────────────────────────────────────┐
│               CommuteCapitalEngine                           │
├─────────────────────────────────────────────────────────────┤
│ + calculateCommuteValue(                                     │
│     hourlyRate: number,      // User's time value (CHF/h)   │
│     dailyCommute: number,    // Minutes one-way             │
│     workDaysPerYear: number  // Default: 220                │
│   ) → annualTimeCost: number                                 │
│                                                              │
│ + getTrueCostOfLiving(                                      │
│     rentSavings: number,                                    │
│     commuteTimeCost: number,                                │
│     transitPassCost: number                                 │
│   ) → netBenefit: number                                    │
└─────────────────────────────────────────────────────────────┘
```

### 2.3 Enhanced Living Cost Comparison

Update `LivingCostComparison.tsx` to include:
- Real SBB commute times (not static data)
- "Time Value of Money" slider (25-100 CHF/hour)
- Annual commute cost visualization
- Net benefit/loss calculation

---

## Phase 3: geo.admin Environmental Data (Week 3-4)

Integrate BAFU noise maps and environmental quality data.

### 3.1 Edge Function: geo.admin Proxy

**File:** `supabase/functions/geo-admin-query/index.ts`

Query layers:
- `ch.bafu.laerm-strassenlaerm_tag` - Daytime road noise
- `ch.bafu.laerm-bahnlaerm_nacht` - Nighttime rail noise
- `ch.bfe.solarenergie-eignung-dacher` - Solar potential

### 3.2 Environmental Quality Types

**File:** `src/lib/relo-os/environmental-quality/types.ts`

```text
interface EnvironmentalProfile {
  noiseDay: number;      // dB
  noiseNight: number;    // dB
  solarPotential: 'low' | 'medium' | 'high';
  fogProbability: number; // days per year
  quietScore: 0-100;
  winterSunScore: 0-100;
}
```

### 3.3 Neighborhood Quality Overlay

Add to `neighborhood_profiles` table:
- `noise_day_db` (integer)
- `noise_night_db` (integer)
- `solar_potential_kwh` (integer)
- `quiet_score` (integer)

---

## Phase 4: Computer Vision Damage Assessment (Week 4-5)

AI-powered surface defect classification for handover disputes.

### 4.1 Edge Function: Damage Assessment

**File:** `supabase/functions/assess-damage/index.ts`

Using Lovable AI (google/gemini-2.5-pro with vision):

```text
Input: Base64 image of surface defect
Output: {
  classification: "scratch" | "hole" | "stain" | "crack" | "wear",
  severity: "superficial" | "minor" | "moderate" | "severe",
  estimated_depth_mm: number,
  is_normal_wear: boolean,
  confidence: number,
  recommendation_de: string
}
```

### 4.2 Integration with Handover Protocol

Enhance `HandoverProtocol.tsx`:
- "AI analysieren" button when photo is captured
- Overlay showing AI classification
- Auto-link to Lebensdauertabelle item
- Combined report: Photo + AI Assessment + Depreciation

---

## Phase 5: B2B Utility Switchboard (Week 5-6)

### 5.1 Utility Provider Registry

**Database table:** `utility_providers`

```text
┌─────────────────────────────────────────────────────────────┐
│                   utility_providers                          │
├─────────────────────────────────────────────────────────────┤
│ id, name, type (electricity|gas|water|internet)             │
│ service_areas (text[]) - postal code prefixes               │
│ api_available (boolean)                                      │
│ notification_url (text) - for future B2B API                │
│ form_template_url (text) - PDF form for manual notification │
└─────────────────────────────────────────────────────────────┘
```

### 5.2 Utility Notification Wizard

**File:** `src/components/relo-os/UtilityNotificationWizard.tsx`

Features:
- Auto-detect providers by postal code
- Pre-filled notification forms
- Meter reading input with photo
- Direct API submission (where available)
- PDF generation for manual submission

### 5.3 Serafe Wizard Enhancement

Upgrade from simple link to full wizard:
- Household ID lookup
- Date overlap calculator
- Pre-filled notification generation
- Direct submission link

---

## Phase 6: Furniture Rescue Marketplace (Week 6-7)

### 6.1 Brocki Integration

**Database table:** `brocki_partners`

```text
┌─────────────────────────────────────────────────────────────┐
│                    brocki_partners                           │
├─────────────────────────────────────────────────────────────┤
│ id, name, city, postal_code                                  │
│ accepted_categories (text[])                                 │
│ offers_pickup (boolean)                                      │
│ contact_email, contact_phone                                 │
│ website_url                                                  │
└─────────────────────────────────────────────────────────────┘
```

### 6.2 "Don't Throw Away" Marketplace

**File:** `src/components/relo-os/FurnitureRescue.tsx`

Features:
- Item photo + CV classification
- Auto-suggest: Donate / Sell / Dispose
- Brocki matching by location + category
- One-click pickup request
- Integration with Tutti.ch / Ricardo API

---

## Technical Architecture

### New Database Tables (5 total)

```text
1. fixture_lifespans      (~150 items)
2. utility_providers      (~50 providers)
3. brocki_partners        (~100 locations)
4. environmental_readings (cached geo.admin data)
5. damage_assessments     (CV results + user data)
```

### New Edge Functions (4 total)

```text
1. sbb-journey           - SBB API proxy
2. geo-admin-query       - Environmental data
3. assess-damage         - CV damage classification
4. utility-notify        - B2B utility notifications
```

### New UI Components (6 total)

```text
1. LebensdauerCalculator.tsx     - Depreciation engine UI
2. CommuteCapitalCalculator.tsx  - Time-value commute tool
3. EnvironmentalQualityCard.tsx  - Noise/solar display
4. DamageAssessmentOverlay.tsx   - CV results in handover
5. UtilityNotificationWizard.tsx - Provider notifications
6. FurnitureRescue.tsx           - Brocki marketplace
```

---

## Implementation Timeline

| Week | Phase | Deliverable |
|------|-------|-------------|
| 1-2 | Lebensdauertabelle | Database + Calculator + Handover Integration |
| 2-3 | SBB Integration | Edge Function + Commute Capital Calculator |
| 3-4 | geo.admin Data | Environmental Quality Layer |
| 4-5 | CV Damage Assessment | AI Edge Function + Handover Integration |
| 5-6 | Utility Switchboard | Provider Registry + Notification Wizard |
| 6-7 | Furniture Rescue | Brocki Integration + Marketplace UI |

---

## Strategic Value

### Link-Worthiness by Feature

| Feature | Target Stakeholders |
|---------|---------------------|
| Lebensdauertabelle | Mieterverband, HEV, Legal blogs |
| Commute Capital | Employers, ESG organizations, SBB |
| Quiet Score | Health insurers, family portals |
| Damage AI | Insurance companies, property managers |
| Utility Switch | Energy providers (EWZ, BKW, Groupe E) |
| Furniture Rescue | Sustainability orgs, Smart City portals |

### North Star Alignment

Each feature directly supports the **Perfect Moves Delivered (PMD)** metric:
- **0 damage claims** → Lebensdauertabelle + CV Assessment
- **On-time arrival** → Already in Phase 5 (GPS tracking)
- **<1 hour admin effort** → Swiss Admin Autopilot expansion

---

## Next Steps

1. **Approve this plan** to begin Phase 1 (Lebensdauertabelle)
2. Start with database schema + seeding official table data
3. Build depreciation calculator library
4. Integrate with existing HandoverProtocol component
5. Test end-to-end handover flow with depreciation logic
