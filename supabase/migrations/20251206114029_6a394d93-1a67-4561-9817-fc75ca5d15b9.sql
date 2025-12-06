-- Fix Critical: Newsletter Subscribers - restrict SELECT to own email only
DROP POLICY IF EXISTS "Users can view their own subscription" ON newsletter_subscribers;
CREATE POLICY "Users can view their own subscription" ON newsletter_subscribers
  FOR SELECT USING (auth.email() = email);

-- Add admin access to newsletter subscribers
CREATE POLICY "Admins can manage newsletter subscribers" ON newsletter_subscribers
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Fix Critical: Email Queue - require admin role
DROP POLICY IF EXISTS "Admins can manage email queue" ON email_queue;
CREATE POLICY "Admins can manage email queue" ON email_queue
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Fix Warning: Email Campaigns - require admin role
DROP POLICY IF EXISTS "Admins can manage email campaigns" ON email_campaigns;
CREATE POLICY "Admins can manage email campaigns" ON email_campaigns
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));