import { Router, type Request, type Response } from "express";
import { db } from "../db/connection";
import { ordersTable, transactionsTable, analyticsTable } from "../db/schema";
import { eq, gte, lte, and, desc, sql } from "drizzle-orm";
import { requireOwnerAuth, type AuthRequest } from "../lib/requireOwnerAuth";
import { updateAnalyticsData } from "../lib/analytics";

const router = Router();

// Middleware
router.use(requireOwnerAuth);

// ============= Update Analytics =============
router.post("/analytics/update", async (req: AuthRequest, res: Response) => {
  try {
    await updateAnalyticsData();
    res.json({ success: true, message: "Analytics data updated" });
  } catch (error) {
    console.error("Analytics update error:", error);
    res.status(500).json({ error: "Failed to update analytics", details: error });
  }
});

// ============= Payment Details =============
router.get("/payments/summary", async (req: AuthRequest, res: Response) => {
  try {
    const { startDate, endDate } = req.query;

    let whereClause = undefined;

    if (startDate && endDate) {
      whereClause = and(
        gte(transactionsTable.createdAt, new Date(startDate as string)),
        lte(transactionsTable.createdAt, new Date(endDate as string))
      );
    }

    const transactions = await db.query.transactionsTable.findMany({
      where: whereClause,
      orderBy: [desc(transactionsTable.createdAt)],
      limit: 100,
    });

    const summary = {
      totalTransactions: transactions.length,
      totalRevenue: transactions.reduce((sum, t) => {
        return sum + parseFloat(t.amount as string);
      }, 0),
      totalProcessingFees: transactions.reduce((sum, t) => {
        return sum + parseFloat(t.processingFee as string);
      }, 0),
      totalRefunds: transactions.reduce((sum, t) => {
        return sum + parseFloat(t.refundAmount as string);
      }, 0),
      netRevenue: transactions.reduce((sum, t) => {
        return sum + parseFloat(t.netAmount as string);
      }, 0),
      completedCount: transactions.filter((t) => t.status === "completed").length,
      failedCount: transactions.filter((t) => t.status === "failed").length,
      refundedCount: transactions.filter((t) => t.isRefunded).length,
    };

    res.json(summary);
  } catch (error) {
    console.error("Payment summary error:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch payment summary", details: error });
  }
});

// Get detailed payment list
router.get("/payments/list", async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 20, status, startDate, endDate } = req.query;

    let whereConditions = [];

    if (status) {
      whereConditions.push(eq(transactionsTable.status, status as string));
    }

    if (startDate) {
      whereConditions.push(
        gte(transactionsTable.createdAt, new Date(startDate as string))
      );
    }

    if (endDate) {
      whereConditions.push(
        lte(transactionsTable.createdAt, new Date(endDate as string))
      );
    }

    const whereClause =
      whereConditions.length > 0 ? and(...whereConditions) : undefined;

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const transactions = await db.query.transactionsTable.findMany({
      where: whereClause,
      orderBy: [desc(transactionsTable.createdAt)],
      limit: parseInt(limit as string),
      offset: skip,
    });

    const total = await db
      .select({ count: sql`count(*)` })
      .from(transactionsTable)
      .where(whereClause);

    const countValue = typeof total[0].count === 'number' ? total[0].count : parseInt(String(total[0].count));
    res.json({
      transactions,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total: countValue,
        pages: Math.ceil(countValue / parseInt(limit as string)),
      },
    });
  } catch (error) {
    console.error("Payment list error:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch payments", details: error });
  }
});

// ============= Order Summary =============
router.get("/orders/summary", async (req: AuthRequest, res: Response) => {
  try {
    const { startDate, endDate } = req.query;

    let whereClause = undefined;

    if (startDate && endDate) {
      whereClause = and(
        gte(ordersTable.createdAt, new Date(startDate as string)),
        lte(ordersTable.createdAt, new Date(endDate as string))
      );
    }

    const orders = await db.query.ordersTable.findMany({
      where: whereClause,
      orderBy: [desc(ordersTable.createdAt)],
    });

    const summary = {
      totalOrders: orders.length,
      totalRevenue: orders
        .reduce((sum, o) => sum + parseFloat(o.totalAmount as string), 0)
        .toFixed(2),
      averageOrderValue: (
        orders.reduce((sum, o) => sum + parseFloat(o.totalAmount as string), 0) /
        (orders.length || 1)
      ).toFixed(2),
      ordersByStatus: {
        pending: orders.filter((o) => o.orderStatus === "pending").length,
        confirmed: orders.filter((o) => o.orderStatus === "confirmed").length,
        processing: orders.filter((o) => o.orderStatus === "processing").length,
        shipped: orders.filter((o) => o.orderStatus === "shipped").length,
        delivered: orders.filter((o) => o.orderStatus === "delivered").length,
        cancelled: orders.filter((o) => o.orderStatus === "cancelled").length,
      },
      paymentStatus: {
        pending: orders.filter((o) => o.paymentStatus === "pending").length,
        completed: orders.filter((o) => o.paymentStatus === "completed").length,
        failed: orders.filter((o) => o.paymentStatus === "failed").length,
        refunded: orders.filter((o) => o.paymentStatus === "refunded").length,
      },
    };

    res.json(summary);
  } catch (error) {
    console.error("Order summary error:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch order summary", details: error });
  }
});

// Get detailed orders list
router.get("/orders/list", async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 20, status, paymentStatus, startDate, endDate } =
      req.query;

    let whereConditions = [];

    if (status) {
      whereConditions.push(eq(ordersTable.orderStatus, status as string));
    }

    if (paymentStatus) {
      whereConditions.push(
        eq(ordersTable.paymentStatus, paymentStatus as string)
      );
    }

    if (startDate) {
      whereConditions.push(
        gte(ordersTable.createdAt, new Date(startDate as string))
      );
    }

    if (endDate) {
      whereConditions.push(
        lte(ordersTable.createdAt, new Date(endDate as string))
      );
    }

    const whereClause =
      whereConditions.length > 0 ? and(...whereConditions) : undefined;

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const orders = await db.query.ordersTable.findMany({
      where: whereClause,
      orderBy: [desc(ordersTable.createdAt)],
      limit: parseInt(limit as string),
      offset: skip,
    });

    const total = await db
      .select({ count: sql`count(*)` })
      .from(ordersTable)
      .where(whereClause);

    const countValue = typeof total[0].count === 'number' ? total[0].count : parseInt(String(total[0].count));
    res.json({
      orders,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total: countValue,
        pages: Math.ceil(countValue / parseInt(limit as string)),
      },
    });
  } catch (error) {
    console.error("Orders list error:", error);
    res.status(500).json({ error: "Failed to fetch orders", details: error });
  }
});

// ============= Analytics & Growth =============
router.get("/analytics/dashboard", async (req: AuthRequest, res: Response) => {
  try {
    const { period = "monthly" } = req.query;

    const analytics = await db.query.analyticsTable.findMany({
      where: eq(analyticsTable.period, period as string),
      orderBy: [desc(analyticsTable.dateRange)],
      limit: 24, // Last 24 periods
    });

    res.json(analytics);
  } catch (error) {
    console.error("Analytics error:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch analytics", details: error });
  }
});

// Get growth analysis
router.get("/analytics/growth", async (req: AuthRequest, res: Response) => {
  try {
    const analytics = await db.query.analyticsTable.findMany({
      where: eq(analyticsTable.period, "monthly"),
      orderBy: [desc(analyticsTable.dateRange)],
      limit: 12, // Last 12 months
    });

    const growthData = {
      revenueGrowth: analytics.map((a) => ({
        date: a.dateRange,
        revenue: a.totalRevenue,
        growth: a.monthOverMonthGrowth,
      })),
      orderGrowth: analytics.map((a) => ({
        date: a.dateRange,
        orders: a.totalOrders,
        growth: a.monthOverMonthGrowth,
      })),
      customerGrowth: analytics.map((a) => ({
        date: a.dateRange,
        newCustomers: a.newCustomers,
        returning: a.returningCustomers,
      })),
    };

    res.json(growthData);
  } catch (error) {
    console.error("Growth analysis error:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch growth analysis", details: error });
  }
});

// ============= Profit & Loss Analysis =============
router.get("/analytics/profitloss", async (req: AuthRequest, res: Response) => {
  try {
    const { period = "monthly" } = req.query;

    const analytics = await db.query.analyticsTable.findMany({
      where: eq(analyticsTable.period, period as string),
      orderBy: [desc(analyticsTable.dateRange)],
      limit: 12,
    });

    const profitLossData = {
      profitTrend: analytics.map((a) => ({
        date: a.dateRange,
        revenue: a.totalRevenue,
        costs: a.totalCosts,
        grossProfit: a.grossProfit,
        netProfit: a.netProfit,
        margin: a.profitMargin,
      })),
      costBreakdown: {
        processingFees: analytics.reduce(
          (sum, a) => sum + parseFloat(a.totalProcessingFees as string),
          0
        ),
        refunds: analytics.reduce(
          (sum, a) => sum + parseFloat(a.totalRefunds as string),
          0
        ),
      },
      summary: {
        totalRevenue: analytics.reduce(
          (sum, a) => sum + parseFloat(a.totalRevenue as string),
          0
        ),
        totalCosts: analytics.reduce(
          (sum, a) => sum + parseFloat(a.totalCosts as string),
          0
        ),
        totalProfit: analytics.reduce(
          (sum, a) => sum + parseFloat(a.netProfit as string),
          0
        ),
        averageMargin:
          analytics.reduce((sum, a) => sum + parseFloat(a.profitMargin as string), 0) /
          (analytics.length || 1),
      },
    };

    res.json(profitLossData);
  } catch (error) {
    console.error("Profit/Loss analysis error:", error);
    res.status(500).json({
      error: "Failed to fetch profit/loss analysis",
      details: error,
    });
  }
});

// ============= Analysis Table =============
router.get("/analytics/table", async (req: AuthRequest, res: Response) => {
  try {
    const { period = "monthly", limit = 100 } = req.query;

    const analyticsData = await db.query.analyticsTable.findMany({
      where: eq(analyticsTable.period, period as string),
      orderBy: [desc(analyticsTable.dateRange)],
      limit: parseInt(limit as string),
    });

    // Format for table display
    const tableData = analyticsData.map((a) => ({
      date: a.dateRange,
      revenue: parseFloat(a.totalRevenue as string),
      orders: a.totalOrders,
      avgOrder: parseFloat(a.averageOrderValue as string),
      costs: parseFloat(a.totalCosts as string),
      fees: parseFloat(a.totalProcessingFees as string),
      refunds: parseFloat(a.totalRefunds as string),
      grossProfit: parseFloat(a.grossProfit as string),
      netProfit: parseFloat(a.netProfit as string),
      margin: parseFloat(a.profitMargin as string),
      successRate: parseFloat(a.successRate as string),
      newCustomers: a.newCustomers,
      repeatRate: parseFloat(a.repeatPurchaseRate as string),
      growth: parseFloat(a.monthOverMonthGrowth as string),
    }));

    res.json(tableData);
  } catch (error) {
    console.error("Analytics table error:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch analytics table", details: error });
  }
});

export default router;
