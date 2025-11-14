# OAuth Account Linking - Quick Reference Card

**Project**: Nomadiqe Platform | **Date**: November 14, 2025 | **Status**: ✅ Code Complete

---

## 🎯 What It Does

**Prevents duplicate users** when the same email is used with different authentication methods.

**Example**:
- User signs up: `john@example.com` with password
- Later signs in with Google: `john@example.com`
- **Result**: ✅ Same account (not duplicate)

---

## 🔧 Setup (3 Steps - 5 Minutes)

### 1. Enable Account Linking
📍 https://supabase.com/dashboard/project/fjltqzdcnqjloxxshywg/auth/settings

- Go to: **Authentication → Settings**
- Find: **"Enable automatic linking of accounts with the same email"**
- Toggle: **ON** ✅
- Click: **Save**

### 2. Enable Email Confirmation (Security)
📍 Same page as above

- Find: **"Enable email confirmations"**
- Toggle: **ON** ✅
- Click: **Save**

### 3. Verify Google OAuth
📍 https://supabase.com/dashboard/project/fjltqzdcnqjloxxshywg/auth/providers

- Provider: **Google**
- Status: **Enabled** ✅
- Client ID: `625220155191-...` ✅
- Client Secret: **(filled in dashboard)** ✅

---

## 🧪 Quick Test (5 Minutes)

1. **Sign up with email**: http://localhost:3001/auth/signup
   - Email: `test-link@example.com`
   - Password: `Test123!`

2. **Sign out**

3. **Sign in with Google**: http://localhost:3001/auth/signin
   - Click "Continua con Google"
   - Use SAME email: `test-link@example.com`

4. **Verify in Supabase Dashboard**:
   - Go to: **Authentication → Users**
   - Search: `test-link@example.com`
   - **Check**: Only ONE user ✅
   - **Check**: User has TWO identities (email + google) ✅

---

## ✅ Verification SQL

**Run in Supabase SQL Editor** to verify linking works:

```sql
-- Should show users with 2+ identities
SELECT
  u.email,
  COUNT(i.id) as identity_count,
  string_agg(i.provider, ', ') as providers
FROM auth.users u
JOIN auth.identities i ON i.user_id = u.id
GROUP BY u.email
HAVING COUNT(i.id) > 1;
```

**Expected**: Rows showing `email, google` as providers

---

## 🔍 Check for Duplicates

```sql
-- Should return ZERO rows
SELECT email, COUNT(*) as count
FROM auth.users
GROUP BY email
HAVING COUNT(*) > 1;
```

**Expected**: Empty result (no duplicates)

---

## 📂 Documentation Files

| File | Use When |
|------|----------|
| `ACCOUNT_LINKING_QUICK_REFERENCE.md` | ⚡ Need quick setup/test info |
| `ACCOUNT_LINKING_IMPLEMENTATION_STATUS.md` | 📖 Want complete technical details |
| `OAUTH_ACCOUNT_LINKING_TEST_PLAN.md` | 🧪 Running comprehensive tests |
| `OAUTH_ACCOUNT_LINKING_SETUP.md` | 📚 Need detailed explanation |

---

## 🚨 Troubleshooting

| Problem | Solution |
|---------|----------|
| Duplicate users created | Enable account linking in dashboard |
| "Email already registered" error | Expected for OAuth→Email flow |
| OAuth returns wrong user | Enable email confirmation |
| Both logins don't work | Check Supabase → Users → Identities |

---

## ✨ Code Status

| Component | Status | File |
|-----------|--------|------|
| Signup OAuth | ✅ Complete | `app/auth/signup/page.tsx:127-166` |
| Signin OAuth | ✅ Complete | `app/auth/signin/page.tsx:59-107` |
| Callback Handler | ✅ Complete | `app/auth/callback/route.ts:41` |
| Middleware | ✅ Complete | `middleware.ts:66` |

**No code changes needed** - just configure dashboard! 🎉

---

## 🎓 How It Works (30 seconds)

1. User creates account: `email@example.com` (identity: email)
2. User signs in with Google: `email@example.com`
3. Supabase checks: "Does this email exist?" → YES
4. Supabase links: Google identity to existing user
5. Result: ONE user, TWO identities ✅

---

## 🔒 Security Note

⚠️ **Always enable email confirmation** to prevent:
- Attacker creates `victim@gmail.com` (unverified)
- Real owner signs in with Google
- Accounts get linked to attacker

✅ **With confirmation**: Linking blocked until email verified

---

## 📊 Success Criteria

Account linking works if:
- ✅ Only ONE user per email in database
- ✅ Users have multiple identities (email, google)
- ✅ Can sign in with either method
- ✅ User data consistent across methods
- ✅ SQL duplicate check returns zero results

---

## 🚀 Production Checklist

- [ ] Account linking enabled in Supabase
- [ ] Email confirmation enabled
- [ ] Google OAuth configured for production domain
- [ ] Tested in production environment
- [ ] Verified no duplicate users exist

---

**Ready?** Go enable account linking in the dashboard now! ⬆️

**Need help?** Check the detailed docs listed above 📚

**Questions?** All your code is already correct - just flip the switch! 🎛️
