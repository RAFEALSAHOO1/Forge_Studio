import { Router, type Request, type Response } from "express";
import { db } from "../db/connection";
import { usersTable } from "../db/schema";
import { eq } from "drizzle-orm";

// Type definition for authenticated request
interface AuthRequest extends Request {
  auth?: { userId: string | null };
}

const router = Router();

// Middleware to require authentication
function requireAuth(req: AuthRequest, res: Response, next: any) {
  if (!req.auth?.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  return next();
}

// Get user profile
router.get("/profile", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const userId = parseInt(req.auth?.userId || "0");
    const clerkId = req.auth?.userId;

    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.clerkId, clerkId || ""),
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json(user);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// Update user profile
router.patch("/profile", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const clerkId = req.auth?.userId;
    const { firstName, lastName, phoneNumber, countryCode, profileImage, preferredAuthMethod } = req.body;

    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.clerkId, clerkId || ""),
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const updateData: any = { updatedAt: new Date() };
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (phoneNumber) updateData.phoneNumber = phoneNumber;
    if (countryCode) updateData.countryCode = countryCode;
    if (profileImage) updateData.profileImage = profileImage;
    if (preferredAuthMethod) updateData.preferredAuthMethod = preferredAuthMethod;

    const result = await db.update(usersTable).set(updateData).where(eq(usersTable.clerkId, clerkId || "")).returning();

    return res.json(result[0]);
  } catch (error) {
    return res.status(500).json({ error: "Failed to update profile" });
  }
});

// Update authentication method preference
router.patch("/auth-preference", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const clerkId = req.auth?.userId;
    const { method } = req.body; // email, phone, both

    const validMethods = ["email", "phone", "both"];
    if (!validMethods.includes(method)) {
      return res.status(400).json({ error: "Invalid auth method" });
    }

    const result = await db
      .update(usersTable)
      .set({ preferredAuthMethod: method })
      .where(eq(usersTable.clerkId, clerkId || ""))
      .returning();

    return res.json(result[0]);
  } catch (error) {
    return res.status(500).json({ error: "Failed to update auth preference" });
  }
});

// Verify phone number
router.post("/verify-phone", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const clerkId = req.auth?.userId;

    const result = await db
      .update(usersTable)
      .set({ isPhoneVerified: true })
      .where(eq(usersTable.clerkId, clerkId || ""))
      .returning();

    return res.json({ success: true, message: "Phone verified" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to verify phone" });
  }
});

// Get user statistics
router.get("/stats", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const userId = parseInt(req.auth?.userId || "0");

    return res.json({
      totalDesigns: 0,
      totalOrders: 0,
      totalSpent: 0,
      memberSince: new Date(),
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch stats" });
  }
});

export default router;
