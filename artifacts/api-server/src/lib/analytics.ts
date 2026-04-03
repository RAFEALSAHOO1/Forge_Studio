import { db } from "../db/connection";
import { transactionsTable, ordersTable, analyticsTable } from "../db/schema";
import { eq, gte, lte, and, sql } from "drizzle-orm";

interface DailyMetrics {
  date: Date;
  transactions: any[];
  orders: any[];
}

// Helper function to convert Date to date string (YYYY-MM-DD format)
function formatDateToString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export async function calculateDailyAnalytics(date: Date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  // Get transactions for the day
  const transactions = await db.query.transactionsTable.findMany({
    where: and(
      gte(transactionsTable.createdAt, startOfDay),
      lte(transactionsTable.createdAt, endOfDay)
    ),
  });

  // Get orders for the day
  const orders = await db.query.ordersTable.findMany({
    where: and(
      gte(ordersTable.createdAt, startOfDay),
      lte(ordersTable.createdAt, endOfDay)
    ),
  });

  // Calculate metrics
  const totalRevenue = transactions.reduce((sum, t) => {
    return sum + parseFloat(t.amount as string);
  }, 0);

  const totalProcessingFees = transactions.reduce((sum, t) => {
    return sum + parseFloat(t.processingFee as string);
  }, 0);

  const totalRefunds = transactions.reduce((sum, t) => {
    return sum + parseFloat(t.refundAmount as string);
  }, 0);

  const netAmount = transactions.reduce((sum, t) => {
    return sum + parseFloat(t.netAmount as string);
  }, 0);

  const completedCount = transactions.filter((t) => t.status === "completed").length;
  const failedCount = transactions.filter((t) => t.status === "failed").length;
  const successRate =
    completedCount + failedCount > 0
      ? (completedCount / (completedCount + failedCount)) * 100
      : 0;

  const totalCosts = totalProcessingFees + totalRefunds;
  const grossProfit = totalRevenue - totalProcessingFees;
  const netProfit = netAmount - totalRefunds;
  const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

  // Count new vs returning customers (simplified)
  const newCustomers = orders.length; // Simplified: assume all new
  const returningCustomers = 0;
  const repeatRate =
    newCustomers + returningCustomers > 0
      ? (returningCustomers / (newCustomers + returningCustomers)) * 100
      : 0;

  // Growth metrics (will be 0 for single day, calculated properly in monthly)
  const growth = 0;

  // Format date to string for database storage
  const dateString = formatDateToString(date);

  return {
    dateRange: dateString,
    period: "daily",
    totalRevenue: totalRevenue.toString(),
    totalOrders: orders.length,
    averageOrderValue:
      orders.length > 0
        ? (totalRevenue / orders.length).toString()
        : "0",
    totalProcessingFees: totalProcessingFees.toString(),
    totalRefunds: totalRefunds.toString(),
    totalCosts: totalCosts.toString(),
    grossProfit: grossProfit.toString(),
    netProfit: netProfit.toString(),
    profitMargin: profitMargin.toString(),
    totalCompletedOrders: completedCount,
    totalFailedOrders: failedCount,
    totalRefundedOrders: transactions.filter((t) => t.isRefunded).length,
    successRate: successRate.toString(),
    newCustomers,
    returningCustomers,
    repeatPurchaseRate: repeatRate.toString(),
    dayOverDayGrowth: "0",
    monthOverMonthGrowth: "0",
    yearOverYearGrowth: "0",
    paymentMethodMetadata: JSON.stringify({
      stripe: completedCount,
    }),
  };
}

export async function calculateMonthlyAnalytics(year: number, month: number) {
  const startOfMonth = new Date(year, month - 1, 1);
  const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

  // Get transactions for the month
  const transactions = await db.query.transactionsTable.findMany({
    where: and(
      gte(transactionsTable.createdAt, startOfMonth),
      lte(transactionsTable.createdAt, endOfMonth)
    ),
  });

  // Get orders for the month
  const orders = await db.query.ordersTable.findMany({
    where: and(
      gte(ordersTable.createdAt, startOfMonth),
      lte(ordersTable.createdAt, endOfMonth)
    ),
  });

  // Calculate previous month for growth metrics
  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;
  const startOfPrevMonth = new Date(prevYear, prevMonth - 1, 1);
  const endOfPrevMonth = new Date(prevYear, prevMonth, 0, 23, 59, 59, 999);

  const prevTransactions = await db.query.transactionsTable.findMany({
    where: and(
      gte(transactionsTable.createdAt, startOfPrevMonth),
      lte(transactionsTable.createdAt, endOfPrevMonth)
    ),
  });

  const prevRevenue = prevTransactions.reduce((sum, t) => {
    return sum + parseFloat(t.amount as string);
  }, 0);

  // Calculate metrics
  const totalRevenue = transactions.reduce((sum, t) => {
    return sum + parseFloat(t.amount as string);
  }, 0);

  const totalProcessingFees = transactions.reduce((sum, t) => {
    return sum + parseFloat(t.processingFee as string);
  }, 0);

  const totalRefunds = transactions.reduce((sum, t) => {
    return sum + parseFloat(t.refundAmount as string);
  }, 0);

  const netAmount = transactions.reduce((sum, t) => {
    return sum + parseFloat(t.netAmount as string);
  }, 0);

  const completedCount = transactions.filter((t) => t.status === "completed").length;
  const failedCount = transactions.filter((t) => t.status === "failed").length;
  const successRate =
    completedCount + failedCount > 0
      ? (completedCount / (completedCount + failedCount)) * 100
      : 0;

  const totalCosts = totalProcessingFees + totalRefunds;
  const grossProfit = totalRevenue - totalProcessingFees;
  const netProfit = netAmount - totalRefunds;
  const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

  // Customer metrics
  const newCustomers = orders.length;
  const returningCustomers = 0;
  const repeatRate =
    newCustomers + returningCustomers > 0
      ? (returningCustomers / (newCustomers + returningCustomers)) * 100
      : 0;

  // Growth metrics
  const monthOverMonthGrowth =
    prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : 0;

  const dateRange = new Date(year, month - 1, 1);
  const dateString = formatDateToString(dateRange);

  return {
    dateRange: dateString,
    period: "monthly",
    totalRevenue: totalRevenue.toString(),
    totalOrders: orders.length,
    averageOrderValue:
      orders.length > 0
        ? (totalRevenue / orders.length).toString()
        : "0",
    totalProcessingFees: totalProcessingFees.toString(),
    totalRefunds: totalRefunds.toString(),
    totalCosts: totalCosts.toString(),
    grossProfit: grossProfit.toString(),
    netProfit: netProfit.toString(),
    profitMargin: profitMargin.toString(),
    totalCompletedOrders: completedCount,
    totalFailedOrders: failedCount,
    totalRefundedOrders: transactions.filter((t) => t.isRefunded).length,
    successRate: successRate.toString(),
    newCustomers,
    returningCustomers,
    repeatPurchaseRate: repeatRate.toString(),
    dayOverDayGrowth: "0",
    monthOverMonthGrowth: monthOverMonthGrowth.toString(),
    yearOverYearGrowth: "0",
    paymentMethodMetadata: JSON.stringify({
      stripe: completedCount,
    }),
  };
}

// Utility to update analytics data
export async function updateAnalyticsData() {
  const today = new Date();
  const todayString = formatDateToString(today);

  // Update today's analytics
  const dailyData = await calculateDailyAnalytics(today);

  // Check if analytics for today already exists
  const existing = await db.query.analyticsTable.findFirst({
    where: and(
      eq(analyticsTable.dateRange, todayString),
      eq(analyticsTable.period, "daily")
    ),
  });

  if (existing) {
    // Update existing
    await db
      .update(analyticsTable)
      .set(dailyData)
      .where(eq(analyticsTable.id, existing.id));
  } else {
    // Insert new
    await db.insert(analyticsTable).values(dailyData);
  }

  // Update current month's analytics
  const monthData = await calculateMonthlyAnalytics(today.getFullYear(), today.getMonth() + 1);
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const monthStartString = formatDateToString(monthStart);

  const existingMonth = await db.query.analyticsTable.findFirst({
    where: and(
      eq(analyticsTable.dateRange, monthStartString),
      eq(analyticsTable.period, "monthly")
    ),
  });

  if (existingMonth) {
    await db
      .update(analyticsTable)
      .set(monthData)
      .where(eq(analyticsTable.id, existingMonth.id));
  } else {
    await db.insert(analyticsTable).values(monthData);
  }

  console.log("Analytics data updated successfully");
}
