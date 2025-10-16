# Vercel Deployment Setup for Social Auth

## 🚀 Steps to Enable Google Sign-In on Vercel

### 1. Add Environment Variables to Vercel

Go to your Vercel project dashboard and add these environment variables:

**Method 1: Via Vercel Dashboard**
1. Go to: https://vercel.com/dashboard
2. Select your project (Nomadiqe-App)
3. Go to **Settings** → **Environment Variables**
4. Add the following variables (one by one):

```bash
# NextAuth Configuration
NEXTAUTH_SECRET=your-secret-here-generate-with-openssl-rand-base64-32
NEXTAUTH_URL=https://your-production-domain.vercel.app

# Google OAuth (Server-side)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Google OAuth (Client-side) - IMPORTANT!
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# Database
DATABASE_URL=postgresql://username:password@host:5432/database?sslmode=require

# Vercel Blob (if using image uploads)
BLOB_READ_WRITE_TOKEN=your-vercel-blob-token
```

**Important Notes:**
- Replace `https://your-production-domain.vercel.app` with your actual Vercel domain
- For each variable, select: **All Environments** (Production, Preview, Development)
- The `NEXT_PUBLIC_*` variables MUST be added for client-side visibility

**Method 2: Via Vercel CLI** (Faster)
```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Login to Vercel
vercel login

# Link your project
vercel link

# Add environment variables
vercel env add NEXTAUTH_SECRET
vercel env add NEXTAUTH_URL
vercel env add GOOGLE_CLIENT_ID
vercel env add GOOGLE_CLIENT_SECRET
vercel env add NEXT_PUBLIC_GOOGLE_CLIENT_ID
vercel env add DATABASE_URL
vercel env add BLOB_READ_WRITE_TOKEN

# When prompted, paste the values and select "Production, Preview, Development"
```

### 2. Update Google OAuth Redirect URI

You need to add your production domain to Google Console:

1. Go to: https://console.cloud.google.com/apis/credentials
2. Select your OAuth 2.0 Client ID
3. Under **Authorized redirect URIs**, add:
   ```
   https://your-production-domain.vercel.app/api/auth/callback/google
   ```
4. Click **Save**

**Example:**
- If your Vercel domain is: `nomadiqe-app.vercel.app`
- Add redirect URI: `https://nomadiqe-app.vercel.app/api/auth/callback/google`

### 3. Redeploy Your App

After adding environment variables:

**Option A: Via Dashboard**
1. Go to **Deployments** tab
2. Click the three dots (•••) on the latest deployment
3. Click **Redeploy**
4. Check ✅ **Use existing Build Cache**
5. Click **Redeploy**

**Option B: Via Git Push**
```bash
git add .
git commit -m "Configure environment variables"
git push origin master
```

**Option C: Via Vercel CLI**
```bash
vercel --prod
```

### 4. Verify It Works

After redeployment:
1. Visit your production site: `https://your-domain.vercel.app/auth/signin`
2. You should see the **"Continue with Google"** button ✅
3. Click it and test sign-in

## 🐛 Troubleshooting

### Google Button Still Not Showing?

**Check 1: Verify Environment Variables**
```bash
vercel env ls
```

Make sure `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is listed and set to "Production, Preview, Development"

**Check 2: Check Build Logs**
1. Go to Vercel Dashboard → Deployments
2. Click on latest deployment
3. Check build logs for any errors

**Check 3: Clear Vercel Cache**
Redeploy without cache:
1. Deployments → Latest deployment → three dots
2. Redeploy
3. **Uncheck** "Use existing Build Cache"

**Check 4: Verify Client-Side Variable**
Open browser console on your production site and type:
```javascript
console.log(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID)
```

If it shows `undefined`, the variable wasn't set correctly.

### "redirect_uri_mismatch" Error on Production?

**Fix:** Add your production domain to Google Console redirect URIs:
```
https://your-domain.vercel.app/api/auth/callback/google
```

### Session Not Persisting?

**Fix:** Make sure `NEXTAUTH_URL` matches your production domain:
```
NEXTAUTH_URL=https://your-domain.vercel.app
```

## 📋 Environment Variables Checklist

Make sure ALL of these are set in Vercel:

- [ ] `NEXTAUTH_SECRET` (server-side)
- [ ] `NEXTAUTH_URL` (server-side) - **MUST be production domain**
- [ ] `GOOGLE_CLIENT_ID` (server-side)
- [ ] `GOOGLE_CLIENT_SECRET` (server-side)
- [ ] `NEXT_PUBLIC_GOOGLE_CLIENT_ID` (client-side) - **CRITICAL!**
- [ ] `DATABASE_URL` (server-side)
- [ ] `BLOB_READ_WRITE_TOKEN` (server-side, if using uploads)

## 🔐 Security Notes

- Never commit `.env` file to Git
- Generate a new `NEXTAUTH_SECRET` for production (different from local)
- Keep `GOOGLE_CLIENT_SECRET` secure
- Only `NEXT_PUBLIC_*` variables are exposed to client-side

## 🎯 Quick Command Reference

```bash
# View all environment variables
vercel env ls

# Pull environment variables to local
vercel env pull

# Add a new environment variable
vercel env add VARIABLE_NAME

# Remove an environment variable
vercel env rm VARIABLE_NAME

# Deploy to production
vercel --prod

# Deploy to preview
vercel
```

## ✅ Success Checklist

After completing setup:
- [ ] All environment variables added to Vercel
- [ ] Production redirect URI added to Google Console
- [ ] App redeployed
- [ ] Google button visible on `/auth/signin`
- [ ] Can sign in with Google successfully
- [ ] Session persists after sign-in

---

**Need Help?** Check:
- Vercel Docs: https://vercel.com/docs/environment-variables
- NextAuth Docs: https://next-auth.js.org/deployment
- This project's `SOCIAL_AUTH_SETUP.md`


