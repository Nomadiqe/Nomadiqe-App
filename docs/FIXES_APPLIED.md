# Social Auth Fixes Applied

## Issues Fixed:

### 1. ✅ NEXTAUTH_URL Configuration
**Problem**: `NEXTAUTH_URL` was set to the full callback URL instead of base URL
- **Was**: `http://localhost:3000/api/auth/callback/google`
- **Fixed to**: `http://localhost:3000`

### 2. ✅ NEXTAUTH_SECRET Generated
**Problem**: Placeholder secret value
- **Fixed**: Generated secure random secret with `openssl rand -base64 32`

### 3. ✅ Image Domains for OAuth Profiles
**Problem**: Google/Facebook profile images not allowed in Next.js
- **Added to `next.config.js`**:
  - `*.googleusercontent.com`
  - `lh3.googleusercontent.com`
  - `platform-lookaside.fbsbx.com`
  - `graph.facebook.com`

### 4. ✅ Auth Callback Conflicts
**Problem**: PrismaAdapter and manual user creation causing conflicts
- **Fixed**: Removed duplicate user creation logic
- **Updated**: JWT callback to properly set role for new OAuth users
- **Added**: 100ms delay to ensure PrismaAdapter completes user creation

### 5. ✅ Database Schema
**Verified**: All tables are in sync and have proper defaults
- User model has `role @default(GUEST)`
- User model has `onboardingStatus @default(PENDING)`

## Files Modified:

1. `.env` - Fixed NEXTAUTH_URL and added NEXTAUTH_SECRET
2. `next.config.js` - Added OAuth image domains
3. `lib/auth.ts` - Fixed JWT and signIn callbacks
4. `app/api/debug/session/route.ts` - Added debug endpoint

## Testing Steps:

1. **Restart your dev server** (IMPORTANT):
   ```bash
   # Stop current server (Ctrl+C)
   npm run dev
   ```

2. **Clear browser cookies** (important for testing):
   - Open DevTools → Application → Cookies
   - Clear all localhost cookies

3. **Test Google Sign-In**:
   - Go to: http://localhost:3000/auth/signin
   - Click "Continue with Google"
   - Authorize the app
   - Should redirect to dashboard (or onboarding if new user)

4. **Debug if issues persist**:
   - Check session: http://localhost:3000/api/debug/session
   - Check server logs for any errors
   - Verify Google Console has correct redirect URI:
     `http://localhost:3000/api/auth/callback/google`

## Expected Flow:

### New User (First Time):
1. Click "Continue with Google"
2. Redirected to Google OAuth
3. User authorizes app
4. Returned to app → `/api/auth/callback/google`
5. PrismaAdapter creates user with defaults (role: GUEST, onboardingStatus: PENDING)
6. JWT callback sets user role in session
7. Middleware detects GUEST role
8. Redirected to `/onboarding/profile-setup`

### Existing User:
1. Click "Continue with Google"
2. Redirected to Google OAuth
3. User authorizes app
4. Returned to app → `/api/auth/callback/google`
5. JWT callback fetches user from database
6. Session created with user's role
7. Redirected to `/dashboard`

## Common Issues:

### Still redirected to sign-up page?
- **Clear browser cookies** (old session might be cached)
- **Check**: http://localhost:3000/api/debug/session
- **Restart dev server** to load new .env values

### "redirect_uri_mismatch" error?
- **Check Google Console**: Redirect URI must be exactly:
  `http://localhost:3000/api/auth/callback/google`
- No trailing slash, use `http` not `https`

### Image loading errors?
- **Restart dev server** - Next.js config changes require restart
- **Check** `next.config.js` has all OAuth image domains

### Database errors?
- **Run**: `npx prisma db push` to sync schema
- **Check**: DATABASE_URL in .env is correct

## Debug Endpoints:

### Check Session:
```
GET http://localhost:3000/api/debug/session
```

Returns:
```json
{
  "hasSession": true,
  "session": { ... },
  "user": { ... },
  "timestamp": "..."
}
```

## Next Steps:

1. ✅ Restart dev server
2. ✅ Clear browser cookies
3. ✅ Test Google sign-in
4. ✅ Verify redirect to dashboard/onboarding
5. 📝 Optional: Set up Facebook/Apple OAuth (see SOCIAL_AUTH_SETUP.md)

---

**Last Updated**: October 15, 2025
**Status**: Ready for Testing 🚀

