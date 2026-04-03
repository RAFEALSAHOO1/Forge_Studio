import { Router, type Request, type Response } from "express";
import { db } from "../db/connection";
import { ordersTable, usersTable } from "../db/schema";
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

// Create order
router.post("/", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { items, shippingAddress, billingAddress, shippingMethod } = req.body;
    const userId = parseInt(req.auth?.userId || "0");

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Items array is required" });
    }

    if (!shippingAddress) {
      return res.status(400).json({ error: "Shipping address is required" });
    }

    // Calculate totals
    const subtotal = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
    const taxAmount = subtotal * 0.1; // 10% tax
    const shippingCost = shippingMethod === "express" ? 25 : 10;
    const totalAmount = subtotal + taxAmount + shippingCost;

    // Generate order ID
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create order
    const result = await db
      .insert(ordersTable)
      .values({
        userId,
        orderId,
        items: JSON.stringify(items),
        shippingAddress: JSON.stringify(shippingAddress),
        billingAddress: JSON.stringify(billingAddress || shippingAddress),
        subtotal: subtotal.toString(),
        taxAmount: taxAmount.toString(),
        shippingCost: shippingCost.toString(),
        totalAmount: totalAmount.toString(),
        shippingMethod,
      })
      .returning();

    return res.status(201).json({
      success: true,
      order: result[0],
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({ error: "Failed to create order" });
  }
});

// Get user orders
router.get("/", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const userId = parseInt(req.auth?.userId || "0");
    const page = parseInt((req.query.page as string) || "0");
    const limit = parseInt((req.query.limit as string) || "10");

    const orders = await db.query.ordersTable.findMany({
      where: eq(ordersTable.userId, userId),
      limit: limit + 1,
      offset: page * limit,
    });

    res.json({
      page,
      limit,
      total: orders.length,
      data: orders.slice(0, limit),
      hasMore: orders.length > limit,
    });
    return;
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// Get order details
router.get("/:orderId", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const orderId = typeof req.params.orderId === 'string' ? req.params.orderId : req.params.orderId[0];
    const userId = parseInt(req.auth?.userId || "0");

    const order = await db.query.ordersTable.findFirst({
      where: (table) => eq(table.orderId, orderId),
    });

    if (!order || order.userId !== userId) {
      return res.status(404).json({ error: "Order not found" });
    }

    return res.json(order);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch order" });
  }
});

// Update order status
router.patch("/:orderId/status", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const orderId = typeof req.params.orderId === 'string' ? req.params.orderId : req.params.orderId[0];
    const { status } = req.body;
    const userId = parseInt(req.auth?.userId || "0");

    const order = await db.query.ordersTable.findFirst({
      where: (table) => eq(table.orderId, orderId),
    });

    if (!order || order.userId !== userId) {
      return res.status(404).json({ error: "Order not found" });
    }

    const validStatuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const updateData: any = { orderStatus: status };
    if (status === "shipped") updateData.shippedAt = new Date();
    if (status === "delivered") updateData.deliveredAt = new Date();

    const result = await db.update(ordersTable).set(updateData).where(eq(ordersTable.id, order.id)).returning();

    return res.json(result[0]);
  } catch (error) {
    return res.status(500).json({ error: "Failed to update order" });
  }
});

// Cancel order
router.post("/:orderId/cancel", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const orderId = typeof req.params.orderId === 'string' ? req.params.orderId : req.params.orderId[0];
    const { reason } = req.body;
    const userId = parseInt(req.auth?.userId || "0");

    const order = await db.query.ordersTable.findFirst({
      where: (table) => eq(table.orderId, orderId),
    });

    if (!order || order.userId !== userId) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (order.orderStatus === "shipped" || order.orderStatus === "delivered") {
      return res.status(400).json({ error: "Cannot cancel shipped/delivered orders" });
    }

    const result = await db
      .update(ordersTable)
      .set({
        orderStatus: "cancelled",
        cancellationReason: reason,
      })
      .where(eq(ordersTable.id, order.id))
      .returning();

    return res.json(result[0]);
  } catch (error) {
    return res.status(500).json({ error: "Failed to cancel order" });
  }
});

// Get order tracking
router.get("/:orderId/tracking", async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;

    const order = await db.query.ordersTable.findFirst({
      where: (table) => eq(table.orderId, orderId as string),
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    return res.json({
      orderId: order.orderId,
      status: order.orderStatus,
      trackingNumber: order.trackingNumber,
      estimatedDeliveryDate: order.estimatedDeliveryDate,
      shippedAt: order.shippedAt,
      deliveredAt: order.deliveredAt,
      timeline: [
        { status: "pending", completed: true, date: order.createdAt },
        { status: "confirmed", completed: order.orderStatus !== "pending", date: null as any },
        { status: "processing", completed: ["processing", "shipped", "delivered"].includes(order.orderStatus || ""), date: null as any },
        { status: "shipped", completed: ["shipped", "delivered"].includes(order.orderStatus || ""), date: order.shippedAt },
        { status: "delivered", completed: order.orderStatus === "delivered", date: order.deliveredAt },
      ],
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch tracking" });
  }
});

export default router;
