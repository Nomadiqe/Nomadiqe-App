# Social Authentication Setup Guide

This guide will help you implement social sign-in (Google, Facebook, Apple) for your Nomadiqe application.

## ✅ What's Already Done

Your application already has:
- ✅ NextAuth.js configured with Prisma adapter
- ✅ Database models (Account, Session, User tables)
- ✅ Social provider configuration in `lib/auth.ts`
- ✅ Sign-in/Sign-up pages with social buttons
- ✅ Automatic user creation and onboarding flow

## 💰 Cost: $0/month (100% FREE!)

All social authentication providers are free:
- **Google OAuth**: Free, unlimited users
- **Facebook Login**: Free, unlimited users
- **Apple Sign In**: Free (only requires paid Apple Developer account if publishing to App Store)

## 🚀 Implementation Steps

### 1. Generate NextAuth Secret

First, generate a secure secret for NextAuth:

```bash
openssl rand -base64 32
```

Add this to your `.env.local`:
```
NEXTAUTH_SECRET=<your-generated-secret>
```

### 2. Set Up Google OAuth (Recommended - Start Here!)

Google OAuth is the easiest to set up and most commonly used.

#### Steps:

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/

2. **Create a Project**
   - Click "Select a project" → "New Project"
   - Name it "Nomadiqe" (or your preferred name)
   - Click "Create"

3. **Enable Google+ API**
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API"
   - Click "Enable"

4. **Create OAuth Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Choose "Web application"
   
5. **Configure OAuth Consent Screen** (if prompted)
   - User Type: "External"
   - App name: "Nomadiqe"
   - User support email: your email
   - Developer contact: your email
   - Click "Save and Continue"
   - Skip scopes (default is fine)
   - Add test users if needed
   - Click "Save and Continue"

6. **Add Authorized Redirect URIs**
   
   For **Development** (localhost):
   ```
   http://localhost:3000/api/auth/callback/google
   ```
   
   For **Production**:
   ```
   https://yourdomain.com/api/auth/callback/google
   ```

7. **Copy Credentials**
   - Copy the "Client ID" and "Client Secret"
   - Add to `.env.local`:
   ```
   GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-client-secret
   ```

8. **Test It!**
   ```bash
   npm run dev
   ```
   - Go to http://localhost:3000/auth/signin
   - Click "Continue with Google"
   - Sign in with your Google account

### 3. Set Up Facebook Login (Optional)

#### Steps:

1. **Go to Facebook Developers**
   - Visit: https://developers.facebook.com/

2. **Create an App**
   - Click "Create App"
   - Choose "Consumer" or "Business" type
   - App Name: "Nomadiqe"
   - Click "Create App"

3. **Add Facebook Login Product**
   - From the dashboard, click "Add Product"
   - Find "Facebook Login" and click "Set Up"

4. **Configure Settings**
   - Go to "Facebook Login" → "Settings"
   - Add Valid OAuth Redirect URIs:
   
   For **Development**:
   ```
   http://localhost:3000/api/auth/callback/facebook
   ```
   
   For **Production**:
   ```
   https://yourdomain.com/api/auth/callback/facebook
   ```

5. **Get App Credentials**
   - Go to "Settings" → "Basic"
   - Copy "App ID" and "App Secret"
   - Add to `.env.local`:
   ```
   FACEBOOK_CLIENT_ID=your-app-id
   FACEBOOK_CLIENT_SECRET=your-app-secret
   ```

6. **Configure App Privacy Policy** (Required for production)
   - Add your privacy policy URL in Basic Settings
   - For development, you can use: `http://localhost:3000/privacy`

7. **Switch to Live Mode** (for production)
   - Toggle the switch at the top from "Development" to "Live"

### 4. Set Up Apple Sign In (Optional - Advanced)

⚠️ **Note**: Apple Sign In requires:
- An Apple Developer account ($99/year) - **only if publishing to App Store**
- A verified domain
- More complex setup than Google/Facebook

#### Steps:

1. **Create an App ID**
   - Go to https://developer.apple.com/account/
   - Certificates, Identifiers & Profiles → Identifiers
   - Click "+" to create new identifier
   - Choose "App IDs" → "App"
   - Description: "Nomadiqe Web"
   - Bundle ID: `com.nomadiqe.web` (reverse domain notation)
   - Enable "Sign In with Apple"
   - Click "Continue" and "Register"

2. **Create a Services ID**
   - Identifiers → Click "+"
   - Choose "Services IDs"
   - Description: "Nomadiqe Sign In"
   - Identifier: `com.nomadiqe.signin`
   - Enable "Sign In with Apple"
   - Click "Configure"

3. **Configure Domains and URLs**
   - Primary App ID: Select the App ID you created
   - Domains: Add your domain (e.g., `nomadiqe.com`)
   - Return URLs: Add callback URL:
     ```
     https://yourdomain.com/api/auth/callback/apple
     ```
   - Click "Save" and "Continue" and "Register"

4. **Create a Private Key**
   - Go to "Keys" → Click "+"
   - Key Name: "Nomadiqe Apple Sign In Key"
   - Enable "Sign In with Apple"
   - Click "Configure"
   - Select your Primary App ID
   - Click "Save", "Continue", and "Register"
   - **Download the key file (.p8)** - you can only download it once!

5. **Add to Environment Variables**
   ```
   APPLE_ID=com.nomadiqe.signin
   APPLE_SECRET=<your-private-key-from-p8-file>
   ```

### 5. Production Deployment

When deploying to production (e.g., Vercel):

1. **Add all environment variables** to your hosting platform
2. **Update OAuth redirect URIs** in each provider's console:
   - Google: https://yourdomain.com/api/auth/callback/google
   - Facebook: https://yourdomain.com/api/auth/callback/facebook
   - Apple: https://yourdomain.com/api/auth/callback/apple
3. **Update NEXTAUTH_URL**:
   ```
   NEXTAUTH_URL=https://yourdomain.com
   ```

## 🧪 Testing

### Test User Flow:

1. **Sign Up with Google**:
   - Go to `/auth/signup`
   - Click "Continue with Google"
   - Authorize the app
   - Should redirect to `/onboarding/profile-setup`

2. **Sign In with Google**:
   - Go to `/auth/signin`
   - Click "Continue with Google"
   - Should redirect to `/dashboard`

3. **Account Linking**:
   - If a user signs in with email/password first, then later with Google using the same email
   - NextAuth automatically links the accounts
   - User can sign in with either method

## 🔒 Security Features

Your setup includes:

✅ **JWT Sessions** - Secure, stateless authentication
✅ **CSRF Protection** - Built into NextAuth
✅ **OAuth State Parameter** - Prevents CSRF attacks
✅ **Secure Password Hashing** - bcrypt for credentials auth
✅ **Email Verification** - Automatic via OAuth
✅ **Account Linking** - Merges social and email accounts

## 📊 Database Tables

NextAuth automatically manages these tables:
- `accounts` - OAuth account connections
- `sessions` - User sessions (not used with JWT strategy)
- `users` - User profiles
- `verification_tokens` - Email verification (if needed)

## 🐛 Troubleshooting

### "Error: Configuration problem"
- Check that all environment variables are set correctly
- Restart your dev server after changing `.env.local`

### "Redirect URI mismatch"
- Make sure the callback URL in your OAuth provider matches exactly
- Check for trailing slashes, http vs https
- Development: `http://localhost:3000/api/auth/callback/google`
- Production: `https://yourdomain.com/api/auth/callback/google`

### "Invalid client" error
- Double-check your Client ID and Client Secret
- Make sure there are no extra spaces or quotes
- Regenerate credentials if needed

### Google: "Access blocked: This app's request is invalid"
- Complete the OAuth consent screen configuration
- Add your email as a test user
- Make sure you've enabled the Google+ API

### Facebook: "Can't Load URL"
- Check that redirect URI is added in Facebook app settings
- Make sure app is in "Development" mode (or "Live" for production)
- Verify domain ownership for production

## 🎉 Next Steps

Once social auth is working:

1. **Customize the user experience**:
   - Update the onboarding flow in `/app/onboarding`
   - Customize the dashboard based on user role
   - Add profile pictures from OAuth providers

2. **Add more providers** (if needed):
   - GitHub, Twitter, LinkedIn, etc.
   - NextAuth supports 50+ providers
   - See: https://next-auth.js.org/providers/

3. **Monitor usage**:
   - Track sign-ins by provider
   - Monitor OAuth errors
   - Set up analytics

## 📚 Additional Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Google OAuth Setup Guide](https://developers.google.com/identity/protocols/oauth2)
- [Facebook Login Guide](https://developers.facebook.com/docs/facebook-login/web)
- [Apple Sign In Guide](https://developer.apple.com/sign-in-with-apple/)

## ❓ Need Help?

Common issues and solutions:
- NextAuth Errors: https://next-auth.js.org/errors
- Google OAuth Errors: https://developers.google.com/identity/protocols/oauth2
- Facebook Login Troubleshooting: https://developers.facebook.com/docs/facebook-login/debugging

---

**Total Setup Time**: 15-30 minutes (Google only) | 1-2 hours (all three providers)
**Cost**: $0/month (FREE!)
**Difficulty**: Easy (Google) | Medium (Facebook) | Advanced (Apple)

