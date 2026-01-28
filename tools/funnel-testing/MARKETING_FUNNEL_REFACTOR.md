# Marketing Funnel Testing - Refactor Plan

## What Changed

**Old Focus:** Testing form-filling flows (CTA → Form → Submit)
**New Focus:** Testing entire customer journeys from Google landing → Goal achievement

## Business Model - Service Combinations

Based on umzugscheck.ch's business model, customers want to book:

### Core Service Combinations (The "10 Ways We Earn Money")
1. **Umzug only** - Basic moving service
2. **Umzug + Reinigung** - Move + cleaning (most common upsell)
3. **Umzug + Entsorgung** - Move + disposal
4. **Umzug + Lagerung** - Move + storage
5. **Umzug + Reinigung + Entsorgung** - Full service tier 1
6. **Umzug + Reinigung + Lagerung** - Full service tier 2
7. **Umzug + Reinigung + Entsorgung + Lagerung** - Premium full service
8. **Reinigung only** - Cleaning without move (end-of-tenancy)
9. **Entsorgung only** - Disposal/junk removal standalone
10. **Packmaterial only** - Box/material sales

### Additional Value-Adds
- Piano/heavy items transport
- International moves
- Office moves (B2B)
- Short notice / emergency moves
- Weekend/evening moves

## Top 20 Traffic Gateways (Google Entry Points)

These are the pages customers land on from Google searches:

### Geographic Pages (High Volume)
1. Homepage - `umzugscheck.ch`
2. Umzug Zürich - `umzug-zuerich`
3. Umzug Bern - `umzug-bern`
4. Déménagement Genève - `demenagement-geneve`
5. Trasloco Lugano - `trasloco-lugano`
6. Umzug Basel - `umzug-basel`

### Service-Specific Pages
7. Umzug + Reinigung - `umzug-reinigung`
8. Endreinigung - `endreinigung`
9. Entsorgung - `entsorgung`
10. Lagerung - `lagerung`
11. Klaviertransport - `klaviertransport`
12. Büroumzug - `bueroumzug`

### Segment Pages
13. Günstiger Umzug - `guenstiger-umzug`
14. Umzug ins Ausland - `umzug-ausland`
15. Studentenumzug - `studentenumzug`
16. Seniorenumzug - `seniorenumzug`

### Comparison/Info Pages
17. Preisvergleich - `preisvergleich`
18. Umzugskosten - `umzugskosten`
19. Umzugsfirma vergleichen - `umzugsfirma-vergleichen`
20. Offerte anfragen - `offerte-anfragen`

## 20 Customer Personas (By Goal)

Each persona has a **specific goal** (service combination they want to book):

### 1. Full Service Seekers (High Budget)
- **Full Service Pro** - Wants Umzug + Reinigung + Entsorgung + Lagerung
- **Wealthy Expat** - International move + full service
- **Executive Mover** - Office move, high urgency, premium service

### 2. Move + Cleaning Combo (Most Common)
- **Busy Professional** - Umzug + Reinigung (no time for cleaning)
- **Family Mover** - Large move + end-of-tenancy cleaning
- **Apartment Leaver** - Focused on deposit return, needs cleaning proof

### 3. Budget Conscious (Move Only)
- **Student** - Cheapest move, no extras
- **Price Hunter** - Comparing quotes, wants basic service
- **DIY Helper** - Wants move only, will pack themselves

### 4. Service-Specific Goals
- **Cleaning Only Customer** - No move, just Endreinigung
- **Disposal Focused** - Downsizing, needs Entsorgung
- **Storage Seeker** - Temporary living situation, needs Lagerung
- **Piano Owner** - Special item transport
- **Green Conscious** - Eco-friendly disposal/recycling

### 5. Explorers/Undecided
- **Comparison Shopper** - Not sure what they need, exploring options
- **Information Seeker** - Wants to understand costs first
- **Last Minute Larry** - Emergency move, next week
- **Skeptical Senior** - Needs trust signals, references
- **Francophone** - French-speaking, needs French service
- **Italian Speaker** - Lugano/Ticino market

### 6. Edge Cases
- **Chaos Bot** - Random navigation to test error handling

## What the AI Runner Should Do

### 1. Land on Gateway Page
```
Example: Customer searches "umzug zürich" → lands on /umzug-zuerich
```

### 2. AI Analysis of Available Options
**Prompt to AI:**
```
You are a customer who just landed on this page from Google.
Goal: [persona.goal.description]
Services wanted: [persona.goal.services_wanted]

Analyze this page:
- What options are presented? (Links, CTAs, services)
- Which option best matches my goal?
- Can I achieve my goal from here?
- What's the clearest path forward?
```

### 3. Navigate Toward Goal
- Click CTAs that move toward goal (e.g., "Umzug + Reinigung" if that's the goal)
- Explore service pages if needed
- Add services to cart/quote if available
- Reach quote form or contact form

### 4. Document Journey
Track:
- **Steps taken** (Page A → Page B → Page C)
- **Goal achieved?** (Yes/No)
- **Services found?** (Did site offer what persona wanted?)
- **Friction points** (Couldn't find option, confusing navigation, dead end)
- **Business model match** (Which services were presented/bookable?)

### 5. Score the Funnel
- **Goal Achievability** (1-100%) - Could persona accomplish their goal?
- **Path Clarity** (1-100%) - Was it obvious how to proceed?
- **Service Coverage** (1-100%) - Does site offer what customer wants?
- **Conversion Confidence** (1-100%) - Overall likelihood of booking

## Updated Schemas

### Gateway Schema (Enhanced)
```typescript
{
  gateway_id: string;
  name: string;
  landing_url: string;
  language: "de" | "en" | "fr" | "it";
  intent: string; // "find_cheap_move", "book_full_service", etc.
  keyword_cluster: string;
  expected_ctas: string[]; // What CTAs should be on this page
  traffic_volume: "high" | "medium" | "low"; // NEW
  primary_business_model: string[]; // ["umzug", "reinigung"] - NEW
  priority_weight: number;
  enabled: boolean;
}
```

### Persona Schema (Enhanced)
```typescript
{
  persona_id: string;
  name: string;
  language: "de" | "en" | "fr" | "it";
  device: "mobile" | "desktop";
  traits: string[];
  budget: "low" | "medium" | "high";
  urgency: "low" | "medium" | "high";
  trust_level: "low" | "medium" | "high";
  goal: { // NEW
    primary: string; // "book_full_service", "get_quote_move_only", etc.
    services_wanted: string[]; // ["umzug", "reinigung", "entsorgung"]
    description: string; // Human-readable goal
    must_have: string[]; // Required services
    nice_to_have: string[]; // Optional services
  };
  click_bias_weights: {
    main_cta: number;
    secondary: number;
    escape: number;
  };
  enabled: boolean;
}
```

### RunResult Schema (Enhanced)
```typescript
{
  run_id: string;
  timestamp: string;
  gateway: Gateway;
  persona: Persona;
  
  // Journey tracking - NEW
  journey: {
    pages_visited: string[]; // URLs
    steps: Step[]; // Each navigation action
    goal_achieved: boolean; // Did they reach their goal?
    services_found: string[]; // What services were available?
    services_booked: string[]; // What did they select/add?
    path_taken: string; // "homepage → services → umzug-reinigung → quote"
  };
  
  // Business model tracking - NEW
  business_model: {
    services_presented: string[]; // What site offered
    services_wanted: string[]; // What persona wanted
    match_score: number; // % of wanted services available
    upsell_opportunities: string[]; // Additional services shown
  };
  
  // Existing scoring
  scores: {
    goal_achievability: number; // NEW (replaces some old metrics)
    path_clarity: number; // NEW
    service_coverage: number; // NEW
    intent_match: number;
    trust: number;
    friction: number;
    clarity: number;
    mobile_usability: number;
    conversion_confidence: number;
  };
  
  verdict: "goal_achieved" | "goal_partial" | "goal_blocked" | "lost";
  dropoff_reason?: string;
  steps_count: number;
  time_ms: number;
}
```

## AI Prompts for Journey Analysis

### Landing Page Analysis
```
You are analyzing a Swiss moving company website from a customer's perspective.

Customer Context:
- Landed from Google search: [keyword_cluster]
- Goal: [persona.goal.description]
- Needs these services: [services_wanted]
- Budget: [budget], Urgency: [urgency]
- Device: [mobile/desktop]

Page Screenshot: [base64 image]

Tasks:
1. What are the top 5 clickable options on this page?
2. Which option best matches the customer's goal?
3. Rate the clarity of service offerings (1-100%)
4. Are all wanted services mentioned/visible?
5. What's the recommended next action?

Return JSON:
{
  "available_options": [{text, type, relevance_score}],
  "best_match": {text, selector, confidence},
  "service_coverage": {found: [], missing: [], score: 0-100},
  "path_clarity": 0-100,
  "recommended_action": "click_cta | explore_services | abandon"
}
```

### Service Page Analysis
```
Customer is now on: [current_url]
Previous path: [pages_visited]
Still looking for: [missing services]

New tasks:
1. Can customer add/select wanted services here?
2. Is this a quote form / booking form?
3. Should customer proceed or go back?
4. Rate friction level (1-100%)
```

## Implementation Steps

### Phase 1: Update Data Files (Done)
- ✅ Refactor gateways.json with real traffic pages
- ✅ Refactor personas.json with business goals

### Phase 2: Update Schemas
- Add `goal` field to PersonaSchema
- Add `journey` and `business_model` tracking to RunResultSchema
- Add `traffic_volume` and `primary_business_model` to GatewaySchema

### Phase 3: Update Runner
- Refactor runner to track full journey (not just form steps)
- Implement AI-powered path analysis
- Add business model matching logic
- Track pages visited and services found

### Phase 4: Update Reporting
- Add journey visualizations (path trees)
- Add business model coverage reports
- Show which gateways → goals work vs. fail
- Heatmap: Gateway × Goal Success Rate

### Phase 5: Add AI Agents
- Landing page analyzer
- Service finder agent
- Goal achievement detector

## Example Test Scenarios

### Scenario 1: Full Service Customer on Homepage
```
Gateway: Homepage
Persona: Full Service Pro (wants Umzug + Reinigung + Entsorgung + Lagerung)
Expected Path: 
  Homepage → Services → Umzug + Reinigung → Add Entsorgung → Add Lagerung → Quote
Expected Result: goal_achieved (all 4 services found and selectable)
```

### Scenario 2: Budget Student on Cheap Move Page
```
Gateway: Günstiger Umzug
Persona: Student (wants cheapest Umzug only, no extras)
Expected Path:
  Günstiger Umzug → Quote form (basic move)
Expected Result: goal_achieved (found affordable move option)
```

### Scenario 3: Cleaning-Only Customer on Move Page
```
Gateway: Umzug Zürich
Persona: Cleaning Only Customer (wants Endreinigung, no move)
Expected Path:
  Umzug Zürich → ??? (page about moves, not cleaning)
Expected Result: goal_blocked (can't find cleaning-only option)
Risk: Customer bounces
```

## Success Metrics

### Gateway Performance
- **Goal Achievement Rate** - % of personas that achieve their goal from this gateway
- **Service Coverage** - % of wanted services found
- **Path Efficiency** - Avg steps to goal
- **Bounce Risk** - % of personas who hit dead ends

### Business Model Coverage
- **Service Combo Gaps** - Which service combinations are hard to find?
- **Upsell Success** - Do customers discover additional services?
- **Lost Revenue** - Which goals can't be fulfilled?

### Persona Insights
- **Best-Served Personas** - Which customer types convert easily?
- **Underserved Personas** - Which goals are hard to achieve?
- **Cross-Gateway Variance** - Does persona success depend on entry point?

## Next Steps

1. ✅ Create this refactor plan
2. Update schemas with goal/journey/business_model fields
3. Refactor runner for journey tracking
4. Implement AI journey analyzer
5. Update reporting for business model insights
6. Populate full 20 gateways + 20 personas
7. Run 400 tests (20 gateways × 20 personas)
8. Generate insights report

---

**This is the right approach for marketing funnel testing - not form flows, but customer journey success rates.**
