-- Remove the restrictive check constraint on variant_name
ALTER TABLE public.flow_feedback_variants DROP CONSTRAINT IF EXISTS flow_feedback_variants_variant_name_check;