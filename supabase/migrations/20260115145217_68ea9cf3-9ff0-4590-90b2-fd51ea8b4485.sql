
-- Make user_id nullable in reviews table for seeded demo reviews
ALTER TABLE public.reviews ALTER COLUMN user_id DROP NOT NULL;
