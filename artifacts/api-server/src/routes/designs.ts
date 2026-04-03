import { Router, type Request, type Response } from "express";
import { db } from "../db/connection";
import { designsTable, usersTable } from "../db/schema";
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

// Create design
router.post("/", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const {
      name,
      description,
      category,
      colors,
      fonts,
      layout,
      customizations,
      previewImageUrl,
      svgData,
    } = req.body;
    const userId = parseInt(req.auth?.userId || "0");

    if (!name || !category) {
      return res.status(400).json({ error: "Name and category are required" });
    }

    const result = await db
      .insert(designsTable)
      .values({
        userId,
        name,
        description,
        category,
        colors: JSON.stringify(colors || []),
        fonts: JSON.stringify(fonts || []),
        layout: JSON.stringify(layout || {}),
        customizations: JSON.stringify(customizations || {}),
        previewImageUrl,
        svgData,
        status: "draft",
      })
      .returning();

    return res.status(201).json(result[0]);
  } catch (error) {
    console.error("Error creating design:", error);
    return res.status(500).json({ error: "Failed to create design" });
  }
});

// Get user designs
router.get("/", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const userId = parseInt(req.auth?.userId || "0");
    const page = parseInt((req.query.page as string) || "0");
    const limit = parseInt((req.query.limit as string) || "10");

    const designs = await db.query.designsTable.findMany({
      where: (table) => eq(table.userId, userId),
      limit: limit + 1,
      offset: page * limit,
    });

    return res.json({
      page,
      limit,
      total: designs.length,
      data: designs.slice(0, limit),
      hasMore: designs.length > limit,
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch designs" });
  }
});

// Get design by ID
router.get("/:designId", async (req: AuthRequest, res: Response) => {
  try {
    const designId = parseInt(Array.isArray(req.params.designId) ? req.params.designId[0] : req.params.designId);

    const design = await db.query.designsTable.findFirst({
      where: (table) => eq(table.id, designId),
    });

    if (!design) {
      return res.status(404).json({ error: "Design not found" });
    }

    return res.json(design);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch design" });
  }
});

// Update design
router.patch("/:designId", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const designId = parseInt(Array.isArray(req.params.designId) ? req.params.designId[0] : req.params.designId);
    const userId = parseInt(req.auth?.userId || "0");
    const { name, description, colors, fonts, layout, customizations, status } = req.body;

    const design = await db.query.designsTable.findFirst({
      where: (table) => eq(table.id, designId),
    });

    if (!design || design.userId !== userId) {
      return res.status(404).json({ error: "Design not found" });
    }

    const updateData: any = { updatedAt: new Date() };
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (colors) updateData.colors = JSON.stringify(colors);
    if (fonts) updateData.fonts = JSON.stringify(fonts);
    if (layout) updateData.layout = JSON.stringify(layout);
    if (customizations) updateData.customizations = JSON.stringify(customizations);
    if (status && ["draft", "published", "archived"].includes(status)) updateData.status = status;

    const result = await db.update(designsTable).set(updateData).where(eq(designsTable.id, design.id)).returning();

    return res.json(result[0]);
  } catch (error) {
    return res.status(500).json({ error: "Failed to update design" });
  }
});

// Delete design
router.delete("/:designId", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const designId = parseInt(Array.isArray(req.params.designId) ? req.params.designId[0] : req.params.designId);
    const userId = parseInt(req.auth?.userId || "0");

    const design = await db.query.designsTable.findFirst({
      where: (table) => eq(table.id, designId),
    });

    if (!design || design.userId !== userId) {
      return res.status(404).json({ error: "Design not found" });
    }

    await db.delete(designsTable).where(eq(designsTable.id, design.id));

    return res.json({ success: true, message: "Design deleted" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete design" });
  }
});

// Publish design
router.post("/:designId/publish", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const designId = parseInt(Array.isArray(req.params.designId) ? req.params.designId[0] : req.params.designId);
    const userId = parseInt(req.auth?.userId || "0");

    const design = await db.query.designsTable.findFirst({
      where: (table) => eq(table.id, designId),
    });

    if (!design || design.userId !== userId) {
      return res.status(404).json({ error: "Design not found" });
    }

    const result = await db
      .update(designsTable)
      .set({
        status: "published",
        isPublic: true,
      })
      .where(eq(designsTable.id, design.id))
      .returning();

    return res.json(result[0]);
  } catch (error) {
    return res.status(500).json({ error: "Failed to publish design" });
  }
});

// Get public designs
router.get("/public/all", async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 0;
    const limit = parseInt(req.query.limit as string) || 12;
    const category = req.query.category as string;

    const designs = await db.query.designsTable.findMany({
      where: (table) =>
        eq(table.isPublic, true) && eq(table.status, "published"),
    });

    res.json({
      page,
      limit,
      total: designs.length,
      data: designs.slice(page * limit, (page + 1) * limit),
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch designs" });
  }
});

export default router;
