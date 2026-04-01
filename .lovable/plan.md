

# /feedback: Block 31 — Outreach Narrative & Market Leadership Race

## What this is

The user's raw pitch narrative distilled into a structured outreach/PR block. This is NOT another risk audit — it's the **offensive story**: why this project matters, the emotional thesis ("Umziehen ist eines der grössten Ereignisse des Menschen"), the AI-built differentiator (90-95% AI), and the measurable race to market leadership.

## Content Structure (5 sub-sections)

### 31.1 — The Human Truth (Emotional Thesis)
The core narrative: Moving = one of life's biggest transitions. Old life → new life. Leaving behind → starting fresh. Everyone goes through it. We took the time to give this process the importance it deserves.

Key message pillars:
- Professional, convenient, personal, fair, fast, precise, authentic, premium quality
- "Vom alten Leben ins Neue" — emotional anchor

### 31.2 — The Business Case (Two Pillars)
- **Umzugscheck.ch** = Vergleichsportal (digital lead engine)
- **Feierabendservices.ch** = Der Dienstleister (physical execution)
- Together: A-Z relocation optimization in the AI era, in the world's most competitive economy

### 31.3 — The AI Story (90-95% AI-Built)
- Platform built 90-95% by AI, rest by founder
- This IS the outreach story — not just a product, but a proof of what AI can build
- Positions the project as a media/PR asset itself

### 31.4 — The Race (Measurable Market Leadership)
- "We're starting the clock": How long to become #1 online? How much budget?
- Metric: Time-to-Market-Leader + Budget-to-Market-Leader
- Measure until goal is reached
- This framing = news-worthy beyond just getting moving contracts

### 31.5 — Outreach Positioning
- Target audiences: Tech media, startup portals, Swiss business press
- Story angle: "AI-built startup races to dominate Switzerland's most traditional market"
- The project IS the content (referencing the existing PR flywheel strategy from memory)

## Design
- New `SourceBadge`: `OUTREACH` (amber/gold: `bg-amber-600/10 text-amber-300`)
- 31.1 uses a gradient card with large italic pull-quote
- 31.4 uses a "race tracker" visual (timeline with start → goal)
- Overall tone: forward-looking, offensive, not defensive

## Architecture

| Action | File |
|--------|------|
| Create | `src/components/feedback/OutreachNarrative.tsx` (~350-400 lines) |
| Edit | `src/pages/FeedbackAnalysis.tsx` — Import, render Block 31 after Block 30, add `OUTREACH` SourceBadge, update footer to 31 blocks |

