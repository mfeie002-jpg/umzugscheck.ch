-- Create paid_launch_checklist table for tracking P0/P1/P2 implementation tasks
CREATE TABLE public.paid_launch_checklist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site TEXT NOT NULL CHECK (site IN ('feierabend', 'umzugscheck', 'both')),
  priority TEXT NOT NULL CHECK (priority IN ('p0', 'p1', 'p2')),
  category TEXT NOT NULL CHECK (category IN ('tracking', 'landing', 'copy', 'dev', 'ops')),
  title TEXT NOT NULL,
  goal TEXT,
  change_description TEXT,
  acceptance_criteria TEXT[],
  owner TEXT CHECK (owner IN ('dev', 'tracking', 'copy', 'ops')),
  complexity TEXT CHECK (complexity IN ('s', 'm', 'l')),
  status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done', 'blocked')),
  blocked_reason TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.paid_launch_checklist ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users to read/write
CREATE POLICY "Authenticated users can manage paid launch checklist"
ON public.paid_launch_checklist
FOR ALL
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Create index for common queries
CREATE INDEX idx_paid_launch_checklist_priority ON public.paid_launch_checklist(priority);
CREATE INDEX idx_paid_launch_checklist_status ON public.paid_launch_checklist(status);

-- Create trigger for updated_at
CREATE TRIGGER update_paid_launch_checklist_updated_at
BEFORE UPDATE ON public.paid_launch_checklist
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Seed with all 20+ implementation tasks from research
INSERT INTO public.paid_launch_checklist (site, priority, category, title, goal, change_description, acceptance_criteria, owner, complexity, status) VALUES
-- P0 - Must do before ads launch
('feierabend', 'p0', 'dev', 'Create /danke thank-you page', 'Enable reliable conversion tracking with unique URL', 'Create /danke route that renders confirmation + fires conversion event', ARRAY['Page loads at /danke?type=form&phone=xxx', 'GA4 form_submit event fires on page load', 'Shows estimated callback time', 'Mobile-optimized'], 'dev', 's', 'todo'),
('feierabend', 'p0', 'tracking', 'Add gclid/gbraid/wbraid to form submission', 'Enable offline conversion import to Google Ads', 'Extend contact_submissions table with gclid, gbraid, wbraid columns. On form submit, read from localStorage and persist to DB', ARRAY['Test: Land with ?gclid=test123, submit form, verify gclid in DB', 'Migration runs without errors'], 'dev', 'm', 'todo'),
('feierabend', 'p0', 'tracking', 'Verify and configure GA4 tracking', 'Ensure baseline analytics working before ads', 'Audit GA4 implementation, verify page views + events', ARRAY['Real-time view shows page views', 'phone_click event fires on tel: clicks', 'whatsapp_click event fires on WhatsApp button'], 'tracking', 's', 'todo'),
('feierabend', 'p0', 'tracking', 'Set up Google Ads conversion tracking', 'Import conversions from GA4 to Google Ads', 'Link GA4 to Google Ads in admin. Import form_submit and phone_click as conversion actions', ARRAY['Conversions visible in Google Ads interface', 'Attribution model set (position-based or last-click)'], 'tracking', 's', 'todo'),
('feierabend', 'p0', 'dev', 'Implement Consent Mode v2', 'Comply with Swiss/EU requirements, maintain conversion modeling', 'Add consent default state + update logic to GTM/direct', ARRAY['Default state is denied for all consent types', 'On cookie accept, state updates to granted', 'Tag Assistant shows consent mode signals'], 'dev', 'm', 'todo'),
('feierabend', 'p0', 'copy', 'Verify trust claims accuracy', 'Avoid credibility damage from unsubstantiated claims', 'Verify "seit 1980", "CHF 2 Mio versichert", review counts', ARRAY['Founding date confirmed with documentation', 'Insurance certificate on file', 'Review count matches Google/Trustpilot'], 'copy', 's', 'todo'),

-- P1 - Do within 2 weeks (Optimization)
('feierabend', 'p1', 'dev', 'Add micro-qualifier toggles to ExpressQuoteForm', 'Filter premium leads, improve call quality', 'Add checkboxes after PLZ entry: Premium service, Special items', ARRAY['Toggles visible on mobile with 52px+ touch targets', 'Data persisted to form submission', 'Staff can see qualifiers in leads'], 'dev', 's', 'todo'),
('feierabend', 'p1', 'dev', 'Add availability indicator to hero', 'Increase phone calls by showing live status', 'Add "🟢 Jetzt erreichbar" dynamic indicator based on time', ARRAY['Shows green 08-20 Uhr, switches to WhatsApp jetzt after 20:00', 'Mobile-visible above fold'], 'dev', 's', 'todo'),
('feierabend', 'p1', 'copy', 'Improve paid landing page copy', 'Increase phone call conversion rate', 'Update hero copy on /paid/zuerich and /paid/zug per CRO recommendations', ARRAY['New headline: 1 Anruf. Alles erledigt.', 'Trust row visible', 'Phone number prominent'], 'copy', 's', 'todo'),
('feierabend', 'p1', 'tracking', 'Add call tracking phone number swap (optional)', 'Attribute calls to specific campaigns/keywords', 'Evaluate call tracking provider (CallRail/Dialpad) or continue with static number', ARRAY['Decision documented: static vs dynamic', 'If dynamic: numbers swap correctly per campaign'], 'tracking', 'm', 'todo'),
('both', 'p1', 'dev', 'Create Feierabend listing on Umzugscheck.ch', 'Use portal as credibility proof', 'Ensure Feierabend appears as premium/featured provider', ARRAY['Feierabend visible in company listings', 'Featured or Premium badge applied', 'Link to feierabend-umzug.ch works'], 'dev', 's', 'todo'),
('feierabend', 'p1', 'copy', 'Add "Bekannt aus" trust bar if press exists', 'Increase trust for cold traffic', 'Add media logos if genuine press mentions exist (SRF, NZZ, 20min)', ARRAY['Only real mentions displayed', 'Grayscale logos with hover color', 'Links to articles if available'], 'copy', 's', 'todo'),
('feierabend', 'p1', 'dev', 'Optimize WhatsApp after-hours flow', 'Capture leads when phone unavailable', 'Implement auto-reply sequence with callback registration', ARRAY['Auto-reply triggers after 20:00', 'Captures PLZ and callback preference', 'Staff receives notification'], 'dev', 'm', 'todo'),

-- P2 - Later (Enhancement)
('feierabend', 'p2', 'dev', 'Create English landing page for expats', 'Capture high-value expat relocation leads', 'Translate /paid/zuerich to English, create /en/moving-zurich', ARRAY['English copy reviewed by native speaker', 'Linked from EN Google Ads campaign', 'Phone works for EN callers'], 'dev', 'm', 'todo'),
('feierabend', 'p2', 'tracking', 'Implement offline conversion upload pipeline', 'Feed actual booking data back to Google Ads', 'Weekly CSV export of gclid + conversion status + value', ARRAY['Export script runs weekly', 'Google Ads imports successfully', 'Conversion values visible in reports'], 'tracking', 'l', 'todo'),
('feierabend', 'p2', 'dev', 'Add price calculator/estimator', 'Engage users before call, qualify intent', 'Add simple 3-step estimator (rooms, services, distance) → range', ARRAY['Shows CHF range (not exact quote)', 'Für exakten Preis: Jetzt anrufen CTA', 'Tracks calculator usage'], 'dev', 'm', 'todo'),
('both', 'p2', 'tracking', 'Implement retargeting audiences', 'Re-engage visitors who did not convert', 'Create GA4 audiences: VIP page visitors, form starters, phone clickers. Export to Google Ads for remarketing', ARRAY['Audiences populate in Google Ads', 'Retargeting campaign can be launched'], 'tracking', 'm', 'todo'),
('feierabend', 'p2', 'dev', 'Add schema.org LocalBusiness markup', 'Improve rich snippets in organic search', 'Add structured data for business info, reviews, services', ARRAY['Schema validator passes', 'Rich snippets visible in search (name, phone, rating)'], 'dev', 's', 'todo'),
('feierabend', 'p2', 'tracking', 'Implement Facebook/Meta Pixel + CAPI', 'Enable Meta retargeting if channel is tested', 'Add Meta Pixel with Conversions API for server-side tracking', ARRAY['Pixel fires on page views', 'CAPI sends lead events from backend', 'Consent Mode integrated'], 'tracking', 'l', 'todo'),
('feierabend', 'p2', 'dev', 'Add live chat/callback widget', 'Capture hesitant visitors', 'Evaluate Tidio/Intercom or custom callback widget', ARRAY['Widget visible on mobile (non-intrusive)', 'Captures phone + preferred callback time', 'Staff notified immediately'], 'dev', 'm', 'todo'),
('feierabend', 'p2', 'dev', 'Create A/B test for headline variants', 'Optimize conversion rate systematically', 'Set up 2-3 headline variants on /paid/zuerich', ARRAY['Traffic split evenly', 'Conversion rate tracked per variant', 'Winner identified after 100+ conversions'], 'dev', 'm', 'todo');