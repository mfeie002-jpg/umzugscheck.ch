# Operations Manual: Cherries & Chaff Execution Guide

> **Companion zu:** FOUNDER_PLAYBOOK_2026.md  
> **Fokus:** Tägliche Execution, Adversarial Rigor, Kill Switches  
> **Owner:** Founder (Ops)

---

## Part 1: 90-Day Launch & Stabilization Roadmap

### Phase 1: Validation & Data Baseline (Weeks 1–4)

**Goal:** Prove Feierabendumzug unit economics BEFORE turning on Marketplace.

| Woche | Build / Action | Measure / KPI | Stop/Go Criteria |
|-------|----------------|---------------|------------------|
| **W1** | **Setup:** Google Ads (Alpha). 1 Landing Page (Feierabend branded). **Ops:** Rent 1 truck (flex). Hire 1 Team Leader (GAV), 2 temps. **Tech:** CRM (HubSpot/Pipedrive) + call recording. | CPC: < CHF 6.00, CTR: > 3.5% | **STOP:** CPC > CHF 10 on day 1. **GO:** 1st booking within CHF 200 spend. |
| **W2** | **Sales:** Founder takes 100% calls. Script testing. **Pricing:** Flat rate only (risk mitigation). | Close Rate: > 20%, CPL: < CHF 80 | **STOP:** Close rate < 10% → Offer or Sales skill issue. |
| **W3** | **Ops:** Execute first 5 jobs. **Audit:** Time vs. Estimate. Did we lose money on labor? | Job Margin: > 20%, NPS: 10/10 (Critical) | **STOP:** Job Margin < 0% → Re-price immediately. |
| **W4** | **Review:** Calculate "True CAC" (Media + Founder Time). **Decision:** Is Direct Profitable? | Blended CAC: < CHF 150, Utilization: 40% | **GO:** If CM2 positive → Unlock Phase 2. |

---

### Phase 2: The Hybrid Switch (Weeks 5–8)

**Goal:** Activate Umzugscheck (Marketplace) to subsidize Feierabend leads.

| Woche | Build / Action | Measure / KPI | Stop/Go Criteria |
|-------|----------------|---------------|------------------|
| **W5** | **Tech:** Launch Umzugscheck LP (Generic comparison hook). **Routing:** Manual triage by Founder. **Ptnr:** Onboard 3 "Beta" partners (Zero fixed fee, 20% commission). | Marketplace CPL: < CHF 45 | **STOP:** Mktplace CPL > Direct CPL → Arbitrage failed. |
| **W6** | **Traffic:** Shift 50% budget to Marketplace keywords ("compare moving prices"). **Routing:** "Cherries" to Feierabend, "Chaff" to Partners. | Partner Accept %: > 40% | **STOP:** Partners reject >80% → Quality issue. |
| **W7** | **Process:** Install "Wizard" form (Room count, km, date). Auto-reject leads < 1.5 rooms (unless partner wants them). | Lead Qual Rate: > 30% | **GO:** Marketplace revenue covers 30% of Ad Spend. |
| **W8** | **Stress Test:** Fill Feierabend truck for End-of-Month (EOM). Sell overflow to partners at premium. | Feierabend Util: 90% (EOM), Mktplace Rev: > CHF 2k | **GO:** Scale Ads. |

---

### Phase 3: Optimization & Automation (Weeks 9–12)

**Goal:** Remove Founder from Ops/Dispatch.

| Woche | Build / Action | Measure / KPI | Stop/Go Criteria |
|-------|----------------|---------------|------------------|
| **W9** | **Hiring:** Hire Sales/Concierge Rep (Part-time). **Training:** Shadow founder for 1 week. | Rep Close Rate: > 15% | **STOP:** Rep close rate < 15% → Retrain or fire. |
| **W10** | **Pricing:** Activate Dynamic Pricing (Mid-month discounts). **Auto-Routing:** Implement Tier 1/2 logic in CRM. | Mid-Month Util: > 60% | **GO:** Mid-month fills up. |
| **W11** | **Finances:** Full P&L Review. **Audit:** Partner Churn / Disputes. | CM2: > 35%, Partner Churn: 0 | **Kill Switch:** Disputes > 5% → Pause Partner network. |
| **W12** | **Scale:** Double Ad Spend. Commit to 2nd Truck Lease. | Blended ROAS: > 400% | **GO:** Graduation to Q2. |

---

## Part 2: Unit Economics Model (Swiss Standards)

### 2.1 Blended CPL (Paid Media)

| Metric | Floor | Target | Stretch |
|--------|-------|--------|---------|
| **CPL** | CHF 55 | CHF 45 | CHF 35 |

**Formula:**
```
CPL = Total_Ad_Spend / Total_Unique_Leads (Phone + Form)
```

**Swiss Context:**
- "Umzug Zürich" CPC: CHF 6–9
- Required Landing Page CVR: >12% to hit target
- Mobile CVR typically 15-20% lower than Desktop

**Conversion Rate Sensitivity:**
| CPC | CVR 8% | CVR 10% | CVR 12% | CVR 15% |
|-----|--------|---------|---------|---------|
| CHF 6 | CHF 75 | CHF 60 | CHF 50 | CHF 40 |
| CHF 7 | CHF 88 | CHF 70 | CHF 58 | CHF 47 |
| CHF 8 | CHF 100 | CHF 80 | CHF 67 | CHF 53 |
| CHF 9 | CHF 113 | CHF 90 | CHF 75 | CHF 60 |

---

### 2.2 Lead-to-Qualified Rate

| Metric | Floor | Target | Stretch |
|--------|-------|--------|---------|
| **Qual Rate** | 30% | 40% | 50% |

**Definition (Qualified Lead):**
- ✅ >2.0 rooms
- ✅ Valid phone number (verified)
- ✅ Move date >14 days out
- ✅ Within service area

**Action if <40%:**
```
Tighten Google Ads negative keywords:
- "billig" / "günstig" / "cheap"
- "klein" / "studio" / "1 zimmer"
- "transporter mieten" / "selbst umziehen"
- "student" / "wg"
```

---

### 2.3 Close Rate (Feierabend Direct)

| Lead Type | Floor | Target | Stretch |
|-----------|-------|--------|---------|
| **Cold Leads** | 15% | 25% | 35% |
| **Warm/Concierge** | 35% | 45% | 55% |
| **Blended** | 22% | 32% | 42% |

**Swiss Benchmark:** Top tier movers convert 30-35%.

**Red Flag Analysis:**
| Close Rate | Likely Issue | Action |
|------------|--------------|--------|
| <10% | Pricing way too high | Reduce by 15%, test |
| 10-15% | Sales script weak | Founder reviews calls |
| 15-22% | Normal ramp-up | Optimize incrementally |
| 22-30% | Target performance | Maintain |
| >35% | Possibly underpriced | Test 10% increase |

---

### 2.4 CM2 per Job (Contribution Margin 2)

| Metric | Floor | Target | Stretch |
|--------|-------|--------|---------|
| **CM2** | CHF 550 | CHF 750 | CHF 950 |
| **CM2 %** | 25% | 35% | 42% |

**Formula:**
```
CM2 = Job_Revenue - (Labor_Burdened + Truck + Fuel + LSVA + Materials + Acquisition_Cost)
```

**Example Calculation (3.5 Zimmer, CHF 2'200 Job):**

```
Revenue:                          CHF 2'200
─────────────────────────────────────────────
COGS:
├── Labor (3 men × 8h × CHF 45)   CHF 1'080
├── Truck Lease (daily)           CHF   180
├── Fuel (50km × CHF 2)           CHF   100
├── LSVA                          CHF    25
├── Packing Materials             CHF    60
└── Subtotal COGS:                CHF 1'445
─────────────────────────────────────────────
Gross Margin:                     CHF   755 (34.3%)
─────────────────────────────────────────────
Acquisition:
├── Ad Spend (CPL CHF 45 / 0.3)   CHF   150
└── Subtotal Acquisition:         CHF   150
─────────────────────────────────────────────
CM2:                              CHF   605 (27.5%) ⚠️

→ Below target. Optimization needed.
```

**CM2 Improvement Levers:**

| Lever | Impact | Difficulty |
|-------|--------|------------|
| Increase price 10% | +CHF 220 | Easy (if demand allows) |
| Reduce crew to 2 men | +CHF 360 | Medium (need efficiency) |
| Improve close rate 25%→35% | +CHF 45 (lower CPA) | Medium |
| Reduce CPL 45→35 | +CHF 33 | Hard (competitive) |

---

### 2.5 Marketplace Metrics

| Metric | Floor | Target | Stretch |
|--------|-------|--------|---------|
| **Resale Rate** | 60% | 75% | 85% |
| **Fill Rate** | 1.8x | 2.2x | 2.8x |
| **Dispute Rate** | <5% | <3% | <1% |

**Definitions:**
- **Resale Rate:** % of Tier 2 leads sold to at least one partner
- **Fill Rate:** Average number of partners buying same lead
- **Dispute Rate:** % of sold leads refunded (bad number, fake, etc.)

**Dispute Threshold Alert:**
```
IF Dispute_Rate > 3%:
  → Pause Ads immediately
  → Audit lead source quality
  → Tighten form validation
  → Resume after fix verified
```

---

## Part 3: Lead Scoring & Routing Spec

### 3.1 Scoring Inputs (0-100 Points)

```
SCORING MATRIX:

Volume (Max 30 pts)
├── >3.5 Rooms:     +30
├── 2.5-3.5 Rooms:  +20
├── 2-2.5 Rooms:    +10
├── 1.5-2 Rooms:    +0
└── <1.5 Rooms:     -10 (Auto-reject trigger)

Distance (Max 20 pts)
├── >50km:          +20 (Higher value)
├── 20-50km:        +15
├── 10-20km:        +10
└── <10km:          +5

Services (Max 30 pts)
├── Packing + Unpacking:  +20
├── Reinigung requested:  +10
├── Lagerung:             +5
└── Transport only:       +0

Date Urgency (Max 20 pts / Min -50 pts)
├── Mid-month (3rd-20th): +20 (Capacity fill)
├── End-month (26th-2nd): +0 (Already full)
├── 7-14 days out:        +10
├── <7 days ("urgent"):   -20
└── "Tomorrow":           -50 (Reject)

Budget Signal (Bonus)
├── "Quality focus":      +10
├── "Best service":       +5
├── "Cheapest price":     -20
└── "Student/WG":         -30
```

### 3.2 Tier Classification & Routing

```
┌─────────────────────────────────────────────────────────────────┐
│                     LEAD ROUTING LOGIC                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  SCORE ≥ 60                    TIER 1 - "CHERRY" 🍒            │
│  ────────────────────────────────────────────────────           │
│  Route:      EXCLUSIVE to Feierabend                            │
│  Concierge:  Human call IMMEDIATELY (Founder/Rep)               │
│  SLA:        Quote sent within 2 hours                          │
│  Priority:   Callback <15 minutes during business hours         │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  SCORE 30-59                   TIER 2 - "STANDARD" 📦           │
│  ────────────────────────────────────────────────────           │
│  Route:      Marketplace - Sell to max 3 partners               │
│  Concierge:  Automated Email/SMS sequence only                  │
│  SLA:        Auto-response within 5 minutes                     │
│  Feierabend: Can bid as "backup" if utilization <60%            │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  SCORE < 30                    TIER 3 - "CHAFF" 🌾              │
│  ────────────────────────────────────────────────────           │
│  Route:      Auto-reject OR sell to "Budget Partner"            │
│  Concierge:  None                                               │
│  Price:      Flat CHF 15/lead (if sold)                         │
│  Action:     Add to nurture sequence for future                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 3.3 Routing Implementation (CRM Workflow)

```javascript
// Lead Routing Logic (Zapier/HubSpot Workflow)

function routeLead(lead) {
  const score = calculateScore(lead);
  
  if (score >= 60) {
    // TIER 1: Cherry
    return {
      tier: 1,
      destination: 'feierabend_exclusive',
      action: 'human_callback',
      sla_minutes: 15,
      notify: ['founder_phone', 'slack_urgent'],
      auto_response: templates.tier1_confirmation,
    };
  }
  
  if (score >= 30) {
    // TIER 2: Standard
    const partners = findMatchingPartners(lead, { max: 3, min_rating: 4.0 });
    return {
      tier: 2,
      destination: 'marketplace',
      partners: partners,
      action: 'auto_sequence',
      feierabend_backup: getUtilization() < 0.6,
      auto_response: templates.tier2_comparison,
    };
  }
  
  // TIER 3: Chaff
  const budgetPartner = findBudgetPartner(lead);
  return {
    tier: 3,
    destination: budgetPartner ? 'budget_sale' : 'reject',
    price: 15,
    action: 'nurture_sequence',
    auto_response: templates.tier3_alternatives,
  };
}
```

### 3.4 Concierge Escalation Triggers

| Trigger | Condition | Action | SLA |
|---------|-----------|--------|-----|
| **High Value** | Est. Revenue > CHF 4k | Founder callback | <30 min |
| **B2B Signal** | "Firma", "Büro", "Geschäft" detected | Sales Rep callback | <1h |
| **Edge Score** | Score 55-65 (borderline) | Human evaluation | <2h |
| **Callback Request** | Customer explicitly requested | Priority queue | <1h |
| **Repeat Visitor** | 3+ form submissions | Friction resolution | <1h |
| **Complaint** | Any negative sentiment | Escalation to Founder | <30 min |

---

## Part 4: Capacity & Utilization Model (Feierabend)

### 4.1 Crew Capacity Definition

```
1 CREW CONFIGURATION:
├── Personnel: 1 Team Leader + 2 Movers (GAV compliant)
├── Vehicle:   7.5t Box Truck (or 3.5t Sprinter for small jobs)
├── Max Volume: 35 m³ / day
├── Max Distance: 60 km one-way (for day return)
└── Equipment: Dollies, blankets, straps, basic tools

CAPACITY METRICS:
├── Revenue Days/Month:     21 (excl. Sundays, holidays)
├── Avg Jobs/Day:           1.3 (some days 2 small, some 1 large)
├── Max Jobs/Month:         ~27
├── Avg Revenue/Day:        CHF 2'140
└── Max Revenue/Month:      CHF 45'000 (at 100% utilization)

COST STRUCTURE:
├── Team Leader (GAV):      CHF 5'200/month (fully burdened)
├── 2 Movers (GAV):         CHF 7'800/month (fully burdened)
├── Truck Lease:            CHF 1'400/month
├── Fuel (avg):             CHF 800/month
├── Insurance (all):        CHF 600/month
├── Materials:              CHF 400/month
├── Maintenance Reserve:    CHF 300/month
└── TOTAL FIXED:            CHF 16'500/month
```

### 4.2 Utilization Thresholds

```
UTILIZATION ZONES:

           ┌──────────────────────────────────────────┐
   100% ───┤ ⚠️ OVER-UTILIZED                        │
           │ Risk: Burnout, errors, bad reviews       │
           │ Action: Reject new bookings              │
    95% ───┼──────────────────────────────────────────┤
           │ 🔵 STRETCH                               │
           │ Action: Plan Crew #2 hiring              │
    85% ───┼──────────────────────────────────────────┤
           │ 🟢 TARGET                                │
           │ Jobs: 18-22/month                        │
           │ Revenue: CHF 38k-47k                     │
    75% ───┼──────────────────────────────────────────┤
           │ 🟡 ACCEPTABLE                            │
           │ Jobs: 14-17/month                        │
           │ Action: Increase marketing slightly      │
    60% ───┼──────────────────────────────────────────┤
           │ 🟠 BREAKEVEN                             │
           │ Jobs: 13/month = CHF 27k = covers fixed  │
           │ Action: Activate discounts               │
    50% ───┼──────────────────────────────────────────┤
           │ 🔴 CRITICAL                              │
           │ Action: Emergency pricing (-15%)         │
           │ Action: Partner overflow bidding         │
     0% ───└──────────────────────────────────────────┘
```

### 4.3 Dynamic Pricing by Utilization

| Zone | Utilization | Pricing Action | Example (Base CHF 180/hr) |
|------|-------------|----------------|---------------------------|
| 🔴 Critical | <50% | -15% discount, aggressive marketing | CHF 153/hr |
| 🟠 Breakeven | 50-60% | -10% discount for mid-month | CHF 162/hr |
| 🟡 Acceptable | 60-75% | Standard pricing | CHF 180/hr |
| 🟢 Target | 75-85% | Standard, no discounts | CHF 180/hr |
| 🔵 Stretch | 85-95% | +15% peak surcharge | CHF 207/hr |
| ⚠️ Over | >95% | +25% or waitlist only | CHF 225/hr |

### 4.4 Calendar Rules

```
BOOKING RULES:

Max Bookings:
├── 2 jobs/day maximum (no triple-booking)
├── 1 buffer slot/week reserved for emergencies
└── No bookings >8 weeks out (capacity uncertain)

Minimum Lead Time:
├── Standard: 48h minimum
├── Express (<48h): +25% surcharge + Concierge approval
├── Same-day: Reject (quality/availability risk)
└── Exception: Concierge can override for Tier 1

Deposit Rules:
├── Booking confirmed with 30% deposit
├── Deposit due: 7 days before move
├── Non-refundable if cancelled <72h before
└── Full refund if cancelled >7 days before

Crew Scheduling:
├── Team Leader assigns jobs weekly (Friday for next week)
├── Buffer: 1 unassigned day for last-minute Tier 1
└── Overtime: Max 2h/day, requires Founder approval
```

### 4.5 Crew #2 Scaling Trigger

```
SCALE TRIGGER CHECKLIST:

Financial Readiness:
[ ] CM2 Crew #1 ≥ CHF 12'000/month (sustained 3 months)
[ ] Cash reserve ≥ CHF 50k (3 months Crew #2 costs)
[ ] Revenue trend: +10% MoM for 2 consecutive months

Operational Readiness:
[ ] Utilization Crew #1 ≥ 85% for 4 consecutive weeks
[ ] Team Leader can train new crew (documented SOP)
[ ] CRM/Routing can handle 2x volume

Pipeline Readiness:
[ ] Lead pipeline ≥ 60 Tier-1 leads/month
[ ] Partner network can absorb additional overflow
[ ] No major quality issues (Disputes <3%)

Timeline:
├── Decision: Week 8 (if triggers met)
├── Job posting: Week 9
├── Hiring: Week 10-11
├── Training: Week 11-12
├── Go-live: Week 13 (Q2 start)
└── Total lead time: 5-6 weeks
```

---

## Part 5: Partner Network Plan (Umzugscheck)

### 5.1 Network Density Strategy

```
ZURICH FOCUS (Priority Market):

Canton Zürich: 5-7 Partners MAX
├── Rationale: Scarcity drives lead value
├── Segmentation:
│   ├── 2 Premium Partners (Elite badge, first access)
│   ├── 3 Standard Partners (normal rotation)
│   └── 1-2 Budget Partners (Tier 3 outlet)
└── Exclusivity: No overlap in specialties

Aargau / Zug: 2-3 Partners each
├── Rationale: Overflow from Zurich
└── Type: Generalists preferred

Rest of CH: 1 National Franchise Partner
├── Rationale: Low-touch, volume play
├── Examples: Movu-affiliated, large chains
└── Pricing: Lower CPL (CHF 30) for lower quality leads
```

### 5.2 Partner ROI Model

**Target: Partner achieves 6-8x ROAS on lead spend**

```
PARTNER ROI CALCULATION:

Input Assumptions:
├── Lead Cost (CPL):     CHF 40
├── Leads/Month:         15
├── Monthly Spend:       CHF 600
├── Close Rate:          20% (1 in 5)
├── Jobs Won:            3/month
├── Avg Job Value:       CHF 1'500
└── Partner Margin:      35%

ROI Calculation:
├── Gross Revenue:       3 × CHF 1'500 = CHF 4'500
├── Partner Margin:      CHF 4'500 × 35% = CHF 1'575
├── Lead Cost:           CHF 600
├── Net Profit:          CHF 975
└── ROAS:                CHF 1'575 / CHF 600 = 2.6x ❌

→ Below 6x target. Need to improve.

IMPROVEMENT OPTIONS:
├── Option A: Lower CPL to CHF 25 → ROAS = 4.2x
├── Option B: Improve partner close rate to 30% → ROAS = 3.9x
├── Option C: Higher job value (CHF 2'200) → ROAS = 3.9x
├── Option D: All combined → ROAS = 7.8x ✅
└── Option E: Better lead quality (Tier 1.5) → Higher close rate
```

### 5.3 Partner Tier System

```
PARTNER TIERS:

BRONZE (New Partners)
├── Requirements:
│   ├── UID verified
│   ├── Min 3.5 Google Rating
│   ├── GAV compliance confirmed
│   └── Insurance proof uploaded
├── Benefits:
│   ├── Standard lead allocation
│   ├── CPL: CHF 45 (standard)
│   └── Support: Email only
├── Upgrade Path:
│   └── After 3 months + 20 jobs + 4.0 rating

SILVER (Established)
├── Requirements:
│   ├── 4.0+ Google Rating
│   ├── 80% Fill Rate (accept offers)
│   └── 3+ months active
├── Benefits:
│   ├── +20% lead allocation
│   ├── CPL: CHF 40.50 (-10%)
│   └── Support: Email + Phone
├── Upgrade Path:
│   └── After 6 months + 50 jobs + 4.3 rating

GOLD (Premium Partners)
├── Requirements:
│   ├── 4.3+ Google Rating
│   ├── 85% Fill Rate
│   ├── 6+ months active
│   └── Zero disputes in 3 months
├── Benefits:
│   ├── First access to Tier 1 overflow
│   ├── CPL: CHF 36 (-20%)
│   ├── Dedicated Account Manager
│   ├── "Empfohlener Partner" badge
│   └── Quarterly strategy calls
└── Special: Feierabend overflow jobs (exclusive)
```

### 5.4 Anti-Churn & Anti-Leakage Measures

| Risk | Detection | Prevention | Enforcement |
|------|-----------|------------|-------------|
| **Direct Poaching** | Partner offers "book direct" discount | 12-month non-compete clause | Mystery shopping 10% of leads |
| **Cherry-Picking** | Partner only accepts "easy" leads | Minimum 70% accept rate required | Auto-suspend if <60% for 2 weeks |
| **Undercutting** | Partner quotes below GAV floor | Price floor in contract (CHF 50/m³) | Quarterly price audit |
| **Bad Reviews** | Partner's rating drops | Minimum 4.0 Google requirement | Monthly rating check, suspend if <3.8 |
| **Capacity Lies** | Partner claims "full" to avoid leads | Real-time calendar sync required | Booking confirmation tracking |
| **Lead Selling** | Partner resells our leads | Unique lead IDs, tracking pixels | Conversion attribution monitoring |

**Enforcement Actions:**
```
WARNING LEVELS:

Level 1 (Yellow Card):
├── Trigger: 1 violation
├── Action: Written warning, 1 week probation
└── Documentation: Logged in CRM

Level 2 (Orange Card):
├── Trigger: 2 violations in 3 months
├── Action: Lead allocation reduced 50%
└── Duration: 1 month

Level 3 (Red Card):
├── Trigger: 3 violations OR 1 severe violation
├── Action: Immediate suspension
├── Appeal: 30-day review period
└── Blacklist: If fraud confirmed
```

---

## Part 6: Seasonal Pricing Plan (Dynamic Yield)

### 6.1 Base Price Structure

**Base Rate:** CHF 180/hr (3 Men + Truck)

### 6.2 Time-of-Month Modifiers

```
MONTHLY PRICING LADDER:

     │
+25% ─┤                                           ████████
     │                                     ███████
+15% ─┤                              ██████
     │                        ██████
+10% ─┤                  █████       
     │            ██████             ████████████████
  0% ─┤     █████                                           
     │█████                                             ████
-10% ─┤
     │
-15% ─┼────────────────────────────────────────────────────
      1    5    10   15   20   25   26   28   30    2
                     Day of Month
```

| Period | Days | Modifier | Rate/hr | Reasoning |
|--------|------|----------|---------|-----------|
| **Monatsanfang** | 1-2 | +10% | CHF 198 | Mietbeginn-Rush |
| **Early** | 3-5 | 0% | CHF 180 | Normal |
| **Low Demand** | 6-10 | -10% | CHF 162 | Fill capacity |
| **Mid-Month** | 11-20 | 0% | CHF 180 | Standard |
| **Pre-End** | 21-25 | +10% | CHF 198 | Building demand |
| **End-Month** | 26-28 | +20% | CHF 216 | High demand |
| **Kündigungstermin** | 29-31 | +25% | CHF 225 | Peak scarcity |

### 6.3 Seasonal Modifiers

```
ANNUAL SEASONALITY:

Month     Demand   Modifier   Rate/hr   Notes
───────────────────────────────────────────────────
Jan       ████░░░  -15%       CHF 153   Dead season
Feb       █████░░  -10%       CHF 162   Still slow
Mar       ██████░  -5%        CHF 171   Ramp-up starts
Apr       ███████  +5%        CHF 189   Spring surge
Mai       ████████ +10%       CHF 198   Peak begins
Jun       █████████ +15%      CHF 207   Peak (highest)
Jul       ████████ +10%       CHF 198   Peak continues
Aug       ███████  +5%        CHF 189   Summer tail
Sep       ███████  +5%        CHF 189   School start
Okt       ██████░  0%         CHF 180   Normalizing
Nov       █████░░  -10%       CHF 162   Slowing
Dez       ████░░░  -10%       CHF 162   Holidays
```

### 6.4 Combined Pricing Matrix

**Final Rate = Base × Seasonal Modifier × Day-of-Month Modifier**

Example: June 29th (Peak season + End-of-month)
```
Base:        CHF 180
Seasonal:    +15% → CHF 207
Day Modifier: +25% → CHF 259
─────────────────────────────
Final Rate:  CHF 259/hr
```

### 6.5 Customer Communication Templates

```
PEAK PRICING (Positive Framing):

"Ihr gewählter Termin am 29. Juni liegt in unserer Hochsaison.
Um beste Qualität zu garantieren, berechnen wir einen saisonalen
Zuschlag von 15%.

💡 Sparen Sie bis zu CHF 400:
   → Verfügbar am 12. Juni zum Standardpreis
   → Verfügbar am 15. Juni zum Standardpreis

Sollen wir einen dieser Alternativtermine reservieren?"

────────────────────────────────────────────────────────

DISCOUNT OFFER (Low Season):

"Gute Nachricht! Für Ihren Wunschtermin am 8. Februar
bieten wir aktuell unseren Winter-Spezialpreis:

🎁 15% Rabatt auf den Gesamtpreis

Dieser Preis ist garantiert und gilt bei Buchung
innerhalb der nächsten 48 Stunden."
```

---

## Part 7: Risk Register

### 7.1 Top 10 Operational Risks

| Rank | Risk | Impact | Probability | Mitigation | Owner |
|------|------|--------|-------------|------------|-------|
| **1** | GAV Wage Spike | Margin erosion 5-10% | Medium | EOM premiums mandatory; automate estimates | Founder |
| **2** | Google CPC > CHF 12 | CAC > CHF 200 | High (2026) | SEO "Checklisten" keywords; Meta retargeting | Marketing |
| **3** | "Fake Profitability" | Cash crunch | Medium | Weekly CM2 tracking, not just revenue | Finance |
| **4** | Partner Revolt | Marketplace collapse | Low | Monthly lead quality reviews; partner NPS | Partner Mgr |
| **5** | Truck Breakdown | Reputation damage | Low | Lease with 24h replacement (Mercedes CharterWay) | Ops |
| **6** | Damage Claims | 3-5% revenue loss | Medium | CHF 1k customer deductible; standard packing SOP | Ops |
| **7** | Founder Burnout | Business failure | High | Force Sales Rep hire by Month 3 | Founder |
| **8** | LSVA Increases | Cost creep 2-3% | Medium | Fleet optimization; route planning; <3.5t for local | Ops |
| **9** | No-Shows (Customer) | Lost ops cost | Medium | 30% deposit required; non-refundable <72h | Sales |
| **10** | Bad Reviews | Conversion drop 20%+ | Medium | Auto "Post-Move" SMS; CHF 50 resolution discount | Ops |

### 7.2 Kill Switch Checklist

```
IMMEDIATE ACTION TRIGGERS:

🔴 PAUSE GOOGLE ADS:
   [ ] Blended CPL > CHF 90 (rolling 7-day average)
   [ ] ROAS < 250% for 2 consecutive weeks
   [ ] Dispute rate > 8%

🔴 STOP OPERATIONS (FEIERABEND):
   [ ] Claims rate > 5% of revenue
   [ ] Team Leader quits without backup
   [ ] Serious injury on job

🔴 SUSPEND PARTNER NETWORK:
   [ ] Partner refund rate > 15%
   [ ] 3+ partner complaints in 1 week
   [ ] Partner caught poaching leads

🔴 EMERGENCY CAPITAL CALL:
   [ ] Cash reserve < 1 month opex (CHF 20k)
   [ ] CM2 negative for 4 consecutive weeks
   [ ] Utilization < 40% for 4 consecutive weeks

🔴 CONSIDER LIQUIDATION:
   [ ] All kill switches triggered simultaneously
   [ ] No path to profitability within 90 days
   [ ] Founder health/capacity compromised
```

---

## Part 8: Adversarial Rigor & Self-Critique

### 8.1 10 Weakest Assumptions with Validation Tests

| # | Assumption | Test Method | Timeline | Fail Decision |
|---|------------|-------------|----------|---------------|
| 1 | "CPL CHF 45 achievable" | Run Google Ads 5 days, cap CHF 500. Need 11+ leads. | W1 | If CPL >60: Shift to SEO/Social |
| 2 | "Partners pay CHF 40/lead" | Cold call 10 movers. Offer 5 free leads. Measure conversion. | Pre-launch | If rejected: Lower to CHF 25, increase volume |
| 3 | "Founder closes 40%" | Track first 20 calls. Need 8+ bookings. | W2 | If <8: Hire sales trainer immediately |
| 4 | "EOM +25% won't kill CVR" | A/B test pricing on 28th-30th quotes | W3-4 | If CVR drops >30%: Reduce to +10% |
| 5 | "3.5 rooms fits in 1 truck" | Force video survey for all Tier 1 leads | W3 | If 20%+ overflows: Mandatory on-site for >3.5 |
| 6 | "Concierge ROI positive" | Track CVR with/without phone for Tier 2 | W6-8 | If no difference: Auto-only for Tier 2 |
| 7 | "Partners won't steal" | Mystery shop own partners monthly | Ongoing | If caught: Ban, legal action |
| 8 | "January won't kill us" | Check Google Trends historic volume | Pre-launch | If -60%: Save 3 months Summer cash |
| 9 | "Claims <1%" | Monitor first 10 jobs closely | W3-4 | If >3%: Increase deductible or fire movers |
| 10 | "GAV labor available" | Post job ad now. Measure applicant flow. | Pre-launch | If none: Use temp agencies (lower margin) |

### 8.2 Minimal Data Collection Setup

```
TECH STACK (Lean):

Entry:      Typeform / Tally (Free tier)
Routing:    Zapier (Starter plan CHF 20/mo)
CRM:        Google Sheets → HubSpot Free
Alerts:     Slack (Free)
Calling:    Aircall / Standard Mobile
Analytics:  Google Analytics 4 (Free)

REQUIRED FIELDS (Lead Form):
├── Name (First, Last)
├── Phone (validated Swiss format)
├── Email
├── Move Date
├── From PLZ
├── To PLZ
├── Room Count (dropdown)
├── Estimated Volume (optional, m³)
├── Floor (From) + Elevator Y/N
├── Floor (To) + Elevator Y/N
├── Services (checkboxes)
└── How did you find us? (UTM passthrough)

DASHBOARD (Google Sheets):
├── Tab 1: Leads (raw data)
├── Tab 2: Scoring (auto-calculated)
├── Tab 3: Pipeline (Feierabend)
├── Tab 4: Marketplace (Partner sales)
├── Tab 5: Financials (Revenue, Costs, CM2)
└── Tab 6: KPIs (Automated charts)
```

### 8.3 Weekly Review Template

```
FRIDAY 16:00 - WEEKLY REVIEW (30 min)

1. LEAD METRICS (5 min)
   [ ] Total leads this week: ___
   [ ] Qualified leads: ___ (___ %)
   [ ] CPL: CHF ___
   [ ] vs. Target: ⬆️ / ➡️ / ⬇️

2. SALES METRICS (5 min)
   [ ] Quotes sent: ___
   [ ] Bookings: ___
   [ ] Close rate: ___ %
   [ ] Pipeline value: CHF ___

3. OPS METRICS (5 min)
   [ ] Jobs completed: ___
   [ ] Utilization: ___ %
   [ ] Revenue: CHF ___
   [ ] Claims/Issues: ___

4. MARKETPLACE (5 min)
   [ ] Leads sold: ___
   [ ] Revenue: CHF ___
   [ ] Partner fill rate: ___ %
   [ ] Disputes: ___

5. FINANCIALS (5 min)
   [ ] Gross Revenue: CHF ___
   [ ] CM2: CHF ___ (___ %)
   [ ] Cash position: CHF ___
   [ ] Runway: ___ weeks

6. DECISIONS (5 min)
   [ ] Stop/Go status: 🟢 / 🟡 / 🔴
   [ ] Top priority next week: ___________
   [ ] Blockers: ___________
   [ ] Help needed: ___________
```

---

## Appendix A: Quick Reference Cards

### A.1 Lead Scoring Cheat Sheet

```
QUICK SCORE:

+30  >3.5 Zimmer
+20  2.5-3.5 Zimmer
+20  Packing Service
+20  Mid-month date
+20  >50km distance
+10  Reinigung
+10  Quality buyer
─────────────────
-10  <1.5 Zimmer
-20  "Cheapest" buyer
-50  "Tomorrow" move
─────────────────

TIER 1: Score ≥60 → Feierabend
TIER 2: Score 30-59 → Partners
TIER 3: Score <30 → Reject/Budget
```

### A.2 Pricing Quick Reference

```
BASE: CHF 180/hr

UTILIZATION:
  <50%: -15% (CHF 153)
  <60%: -10% (CHF 162)
  <75%: Standard
  >85%: +15% (CHF 207)
  >95%: +25% (CHF 225)

TIME OF MONTH:
  1-2:   +10%
  6-10:  -10%
  26-28: +20%
  29-31: +25%

SEASON:
  Jan-Feb: -15%
  Jun-Jul: +15%
```

### A.3 Kill Switch Quick Check

```
🔴 STOP ADS:      CPL >90 (7d avg)
🔴 STOP OPS:      Claims >5%
🔴 STOP PARTNERS: Refunds >15%
🔴 CASH CALL:     <1 month runway
```

---

*Operations Manual v1.0*  
*Companion to: FOUNDER_PLAYBOOK_2026.md*  
*Review Cycle: Weekly (Friday 16:00)*
