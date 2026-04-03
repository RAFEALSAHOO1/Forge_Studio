import { getAuth } from "@clerk/express";
import { db } from "../db/connection";
import { usersTable } from "../db/schema";
import { eq } from "drizzle-orm";
import type { Request, Response, NextFunction } from "express";

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
  userEmail?: string;
}

export async function requireOwnerAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const auth = getAuth(req);
    const userId = auth?.userId;

    if (!userId) {
      res.status(401).json({
        error: "unauthorized",
        message: "Authentication required",
      });
      return;
    }

    // Get user from database
    const user = await db.query.usersTable.findFirst({
      where: (table) => eq(table.clerkId, userId),
    });

    if (!user) {
      res.status(401).json({
        error: "unauthorized",
        message: "User not found",
      });
      return;
    }

    // Check if user is owner
    if (user.role !== "owner") {
      res.status(403).json({
        error: "forbidden",
        message: "This resource is only accessible to owners",
      });
      return;
    }

    req.userId = user.id.toString();
    req.userRole = user.role;
    req.userEmail = user.email;
    next();
  } catch (error) {
    console.error("Owner auth error:", error);
    res.status(500).json({
      error: "server_error",
      message: "Failed to verify owner status",
    });
  }
}
