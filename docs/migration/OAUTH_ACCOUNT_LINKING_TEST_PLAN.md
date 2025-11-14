# OAuth Account Linking - Test Plan & Verification

**Purpose**: Verify that when a user signs in with OAuth (e.g., Google) using the same email as an existing email/password account, Supabase automatically links the accounts instead of creating a duplicate user.

**Date Created**: November 14, 2025
**Prerequisites**: Account linking must be enabled in Supabase Dashboard

---

## 🔧 Pre-Test Setup

### 1. Enable Account Linking in Supabase Dashboard

**Navigate to**: https://supabase.com/dashboard/project/fjltqzdcnqjloxxshywg/auth/settings

1. Go to **Authentication → Settings**
2. Find **"Security and Protection"** section
3. Enable **"Enable automatic linking of accounts with the same email"** ✅
4. Enable **"Enable email confirmations"** ✅ (for security)
5. Click **Save**

### 2. Verify Google OAuth Configuration

**Navigate to**: https://supabase.com/dashboard/project/fjltqzdcnqjloxxshywg/auth/providers

Check Google Provider settings:
- ✅ **Enabled**: YES
- ✅ **Client ID**: `625220155191-2qqgeha032kvtgr7cvaa837qo20an8uo.apps.googleusercontent.com`
- ✅ **Client Secret**: (should be filled in dashboard)
- ✅ **Redirect URL**: `https://fjltqzdcnqjloxxshywg.supabase.co/auth/v1/callback`

---

## 🧪 Test Scenarios

### Test 1: Email/Password First → Google OAuth Second (PRIMARY TEST)

**Goal**: Verify that signing in with Google DOES NOT create a duplicate user when email already exists.

#### Step 1: Create Email/Password Account

1. Open browser: http://localhost:3001/auth/signup
2. Fill in signup form:
   ```
   Email: test-linking@yourdomain.com
   Password: TestPassword123!
   Confirm Password: TestPassword123!
   ```
3. Click **"Crea account"**
4. **Expected**:
   - Success message appears
   - Redirected to `/onboarding`
   - If email confirmation required: Check inbox for confirmation email

5. **Verify in Supabase Dashboard**:
   - Go to **Authentication → Users**
   - Find user with email `test-linking@yourdomain.com`
   - **Note the User ID** (e.g., `abc-123-def-456`)
   - Verify **only ONE identity** exists (provider: `email`)

#### Step 2: Sign Out

1. Sign out of the application
2. Verify session is cleared (check cookies in DevTools)

#### Step 3: Sign In with Google (Same Email)

1. Go to: http://localhost:3001/auth/signin
2. Click **"Continua con Google"**
3. **In Google OAuth screen**:
   - ⚠️ **IMPORTANT**: Use the SAME email: `test-linking@yourdomain.com`
   - Complete Google authentication
4. **Expected**:
   - Redirected back to your app
   - Signed in successfully
   - Redirected to `/dashboard`

#### Step 4: Verify Account Linking (CRITICAL)

**In Supabase Dashboard → Authentication → Users**:

1. Search for: `test-linking@yourdomain.com`
2. **Verify ONLY ONE user exists** ✅
3. Click on the user to view details
4. **Verify User ID matches** the ID from Step 1 (e.g., `abc-123-def-456`)
5. Check **Identities** section - should show **TWO identities**:
   ```
   Identity 1:
   - Provider: email
   - Created: [earlier timestamp]

   Identity 2:
   - Provider: google
   - Created: [later timestamp]
   ```

**SQL Verification** (run in Supabase SQL Editor):

```sql
-- Check user and their identities
SELECT
  u.id,
  u.email,
  u.email_confirmed_at,
  u.created_at,
  json_agg(
    json_build_object(
      'provider', i.provider,
      'provider_id', i.provider_id,
      'created_at', i.created_at
    ) ORDER BY i.created_at
  ) as identities,
  COUNT(i.id) as identity_count
FROM auth.users u
LEFT JOIN auth.identities i ON i.user_id = u.id
WHERE u.email = 'test-linking@yourdomain.com'
GROUP BY u.id, u.email, u.email_confirmed_at, u.created_at;
```

**Expected Output**:
```json
{
  "id": "abc-123-def-456",
  "email": "test-linking@yourdomain.com",
  "email_confirmed_at": "2025-11-14T10:00:00.000Z",
  "created_at": "2025-11-14T10:00:00.000Z",
  "identity_count": 2,
  "identities": [
    {
      "provider": "email",
      "provider_id": "abc-123-def-456",
      "created_at": "2025-11-14T10:00:00.000Z"
    },
    {
      "provider": "google",
      "provider_id": "google-user-id-12345",
      "created_at": "2025-11-14T11:30:00.000Z"
    }
  ]
}
```

#### Step 5: Verify Both Login Methods Work

1. **Sign out**
2. **Sign in with Email/Password**:
   - Email: `test-linking@yourdomain.com`
   - Password: `TestPassword123!`
   - **Expected**: ✅ Login successful
3. **Sign out**
4. **Sign in with Google**:
   - Use same Google account
   - **Expected**: ✅ Login successful
5. **Verify**: Both methods log into the SAME user account

---

### Test 2: Google OAuth First → Email/Password Second

**Goal**: Verify that trying to create an email/password account with an email that already exists via OAuth either links the account or shows an appropriate error.

#### Step 1: Create Google OAuth Account

1. Go to: http://localhost:3001/auth/signin
2. Click **"Continua con Google"**
3. Use email: `oauth-first@yourdomain.com`
4. Complete authentication
5. **Expected**: Account created, redirected to `/onboarding`

#### Step 2: Verify in Supabase

1. Go to **Authentication → Users**
2. Find user: `oauth-first@yourdomain.com`
3. **Note User ID**
4. Verify **only ONE identity** (provider: `google`)

#### Step 3: Attempt Email/Password Signup

1. Sign out
2. Go to: http://localhost:3001/auth/signup
3. Try to sign up with:
   ```
   Email: oauth-first@yourdomain.com
   Password: NewPassword123!
   ```
4. Click **"Crea account"**
5. **Expected Behavior** (one of these):
   - **Option A**: Error message: "Email già registrato" or "User already registered"
   - **Option B**: Account linked successfully (if Supabase configured this way)

#### Step 4: Verify No Duplicate User

1. Check Supabase Dashboard → Users
2. **Verify**: Still only ONE user with email `oauth-first@yourdomain.com`
3. **If linking occurred**: Verify user now has TWO identities (google + email)

---

### Test 3: Multiple OAuth Providers

**Goal**: Verify linking works with multiple OAuth providers.

**Prerequisites**:
- Enable Facebook or Apple OAuth in Supabase Dashboard
- Configure OAuth credentials

#### Steps:

1. Create account with Google: `multi-oauth@yourdomain.com`
2. Sign out
3. Sign in with Facebook using SAME email: `multi-oauth@yourdomain.com`
4. **Expected**: Account linked, not duplicated
5. **Verify in Supabase**: User has multiple identities:
   - google
   - facebook

---

## 🔍 Verification Checklist

After completing tests, verify:

### Database Checks

- [ ] No duplicate users with same email in `auth.users`
- [ ] Each user has multiple entries in `auth.identities` table
- [ ] All identities share the same `user_id`

### Functionality Checks

- [ ] Can sign in with email/password after linking Google
- [ ] Can sign in with Google after linking email/password
- [ ] User data (profile, posts, etc.) is consistent regardless of login method
- [ ] Session works correctly with both auth methods

### Security Checks

- [ ] Email confirmation enabled for security
- [ ] Account linking only works with verified emails
- [ ] Cannot link accounts with unverified emails

---

## 📊 SQL Queries for Verification

### Find All Users with Multiple Identities

```sql
SELECT
  u.id,
  u.email,
  COUNT(i.id) as identity_count,
  string_agg(i.provider, ', ' ORDER BY i.created_at) as providers
FROM auth.users u
LEFT JOIN auth.identities i ON i.user_id = u.id
GROUP BY u.id, u.email
HAVING COUNT(i.id) > 1
ORDER BY u.created_at DESC;
```

### Check Specific User's Identities

```sql
SELECT
  u.id as user_id,
  u.email,
  u.created_at as user_created,
  i.id as identity_id,
  i.provider,
  i.provider_id,
  i.created_at as identity_created
FROM auth.users u
LEFT JOIN auth.identities i ON i.user_id = u.id
WHERE u.email = 'your-test-email@example.com'
ORDER BY i.created_at;
```

### Find Duplicate Emails (Should Return ZERO Results)

```sql
-- This should return ZERO rows if account linking works correctly
SELECT
  email,
  COUNT(*) as duplicate_count
FROM auth.users
GROUP BY email
HAVING COUNT(*) > 1;
```

### Check Your Custom users Table

```sql
-- Verify your custom users table matches auth.users
SELECT
  au.id,
  au.email,
  cu.email as custom_email,
  cu."fullName",
  au.created_at,
  COUNT(ai.id) as identity_count
FROM auth.users au
LEFT JOIN public.users cu ON cu.id = au.id
LEFT JOIN auth.identities ai ON ai.user_id = au.id
WHERE au.email = 'test-linking@yourdomain.com'
GROUP BY au.id, au.email, cu.email, cu."fullName", au.created_at;
```

---

## ⚠️ Common Issues & Solutions

### Issue 1: Duplicate Users Still Created

**Symptom**: Multiple users with same email in `auth.users`

**Cause**: Account linking not enabled in Supabase Dashboard

**Solution**:
1. Go to Supabase Dashboard → Authentication → Settings
2. Enable "automatic linking of accounts with same email"
3. Save changes
4. Test again with NEW email addresses

---

### Issue 2: "Email Already Registered" Error

**Symptom**: Error when trying OAuth after email/password signup

**Diagnosis**: This might be CORRECT behavior depending on configuration

**What to Check**:
- If you get this error when using OAuth FIRST, then email signup SECOND: ✅ This is correct
- If you get this error when using email/password FIRST, then OAuth SECOND: ❌ Account linking not working

**Solution**: Verify account linking is enabled in dashboard

---

### Issue 3: Accounts Link But User Data Missing

**Symptom**: OAuth login works but user profile is incomplete

**Cause**: Your custom `users` table might not be auto-populated on OAuth

**Solution**: Check database trigger `handle_new_user` in Supabase:

```sql
-- Verify trigger exists
SELECT * FROM pg_trigger
WHERE tgname = 'on_auth_user_created';

-- If trigger doesn't exist, create it
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, "fullName", created_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.created_at
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

---

### Issue 4: Email Verification Blocking Account Linking

**Symptom**: Accounts don't link when email not verified

**Diagnosis**: This is CORRECT security behavior

**Solution**:
- User must verify email before account linking works
- Or disable email confirmation (NOT recommended for production)

---

## ✅ Success Criteria

Account linking is working correctly if:

1. ✅ **Single User**: Only ONE user entry in `auth.users` per email
2. ✅ **Multiple Identities**: User has multiple entries in `auth.identities`
3. ✅ **Both Methods Work**: Can log in with email/password AND OAuth
4. ✅ **Data Consistency**: Same user data regardless of login method
5. ✅ **No Duplicates**: SQL query for duplicate emails returns ZERO results
6. ✅ **Security**: Email verification prevents unauthorized account linking

---

## 📝 Test Results Template

**Test Date**: _______________
**Tester**: _______________
**Supabase Project**: fjltqzdcnqjloxxshywg

### Test 1: Email → OAuth
- [ ] Email/password account created
- [ ] Google OAuth sign-in successful
- [ ] Only ONE user in database
- [ ] User has TWO identities
- [ ] Both login methods work

**Issues Found**: _______________

### Test 2: OAuth → Email
- [ ] Google account created
- [ ] Email signup attempt result: _______________
- [ ] No duplicate users
- [ ] Appropriate behavior (error or link)

**Issues Found**: _______________

### Test 3: Multiple OAuth
- [ ] Not tested
- [ ] Tested - Results: _______________

**Overall Status**: ⏳ IN PROGRESS / ✅ PASSED / ❌ FAILED

**Notes**:
_______________________________________
_______________________________________

---

## 🚀 Next Steps After Testing

If all tests pass:
1. ✅ Mark account linking as verified
2. ✅ Document the configuration in production deployment guide
3. ✅ Add to user manual/documentation
4. ✅ Consider adding UI to show linked accounts in user settings

If tests fail:
1. ❌ Review Supabase Dashboard settings
2. ❌ Check environment variables
3. ❌ Verify OAuth provider configuration
4. ❌ Review auth callback handler code
5. ❌ Check database triggers

---

**Generated**: November 14, 2025
**For Project**: Nomadiqe Platform
**Supabase Migration**: Complete
