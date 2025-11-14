# OAuth Account Linking Setup Guide

## 🎯 Problem Statement

**Issue:** When a user signs up with email/password (e.g., `user@example.com`), then later tries to sign in with Google using the same email, we DON'T want to create a duplicate user.

**Solution:** Configure Supabase to automatically link OAuth accounts to existing users with the same email.

---

## 🔧 Supabase Dashboard Configuration

### Step 1: Enable Account Linking

1. **Go to Supabase Dashboard:**
   - URL: https://supabase.com/dashboard/project/fjltqzdcnqjloxxshywg
   - Navigate to: **Authentication → Settings**

2. **Configure Email Settings:**
   - Scroll to **"Email Auth"** section
   - ✅ **Enable Email Confirmations** (IMPORTANT!)
   - This ensures email is verified before account linking

3. **Enable Automatic Account Linking:**
   - Look for **"Security and Protection"** section
   - Find **"Enable automatic linking of accounts with the same email"**
   - ✅ **Toggle this ON**

### Step 2: Verify OAuth Provider Settings

1. **Go to:** Authentication → Providers
2. **Find Google Provider**
3. **Verify Configuration:**
   - ✅ Enabled: YES
   - Client ID: 625220155191-2qqgeha032kvtgr7cvaa837qo20an8uo.apps.googleusercontent.com
   - Client Secret: (should be set in dashboard)
   - Authorized redirect URLs: Should include:
     - `https://fjltqzdcnqjloxxshywg.supabase.co/auth/v1/callback`
     - `http://localhost:3001/auth/callback` (for development)

---

## 🔍 How Account Linking Works

### Scenario 1: Email/Password First, Then OAuth
```
1. User signs up with email/password:
   ✉️ user@example.com / password123
   → User created in auth.users (id: abc-123)
   → Identity: email

2. Later, user clicks "Sign in with Google":
   🔐 Google returns: user@example.com
   → Supabase checks: Does user@example.com exist? YES!
   → Supabase links: Google identity to user abc-123
   → User now has TWO identities:
     - email (password-based)
     - google.com (OAuth)
   → NO duplicate user created ✅
```

### Scenario 2: OAuth First, Then Email/Password
```
1. User signs in with Google:
   🔐 Google: user@example.com
   → User created in auth.users (id: abc-123)
   → Identity: google.com

2. Later, user tries to sign up with email/password:
   ✉️ user@example.com / password123
   → Supabase checks: Does user@example.com exist? YES!
   → Option A (Recommended): Return error "Email already registered"
   → Option B: Link email identity to existing user
```

---

## 📊 Database Structure

### auth.users Table
```sql
-- Single user record regardless of sign-in method
id: abc-123
email: user@example.com
email_confirmed_at: 2025-01-14 10:00:00
created_at: 2025-01-14 10:00:00
```

### auth.identities Table
```sql
-- Multiple identities for the same user
[
  {
    id: identity-1,
    user_id: abc-123,
    provider: "email",
    created_at: 2025-01-14 10:00:00
  },
  {
    id: identity-2,
    user_id: abc-123,
    provider: "google",
    provider_id: "google-user-id-12345",
    created_at: 2025-01-14 15:30:00
  }
]
```

### Your users Table (Custom)
```sql
-- Your custom user profile table
id: abc-123  -- Same as auth.users.id
email: user@example.com
fullName: "John Doe"
username: "johndoe"
-- ... other profile fields
```

---

## 🛡️ Security Considerations

### Email Verification is Critical

**Why?** Without email verification, someone could:
1. Sign up with `victim@example.com` (email/password)
2. Never verify the email
3. Real owner of `victim@example.com` signs in with Google
4. Account gets linked to the wrong person!

**Solution:**
- ✅ Enable email confirmation in Supabase
- Only link accounts where email is verified
- Or only allow OAuth linking if email is confirmed

### Current Implementation Check

Let's verify your signup flow handles this:

**File:** `app/auth/signup/page.tsx`
```typescript
// Line 101-106: Current code
if (data.user.identities && data.user.identities.length === 0) {
  // Email confirmation required
  toast({ title: "Verifica la tua email" })
} else {
  // No confirmation needed - redirect to onboarding
  router.push('/onboarding')
}
```

**This is GOOD!** ✅ It handles email confirmation properly.

---

## 🧪 Testing Account Linking

### Test Case 1: Email First, OAuth Second

1. **Sign up with email/password:**
   ```
   Email: test-linking@example.com
   Password: TestPassword123!
   ```

2. **Verify email** (if confirmation required)

3. **Sign out**

4. **Click "Sign in with Google"**
   - Use the SAME email: test-linking@example.com

5. **Expected Result:**
   - ✅ Signed in to existing account
   - ✅ NO duplicate user created
   - ✅ Check Supabase Dashboard → Authentication → Users
   - ✅ Should see ONE user with email test-linking@example.com
   - ✅ User has multiple identities (email + google)

### Test Case 2: OAuth First, Email Second

1. **Sign in with Google:**
   - Email: oauth-first@example.com

2. **Sign out**

3. **Try to sign up with email/password:**
   ```
   Email: oauth-first@example.com
   Password: TestPassword123!
   ```

4. **Expected Result:**
   - ❌ Error: "Email already registered"
   - ✅ User directed to sign in instead

---

## 🔧 Code Implementation

### Current OAuth Flow (Already Implemented)

**Signup with OAuth:**
```typescript
// app/auth/signup/page.tsx - Line 127-166
const handleSocialSignUp = async (provider: 'google') => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback?next=/onboarding`,
    },
  })
  // ... error handling
}
```

**Signin with OAuth:**
```typescript
// app/auth/signin/page.tsx - Line 59-100
const handleSocialSignIn = async (provider: 'google') => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback?next=${redirectTo}`,
    },
  })
  // ... error handling
}
```

**Callback Handler:**
```typescript
// app/auth/callback/route.ts - Line 41
const { error } = await supabase.auth.exchangeCodeForSession(code)
```

### ✅ Your Code is Already Correct!

The account linking happens automatically in Supabase's backend when:
1. OAuth returns an email
2. That email exists in auth.users
3. Account linking is enabled in dashboard

**No code changes needed** - just enable it in the dashboard!

---

## 🎯 Action Items

### For You (Dashboard Configuration)

1. [ ] Go to Supabase Dashboard
2. [ ] Authentication → Settings
3. [ ] Enable **Email Confirmations**
4. [ ] Enable **Automatic Account Linking**
5. [ ] Save changes

### Testing Checklist

1. [ ] Create account with email/password
2. [ ] Sign out
3. [ ] Sign in with Google (same email)
4. [ ] Verify only ONE user in Supabase Dashboard
5. [ ] Check user has multiple identities

---

## 📚 Additional Resources

### Supabase Documentation
- **Account Linking:** https://supabase.com/docs/guides/auth/auth-identity-linking
- **OAuth Guide:** https://supabase.com/docs/guides/auth/social-login
- **Email Confirmation:** https://supabase.com/docs/guides/auth/auth-email

### Verify Configuration
```sql
-- Run this in Supabase SQL Editor to check identities
SELECT
  u.id,
  u.email,
  u.email_confirmed_at,
  json_agg(
    json_build_object(
      'provider', i.provider,
      'created_at', i.created_at
    )
  ) as identities
FROM auth.users u
LEFT JOIN auth.identities i ON i.user_id = u.id
WHERE u.email = 'test-linking@example.com'
GROUP BY u.id, u.email, u.email_confirmed_at;
```

Expected output for a linked account:
```json
{
  "id": "abc-123-def",
  "email": "test-linking@example.com",
  "email_confirmed_at": "2025-01-14T10:00:00",
  "identities": [
    {"provider": "email", "created_at": "2025-01-14T10:00:00"},
    {"provider": "google", "created_at": "2025-01-14T15:30:00"}
  ]
}
```

---

## ⚠️ Common Issues

### Issue 1: Duplicate Users Still Created
**Cause:** Account linking not enabled in dashboard
**Solution:** Follow Step 1 above

### Issue 2: "Email already registered" error
**Cause:** This is actually CORRECT behavior for email/password signup after OAuth
**Solution:** User should sign in with OAuth instead

### Issue 3: OAuth returns wrong user
**Cause:** Email verification not enabled
**Solution:** Enable email confirmation in dashboard

---

## ✅ Summary

**Your code is already set up correctly!** You just need to:

1. **Enable account linking in Supabase Dashboard**
2. **Enable email confirmations for security**
3. **Test the flow**

When configured properly:
- ✅ Same email = Same user account
- ✅ Multiple sign-in methods work
- ✅ No duplicate users
- ✅ User data stays consistent

**No code changes needed** - Supabase handles this automatically! 🎉
