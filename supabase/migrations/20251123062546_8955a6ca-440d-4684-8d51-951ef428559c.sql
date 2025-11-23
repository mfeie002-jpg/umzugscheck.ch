-- Add foreign key relationship between reviews and profiles
-- Since both reviews.user_id and profiles.id reference auth.users(id),
-- we can create a foreign key constraint
ALTER TABLE public.reviews
ADD CONSTRAINT reviews_user_id_profiles_fkey
FOREIGN KEY (user_id)
REFERENCES public.profiles(id)
ON DELETE CASCADE;