-- Fix conflicting RLS policies on contact_submissions
-- Drop redundant SELECT policy
DROP POLICY IF EXISTS "Admins can view all submissions" ON public.contact_submissions;

-- Add DELETE policy for admins
CREATE POLICY "Admins can delete contact submissions"
ON public.contact_submissions
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role IN ('admin'::app_role, 'moderator'::app_role)
  )
);

-- Add UPDATE policy for documents
CREATE POLICY "Users can update their own documents"
ON public.documents
FOR UPDATE
USING (auth.uid() = user_id);

-- Add constraint to prevent users from setting is_from_team to true
-- Using a trigger since RLS can't directly constrain values during INSERT
CREATE OR REPLACE FUNCTION public.validate_message_from_team()
RETURNS TRIGGER AS $$
BEGIN
  -- Only allow is_from_team = true if user is admin/moderator
  IF NEW.is_from_team = true THEN
    IF NOT EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role IN ('admin'::app_role, 'moderator'::app_role)
    ) THEN
      NEW.is_from_team := false;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS validate_message_from_team_trigger ON public.messages;
CREATE TRIGGER validate_message_from_team_trigger
BEFORE INSERT ON public.messages
FOR EACH ROW
EXECUTE FUNCTION public.validate_message_from_team();