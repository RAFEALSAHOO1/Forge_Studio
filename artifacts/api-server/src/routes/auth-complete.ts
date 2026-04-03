import { Router, type Request, type Response } from "express";
import { db } from "../db/connection";
import { usersTable, otpsTable } from "../db/schema";
import { eq, or } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Resend } from "resend";

const router = Router();
const resend = new Resend(process.env.RESEND_API_KEY);

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key";
const JWT_EXPIRY = "7d";
const SALT_ROUNDS = 10;

// ============================================
// TYPES & INTERFACES
// ============================================

interface SignupPayload {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  googleToken?: string;
}

interface LoginPayload {
  email: string;
  password?: string;
  googleToken?: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  user?: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    profileImage: string | null;
    authProvider: string;
  };
  token?: string;
}

// ============================================
// AUTHENTICATION HELPERS
// ============================================

/**
 * Hash password using bcrypt
 */
async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compare password with hash
 */
async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generate JWT token
 */
function generateToken(userId: number, email: string): string {
  return jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
}

/**
 * Verify JWT token
 */
function verifyToken(token: string): { userId: number; email: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: number; email: string };
  } catch {
    return null;
  }
}

/**
 * Verify Google OAuth token (in production, verify with Google's API)
 */
async function verifyGoogleToken(token: string): Promise<{ id: string; email: string; name: string; picture: string } | null> {
  try {
    // In production, verify token with Google's tokeninfo endpoint
    // For now, decode JWT (Google ID tokens are JWTs)
    const decoded = jwt.decode(token) as any;
    if (decoded && decoded.email) {
      return {
        id: decoded.sub,
        email: decoded.email,
        name: decoded.name || "",
        picture: decoded.picture || "",
      };
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Send verification email
 */
async function sendVerificationEmail(email: string, verificationLink: string): Promise<boolean> {
  try {
    await resend.emails.send({
      from: "noreply@forgestudio.com",
      to: email,
      subject: "Verify Your Forge Studio Email",
      html: `
        <h2>Welcome to Forge Studio!</h2>
        <p>Please verify your email address by clicking the link below:</p>
        <a href="${verificationLink}" style="padding: 10px 20px; background-color: #6366F1; color: white; text-decoration: none; border-radius: 8px; display: inline-block; margin: 20px 0;">
          Verify Email
        </a>
        <p>Or copy this link: ${verificationLink}</p>
        <p>This link expires in 24 hours.</p>
      `,
    });
    return true;
  } catch (error) {
    console.error("Failed to send verification email:", error);
    return false;
  }
}

// ============================================
// EMAIL/PASSWORD SIGNUP
// ============================================

router.post("/signup/email", async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName } = req.body as SignupPayload;

    // Validation
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: "Email, password, and names are required",
      } as AuthResponse);
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      } as AuthResponse);
    }

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email.toLowerCase()))
      .limit(1);

    if (existingUser.length > 0) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists",
      } as AuthResponse);
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const newUser = await db
      .insert(usersTable)
      .values({
        email: email.toLowerCase(),
        password: hashedPassword,
        firstName,
        lastName,
        authProvider: "email",
        isEmailVerified: false,
      })
      .returning();

    if (!newUser[0]) {
      return res.status(500).json({
        success: false,
        message: "Failed to create user",
      } as AuthResponse);
    }

    // Generate verification token and send email
    const verificationToken = jwt.sign(
      { userId: newUser[0].id, email: newUser[0].email, purpose: "email-verification" },
      JWT_SECRET,
      { expiresIn: "24h" },
    );

    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    await sendVerificationEmail(newUser[0].email, verificationLink);

    // Generate auth token
    const authToken = generateToken(newUser[0].id, newUser[0].email);

    return res.status(201).json({
      success: true,
      message: "Signup successful. Please verify your email.",
      user: {
        id: newUser[0].id,
        email: newUser[0].email,
        firstName: newUser[0].firstName || "",
        lastName: newUser[0].lastName || "",
        profileImage: newUser[0].profileImage,
        authProvider: newUser[0].authProvider,
      },
      token: authToken,
    } as AuthResponse);
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during signup",
    } as AuthResponse);
  }
});

// ============================================
// EMAIL/PASSWORD LOGIN
// ============================================

router.post("/login/email", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as LoginPayload;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      } as AuthResponse);
    }

    // Find user
    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email.toLowerCase()))
      .limit(1);

    if (user.length === 0 || !user[0].password) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      } as AuthResponse);
    }

    // Compare passwords
    const isPasswordValid = await comparePassword(password, user[0].password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      } as AuthResponse);
    }

    // Update last login
    await db
      .update(usersTable)
      .set({ lastLoginAt: new Date() })
      .where(eq(usersTable.id, user[0].id));

    // Generate token
    const token = generateToken(user[0].id, user[0].email);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user[0].id,
        email: user[0].email,
        firstName: user[0].firstName || "",
        lastName: user[0].lastName || "",
        profileImage: user[0].profileImage,
        authProvider: user[0].authProvider,
      },
      token,
    } as AuthResponse);
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during login",
    } as AuthResponse);
  }
});

// ============================================
// GOOGLE OAUTH SIGNUP/LOGIN
// ============================================

router.post("/auth/google", async (req: Request, res: Response) => {
  try {
    const { googleToken } = req.body;

    if (!googleToken) {
      return res.status(400).json({
        success: false,
        message: "Google token is required",
      } as AuthResponse);
    }

    // Verify Google token
    const googleUser = await verifyGoogleToken(googleToken);

    if (!googleUser) {
      return res.status(401).json({
        success: false,
        message: "Invalid Google token",
      } as AuthResponse);
    }

    // Check if user exists
    let user = await db
      .select()
      .from(usersTable)
      .where(
        or(eq(usersTable.email, googleUser.email), eq(usersTable.googleId, googleUser.id)),
      )
      .limit(1);

    if (user.length === 0) {
      // Create new user from Google
      const [firstName, lastName] = googleUser.name.split(" ");

      const newUser = await db
        .insert(usersTable)
        .values({
          email: googleUser.email,
          googleId: googleUser.id,
          firstName: firstName || googleUser.name,
          lastName: lastName || "",
          profileImage: googleUser.picture,
          authProvider: "google",
          isEmailVerified: true, // Google emails are pre-verified
        })
        .returning();

      user = newUser;
    } else if (!user[0].googleId) {
      // Link Google account to existing email user
      await db
        .update(usersTable)
        .set({ googleId: googleUser.id, profileImage: googleUser.picture })
        .where(eq(usersTable.id, user[0].id));
    }

    // Update last login
    await db
      .update(usersTable)
      .set({ lastLoginAt: new Date() })
      .where(eq(usersTable.id, user[0].id));

    // Generate token
    const token = generateToken(user[0].id, user[0].email);

    return res.status(200).json({
      success: true,
      message: user.length === 1 ? "Login successful" : "Signup successful",
      user: {
        id: user[0].id,
        email: user[0].email,
        firstName: user[0].firstName || "",
        lastName: user[0].lastName || "",
        profileImage: user[0].profileImage,
        authProvider: user[0].authProvider,
      },
      token,
    } as AuthResponse);
  } catch (error) {
    console.error("Google auth error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during Google authentication",
    } as AuthResponse);
  }
});

// ============================================
// EMAIL VERIFICATION
// ============================================

router.post("/verify-email", async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Verification token is required",
      } as AuthResponse);
    }

    // Decode token
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    if (decoded.purpose !== "email-verification") {
      return res.status(401).json({
        success: false,
        message: "Invalid verification token",
      } as AuthResponse);
    }

    // Update user
    await db
      .update(usersTable)
      .set({ isEmailVerified: true })
      .where(eq(usersTable.id, decoded.userId));

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    } as AuthResponse);
  } catch (error) {
    console.error("Email verification error:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired verification token",
    } as AuthResponse);
  }
});

// ============================================
// PASSWORD RESET REQUEST
// ============================================

router.post("/request-password-reset", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      } as AuthResponse);
    }

    // Check if user exists
    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email.toLowerCase()))
      .limit(1);

    if (user.length === 0) {
      // Don't reveal if email exists for security
      return res.status(200).json({
        success: true,
        message: "If this email exists, a password reset link has been sent",
      } as AuthResponse);
    }

    // Generate reset token
    const resetToken = jwt.sign(
      { userId: user[0].id, email: user[0].email, purpose: "password-reset" },
      JWT_SECRET,
      { expiresIn: "1h" },
    );

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    // Send reset email
    await resend.emails.send({
      from: "noreply@forgestudio.com",
      to: user[0].email,
      subject: "Reset Your Forge Studio Password",
      html: `
        <h2>Password Reset Request</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}" style="padding: 10px 20px; background-color: #6366F1; color: white; text-decoration: none; border-radius: 8px; display: inline-block; margin: 20px 0;">
          Reset Password
        </a>
        <p>This link expires in 1 hour.</p>
        <p>If you didn't request this, ignore this email.</p>
      `,
    });

    return res.status(200).json({
      success: true,
      message: "If this email exists, a password reset link has been sent",
    } as AuthResponse);
  } catch (error) {
    console.error("Password reset request error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    } as AuthResponse);
  }
});

// ============================================
// PASSWORD RESET CONFIRM
// ============================================

router.post("/reset-password", async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: "Token and password are required",
      } as AuthResponse);
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      } as AuthResponse);
    }

    // Decode token
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    if (decoded.purpose !== "password-reset") {
      return res.status(401).json({
        success: false,
        message: "Invalid reset token",
      } as AuthResponse);
    }

    // Hash new password
    const hashedPassword = await hashPassword(password);

    // Update user
    await db
      .update(usersTable)
      .set({ password: hashedPassword })
      .where(eq(usersTable.id, decoded.userId));

    return res.status(200).json({
      success: true,
      message: "Password reset successful. Please login with your new password.",
    } as AuthResponse);
  } catch (error) {
    console.error("Password reset error:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired reset token",
    } as AuthResponse);
  }
});

// ============================================
// REQUEST EMAIL VERIFICATION (RESEND)
// ============================================

router.post("/request-email-verification", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      } as AuthResponse);
    }

    // Find user
    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email.toLowerCase()))
      .limit(1);

    if (user.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User with this email not found",
      } as AuthResponse);
    }

    if (user[0].isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified",
      } as AuthResponse);
    }

    // Generate verification token
    const verificationToken = jwt.sign(
      { userId: user[0].id, email: user[0].email, purpose: "email-verification" },
      JWT_SECRET,
      { expiresIn: "24h" },
    );

    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

    // Send verification email
    await sendVerificationEmail(user[0].email, verificationLink);

    return res.status(200).json({
      success: true,
      message: "Verification email sent successfully",
    } as AuthResponse);
  } catch (error) {
    console.error("Request email verification error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    } as AuthResponse);
  }
});

// ============================================
// GET CURRENT USER
// ============================================

router.get("/me", async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authorization header missing",
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, decoded.userId))
      .limit(1);

    if (user.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user[0].id,
        email: user[0].email,
        firstName: user[0].firstName || "",
        lastName: user[0].lastName || "",
        profileImage: user[0].profileImage,
        authProvider: user[0].authProvider,
      },
    });
  } catch (error) {
    console.error("Get current user error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

export default router;
