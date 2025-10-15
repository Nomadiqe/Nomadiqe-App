# Social Auth - Quick Start (5 Minutes)

The fastest way to get social sign-in working with **Google OAuth** (other providers optional).

## ⚡ Quick Setup (Google Only)

### 1. Generate NextAuth Secret (30 seconds)

```bash
openssl rand -base64 32
```

Copy the output and add to `.env.local`:
```env
NEXTAUTH_SECRET=<paste-your-generated-secret>
```

### 2. Create Google OAuth App (3 minutes)

1. **Go to**: https://console.cloud.google.com/
2. **Create Project**: "Nomadiqe"
3. **Enable API**: Search "Google+ API" → Enable
4. **Create Credentials**:
   - APIs & Services → Credentials
   - Create OAuth client ID → Web application
   - Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`

5. **Copy credentials to `.env.local`**:
```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
```

### 3. Test It! (1 minute)

```bash
npm run dev
```

Visit: http://localhost:3000/auth/signin

Click **"Continue with Google"** ✨

## ✅ That's It!

You now have:
- ✅ Google sign-in working
- ✅ Automatic user creation
- ✅ Onboarding flow integration
- ✅ Account linking (OAuth + email/password)

## 🎯 Next Steps (Optional)

### Add Facebook Login (10 minutes)
See detailed guide in `SOCIAL_AUTH_SETUP.md`

### Add Apple Sign In (30 minutes)
See detailed guide in `SOCIAL_AUTH_SETUP.md`

## 🐛 Quick Troubleshooting

**Error: "redirect_uri_mismatch"**
- Check the callback URL in Google Console matches: `http://localhost:3000/api/auth/callback/google`

**Error: "Configuration problem"**
- Restart your dev server: `npm run dev`
- Check `.env.local` has all required variables

**Error: "Access blocked"**
- Add yourself as a test user in Google OAuth consent screen

## 📁 Files Modified

Your project already has everything configured:
- ✅ `lib/auth.ts` - NextAuth configuration
- ✅ `app/auth/signin/page.tsx` - Sign-in with social buttons
- ✅ `app/auth/signup/page.tsx` - Sign-up with social buttons
- ✅ `prisma/schema.prisma` - Database models for OAuth

## 💰 Cost

**FREE** - $0/month for unlimited users!

## 🔒 Security

Built-in security features:
- JWT-based sessions
- CSRF protection
- State parameter validation
- Automatic account linking
- Secure password hashing (for email/password)

---

**Need more help?** See the full guide: [SOCIAL_AUTH_SETUP.md](./SOCIAL_AUTH_SETUP.md)

