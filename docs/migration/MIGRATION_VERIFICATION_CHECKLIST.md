# Supabase Migration Verification Checklist

## 🎯 Goal
Verify that the migration from NextAuth + Drizzle/Neon to Supabase Auth + Supabase Database is complete and working.

## 🌐 Dev Server
**URL:** http://localhost:3001

## ✅ Pre-Migration Cleanup Verification

### 1. Check Old Dependencies Removed
- [ ] No `next-auth` in package.json
- [ ] No `@auth/drizzle-adapter` in package.json
- [ ] No `drizzle-orm` in package.json
- [ ] No `@neondatabase/serverless` in package.json

### 2. Check Old Files Removed
- [ ] No `lib/auth.ts` file
- [ ] No `lib/db.ts` file
- [ ] No `prisma/schema.prisma` file
- [ ] No `types/next-auth.d.ts` file
- [ ] No `app/api/auth/[...nextauth]/route.ts` file

### 3. Check New Supabase Files Exist
- [x] `lib/supabase/server.ts` exists
- [x] `lib/supabase/client.ts` exists
- [x] `.env.local` has SUPABASE_URL and SUPABASE_ANON_KEY
- [x] Middleware uses Supabase auth

## 🧪 Critical Features Testing

### Phase 1: Authentication (CRITICAL)

#### Test 1: Sign Up with Supabase Auth
1. Navigate to http://localhost:3001/auth/signup
2. Fill in the form:
   - Email: test-migration@example.com
   - Password: TestPassword123!
   - Full Name: Test User
   - Username: testuser
3. Click "Sign Up"
4. **Expected:**
   - Redirected to onboarding
   - User created in Supabase Auth
   - User record created in Supabase `users` table
5. **Verify in Supabase Dashboard:**
   - Go to Authentication > Users
   - Confirm new user appears
   - Go to Table Editor > users
   - Confirm user record with correct email

**Status:** ⏳ PENDING

#### Test 2: Email Confirmation Flow
1. Check email inbox for confirmation email
2. Click confirmation link
3. **Expected:** Email confirmed in Supabase
4. **Verify in Supabase Dashboard:**
   - Authentication > Users > email_confirmed_at is set

**Status:** ⏳ PENDING

#### Test 3: Sign In with Supabase Auth
1. Sign out if logged in
2. Navigate to http://localhost:3001/auth/signin
3. Enter credentials from Test 1
4. Click "Sign In"
5. **Expected:**
   - Successfully logged in
   - Redirected to appropriate page
   - Session cookie set

**Status:** ⏳ PENDING

#### Test 4: Session Persistence
1. After signing in, refresh the page
2. **Expected:** Still logged in
3. Open browser DevTools > Application > Cookies
4. **Expected:** See Supabase auth cookies (sb-*-auth-token)

**Status:** ⏳ PENDING

### Phase 2: Onboarding Flow

#### Test 5: Role Selection
1. After signup, should land on /onboarding or /onboarding/role-selection
2. Select a role (Guest, Host, or Influencer)
3. Click "Continue"
4. **Expected:**
   - Role saved to Supabase users table
   - Redirected to next step
5. **Verify in Supabase:**
   - Table Editor > users > role column updated

**Status:** ⏳ PENDING

#### Test 6: Profile Setup
1. Fill in profile information:
   - Bio
   - Location
   - Profile picture (optional)
2. Submit
3. **Expected:**
   - Profile data saved to Supabase
   - Progress tracked in onboarding_progress table

**Status:** ⏳ PENDING

#### Test 7: Role-Specific Onboarding
Choose one role and complete its specific flow:

**For Guest:**
- Interest selection
- Verify data in guest_preferences table

**For Host:**
- Property listing creation
- Verify data in properties table
- Check host_profiles table

**For Influencer:**
- Social media connection
- Verify data in influencer_profiles table
- Check social_connections table

**Status:** ⏳ PENDING

### Phase 3: Data Operations

#### Test 8: Create a Post
1. Navigate to /create-post
2. Upload an image
3. Write content
4. Add location
5. Submit
6. **Expected:**
   - Post created in Supabase posts table
   - Image URL stored (Vercel Blob or Supabase Storage)
7. **Verify:**
   - Post appears on home page
   - Post visible in Supabase Table Editor > posts

**Status:** ⏳ PENDING

#### Test 9: Social Interactions
1. Like a post
2. **Verify:** likes table updated
3. Comment on a post
4. **Verify:** comments table updated
5. Follow a user
6. **Verify:** follows table updated

**Status:** ⏳ PENDING

#### Test 10: Points System
1. Perform daily check-in
2. **Verify:**
   - Points balance updated in users table
   - Transaction recorded in points_transactions table
3. Check points history
4. **Verify:** Displays correct transactions

**Status:** ⏳ PENDING

### Phase 4: Search & Properties

#### Test 11: Property Search
1. Navigate to /search
2. Enter search criteria
3. **Verify:**
   - Results load from Supabase properties table
   - Filters work correctly
   - No "max_guests" or "is_active" column errors

**Status:** ⏳ PENDING

#### Test 12: Property Details
1. Click on a property
2. **Verify:**
   - Details load from Supabase
   - Images display correctly
   - Host information shows

**Status:** ⏳ PENDING

### Phase 5: Database Migration Verification

#### Test 13: Check Supabase Tables
Open Supabase Dashboard > Table Editor and verify all tables exist:

**Core Tables:**
- [ ] users (with Supabase auth.users trigger)
- [ ] posts
- [ ] comments
- [ ] likes
- [ ] follows
- [ ] messages
- [ ] chats
- [ ] notifications
- [ ] properties
- [ ] reviews
- [ ] points_transactions

**Profile Tables:**
- [ ] guest_preferences
- [ ] host_profiles
- [ ] influencer_profiles
- [ ] social_connections

**Onboarding:**
- [ ] onboarding_progress

**Status:** ⏳ PENDING

#### Test 14: Check RLS Policies
1. Go to Supabase Dashboard > Authentication > Policies
2. **Verify:** Each table has appropriate RLS policies enabled
3. **Test:** Try accessing data without auth (should fail for protected tables)

**Status:** ⏳ PENDING

### Phase 6: Cleanup Verification

#### Test 15: No NextAuth References
Search codebase for old authentication references:

```bash
# Should return NO results or only in documentation
grep -r "next-auth" --include="*.ts" --include="*.tsx" app/ components/ lib/
grep -r "NextAuth" --include="*.ts" --include="*.tsx" app/ components/ lib/
grep -r "getServerSession" --include="*.ts" --include="*.tsx" app/ components/ lib/
```

**Status:** ⏳ PENDING

#### Test 16: No Drizzle/Neon References
```bash
# Should return NO results or only in documentation
grep -r "drizzle" --include="*.ts" --include="*.tsx" app/ components/ lib/
grep -r "neon" --include="*.ts" --include="*.tsx" app/ components/ lib/
```

**Status:** ⏳ PENDING

## 🔍 Error Monitoring

### Check Dev Server Logs
Monitor for errors in the terminal running `npm run dev`:
- [ ] No authentication errors
- [ ] No database connection errors
- [ ] No column naming errors (max_guests, is_active, etc.)
- [ ] No "session is not defined" errors

### Check Browser Console
Press F12 in browser and check Console tab:
- [ ] No JavaScript errors
- [ ] No authentication failures
- [ ] No API call failures

## 📊 Migration Completion Criteria

### Must Pass (Critical):
- ✅ All old dependencies removed
- ✅ All old files removed
- ✅ Supabase client configured
- ⏳ Sign up with Supabase Auth works
- ⏳ Sign in with Supabase Auth works
- ⏳ User data persists in Supabase
- ⏳ Onboarding flow completes
- ⏳ Posts can be created
- ⏳ No authentication errors

### Should Pass (Important):
- ⏳ Session persistence works
- ⏳ Social features work (likes, comments, follows)
- ⏳ Points system works
- ⏳ Property search works
- ⏳ RLS policies enforce security

### Nice to Have:
- Email confirmation flow
- Password reset flow
- OAuth providers (Google, etc.)
- Profile editing
- Messaging system

## 🚨 Common Issues & Solutions

### Issue: "Cannot find module '@/lib/auth'"
**Solution:** Old import not updated. Replace with `@/lib/supabase/server`

### Issue: "session is not defined"
**Solution:** Update to use `supabase.auth.getUser()` instead of NextAuth session

### Issue: Database column errors (max_guests, is_active)
**Solution:** Already fixed in app/search/page.tsx - verify fix is applied

### Issue: User not redirected after login
**Solution:** Check middleware.ts routes configuration

### Issue: RLS policy blocking legitimate requests
**Solution:** Review and update RLS policies in Supabase Dashboard

## 📝 Testing Notes

Use this space to record any issues found during testing:

---

**Test Date:** _____________

**Tester:** _____________

**Issues Found:**
1.
2.
3.

**Migration Status:** ⏳ IN PROGRESS / ✅ COMPLETE / ❌ FAILED

---

## ✅ Final Verification

Before marking migration complete, verify:
1. [ ] All Phase 1 (Authentication) tests pass
2. [ ] At least one complete user journey works (signup → onboarding → create post)
3. [ ] No old authentication system references remain
4. [ ] All data is stored in Supabase (not Neon)
5. [ ] Dev server runs without critical errors
6. [ ] Browser console shows no authentication errors

**Migration Approved By:** _____________

**Date:** _____________
