-- Add RLS policies for move_updates table (INSERT, UPDATE, DELETE)
-- Only admins can insert move updates
CREATE POLICY "Admins can insert move updates"
ON public.move_updates
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role IN ('admin', 'moderator')
  )
);

-- Only admins can update move updates
CREATE POLICY "Admins can update move updates"
ON public.move_updates
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role IN ('admin', 'moderator')
  )
);

-- Only admins can delete move updates
CREATE POLICY "Admins can delete move updates"
ON public.move_updates
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role IN ('admin', 'moderator')
  )
);

-- Add explicit SELECT deny for anonymous users on contact_submissions
-- First drop the existing policy if any that allows public select
DROP POLICY IF EXISTS "Public can view contact submissions" ON public.contact_submissions;

-- Ensure only authenticated admins can SELECT contact submissions
CREATE POLICY "Only admins can view contact submissions"
ON public.contact_submissions
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role IN ('admin', 'moderator')
  )
);