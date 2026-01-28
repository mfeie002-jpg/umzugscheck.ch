# Founder Playbook: Cherries & Chaff Operating Plan 2026

> **Version:** 1.0  
> **Gültig ab:** Q1 2026  
> **Review-Zyklus:** Wöchentlich (Freitag 16:00)  
> **Owner:** Founder

---

## Executive Summary

**Modell:** Hybrid Acquisition Engine
- **Umzugscheck.ch** = Lead-Akquisitionsmaschine (Volumen, Qualifizierung, Routing)
- **Feierabend-Umzug** = Premium-Operator mit First Right of Refusal auf Tier-1-Leads
- **Partner-Netzwerk** = Capacity Overflow für Tier-2 und Saisonspitzen

**North Star Metric:** CM2 pro Arbeitsstunde ≥ CHF 85

---

## 1. 90-Tage-Roadmap (W1–W12)

### Phase 1: Foundation (Woche 1–4)

| Woche | Milestone | Build | Measure | Stop/Go-Kriterium |
|-------|-----------|-------|---------|-------------------|
| **W1** | Lead Scoring Live | Lead-Scoring-Algorithmus V1, Tier-1/2-Routing | Scoring-Accuracy (Sample n=20) | ≥70% korrekte Tier-Zuweisung → GO |
| **W2** | Feierabend CRM Setup | Kapazitätskalender, Crew-Zuweisung, Job-Tracking | Dateneingabe-Zeit pro Lead | <3 Min/Lead → GO |
| **W3** | Partner Onboarding V1 | 5 Pilotpartner (ZH, AG, BE), Verträge, Portal-Zugang | Partner-Aktivierungsrate | ≥4/5 aktiv → GO |
| **W4** | Paid Media Launch | Google Ads Kampagnen (Brand + Generic ZH), Tracking | CPL, CTR, Conv.-Rate | CPL <CHF 55 → GO |

**Phase 1 Gate:** 
- ✅ Lead Scoring funktioniert mit ≥70% Accuracy
- ✅ Feierabend kann 3 Jobs/Woche abwickeln
- ✅ Mindestens 4 aktive Partner
- ❌ Falls nicht erreicht: 2 Wochen Iteration, kein Scale

---

### Phase 2: Traction (Woche 5–8)

| Woche | Milestone | Build | Measure | Stop/Go-Kriterium |
|-------|-----------|-------|---------|-------------------|
| **W5** | Volume Ramp | Paid Media +50% Budget, SEO Quick Wins | Lead-Volumen, Qualified-Rate | ≥40 Leads/Woche → GO |
| **W6** | Concierge Filtering | Human Concierge für CHF 2k+ Leads, Callback <2h | Qualification-Rate, NPS | Qual-Rate ≥45% → GO |
| **W7** | Partner Expansion | +8 Partner (LU, SG, BS, Ostschweiz) | Fill-Rate, Partner-Response | Fill-Rate ≥70% → GO |
| **W8** | Feierabend Crew #2 | Zweites Crew eingestellt/trainiert | Utilization Crew 1 + 2 | Util ≥75% → GO |

**Phase 2 Gate:**
- ✅ 50+ qualifizierte Leads/Woche
- ✅ Feierabend Close-Rate ≥35%
- ✅ Partner Fill-Rate ≥70%
- ❌ Falls CPL >CHF 65: Pause Paid, Focus SEO

---

### Phase 3: Scale (Woche 9–12)

| Woche | Milestone | Build | Measure | Stop/Go-Kriterium |
|-------|-----------|-------|---------|-------------------|
| **W9** | Dynamic Pricing Live | Saisonale Preislogik, End-of-Month Premium | Revenue/Job, Margin | CM2/Job ≥CHF 650 → GO |
| **W10** | Automation Push | Auto-Routing Tier-2, Partner-Matching-Algo | Manual Touchpoints/Lead | <2 Touches/Lead → GO |
| **W11** | Canton Expansion | +5 Kantone (TI, VS, GR via Partner) | Geographic Coverage | ≥60% CH-Bevölkerung → GO |
| **W12** | Q1 Review & Plan | Retrospektive, Q2-Planung, Investor-Update | All KPIs vs. Target | Break-Even-Pfad klar → GO |

**Phase 3 Gate:**
- ✅ Blended CPL ≤CHF 52
- ✅ CM2 pro Job ≥CHF 650
- ✅ Feierabend Utilization ≥80%
- ✅ Partner Network ≥15 aktive Partner

---

## 2. Unit Economics Model

### 2.1 Target Ranges (Konservativ)

| Metrik | Floor | Target | Stretch | Formel |
|--------|-------|--------|---------|--------|
| **Blended CPL** | CHF 65 | CHF 52 | CHF 42 | `(Google Spend + Meta Spend) / Total Leads` |
| **Lead-to-Qualified Rate** | 35% | 45% | 55% | `Qualified Leads / Total Leads` |
| **Qualified-to-Opportunity Rate** | 60% | 70% | 80% | `Opportunities / Qualified Leads` |
| **Close Rate (Feierabend)** | 30% | 40% | 50% | `Won Jobs / Feierabend Opportunities` |
| **Close Rate (Partner)** | 20% | 28% | 35% | `Won Jobs / Partner Opportunities` |
| **CM2 per Job (Feierabend)** | CHF 550 | CHF 750 | CHF 950 | `Revenue - COGS - Variable Costs` |
| **CM2 per Lead (Partner)** | CHF 25 | CHF 38 | CHF 50 | `CPL Revenue - Acquisition Cost` |
| **Marketplace Fill Rate** | 65% | 78% | 88% | `Filled Leads / Total Partner Leads` |
| **Dispute/Refund Rate** | <5% | <2% | <1% | `Disputes / Total Jobs` |
| **Partner Churn (Monthly)** | <8% | <4% | <2% | `Lost Partners / Total Partners` |

### 2.2 Funnel Economics (Beispielrechnung)

```
1000 Leads (Blended CPL CHF 52)           = CHF 52'000 Acquisition Cost
├── 450 Qualified (45%)
│   ├── 135 Tier-1 → Feierabend (30%)
│   │   ├── 54 Closed (40% CR)
│   │   │   └── 54 Jobs × CHF 2'400 avg = CHF 129'600 Revenue
│   │   │   └── 54 Jobs × CHF 750 CM2   = CHF 40'500 Contribution
│   │   └── 81 Lost/Declined
│   │       └── Resold to Partners      = CHF 3'240 (81 × CHF 40)
│   │
│   └── 315 Tier-2 → Partners (70%)
│       ├── 246 Filled (78% Fill Rate)
│       │   └── 246 × CHF 45 avg CPL    = CHF 11'070 Revenue
│       └── 69 Unfilled
│           └── Refund/Credit           = CHF 0

Total Revenue:   CHF 143'910
Total CM2:       CHF 54'810
CM2 Margin:      38.1%
CM2 per Lead:    CHF 54.81
ROAS:            2.76x
```

### 2.3 Break-Even Calculation

```
Fixed Costs (Monthly):
├── Feierabend Crew (2 FTE)       CHF 14'000
├── Marketing/Ops Person          CHF 8'000
├── Tech/Hosting                  CHF 800
├── Insurance/Legal               CHF 1'200
├── Office/Tools                  CHF 1'000
└── Buffer (10%)                  CHF 2'500
= Total Fixed                     CHF 27'500

Break-Even Leads Required:
CHF 27'500 / CHF 54.81 = 502 Leads/Monat
= 126 Leads/Woche
= 18 Leads/Tag
```

---

## 3. Lead Scoring & Routing Specification

### 3.1 Scoring Inputs & Weights

| Input | Weight | Scoring Logic |
|-------|--------|---------------|
| **Zimmeranzahl** | 15% | 1-2: 20pts, 3-3.5: 60pts, 4-4.5: 85pts, 5+: 100pts |
| **Volumen (m³)** | 20% | <20: 15pts, 20-40: 50pts, 40-60: 80pts, 60+: 100pts |
| **Distanz (km)** | 10% | <15: 100pts, 15-30: 80pts, 30-50: 60pts, >50: 40pts |
| **Services gewählt** | 15% | Nur Transport: 30pts, +Packing: 60pts, +Reinigung: 85pts, Full-Service: 100pts |
| **Umzugsdatum** | 15% | <7 Tage: 100pts, 7-14: 80pts, 14-30: 60pts, >30: 40pts |
| **Budget-Indikator** | 15% | <1500: 20pts, 1500-2500: 60pts, 2500-4000: 85pts, >4000: 100pts |
| **Urgency Signals** | 10% | Callback requested: +30pts, Weekend call: +20pts, Multiple form visits: +15pts |

### 3.2 Tier Classification

```
TIER-1 (Feierabend First Right)
├── Score ≥ 75
├── AND Volume ≥ 30m³ OR Services ≥ 3
├── AND Distance ≤ 40km (Feierabend Service Area)
├── AND Budget-Indikator ≥ CHF 2'000
└── Expected Job Value: CHF 2'200+

TIER-2 (Partner Network)
├── Score 45-74
├── OR Distance > 40km
├── OR Budget < CHF 2'000
└── Expected Job Value: CHF 800-2'200

TIER-3 (Low Priority / Self-Service)
├── Score < 45
├── OR 1-Zimmer ohne Services
├── OR >60 Tage Vorlauf
└── → Automated Email Nurture, no human touch
```

### 3.3 Routing Logic

```python
def route_lead(lead):
    score = calculate_score(lead)
    
    if score >= 75 and is_feierabend_area(lead.from_postal):
        # TIER-1: Feierabend First Right
        if feierabend_has_capacity(lead.move_date):
            return assign_to_feierabend(lead, priority="high")
        else:
            # Overflow to Premium Partners
            return assign_to_partner(lead, tier="premium", min_rating=4.5)
    
    elif score >= 45:
        # TIER-2: Partner Network
        partners = find_matching_partners(lead)
        if len(partners) >= 3:
            return broadcast_to_partners(lead, partners[:5])
        else:
            # Concierge manual matching
            return assign_to_concierge(lead, reason="low_partner_match")
    
    else:
        # TIER-3: Automated Nurture
        return add_to_nurture_sequence(lead)
```

### 3.4 Human Concierge Triggers

**Automatisch → Concierge eskalieren wenn:**

| Trigger | Reason | SLA |
|---------|--------|-----|
| Budget ≥ CHF 5'000 | High-Value Opportunity | Callback <1h |
| "Firmenumzug" detected | B2B Upsell | Callback <2h |
| Score 70-79 + Premium Services | Edge Case, worth human eval | Callback <4h |
| Customer requested callback | Explicit intent | Callback <2h |
| 2+ form submissions same email | High intent, friction | Callback <2h |
| Complaint/Issue mentioned | Reputation risk | Callback <30min |

**Concierge Kapazität:** 1 Person = max 40 Calls/Tag = 25 qualifizierte Leads

---

## 4. Capacity & Utilization Model (Feierabend)

### 4.1 Crew Definition

```
1 CREW = 2 Personen + 1 Fahrzeug (7.5t)

Kapazität pro Crew:
├── Jobs/Tag:        1.5 (durchschnittlich)
├── Jobs/Woche:      6-7 (Mo-Sa)
├── Jobs/Monat:      26-28
├── Max Volume/Tag:  35 m³
└── Max Distanz:     60 km (one-way)

Crew Cost Structure:
├── Löhne (2 FTE):   CHF 7'000/Monat
├── Fahrzeug:        CHF 1'800/Monat (Leasing + Fuel + Maint)
├── Versicherung:    CHF 600/Monat
├── Material:        CHF 400/Monat
└── Total:           CHF 9'800/Monat
```

### 4.2 Utilization Targets

| Level | Utilization | Jobs/Monat | Revenue | CM2 | Status |
|-------|-------------|------------|---------|-----|--------|
| **Kritisch** | <60% | <16 | <CHF 38k | <CHF 5k | 🔴 Pricing senken |
| **Akzeptabel** | 60-75% | 16-20 | CHF 38-48k | CHF 5-8k | 🟡 Optimieren |
| **Target** | 75-85% | 20-24 | CHF 48-58k | CHF 8-12k | 🟢 Halten |
| **Stretch** | 85-95% | 24-27 | CHF 58-65k | CHF 12-15k | 🔵 Crew #2 planen |
| **Überlastet** | >95% | >27 | >CHF 65k | - | ⚠️ Qualitätsrisiko |

### 4.3 Yield Management Rules

```
PRICING MODIFIERS:

Base Price = Volume × CHF 65/m³ + Distance × CHF 2.50/km + Services

Utilization-Based:
├── Util <60%:  -15% Rabatt anbieten
├── Util 60-75%: Standard Pricing
├── Util 75-85%: +10% Premium möglich
├── Util >85%:   +20% Premium, oder Waitlist
└── Util >95%:   Keine neuen Buchungen

Time-Based:
├── <48h Vorlauf:    +25% (Urgency Premium)
├── Wochenende:      +15%
├── End-of-Month:    +20% (siehe Seasonal Pricing)
├── Feiertage:       +30%
└── Low Season (Jan-Feb): -10%

Calendar Rules:
├── Max 2 Jobs/Tag pro Crew
├── Buffer: 1 Slot/Woche für Notfälle
├── Keine Buchungen >8 Wochen im Voraus (Kapazität unsicher)
└── Mindestvorlauf: 48h (sonst Concierge-Freigabe)
```

### 4.4 Crew Scaling Trigger

```
SCALE TO CREW #2 WHEN:
├── Utilization Crew #1 ≥ 85% für 4 konsekutive Wochen
├── AND Lead Pipeline ≥ 50 Tier-1 Leads/Monat
├── AND CM2 Crew #1 ≥ CHF 10'000/Monat
├── AND Cash Reserve ≥ 3 Monate Crew-Kosten (CHF 30k)

LEAD TIME: 6-8 Wochen (Hiring + Training)
```

---

## 5. Partner Network Plan

### 5.1 Partner Density by Canton

| Kanton | Bevölkerung | Target Partner | Priority | Phase |
|--------|-------------|----------------|----------|-------|
| **Zürich** | 1.6M | 8-10 | 🔴 Critical | W1-4 |
| **Bern** | 1.0M | 5-6 | 🔴 Critical | W1-4 |
| **Aargau** | 700k | 4-5 | 🔴 Critical | W1-4 |
| **Luzern** | 420k | 3-4 | 🟡 Important | W5-8 |
| **St. Gallen** | 520k | 3-4 | 🟡 Important | W5-8 |
| **Basel-Stadt/Land** | 500k | 3-4 | 🟡 Important | W5-8 |
| **Thurgau** | 280k | 2 | 🟢 Nice-to-have | W9-12 |
| **Zug** | 130k | 1-2 | 🟢 Nice-to-have | W9-12 |
| **Tessin** | 350k | 2-3 | 🟢 Nice-to-have | W9-12 |
| **Rest** | 2.5M | 8-10 | 🔵 Opportunistic | Q2+ |

**Total Target:** 40-50 Partner bis Ende Q2 2026

### 5.2 Partner ROI Model

```
MINIMUM PARTNER ROI TARGET: 6x (konservativ) - 8x (target)

Example Calculation (Small Partner):
├── Monthly Subscription:     CHF 0 (CPL-Modell)
├── Leads Purchased:          15/Monat
├── CPL Average:              CHF 45
├── Monthly Lead Cost:        CHF 675
│
├── Close Rate (Partner):     28%
├── Jobs Won:                 4.2/Monat
├── Avg Job Value:            CHF 1'800
├── Gross Revenue:            CHF 7'560
│
├── Partner Margin (~35%):    CHF 2'646
├── Net after Lead Cost:      CHF 1'971
│
└── ROI = CHF 2'646 / CHF 675 = 3.9x ❌ (under target)

ADJUSTMENT NEEDED:
├── Option A: Lower CPL to CHF 35 → ROI = 5.0x
├── Option B: Improve Close Rate to 35% → ROI = 4.9x
├── Option C: Higher Job Value (CHF 2'200) → ROI = 4.8x
└── Option D: All combined → ROI = 7.8x ✅
```

### 5.3 Anti-Churn & Anti-Leakage Measures

| Risk | Mitigation | Monitoring |
|------|------------|------------|
| **Partner buys leads, then goes direct** | 12-Monat Non-Compete in Vertrag, Brand-Monitoring | Google Alerts auf Partner + "Umzug" |
| **Partner cherry-picks, ignores Tier-2** | Minimum Fill-Rate 70% oder Kündigung | Weekly Fill-Rate Report |
| **Partner underquotes to steal customer** | Price Floor in Vertrag (GAV-konform) | Mystery Shopping 1x/Quartal |
| **Partner bad reviews reflect on us** | Quality Gate: Min 4.0 Google Rating | Monthly Rating Check |
| **Partner capacity lies** | Real-time Calendar Sync required | Booking Confirmation Rate |
| **Partner poaches other partners' leads** | Lead-Tracking with unique IDs | Conversion Attribution |

### 5.4 Partner Tiers & Benefits

```
BRONZE (New Partners)
├── Requirements: Verified, Min 3.5 Rating, GAV-compliant
├── Lead Volume: Standard allocation
├── CPL: Standard (CHF 45)
├── Support: Email only
└── Upgrade after: 3 Monate + 20 Jobs + 4.0 Rating

SILVER (Established)
├── Requirements: 4.0+ Rating, 80% Fill Rate, 3+ Monate
├── Lead Volume: +20% allocation
├── CPL: -10% Rabatt (CHF 40.50)
├── Support: Priority Email + Phone
└── Upgrade after: 6 Monate + 50 Jobs + 4.3 Rating

GOLD (Premium Partners)
├── Requirements: 4.3+ Rating, 85% Fill Rate, 6+ Monate
├── Lead Volume: First access to overflow Tier-1
├── CPL: -20% Rabatt (CHF 36)
├── Support: Dedicated Account Manager
├── Badge: "Empfohlener Partner" auf Profil
└── Exclusive: Feierabend Overflow-Jobs
```

---

## 6. Seasonal Pricing Plan

### 6.1 Monthly Demand Pattern (Swiss Market)

```
DEMAND INDEX (100 = Durchschnitt):

Jan  ████░░░░░░  65   Low Season
Feb  █████░░░░░  72   Low Season
Mär  ███████░░░  88   Ramp-Up
Apr  █████████░  105  Peak Start
Mai  ██████████  115  Peak
Jun  ██████████  120  Peak
Jul  █████████░  108  Peak Tail
Aug  ████████░░  95   Transition
Sep  █████████░  102  Mini-Peak
Okt  ████████░░  92   Transition
Nov  ██████░░░░  78   Low Season
Dez  █████░░░░░  70   Low Season (Feiertage)
```

### 6.2 End-of-Month Premium

```
MONTHLY PRICING LADDER:

Day of Month  |  Modifier  |  Reason
──────────────┼────────────┼─────────────────────
1-5           |   +10%     |  Mietbeginn Rush
6-10          |   -5%      |  Low Demand Window
11-15         |   Standard |  Normal
16-20         |   Standard |  Normal
21-25         |   +5%      |  Pre-End Buildup
26-28         |   +15%     |  End-of-Month
29-31         |   +25%     |  Kündigungstermin Rush
```

### 6.3 Complete Pricing Matrix (CHF per m³)

| Monat | Day 1-5 | Day 6-10 | Day 11-20 | Day 21-25 | Day 26-28 | Day 29-31 |
|-------|---------|----------|-----------|-----------|-----------|-----------|
| **Jan** | 59 | 52 | 55 | 58 | 63 | 69 |
| **Feb** | 61 | 54 | 57 | 60 | 66 | 71 |
| **Mär** | 67 | 60 | 63 | 66 | 72 | 79 |
| **Apr** | 73 | 66 | 69 | 72 | 79 | 86 |
| **Mai** | 78 | 71 | 75 | 79 | 86 | 94 |
| **Jun** | 82 | 74 | 78 | 82 | 90 | 98 |
| **Jul** | 75 | 68 | 71 | 75 | 82 | 89 |
| **Aug** | 68 | 61 | 64 | 67 | 74 | 80 |
| **Sep** | 71 | 64 | 67 | 70 | 77 | 84 |
| **Okt** | 66 | 59 | 62 | 65 | 71 | 77 |
| **Nov** | 58 | 52 | 55 | 58 | 63 | 69 |
| **Dez** | 56 | 50 | 53 | 56 | 61 | 66 |

**Base: CHF 65/m³**

### 6.4 Example Job Pricing

```
BEISPIEL: 45m³ Umzug am 29. Juni

Base Volume Cost:     45 × CHF 78 (Jun Base) = CHF 3'510
End-of-Month Premium: +25%                   = CHF 878
Distance (25km):      25 × CHF 2.50          = CHF 63
Floor (3. OG, Lift):  3 × CHF 10             = CHF 30
Services (Packing):   45 × CHF 15            = CHF 675
────────────────────────────────────────────────────────
Subtotal:                                    = CHF 5'156
Platform Fee (5%):                           = CHF 258
────────────────────────────────────────────────────────
TOTAL:                                       = CHF 5'414

Customer Communication:
"Ihr Festpreis: CHF 5'414 – garantiert, keine versteckten Kosten."
```

---

## 7. Risk Register

### 7.1 Top 10 Risks with Mitigations

| # | Risk | Probability | Impact | Score | Mitigation | Owner | Monitoring |
|---|------|-------------|--------|-------|------------|-------|------------|
| 1 | **GAV Cost Floor Violation** | Medium | Critical | 🔴 15 | Minimum-Preis CHF 55/m³ im System, Legal Review Q1 | Founder | Quarterly Audit |
| 2 | **CPC Inflation 2026** | High | High | 🔴 16 | 30% Budget Reserve, SEO Investment parallel, Diversify (Meta, TikTok) | Marketing | Weekly CPL Trend |
| 3 | **Missed Calls / Slow Response** | Medium | High | 🟡 12 | Auto-Callback <5 Min, Voicemail-to-Text, Concierge SLA | Ops | Daily Call Metrics |
| 4 | **Damage Claims** | Low | Critical | 🟡 10 | CHF 2M Versicherung, Photo-Documentation, Handover Protocol | Ops | Per-Job Checklist |
| 5 | **Partner Capacity Crunch (Peak)** | High | Medium | 🟡 12 | 20% Overcapacity Partner Pool, Dynamic Pricing to flatten demand | Partner Mgr | Weekly Utilization |
| 6 | **LSVA Cost Increase** | Medium | Medium | 🟡 9 | Price Buffer +5%, Fleet Optimization, Route Planning | Finance | Annual Review |
| 7 | **Feierabend Key Person Risk** | Medium | High | 🟡 12 | Cross-Training, Process Documentation, Crew #2 as redundancy | Founder | Monthly 1:1 |
| 8 | **Partner Churn >10%** | Medium | Medium | 🟡 9 | Quarterly NPS, ROI Reporting, Partner Success Program | Partner Mgr | Monthly Churn |
| 9 | **Reputation Attack** | Low | High | 🟡 8 | Review Monitoring, Response SLA <24h, Legal on retainer | Marketing | Daily Alerts |
| 10 | **Cash Flow Crunch** | Low | Critical | 🟡 10 | 3 Monate Runway Reserve, Payment Terms Net-7, Credit Line CHF 50k | Finance | Weekly Cash Position |

### 7.2 Risk Response Matrix

```
PROBABILITY × IMPACT MATRIX:

                    LOW IMPACT    MEDIUM IMPACT    HIGH IMPACT    CRITICAL
                    ──────────────────────────────────────────────────────
HIGH PROB (>60%)    Accept        Mitigate         Mitigate       Avoid
MEDIUM (30-60%)     Accept        Mitigate         Mitigate       Mitigate
LOW PROB (<30%)     Accept        Accept           Mitigate       Mitigate
```

### 7.3 Contingency Triggers

| Trigger | Threshold | Action |
|---------|-----------|--------|
| CPL > CHF 75 | 2 Wochen konsekutiv | Pause Paid, Shift to SEO/Referral |
| Utilization < 50% | 2 Wochen konsekutiv | Emergency Pricing (-20%), Partner Overflow |
| Partner Fill < 50% | 1 Monat | Partner Recruitment Sprint, Reduce Lead Volume |
| Dispute Rate > 5% | 1 Monat | Quality Audit, Process Review, Training |
| Cash Runway < 2 Mo | Any time | Cost Freeze, Emergency Fundraise |

---

## 8. Weekly Operating Rhythm

### Monday: Week Planning
- [ ] Review last week KPIs (15 min)
- [ ] Feierabend Capacity Check (10 min)
- [ ] Partner Capacity Check (10 min)
- [ ] Adjust Paid Media Bids (15 min)
- [ ] Concierge Priority Queue (10 min)

### Tuesday-Thursday: Execution
- [ ] Daily Lead Review (10 min each)
- [ ] Concierge Callbacks (ongoing)
- [ ] Partner Support (as needed)
- [ ] Content/SEO Work (2h/day)

### Friday: Review & Reporting
- [ ] Weekly KPI Dashboard Update (30 min)
- [ ] Partner Performance Review (20 min)
- [ ] Cash Position Check (10 min)
- [ ] Risk Register Review (10 min)
- [ ] Plan Next Week (20 min)

### Monthly Cadence
- Week 1: Partner NPS Survey
- Week 2: Competitor Pricing Check
- Week 3: Process Improvement Sprint
- Week 4: Financial Review, Investor Update

---

## 9. Key Dashboards & Alerts

### 9.1 Daily Dashboard

```
┌─────────────────────────────────────────────────────┐
│ DAILY PULSE                          [2026-01-28]  │
├─────────────────────────────────────────────────────┤
│ Leads Today:        23 (▲ +4 vs avg)               │
│ Qualified:          11 (48%)                        │
│ Tier-1 to FE:       4                               │
│ Tier-2 to Partners: 7                               │
│ CPL Today:          CHF 48 (✅ under target)        │
├─────────────────────────────────────────────────────┤
│ Feierabend:                                         │
│ ├── Jobs Today:     2/2 (100% util)                │
│ ├── This Week:      5/7 (71% util) 🟡              │
│ └── Pipeline:       8 opportunities                 │
├─────────────────────────────────────────────────────┤
│ Partners:                                           │
│ ├── Active Today:   12/15                          │
│ ├── Fill Rate:      76% (✅)                       │
│ └── Avg Response:   2.1h (✅)                      │
└─────────────────────────────────────────────────────┘
```

### 9.2 Alert Thresholds

| Alert | Threshold | Channel | Escalation |
|-------|-----------|---------|------------|
| CPL Spike | >CHF 70 | Slack #alerts | Pause after 3h |
| Zero Leads | 4h without lead | Slack + SMS | Check immediately |
| Missed Call | >3 in queue | Slack #ops | Callback within 15m |
| Damage Report | Any | Email + Call | Same day response |
| Partner Complaint | Any | Email | Same day response |
| Cash < CHF 30k | Daily check | Email to Founder | Immediate action |

---

## 10. Success Criteria (90-Day)

### Minimum Viable Success (Stop/Go for Q2)

- [ ] **Leads:** ≥400 total, ≥180 qualified
- [ ] **Feierabend Jobs:** ≥25 closed
- [ ] **Feierabend CM2:** ≥CHF 15'000 cumulative
- [ ] **Partner Network:** ≥12 active partners
- [ ] **Fill Rate:** ≥65%
- [ ] **Blended CPL:** ≤CHF 58
- [ ] **Cash Runway:** ≥4 months remaining

### Target Success

- [ ] **Leads:** ≥600 total, ≥270 qualified
- [ ] **Feierabend Jobs:** ≥45 closed
- [ ] **Feierabend CM2:** ≥CHF 30'000 cumulative
- [ ] **Partner Network:** ≥18 active partners
- [ ] **Fill Rate:** ≥75%
- [ ] **Blended CPL:** ≤CHF 52
- [ ] **Crew #2:** Hired and trained

### Stretch Success (Investor-Ready)

- [ ] **Monthly Recurring Revenue:** ≥CHF 50k
- [ ] **CM2 Margin:** ≥40%
- [ ] **Partner NPS:** ≥40
- [ ] **Customer NPS:** ≥50
- [ ] **Geographic Coverage:** ≥60% Swiss population
- [ ] **Clear path to CHF 1M ARR**

---

## Appendix A: Formulas Reference

```
# Lead Economics
CPL = Total_Ad_Spend / Total_Leads
CAC = Total_Marketing_Cost / Customers_Acquired
LTV = Avg_Job_Value × Repeat_Rate × Margin
LTV:CAC Ratio = LTV / CAC (Target: ≥3:1)

# Funnel Metrics
Qualified_Rate = Qualified_Leads / Total_Leads
Close_Rate = Won_Jobs / Opportunities
Fill_Rate = Filled_Leads / Total_Partner_Leads

# Profitability
CM1 = Revenue - Direct_COGS
CM2 = CM1 - Variable_Marketing_Cost
CM2_per_Lead = Total_CM2 / Total_Leads
ROAS = Revenue / Ad_Spend

# Capacity
Utilization = Actual_Jobs / Max_Capacity
Crew_Productivity = Revenue / Crew_Cost

# Partner Economics
Partner_ROI = Partner_Margin / Lead_Cost
Partner_LTV = Monthly_Spend × Avg_Tenure × Margin
Partner_Churn = Lost_Partners / Start_Partners
```

---

## Appendix B: Swiss Market Constants

```
# Legal/Regulatory
GAV_Min_Wage_2026 = CHF 23.50/h (estimated)
LSVA_Rate = CHF 0.025/tkm (7.5t)
MwSt = 8.1%
Arbeitgeber_Sozial = ~15.5% of gross

# Market Benchmarks
Avg_Move_Value_CH = CHF 2'100
Avg_Volume_Private = 32 m³
Avg_Distance = 18 km
Peak_Season_Multiplier = 1.25x
End_Month_Premium = 1.20x

# Digital Marketing
Google_CPC_Umzug_2026 = CHF 4.50-8.50 (estimated)
Conversion_Rate_Landing = 3.5-5.5%
Mobile_Traffic = 68%
```

---

*Letzte Aktualisierung: 2026-01-28*
*Nächste Review: 2026-02-07*
