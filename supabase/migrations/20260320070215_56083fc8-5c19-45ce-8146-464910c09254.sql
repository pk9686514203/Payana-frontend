-- Step 1: Drop FK constraints and make user_id nullable
ALTER TABLE public.agents DROP CONSTRAINT IF EXISTS agents_user_id_fkey;
ALTER TABLE public.vehicle_owners DROP CONSTRAINT IF EXISTS vehicle_owners_user_id_fkey;
ALTER TABLE public.agents ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE public.vehicle_owners ALTER COLUMN user_id DROP NOT NULL;