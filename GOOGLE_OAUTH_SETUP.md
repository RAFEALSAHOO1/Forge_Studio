# Google OAuth Setup - Complete Guide

## 🎯 Overview

This guide will help you set up **completely free** Google OAuth authentication for Forge Studio. Google OAuth is:
- ✅ Completely free (no costs, even for unlimited usage)
- ✅ No credit card required
- ✅ No API quotas or limitations for auth
- ✅ Production-ready

**Time required**: ~30 minutes

---

## 📋 Step 1: Create Google Cloud Project

### 1.1 Go to Google Cloud Console
1. Open [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account (create one if needed - also free)
3. Click on the project dropdown at the top

### 1.2 Create New Project
1. Click "NEW PROJECT" button
2. **Project name**: `Forge Studio`
3. Leave **Organization** blank
4. Click "CREATE"
5. Wait for the project to be created (~1 minute)
6. You'll be notified when ready

### 1.3 Select Your Project
- Once created, click the project dropdown again
- Select "Forge Studio" project

---

## 🔑 Step 2: Create OAuth 2.0 Credentials

### 2.1 Configure OAuth Consent Screen
1. In the left sidebar, go to **APIs & Services** > **OAuth consent screen**
2. Choose **User Type**: "External"
3. Click "CREATE"

**Fill the form:**

**App Information:**
- **App name**: `Forge Studio`
- **User support email**: Your email
- **App logo** (optional): Leave blank
- Click "SAVE AND CONTINUE"

**Scopes:**
- Click "ADD OR REMOVE SCOPES"
- Search and select:
  - `https://www.googleapis.com/auth/userinfo.email`
  - `https://www.googleapis.com/auth/userinfo.profile`
- Click "UPDATE" and "SAVE AND CONTINUE"

**Test Users** (optional):
- Leave blank for now (not needed for development)
- Click "SAVE AND CONTINUE"

**Summary:**
- Click "BACK TO DASHBOARD"

### 2.2 Create OAuth 2.0 Client ID
1. Go to **APIs & Services** > **Credentials** (in left sidebar)
2. Click "CREATE CREDENTIALS" button at top
3. Choose **OAuth 2.0 Client ID**
4. Select application type: **Web application**

**Configure Web Application:**

**Name:**
```
Forge Studio
```

**Authorized JavaScript origins:**
Add both development and production:
```
http://localhost:5173
http://localhost:3000
```

> **Note**: For production, replace `localhost` with your actual domain
> Example: `https://forgestudio.com`

**Authorized redirect URIs:**
```
http://localhost:5173/login
http://localhost:3000/auth/callback
```

> **Note**: Google OAuth usually uses a popup/window modal, so strict redirect URIs aren't required. These are placeholder URLs.

5. Click "CREATE"

---

## 📝 Step 3: Get Your Credentials

### 3.1 Copy Your Credentials
After clicking CREATE, you'll see a popup with:
- **Client ID**: (looks like `xxx.apps.googleusercontent.com`)
- **Client Secret**: (a long string)

**⚠️ IMPORTANT:**
- ✅ Keep **Client ID** safe (can be public - it's used in frontend)
- 🔒 Keep **Client Secret** safe (private - backend only)

You can also access these anytime:
1. Go to **APIs & Services** > **Credentials**
2. Under "OAuth 2.0 Client IDs", click on your "Forge Studio" app
3. Client ID and Secret are shown in the form

---

## 🔧 Step 4: Configure Forge Studio

### 4.1 Backend Configuration
Create `artifacts/api-server/.env`:

```bash
# ... existing variables ...

# Google OAuth (optional, for verification if implemented)
GOOGLE_CLIENT_SECRET="your-secret-from-google-cloud"
GOOGLE_OAUTH_VERIFICATION=false
```

### 4.2 Frontend Configuration
Create `artifacts/designforge/.env`:

```bash
# ... existing variables ...

# Google OAuth (Required)
VITE_GOOGLE_CLIENT_ID="your-client-id-from-google-cloud.apps.googleusercontent.com"
```

**Example:**
```bash
VITE_GOOGLE_CLIENT_ID="123456789-abc123def456.apps.googleusercontent.com"
```

---

## 🚀 Step 5: Install Required Package

### 5.1 Install @react-oauth/google

In `artifacts/designforge/` directory:

```bash
pnpm add @react-oauth/google
```

This installs the official Google OAuth library for React.

---

## ✅ Step 6: Verify Integration

### 6.1 Check if Components are Updated

Your files should already have Google OAuth integrated:

✓ **main.tsx** - Has `GoogleOAuthProvider` wrapper
✓ **Login.tsx** - Has `GoogleLogin` component
✓ **Signup.tsx** - Has `GoogleLogin` component

### 6.2 Test the Integration

1. **Start the services:**
   ```bash
   # Terminal 1 - Backend
   cd artifacts/api-server && pnpm dev

   # Terminal 2 - Frontend  
   cd artifacts/designforge && pnpm dev
   ```

2. **Open http://localhost:5173/login**
   - You should see a "Sign in with Google" button
   - Click it and test Google authentication

3. **Open http://localhost:5173/signup**
   - You should see a "Sign up with Google" button
   - Test creating an account with Google

---

## 🔄 Complete Google OAuth Flow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. User clicks "Sign in with Google" button on frontend     │
└────────────────┬────────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────────┐
│ 2. Google OAuth popup appears                               │
│    - User signs into Google account                         │
│    - User grants permission                                 │
│    - Returns JWT token to frontend                          │
└────────────────┬────────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────────┐
│ 3. Frontend receives Google JWT token                        │
│    - GoogleLogin component captures credential              │
│    - Calls handleGoogleSuccess()                            │
└────────────────┬────────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────────┐
│ 4. Frontend sends token to backend                          │
│    POST /api/auth/auth/google                              │
│    Body: { token: "google_jwt_token" }                     │
└────────────────┬────────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────────┐
│ 5. Backend verifies Google token                            │
│    - Decodes JWT token                                      │
│    - Extracts email, name, picture                          │
└────────────────┬────────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────────┐
│ 6. Backend checks if user exists                            │
│    - If YES: Link Google to existing account               │
│    - If NO: Create new user from Google profile            │
└────────────────┬────────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────────┐
│ 7. Backend generates JWT session token                      │
│    - Expires in 7 days                                      │
│    - Contains userId, email                                 │
└────────────────┬────────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────────┐
│ 8. Backend returns to frontend                              │
│    {                                                         │
│      "success": true,                                       │
│      "token": "session_jwt_token",                          │
│      "user": { id, email, firstName, lastName, ... }       │
│    }                                                         │
└────────────────┬────────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────────┐
│ 9. Frontend stores session token                            │
│    - Saves to localStorage                                  │
│    - User is authenticated!                                 │
└────────────────┬────────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────────┐
│ 10. Redirect to home page                                   │
│     User is fully logged in                                │
└─────────────────────────────────────────────────────────────┘
```

---

## 🧪 Testing Google OAuth

### Test Scenario 1: New User Signup
1. Go to /signup
2. Click "Sign up with Google"
3. Sign in with your Google account
4. Grant permissions
5. You should be redirected to home page
6. Check that your profile is created in database

### Test Scenario 2: Existing User Login
1. Go to /login with same Google account
2. Click "Sign in with Google"
3. Grant permissions (might be skipped if already granted)
4. You should be logged in immediately

### Test Scenario 3: Account Linking
1. Sign up with email/password first
2. Verify your email
3. Log in with email/password
4. Go to account settings (future feature)
5. Link your Google account
6. Later, you can log in with Google

---

## 🚨 Troubleshooting

### Issue: "Client ID not set" or "VITE_GOOGLE_CLIENT_ID undefined"
**Solution:**
- Check `.env` file has the variable
- Restart the development server
- Check variable name is exactly: `VITE_GOOGLE_CLIENT_ID`

### Issue: "Google popup blocked by browser"
**Solution:**
- This is normal the first time - popup was blocked
- Click the button again
- Browser should ask permission to show popups
- Allow it

### Issue: "Invalid Client ID" error
**Solution:**
- Verify Client ID in .env matches exactly from Google Cloud Console
- Make sure it ends with `.apps.googleusercontent.com`
- Check for extra spaces or typos

### Issue: "Origin mismatch" or "Redirect URI mismatch"
**Solution:**
- This is normal - verify the origin is configured in Google Cloud Console
- Go to Google Cloud Console > Credentials > OAuth 2.0 Client ID
- Add the origin if missing:
  - Development: `http://localhost:5173`
  - Production: Your actual domain

### Issue: "Google button not appearing"
**Solution:**
- Check @react-oauth/google is installed: `pnpm list @react-oauth/google`
- Make sure GoogleOAuthProvider wraps the app in main.tsx
- Check browser console for errors

### Issue: "CORS error when sending token to backend"
**Solution:**
- This shouldn't happen because frontend and backend are same origin locally
- For production, ensure backend CORS is configured for frontend domain

---

## 🎯 What Happens Next

Your Google OAuth is now integrated:
- ✅ Users can sign up with Google one-click
- ✅ Users can log in with Google one-click
- ✅ Account linking between Google and email is automatic
- ✅ Profile data (name, picture) is fetched from Google
- ✅ Email is auto-verified for Google accounts
- ✅ All subsequent logins use session JWT token

---

## 📱 Mobile Testing (Optional)

To test on mobile/tablet:

1. Get your local computer's IP address:
   ```bash
   # Windows PowerShell
   ipconfig | Select-String IPv4
   
   # Mac/Linux
   ifconfig | grep inet
   ```

2. Update Google Cloud Console Authorized Origins:
   - Add: `http://YOUR_IP_ADDRESS:5173`

3. On mobile device on same WiFi:
   - Visit: `http://YOUR_IP_ADDRESS:5173/login`
   - Test Google OAuth

---

## 🔒 Security Notes

- ✅ Client ID is public (shown in frontend code) - that's normal
- 🔒 Client Secret is private (backend only) - never share
- ✅ Google OAuth handles all the security
- ✅ Frontend never sends password to Google
- ✅ Session tokens have 7-day expiry
- ✅ Tokens are stored securely in localStorage

---

## 📚 Resources

- [Google Cloud Console](https://console.cloud.google.com/)
- [OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [@react-oauth/google](https://www.npmjs.com/package/@react-oauth/google)
- [Google Sign-In Button](https://developers.google.com/identity/gsi/web)

---

## ✅ Verification Checklist

- [ ] Created Google Cloud Project
- [ ] Created OAuth 2.0 Client ID
- [ ] Copied Client ID to VITE_GOOGLE_CLIENT_ID in .env
- [ ] Installed @react-oauth/google package
- [ ] Backend has GoogleOAuthProvider in main.tsx
- [ ] Login page shows Google button
- [ ] Signup page shows Google button
- [ ] Tested Google login - works ✓
- [ ] Tested Google signup - works ✓
- [ ] User profile created in database ✓

---

**Status**: Google OAuth is **completely free and fully functional**
**Cost**: $0 (Zero)
**Setup Time**: ~30 minutes total

