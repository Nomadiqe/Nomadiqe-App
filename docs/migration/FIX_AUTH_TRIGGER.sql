-- ================================================
-- CRITICAL FIX: Auto-create public.users on signup
-- ================================================
-- Run this in Supabase Dashboard → SQL Editor
--
-- This trigger automatically creates a user record in public.users
-- when a new user signs up via Supabase Auth (auth.users)
--
-- Without this, users can sign up but have no profile in the app!
-- ================================================

-- 1. Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.users (
    id,
    email,
    name,
    "fullName",
    "emailVerified",
    "createdAt",
    "updatedAt"
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.email_confirmed_at IS NOT NULL,
    NOW(),
    NOW()
  );
  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    -- User already exists, this is fine
    RETURN NEW;
  WHEN OTHERS THEN
    -- Log error but don't fail the signup
    RAISE WARNING 'Error creating user profile: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- 2. Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 3. Create trigger to call function on new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 4. Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated;
GRANT ALL ON public.users TO postgres, authenticated;

-- ================================================
-- TEST THE TRIGGER (Optional)
-- ================================================
-- Uncomment to test if trigger works:
--
-- -- Create test user in auth.users
-- INSERT INTO auth.users (
--   id,
--   email,
--   encrypted_password,
--   email_confirmed_at,
--   raw_user_meta_data,
--   created_at,
--   updated_at
-- )
-- VALUES (
--   gen_random_uuid(),
--   'trigger-test@example.com',
--   crypt('password123', gen_salt('bf')),
--   NOW(),
--   '{"name": "Test User"}'::jsonb,
--   NOW(),
--   NOW()
-- );
--
-- -- Check if user was created in public.users
-- SELECT * FROM public.users WHERE email = 'trigger-test@example.com';
--
-- -- Clean up test
-- DELETE FROM public.users WHERE email = 'trigger-test@example.com';
-- DELETE FROM auth.users WHERE email = 'trigger-test@example.com';

-- ================================================
-- VERIFICATION QUERIES
-- ================================================
-- Check if trigger exists:
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- Check if function exists:
SELECT 
  routine_name,
  routine_type
FROM information_schema.routines
WHERE routine_name = 'handle_new_user';

-- ================================================
-- SUCCESS!
-- ================================================
-- After running this script:
-- 1. New users will automatically get a public.users record
-- 2. Sign-up should work in your app
-- 3. You can test by creating a new account
-- ================================================

