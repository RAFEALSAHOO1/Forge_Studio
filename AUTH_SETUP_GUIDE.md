# Forge Studio Authentication System - Setup & Configuration Guide

## 📋 Table of Contents
1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [Authentication Methods](#authentication-methods)
4. [Environment Configuration](#environment-configuration)
5. [Database Setup](#database-setup)
6. [API Endpoints](#api-endpoints)
7. [Frontend Setup](#frontend-setup)
8. [Google OAuth Configuration](#google-oauth-configuration)
9. [Testing the Authentication System](#testing-the-authentication-system)
10. [Deployment Checklist](#deployment-checklist)
11. [Troubleshooting](#troubleshooting)

## 🔐 Overview

The Forge Studio authentication system provides a complete user management solution with:

- **Email/Password Authentication**: Traditional email-based signup and login
- **Google OAuth 2.0**: One-click signup/login with Google accounts
- **Email Verification**: Secure email verification flow with expiring tokens
- **Password Reset**: Secure password reset with 1-hour expiring tokens
- **Session Management**: JWT-based authentication with 7-day token expiry
- **Protected Routes**: Frontend route protection for authenticated users
- **Profile Management**: User profile data storage and retrieval

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React + Vite)                  │
│  ┌──────────┬──────────┬──────────────┬──────────┬────────┐ │
│  │ Login    │ Signup   │ Verify Email │ Password │ Reset  │ │
│  │ Page     │ Page     │ Page         │ Request  │ Page   │ │
│  └──────┬───┴──┬───────┴──┬───────────┴──┬───────┴────┬───┘ │
│         │      │          │              │            │      │
│         └──────┼──────────┼──────────────┼────────────┘      │
│                │ useAuth Hook & ProtectedRoute Component     │
│                │ (localStorage token management)              │
└────────────────┼──────────────────────────────────────────────┘
                 │ HTTP Requests
┌────────────────┼──────────────────────────────────────────────┐
│                │ Backend (Express.js)                         │
│  ┌─────────────▼─────────────────────────────────────────┐  │
│  │ Auth Routes (auth-complete.ts)                        │  │
│  │ ┌─────────────────────────────────────────────────┐   │  │
│  │ │ POST   /signup/email               (register)   │   │  │
│  │ │ POST   /login/email                (login)      │   │  │
│  │ │ POST   /auth/google                (oauth)      │   │  │
│  │ │ POST   /verify-email               (verify)     │   │  │
│  │ │ POST   /request-password-reset     (reset req)  │   │  │
│  │ │ POST   /reset-password             (confirm)    │   │  │
│  │ │ POST   /request-email-verification (resend)     │   │  │
│  │ │ GET    /me                         (get user)   │   │  │
│  │ └─────────────────────────────────────────────────┘   │  │
│  └──────┬──────────────────────────────────────────────────┘  │
│         │ Helpers: hashPassword, comparePassword, generateToken
│         │ Services: sendVerificationEmail, verifyToken
│         │
│  ┌──────▼──────────────────────────────────────────────────┐  │
│  │ Database (PostgreSQL + Drizzle ORM)                    │  │
│  │ ┌────────────────────────────────────────────────────┐ │  │
│  │ │ users table                                        │ │  │
│  │ │ ├─ id (primary key)                               │ │  │
│  │ │ ├─ email (unique)                                 │ │  │
│  │ │ ├─ password (hashed with bcryptjs)                │ │  │
│  │ │ ├─ googleId (unique, for OAuth)                   │ │  │
│  │ │ ├─ authProvider (email|google|phone)              │ │  │
│  │ │ ├─ firstName, lastName                            │ │  │
│  │ │ ├─ profileImage                                   │ │  │
│  │ │ ├─ isEmailVerified                                │ │  │
│  │ │ ├─ clerkId (optional, legacy)                     │ │  │
│  │ │ └─ createdAt, updatedAt, lastLoginAt              │ │  │
│  │ └────────────────────────────────────────────────────┘ │  │
│  └─────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘

External Services:
┌──────────────────────────┐    ┌──────────────────────────┐
│ Resend (Email Service)   │    │ Google OAuth 2.0         │
│ - Verification emails    │    │ - OAuth token validation │
│ - Password reset emails  │    │ - User profile retrieval │
└──────────────────────────┘    └──────────────────────────┘
```

## 🔑 Authentication Methods

### 1. Email/Password Authentication
- **Registration**: Email → Password (8+ chars) → Verification email sent
- **Login**: Email → Password → JWT token generated
- **Email Verification**: Token-based, 24-hour expiry
- **Password Reset**: 1-hour expiry tokens for security

### 2. Google OAuth 2.0
- **Account Creation**: Single click signup with Google account
- **Auto-Login**: Returns existing user if found
- **Account Linking**: Links Google to existing email account
- **Pre-verified**: Email is auto-verified for Google accounts

### 3. Security Features
- Passwords hashed with bcryptjs (10 salt rounds)
- JWT tokens with 7-day expiry
- Email verification tokens with 24-hour expiry
- Password reset tokens with 1-hour expiry
- Token verification on protected routes
- Bearer token validation on all authenticated endpoints

## 🔧 Environment Configuration

### Backend Environment Variables

Create `.env` file in `artifacts/api-server/`:

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/forgestudio"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-min-32-chars-long"
JWT_EXPIRY="7d"

# Email Service (Resend)
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# Frontend URL (for email links)
FRONTEND_URL="http://localhost:5173"  # Development
# FRONTEND_URL="https://forgestudio.com"  # Production

# Google OAuth (after configuration)
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Node Environment
NODE_ENV="development"  # or "production"
```

### Frontend Environment Variables

Create `.env` file in `artifacts/designforge/`:

```bash
# API Configuration
VITE_API_URL="http://localhost:3000/api"  # Development
# VITE_API_URL="https://api.forgestudio.com"  # Production

# Google OAuth (React OAuth Library)
VITE_GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
```

## 📊 Database Setup

### 1. Database Schema

The `users` table in `lib/db/src/schema/users.ts` includes:

```typescript
{
  id: number (primary key, auto-increment)
  email: string (unique)
  password: string | null (hashed, null for OAuth-only)
  firstName: string
  lastName: string
  profileImage: string | null
  authProvider: "email" | "google" | "phone"
  googleId: string | null (unique, for OAuth)
  clerkId: string | null (optional, legacy)
  isEmailVerified: boolean
  createdAt: Date
  updatedAt: Date
  lastLoginAt: Date | null
}
```

### 2. Running Migrations

```bash
# From project root
cd lib/db

# Generate migration from schema changes
pnpm drizzle-kit generate:pg

# Apply migrations to database
pnpm drizzle-kit migrate:pg

# Or use drizzle studio for visual inspection
pnpm drizzle-kit studio
```

### 3. Verify Schema

```bash
# Connect to database and verify users table
psql postgresql://user:password@localhost:5432/forgestudio

# List tables
\dt

# Describe users table
\d users
```

## 📡 API Endpoints

### Authentication Endpoints

Base URL: `http://localhost:3000/api/auth`

#### 1. Email/Password Signup
```http
POST /signup/email
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe"
}

Response (201):
{
  "success": true,
  "message": "Signup successful. Please verify your email.",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "profileImage": null,
    "authProvider": "email"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### 2. Email/Password Login
```http
POST /login/email
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}

Response (200):
{
  "success": true,
  "message": "Login successful",
  "user": { ... },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### 3. Google OAuth
```http
POST /auth/google
Content-Type: application/json

{
  "token": "google_id_token_from_client..."
}

Response (200):
{
  "success": true,
  "message": "Login successful",
  "user": { ... },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### 4. Email Verification
```http
POST /verify-email
Content-Type: application/json

{
  "token": "verification_token_from_email..."
}

Response (200):
{
  "success": true,
  "message": "Email verified successfully"
}
```

#### 5. Request Password Reset
```http
POST /request-password-reset
Content-Type: application/json

{
  "email": "user@example.com"
}

Response (200):
{
  "success": true,
  "message": "If this email exists, a password reset link has been sent"
}
```

#### 6. Reset Password
```http
POST /reset-password
Content-Type: application/json

{
  "token": "reset_token_from_email...",
  "password": "newPassword123"
}

Response (200):
{
  "success": true,
  "message": "Password reset successful. Please login with your new password."
}
```

#### 7. Resend Verification Email
```http
POST /request-email-verification
Content-Type: application/json

{
  "email": "user@example.com"
}

Response (200):
{
  "success": true,
  "message": "Verification email sent successfully"
}
```

#### 8. Get Current User
```http
GET /me
Authorization: Bearer <jwt_token>

Response (200):
{
  "success": true,
  "user": { ... }
}
```

### Error Responses

All endpoints follow this error format:

```json
{
  "success": false,
  "message": "Error description"
}
```

HTTP Status Codes:
- `400`: Bad Request (missing fields, invalid input)
- `401`: Unauthorized (invalid credentials, expired tokens)
- `404`: Not Found (user not found)
- `409`: Conflict (user already exists)
- `500`: Server Error

## 🎨 Frontend Setup

### 1. Authentication Hook Usage

```typescript
import { useAuth } from '@/hooks/useAuth';

function MyComponent() {
  const { 
    user,           // Current user object
    isAuthenticated, // Boolean
    isLoading,      // Boolean
    error,          // Error message or null
    login,          // (email, password) => Promise
    signup,         // (email, password, firstName, lastName) => Promise
    googleAuth,     // (token) => Promise
    logout,         // () => void
    getToken,       // () => string | null
    getAuthHeader,  // () => { Authorization: "Bearer ..." }
  } = useAuth();

  // Example usage
  const handleLogin = async () => {
    try {
      await login('user@example.com', 'password');
      // Redirect to dashboard
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <button onClick={handleLogin} disabled={isLoading}>
      {isLoading ? 'Logging in...' : 'Login'}
    </button>
  );
}
```

### 2. Protected Routes Usage

```typescript
import { ProtectedRoute } from '@/components/ProtectedRoute';

// In Router component
<ProtectedRoute>
  <DashboardPage />
</ProtectedRoute>
```

### 3. Making Authenticated API Calls

```typescript
const { getAuthHeader } = useAuth();

// In API call
fetch('/api/orders', {
  headers: {
    'Content-Type': 'application/json',
    ...getAuthHeader()  // Includes Bearer token
  }
})
```

### 4. Authentication Pages

**Login** (`/login`): Email/password form + Google OAuth button
**Signup** (`/signup`): Registration form + Google OAuth button
**Verify Email** (`/verify-email`): Token verification + resend option
**Password Reset Request** (`/request-password-reset`): Email input
**Password Reset** (`/reset-password`): New password form

## 🔐 Google OAuth Configuration

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project: "Forge Studio"
3. Enable APIs:
   - Google+ API
   - Google Identity Service

### Step 2: Create OAuth 2.0 Credentials

1. Go to Credentials
2. Click "Create Credentials" → "OAuth 2.0 Client ID"
3. Select "Web application"
4. Add Authorized JavaScript origins:
   - `http://localhost:5173` (development)
   - `https://forgestudio.com` (production)
5. Add Authorized redirect URIs:
   - `http://localhost:5173/login` (development)
   - `https://forgestudio.com/login` (production)

### Step 3: Configure Frontend

1. Install Google OAuth library:
   ```bash
   cd artifacts/designforge
   pnpm add @react-oauth/google
   ```

2. Update `src/main.tsx`:
   ```typescript
   import { GoogleOAuthProvider } from '@react-oauth/google';
   
   ReactDOM.createRoot(document.getElementById('root')!).render(
     <React.StrictMode>
       <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
         <App />
       </GoogleOAuthProvider>
     </React.StrictMode>,
   );
   ```

3. Update Login and Signup pages to use actual Google button:
   ```typescript
   import { GoogleLogin } from '@react-oauth/google';
   
   <GoogleLogin
     onSuccess={(credentialResponse) => {
       googleAuth(credentialResponse.credential);
     }}
     onError={() => console.log('Login Failed')}
   />
   ```

### Step 4: Backend Google Token Verification

Update `verifyGoogleToken` function in `auth-complete.ts` to verify with Google:

```typescript
async function verifyGoogleToken(token: string): Promise<...> {
  try {
    // Call Google's tokeninfo API
    const response = await fetch(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`);
    const data = await response.json();
    
    if (data.error) {
      return null;
    }
    
    // Fetch user info
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const userInfo = await userResponse.json();
    
    return {
      id: userInfo.id,
      email: userInfo.email,
      name: userInfo.name,
      picture: userInfo.picture,
    };
  } catch {
    return null;
  }
}
```

## ✅ Testing the Authentication System

### 1. Backend Testing

Use curl or Postman:

```bash
# Test Signup
curl -X POST http://localhost:3000/api/auth/signup/email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123",
    "firstName": "Test",
    "lastName": "User"
  }'

# Test Login
curl -X POST http://localhost:3000/api/auth/login/email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123"
  }'

# Test Get Current User (replace TOKEN with actual JWT)
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer TOKEN"
```

### 2. Frontend Testing

1. Open `http://localhost:5173/signup`
2. Fill in form and submit
3. Check email for verification link
4. Click verification link
5. Go to `http://localhost:5173/login`
6. Login with credentials
7. Check that user is authenticated and redirected

### 3. Test Password Reset Flow

1. Go to `/request-password-reset`
2. Enter email address
3. Check email for reset link
4. Click link (verify token parameter)
5. Enter new password
6. Login with new password

## 🚀 Deployment Checklist

- [ ] Database migrations applied to production database
- [ ] Create production environment variables:
  - [ ] JWT_SECRET (strong, random string)
  - [ ] DATABASE_URL (production PostgreSQL)
  - [ ] RESEND_API_KEY (production)
  - [ ] FRONTEND_URL (production domain)
  - [ ] GOOGLE_CLIENT_ID (production)
  - [ ] GOOGLE_CLIENT_SECRET (production)
- [ ] Configure Google OAuth credentials for production domain
- [ ] Update CORS settings to allow production domain
- [ ] Test all auth flows in production build
- [ ] Setup email templates for production
- [ ] Configure SSL/HTTPS
- [ ] Setup monitoring/logging for auth endpoints
- [ ] Test password reset email links
- [ ] Test email verification emails
- [ ] Setup rate limiting on auth endpoints
- [ ] Implement session management/logout on all devices
- [ ] Setup automated database backups
- [ ] Document deployment process

## 🔨 Troubleshooting

### Issue: "Token verification failed"
**Solution**: 
- Check JWT_SECRET matches between frontend and backend
- Verify token hasn't expired (7 days)
- Check Authorization header format: `Bearer <token>`

### Issue: "Email delivery not working"
**Solution**:
- Verify RESEND_API_KEY is correct
- Check email address is not in spam folder
- Verify FRONTEND_URL is correct in backend config

### Issue: "Google authentication failing"
**Solution**:
- Verify GOOGLE_CLIENT_ID is correct
- Check authorized origins in Google Cloud Console
- Ensure Google OAuth library is installed: `pnpm add @react-oauth/google`
- Check browser console for OAuth errors

### Issue: "User not found after login"
**Solution**:
- Verify user was created in database
- Check email is lowercased consistently
- Verify database connection is working

### Issue: "Password hashing errors"
**Solution**:
- Ensure bcryptjs is installed: `pnpm add bcryptjs`
- Check Node.js version (should be 14.20+)
- Verify SALT_ROUNDS = 10 (shouldn't be changed)

### Issue: "Protected routes not working"
**Solution**:
- Verify token is stored in localStorage correctly
- Check useAuth hook is properly initialized
- Ensure ProtectedRoute component wraps routes needing auth

### Issue: "Email verification link not working"
**Solution**:
- Verify FRONTEND_URL matches your domain
- Check token in URL hasn't been modified
- Verify token hasn't expired (24 hours)
- Check browser console for errors

## 📚 Additional Resources

- [JWT Introduction](https://jwt.io/introduction)
- [bcryptjs Documentation](https://github.com/dcodeIO/bcrypt.js)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Resend Email API](https://resend.com/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [React OAuth Google](https://www.npmjs.com/package/@react-oauth/google)

## 📝 Files Reference

### Backend Files
- `artifacts/api-server/src/routes/auth-complete.ts` - Main auth implementation
- `artifacts/api-server/src/routes/index.ts` - Route registration
- `lib/db/src/schema/users.ts` - Database schema

### Frontend Files
- `artifacts/designforge/src/pages/Login.tsx` - Login page
- `artifacts/designforge/src/pages/Signup.tsx` - Signup page
- `artifacts/designforge/src/pages/VerifyEmail.tsx` - Email verification
- `artifacts/designforge/src/pages/RequestPasswordReset.tsx` - Password reset request
- `artifacts/designforge/src/pages/ResetPassword.tsx` - Password reset confirm
- `artifacts/designforge/src/hooks/useAuth.ts` - Auth hook
- `artifacts/designforge/src/components/ProtectedRoute.tsx` - Route protection
- `artifacts/designforge/src/App.tsx` - Route configuration

---

**Last Updated**: 2024
**Status**: Production Ready
**Version**: 1.0.0
