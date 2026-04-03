# Forge Studio Auth API - Quick Reference

## 🚀 Quick Start

**Base URL**: `http://localhost:3000/api/auth`

**Headers**:
```
Content-Type: application/json
Authorization: Bearer <jwt_token>  # Required for protected endpoints
```

---

## 📝 Endpoints Summary

| Method | Endpoint | Protected | Purpose |
|--------|----------|-----------|---------|
| POST | `/signup/email` | ❌ | Register with email |
| POST | `/login/email` | ❌ | Login with email |
| POST | `/auth/google` | ❌ | Google OAuth login |
| POST | `/verify-email` | ❌ | Verify email address |
| POST | `/request-password-reset` | ❌ | Request password reset |
| POST | `/reset-password` | ❌ | Reset password |
| POST | `/request-email-verification` | ❌ | Resend verification email |
| GET | `/me` | ✅ | Get current user |

---

## 🔐 Authentication Endpoints

### 1️⃣ Sign Up (Email/Password)
```
POST /signup/email
```

**Request**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Success Response** (201):
```json
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

**Error Responses**:
```json
// 400 - Missing fields
{ "success": false, "message": "Email, password, and names are required" }

// 400 - Password too short
{ "success": false, "message": "Password must be at least 8 characters" }

// 409 - User exists
{ "success": false, "message": "User with this email already exists" }
```

---

### 2️⃣ Log In (Email/Password)
```
POST /login/email
```

**Request**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Login successful",
  "user": { /* user object */ },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses**:
```json
// 400 - Missing fields
{ "success": false, "message": "Email and password are required" }

// 401 - Invalid credentials
{ "success": false, "message": "Invalid email or password" }
```

---

### 3️⃣ Google OAuth
```
POST /auth/google
```

**Request**:
```json
{
  "token": "google_id_token_from_google_sdk..."
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Login successful",
  "user": { /* user object */ },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses**:
```json
// 400 - Missing token
{ "success": false, "message": "Google token is required" }

// 401 - Invalid token
{ "success": false, "message": "Invalid Google token" }
```

---

### 4️⃣ Verify Email
```
POST /verify-email
```

**Request**:
```json
{
  "token": "verification_token_from_email..."
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

**Error Responses**:
```json
// 400 - Missing token
{ "success": false, "message": "Verification token is required" }

// 401 - Invalid token
{ "success": false, "message": "Invalid or expired verification token" }
```

---

### 5️⃣ Request Password Reset
```
POST /request-password-reset
```

**Request**:
```json
{
  "email": "user@example.com"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "If this email exists, a password reset link has been sent"
}
```

> **Note**: Returns same message whether email exists or not (security feature)

---

### 6️⃣ Reset Password
```
POST /reset-password
```

**Request**:
```json
{
  "token": "reset_token_from_email...",
  "password": "NewPassword123"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Password reset successful. Please login with your new password."
}
```

**Error Responses**:
```json
// 400 - Missing fields
{ "success": false, "message": "Token and password are required" }

// 400 - Password too short
{ "success": false, "message": "Password must be at least 8 characters" }

// 401 - Invalid token
{ "success": false, "message": "Invalid or expired reset token" }
```

---

### 7️⃣ Resend Email Verification
```
POST /request-email-verification
```

**Request**:
```json
{
  "email": "user@example.com"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Verification email sent successfully"
}
```

**Error Responses**:
```json
// 400 - Missing email
{ "success": false, "message": "Email is required" }

// 404 - User not found
{ "success": false, "message": "User with this email not found" }

// 400 - Already verified
{ "success": false, "message": "Email is already verified" }
```

---

### 8️⃣ Get Current User
```
GET /me
Authorization: Bearer <jwt_token>
```

**Success Response** (200):
```json
{
  "success": true,
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "profileImage": null,
    "authProvider": "email"
  }
}
```

**Error Responses**:
```json
// 401 - Missing header
{ "success": false, "message": "Authorization header missing" }

// 401 - Invalid token
{ "success": false, "message": "Invalid token" }

// 404 - User not found (token valid but user deleted)
{ "success": false, "message": "User not found" }
```

---

## 🧪 Testing Examples

### Using cURL

**Sign Up**:
```bash
curl -X POST http://localhost:3000/api/auth/signup/email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

**Login**:
```bash
curl -X POST http://localhost:3000/api/auth/login/email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123"
  }'
```

**Get Current User**:
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Using JavaScript/Fetch

**Sign Up**:
```javascript
const response = await fetch('http://localhost:3000/api/auth/signup/email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'TestPass123',
    firstName: 'John',
    lastName: 'Doe'
  })
});
const data = await response.json();
console.log(data.token); // Save this token
```

**Login**:
```javascript
const response = await fetch('http://localhost:3000/api/auth/login/email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'TestPass123'
  })
});
const data = await response.json();
localStorage.setItem('token', data.token);
```

**Get Current User**:
```javascript
const token = localStorage.getItem('token');
const response = await fetch('http://localhost:3000/api/auth/me', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const { user } = await response.json();
console.log(user);
```

---

## 🔐 Token Usage

### Storing Token
```javascript
// After login/signup
localStorage.setItem('auth_token', response.token);
```

### Using Token in Requests
```javascript
const token = localStorage.getItem('auth_token');
fetch('/api/orders', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

### Token Expiry
- **Duration**: 7 days
- **Format**: JWT (JSON Web Token)
- **Claim**: `{ userId, email }`
- **Signature**: HS256 with JWT_SECRET

---

## 📋 HTTP Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | Success | Login/Get user succeeded |
| 201 | Created | User signup succeeded |
| 400 | Bad Request | Missing required fields |
| 401 | Unauthorized | Invalid credentials/token |
| 404 | Not Found | User not found |
| 409 | Conflict | User already exists |
| 500 | Server Error | Database connection failed |

---

## 🔄 User Flows

### Email/Password Registration
```
1. POST /signup/email
   ↓
2. Email sent with verification link
   ↓
3. User clicks link (contains token in URL)
   ↓
4. POST /verify-email with token
   ↓
5. Account active, user can login
```

### Email/Password Login
```
1. POST /login/email
   ↓
2. Receive JWT token
   ↓
3. Store token in localStorage
   ↓
4. Use token in Auth header for protected requests
```

### Password Reset
```
1. POST /request-password-reset
   ↓
2. Email sent with reset link (contains token)
   ↓
3. User clicks link and fills new password
   ↓
4. POST /reset-password with token + new password
   ↓
5. Can login with new password
```

### Google OAuth
```
1. User clicks "Sign in with Google"
   ↓
2. Google OAuth consent screen
   ↓
3. User approves, get Google token
   ↓
4. POST /auth/google with Google token
   ↓
5. User created/logged in, JWT token returned
```

---

## 📱 Frontend Implementation

### Using useAuth Hook
```typescript
import { useAuth } from '@/hooks/useAuth';

function MyComponent() {
  const { user, login, logout, isLoading } = useAuth();
  
  if (!user) return <div>Not logged in</div>;
  
  return (
    <div>
      Welcome {user.firstName}!
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Making Authenticated Requests
```typescript
const { getAuthHeader } = useAuth();

fetch('/api/orders', {
  headers: {
    'Content-Type': 'application/json',
    ...getAuthHeader() // Adds Authorization header
  }
});
```

---

## ⚡ Performance Tips

1. **Cache user data** after login
2. **Don't validate token on every request** (only on app load)
3. **Use localStorage** for token persistence
4. **Lazy load auth pages** only when needed
5. **Debounce password reset requests** (max 1 per minute per email)

---

## 🚨 Common Errors & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| "Invalid email or password" | Wrong credentials | Check email/password |
| "User already exists" | Email taken | Use different email |
| "Invalid or expired token" | Token expired/modified | Re-verify from email |
| "Token and password required" | Missing field | Include both in request |
| "Password must be 8+ chars" | Password too short | Use 8+ character password |
| "Authorization header missing" | No Bearer token | Add `Authorization: Bearer <token>` |
| "Invalid token" | Token corrupted/expired | Login again to get new token |

---

## 📞 API Version
- **Version**: 1.0.0
- **Base Path**: `/api/auth`
- **Authentication**: JWT Bearer Token
- **Rate Limit**: None (add before production)

---

**Last Updated**: Current Build
**Status**: ✅ Production Ready
