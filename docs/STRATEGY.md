# Umzugscheck.ch – Strategic Development Guide

> **Golden Rule:** Ideas are free. Data is expensive. Fragmentation kills learning.

---

## 📊 Funnel Structure

### Primary Conversion Funnel
```
Homepage → Calculator/Wizard → Company Selection → Contact Form → Confirmation
     ↓           ↓                    ↓               ↓
  Trust      Price Estimate      Social Proof    Lead Capture
```

### Entry Points
| Entry Point | Purpose | Target User |
|-------------|---------|-------------|
| `/umzugsofferten` | Main funnel (Control) | General visitors |
| `/umzugsofferten-v2` | Simplified 3-step | Impatient users |
| `/umzugsofferten-v3` | Price-first | Price-conscious |
| `/umzugsofferten-v4` | Conversational | Guidance seekers |
| `/rechner` | Calculator entry | Cost estimators |
| `/rechner/video` | AI Video analysis | Tech-forward users |
| Regional pages | Local SEO | Geographic searches |

### Funnel Variants (A/B Testing)
- **Control:** 4-step (MoveType → Location+Services → Companies → Contact)
- **Variant A:** 3-step simplified (no company selection)
- **Variant B:** Price-first (show estimate before company selection)
- **Variant C:** Conversational (guided Q&A style)

---

## 💎 Service Tiers

### Core Services (Always Included)
| Service | Base Price Range | Booking Rate |
|---------|------------------|--------------|
| Umzug (Basis) | Included | 100% |

### Upsell Services (High Margin)
| Service | Price Add | Booking Rate | Priority |
|---------|-----------|--------------|----------|
| Einpack-Service | +CHF 300-500 | 73% | ⭐⭐⭐ Highest |
| Auspack-Service | +CHF 200-400 | 52% | ⭐⭐ High |
| Endreinigung | +CHF 250-450 | 45% | ⭐⭐ High |
| Entsorgung | +CHF 150-300 | 28% | ⭐ Medium |
| Zwischenlagerung | +CHF 100-200/Mt | 12% | ⭐ Low |

### Premium Packages (Future)
- **All-Inclusive:** Umzug + Pack + Unpack + Reinigung
- **White-Glove:** All-inclusive + Möbelmontage + Garantie
- **DIY-Support:** Only heavy items, rest self-service

---

## 🛡️ Trust Mechanics

### Trust Signals (Priority Order)
1. **Verified Reviews** – Real customer feedback with photos
2. **Price Transparency** – Clear estimates, no hidden fees
3. **Swiss Quality Badge** – "Geprüfte Schweizer Firmen"
4. **Insurance Display** – "Versichert bis CHF 50'000"
5. **Response Time** – "Antwort in Ø 2 Stunden"
6. **Guarantee Badges** – "Abnahmegarantie", "Festpreisgarantie"

### Trust Placement
```
Hero Section:     ✓ Kostenlos ✓ Unverbindlich ✓ 2 Min
Company Cards:    Rating + Reviews + Verified Badge
Contact Form:     Privacy + SSL + Data protection
Confirmation:     What happens next + Timeline
```

### Social Proof Elements
- Live counter: "2'847 Umzüge diese Woche vermittelt"
- Recent reviews carousel
- Company response times
- "Beliebt in Ihrer Region" badges

---

## 🤖 Automation Ideas

### Lead Processing
- [ ] Auto-assign leads to matching companies by region/service
- [ ] Auto-send confirmation emails with estimate PDF
- [ ] Auto-reminder for incomplete forms (exit intent capture)
- [ ] Auto-follow-up after 24h if no company response

### Company Matching
- [ ] Smart ranking based on availability + quality + price
- [ ] Real-time capacity checks
- [ ] Seasonal pricing adjustments
- [ ] AI-powered lead quality scoring

### Communication
- [ ] WhatsApp integration for instant quotes
- [ ] SMS notifications for urgent moves
- [ ] Automated review requests post-move
- [ ] Drip campaigns for abandoned funnels

### Analytics & Optimization
- [ ] Automatic A/B test winner detection
- [ ] Conversion funnel health alerts
- [ ] Weekly performance digests
- [ ] Competitor price monitoring

---

## 🎯 Decision Matrix

| Goal | Action in Lovable | Notes |
|------|-------------------|-------|
| Explore crazy ideas | New project (Lab) | Max 1-2 at a time |
| Improve conversions | Landing page variant | Keep in master |
| Test pricing | Variant block | Use flow-variants.ts |
| Test copy | Variant block | A/B test registration |
| Test bundles | Variant block | Service tier configs |
| New market logic | Landing page | Regional pages |
| Core system change | Master project | Direct implementation |

### When to Create New Landing Pages
✅ New geographic market (canton/city)
✅ New service vertical (B2B, seniors, students)
✅ New pricing model (subscription, flat-rate)
✅ Major funnel restructure test

### When to Use Variants
✅ Copy/messaging tests
✅ CTA button tests
✅ Step order changes
✅ UI layout experiments
✅ Price display experiments

### When to Use Lab Projects
✅ Completely new product concept
✅ Integration experiments (new APIs)
✅ Risky technical changes
⚠️ Kill or merge within 2 weeks

---

## 🧬 Project Structure

```
umzugscheck.ch (MASTER)
│
├── 🧠 Core Systems
│   ├── MultiStepCalculator (main funnel)
│   ├── VideoEstimator (AI analysis)
│   ├── CompanyMatching (ranking engine)
│   └── LeadManagement (CRM)
│
├── 🛡️ Trust Engine
│   ├── Reviews system
│   ├── Verification badges
│   ├── Social proof components
│   └── Guarantee displays
│
├── 💰 Monetization
│   ├── Lead pricing (CPL)
│   ├── Click pricing (CPC)
│   ├── Subscription plans
│   └── Sponsored placements
│
├── 📄 Landing Pages
│   ├── /umzugsofferten (main funnel)
│   ├── /umzugsofferten-v2,v3,v4 (variants)
│   ├── /umzugsfirmen/:canton (regional)
│   ├── /beste-umzugsfirma (ranking)
│   ├── /guenstige-umzugsfirma (budget)
│   ├── /services/:type (service-specific)
│   └── /ratgeber/:topic (content/SEO)
│
├── 🧪 Experiments
│   ├── src/lib/flow-variants.ts (funnel configs)
│   ├── src/lib/ab-testing.ts (test definitions)
│   └── Admin A/B dashboard
│
└── 🔧 Admin Tools
    ├── /admin/rankings
    ├── /admin/ab-testing
    ├── /admin/analytics
    └── /admin/tools
```

---

## 📈 Current A/B Tests

| Test ID | Name | Variants | Status |
|---------|------|----------|--------|
| `hero_cta` | Hero CTA Button Text | 3 variants | Active |
| `calculator_submit` | Calculator Submit Button | 3 variants | Active |
| `video_cta` | Video Calculator CTA | 2 variants | Active |
| `company_view_mode` | Company List View | 2 variants | Active |
| `offerten_flow` | Umzugsofferten Flow | 4 variants | Active |

---

## ⚠️ Anti-Patterns (Don't Do This)

❌ **Don't** create new projects for every experiment
❌ **Don't** duplicate core components across projects
❌ **Don't** test more than 3-4 things simultaneously
❌ **Don't** run tests without clear success metrics
❌ **Don't** let lab projects live longer than 2 weeks
❌ **Don't** fragment analytics across multiple domains

---

## ✅ Best Practices

✅ **One master project** for all production code
✅ **Landing pages** for market/segment variations
✅ **Variants** for copy/UI/pricing experiments
✅ **Weekly review** of experiment results
✅ **Kill or merge** lab learnings into core
✅ **Document decisions** in this file
✅ **Track everything** in centralized analytics

---

## 📝 Implementation Checklist

### Before Starting Any Experiment
- [ ] Define success metric (conversion rate, revenue, etc.)
- [ ] Set test duration (min 2 weeks, 1000+ visitors)
- [ ] Document hypothesis
- [ ] Check for conflicts with other tests

### After Experiment Ends
- [ ] Analyze results with statistical significance
- [ ] Document learnings
- [ ] Merge winner into control
- [ ] Clean up variant code if not needed
- [ ] Update this strategy doc

---

*Last updated: 2024-12-25*
*Maintainer: Umzugscheck Team*
