# 🐛 Issue Backlog & Development Roadmap

**Generated**: 2026-01-28  
**Priority**: Week 1 Sprint  
**Status**: Ready for Implementation  

---

## Critical Issues (Must Fix This Week)

### 🔴 Issue #2.1: URL Parameter Prepopulation

**Status**: 🔴 Open  
**Severity**: HIGH  
**Funnel**: #2 Vergleich Wizard  
**Route**: `/vergleich`  
**Impact**: -15-20% form completion rate

#### Problem
```
User journey:
1. User fills "/": from=8001, to=3000, rooms=2
2. Clicks "Jetzt checken lassen"
3. Redirects to: /vergleich?from=8001&to=3000&rooms=2
4. ❌ Wizard form shows EMPTY fields
5. User re-enters data manually (30s friction)
```

#### Root Cause
URL parameters not parsed or form fields not updated on component mount.

#### Solution

**File to Modify**: `src/pages/VergleichWizard.tsx` (or similar)

**Code Changes Required**:
```typescript
// Add to component mount/useEffect
import { useSearchParams } from 'react-router-dom';

export function VergleichWizard() {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    from: searchParams.get('from') || '',
    to: searchParams.get('to') || '',
    rooms: searchParams.get('rooms') || '',
    date: searchParams.get('date') || '',
  });

  useEffect(() => {
    // Validate parsed values
    if (searchParams.get('from')) {
      setFormData(prev => ({
        ...prev,
        from: searchParams.get('from') || prev.from
      }));
    }
    // ... similar for other fields
  }, [searchParams]);

  return (
    <div>
      {/* Form with prefilled values */}
      <input value={formData.from} onChange={...} />
    </div>
  );
}
```

#### Testing Checklist
- [ ] Navigate to `/vergleich?from=8001&to=3000&rooms=2`
- [ ] Verify "Von" field shows "8001"
- [ ] Verify "Nach" field shows "3000"
- [ ] Verify "Zimmer" field shows "2"
- [ ] Verify form is editable (user can override)
- [ ] Show toast: "Ihre Angaben vorausgefüllt"

#### Effort
**Estimate**: 2-3 hours  
**Complexity**: Medium  
**Risk**: Low

#### Expected Result
- ✅ Form completion rate: +15-20%
- ✅ User friction: -30 seconds average
- ✅ Bounce rate: -10-15%

---

### 🔴 Issue #5.1: Firm Card Click Handler Missing

**Status**: 🔴 Open  
**Severity**: HIGH  
**Funnel**: #5 Firmenverzeichnis  
**Route**: `/umzugsfirmen`  
**Impact**: 0% firm profile click-through rate

#### Problem
```
User journey:
1. User lands on /umzugsfirmen
2. Sees list of firms in map/card view
3. ❌ Clicks on firm card
4. ❌ Nothing happens (no navigation)
5. User bounces (stuck on directory)
```

#### Root Cause
Firm cards likely missing `onClick` handler or navigation logic.

#### Solution

**File to Modify**: `src/components/FirmCard.tsx` (or similar)

**Code Changes Required**:
```typescript
import { useNavigate } from 'react-router-dom';

export function FirmCard({ firm }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/firma/${firm.slug}`);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="cursor-pointer hover:shadow-lg transition-shadow"
    >
      <h3>{firm.name}</h3>
      <p>{firm.rating} ⭐</p>
      <p className="text-primary">{firm.priceRange}</p>
    </div>
  );
}
```

#### Testing Checklist
- [ ] Click firm card on `/umzugsfirmen`
- [ ] Verify navigation to `/firma/{slug}`
- [ ] Verify firm details display
- [ ] Verify hover state (cursor changes to pointer)
- [ ] Verify touch-friendly on mobile

#### Effort
**Estimate**: 1-2 hours  
**Complexity**: Low  
**Risk**: Low

#### Expected Result
- ✅ Firm profile CTR: 0% → 30-40%
- ✅ Conversion funnel opens
- ✅ Lead generation possible from directory

---

### 🔴 Issue #5.2: Missing Primary CTA Button on Firm Card

**Status**: 🔴 Open  
**Severity**: HIGH  
**Funnel**: #5 Firmenverzeichnis  
**Route**: `/umzugsfirmen`  
**Impact**: Unclear interaction model, low engagement

#### Problem
```
User sees firm card but:
- ❌ No button visible
- ❌ No clear "next action"
- ❌ Uncertain if card is clickable
- ❌ User doesn't know what to do next
```

#### Root Cause
Missing explicit CTA button on each card.

#### Solution

**File to Modify**: `src/components/FirmCard.tsx` (or similar)

**Code Changes Required**:
```typescript
export function FirmCard({ firm }) {
  const navigate = useNavigate();

  const handleContact = () => {
    navigate(`/firma/${firm.slug}#contact`);
  };

  return (
    <div className="firm-card border rounded-lg p-4">
      {/* Card content */}
      <h3>{firm.name}</h3>
      <p>{firm.rating} ⭐ ({firm.reviewCount} Bewertungen)</p>
      <p className="text-gray-600">{firm.description}</p>
      
      {/* Price range */}
      <div className="my-3 bg-gray-100 p-2 rounded">
        <p className="text-sm text-gray-600">Preisspanne</p>
        <p className="font-bold">{firm.priceRange}</p>
      </div>

      {/* Primary CTA */}
      <button
        onClick={handleContact}
        className="w-full bg-red-600 text-white py-2 px-4 rounded font-semibold hover:bg-red-700"
      >
        Offerte anfordern
      </button>
    </div>
  );
}
```

#### Styling
- **Button**: Red (primary brand color)
- **Text**: "Offerte anfordern" or "Profil ansehen"
- **Size**: Full width on card
- **Hover**: Darker red, slight lift effect

#### Testing Checklist
- [ ] Button visible on each firm card
- [ ] Button text clear and actionable
- [ ] Click button → Navigate to contact form
- [ ] Button styling matches brand
- [ ] Mobile: Button is touch-friendly (44px+ height)

#### Effort
**Estimate**: 1 hour  
**Complexity**: Low  
**Risk**: Low

#### Expected Result
- ✅ User clarity: +50%
- ✅ CTR improvement: +20-30%
- ✅ Conversion rate: Better signposting

---

## Medium Priority Issues (Test & Iterate)

### 🟡 Issue #3.1: Video Upload Flow Incomplete

**Status**: 📋 Needs Testing  
**Severity**: MEDIUM  
**Funnel**: #3 Video-Offerte  
**Route**: `/video`  
**Blocker**: No test video file available

#### What We Know
- ✅ Page loads fast
- ✅ Upload button visible
- ✅ File dialog opens
- ⚠️ Upload result: **UNKNOWN**
- ⚠️ Analysis response: **UNKNOWN**
- ⚠️ Results display: **UNKNOWN**

#### Testing Action Items
1. **Create test video file**
   - Format: MP4 (or supported format)
   - Size: <10 MB (per constraints)
   - Content: Sample room/apartment footage
   
2. **Execute full flow**
   - Upload video
   - Wait for analysis
   - Verify results display
   - Check price estimate accuracy
   
3. **Test error cases**
   - Upload invalid format → Error message
   - Upload >10 MB → Error message
   - Upload timeout → Graceful handling

#### Effort
**Estimate**: 1-2 hours  
**Complexity**: Medium (depends on test setup)  
**Risk**: Medium

#### Timeline
**Deadline**: 2026-02-01 (Friday)

---

### 🟡 Issue #4.1: Photo Upload Flow Incomplete

**Status**: 📋 Needs Testing  
**Severity**: MEDIUM  
**Funnel**: #4 AI Photo Upload  
**Route**: `/rechner/ai`  
**Blocker**: No test photo files available

#### What We Know
- ✅ Page loads fast
- ✅ Drag-drop zone visible
- ✅ Upload button visible
- ⚠️ Upload result: **UNKNOWN**
- ⚠️ KI analysis: **UNKNOWN**
- ⚠️ Inventory recognition: **UNKNOWN**
- ⚠️ Price estimation: **UNKNOWN**

#### Testing Action Items
1. **Create test image files**
   - Format: JPG/PNG (per constraints)
   - Size: <10 MB each, max 10 total
   - Content: Interior photos (kitchen, bedroom, furniture)
   
2. **Test drag-drop upload**
   - Drag images onto drop zone
   - Verify upload progress
   - Verify "Mit KI analysieren" button activates
   
3. **Verify KI analysis**
   - Click "Mit KI analysieren"
   - Wait for analysis
   - Verify inventory detection (furniture, boxes, etc.)
   - Verify price estimate displays
   
4. **Test error cases**
   - Upload invalid format → Error
   - Upload >10 MB → Error
   - Upload >10 files → Error
   - Analysis timeout → Graceful handling

#### Effort
**Estimate**: 2 hours  
**Complexity**: Medium (multi-file, async analysis)  
**Risk**: Medium

#### Timeline
**Deadline**: 2026-02-01 (Friday)

---

## 📊 Development Roadmap

### Week 1 Sprint (2026-01-28 - 2026-02-03)

```
PRIORITY 1: Fix Critical Issues (Tue-Wed)
─────────────────────────────────────────
[x] #2.1 URL Prepopulation         [2-3h] Developer
[x] #5.1 Card Click Handler        [1-2h] Developer  
[x] #5.2 CTA Button                [1h]   Developer
    SUBTOTAL: ~4-5 hours

PRIORITY 2: Complete Testing (Wed-Fri)
─────────────────────────────────────────
[ ] #3.1 Video Upload E2E          [1-2h] QA
[ ] #4.1 Photo Upload E2E          [2h]   QA
    SUBTOTAL: ~4 hours

PRIORITY 3: Retest + Verify (Fri)
─────────────────────────────────────────
[ ] Retest #2 after fix
[ ] Retest #5 after fix
[ ] Complete #3, #4 testing
    SUBTOTAL: ~3 hours

TOTAL WEEK 1: ~11-12 hours
```

### Week 2 Sprint (2026-02-04 - 2026-02-10)

```
[ ] Test Funnels #6-10             [10-12h] QA
[ ] Implement fixes from Week 1   [4-6h]  Developer
[ ] Report Week 2 results
```

---

## Git Issues Template

Use this template to create GitHub Issues:

```markdown
## Issue #2.1: URL Parameters Not Prepopulated in Vergleich Wizard

**Severity**: HIGH  
**Funnel**: #2 Vergleich Wizard  
**Type**: Bug - UX Friction  

### Description
When users navigate from Homepage to Vergleich Wizard with URL params 
(e.g., /vergleich?from=8001&to=3000), the form fields are not prepopulated.

### Current Behavior
- User fills: von=8001, nach=3000, rooms=2
- Clicks "Jetzt checken lassen"
- Redirects to /vergleich?from=8001&to=3000&rooms=2
- Form shows EMPTY fields
- User must re-enter data

### Expected Behavior
- Form fields auto-populate from URL params
- Toast notification: "Ihre Angaben vorausgefüllt"
- User can proceed or edit values

### Impact
- Form completion: -15-20%
- User friction: +30 seconds
- Bounce rate: +10-15%

### Solution
Parse URL params in VergleichWizard component and populate form state.

### Files to Modify
- src/pages/VergleichWizard.tsx

### Acceptance Criteria
- [ ] Navigate to /vergleich?from=8001&to=3000&rooms=2
- [ ] "Von" field shows "8001"
- [ ] "Nach" field shows "3000"
- [ ] "Zimmer" field shows "2"
- [ ] Toast notification displays
- [ ] Fields are editable

### Effort
2-3 hours

### Testing
Test plan in FUNNEL_TEST_RESULTS_WEEK1.md
```

---

## Success Metrics

After all fixes implemented:

| Metric | Before | Target | Impact |
|--------|--------|--------|--------|
| Vergleich form completion | ~50% | ~70% | +40% |
| Directory → Profile CTR | 0% | 30-40% | Opens funnel |
| Video upload completion | Unknown | >50% | New funnel open |
| Photo upload completion | Unknown | >50% | New funnel open |
| Overall lead conversion | ~20% | ~35% | **+75%** |

---

## File References

| Document | Purpose |
|----------|---------|
| [FUNNEL_TEST_RESULTS_WEEK1.md](FUNNEL_TEST_RESULTS_WEEK1.md) | Full test results & context |
| [AUTONOMOUS_QA_FRAMEWORK.md](AUTONOMOUS_QA_FRAMEWORK.md) | Testing methodology |
| [TOP_10_MARKETING_FUNNELS_AGENT_PROMPT.md](TOP_10_MARKETING_FUNNELS_AGENT_PROMPT.md) | Extended funnel testing |

---

**Version**: 1.0  
**Status**: Ready for Development  
**Created**: 2026-01-28  
**Assigned To**: Development Team
