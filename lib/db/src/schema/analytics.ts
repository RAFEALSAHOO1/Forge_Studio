import { pgTable, text, serial, timestamp, numeric, varchar, integer, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const analyticsTable = pgTable("analytics", {
  id: serial("id").primaryKey(),
  
  // Date grouping
  dateRange: date("date_range").notNull(),
  period: varchar("period", { length: 20 }).notNull(), // daily, weekly, monthly, yearly
  
  // Revenue metrics
  totalRevenue: numeric("total_revenue", { precision: 15, scale: 2 }).default("0"),
  totalOrders: integer("total_orders").default(0),
  averageOrderValue: numeric("average_order_value", { precision: 10, scale: 2 }).default("0"),
  
  // Cost metrics
  totalProcessingFees: numeric("total_processing_fees", { precision: 15, scale: 2 }).default("0"),
  totalRefunds: numeric("total_refunds", { precision: 15, scale: 2 }).default("0"),
  totalCosts: numeric("total_costs", { precision: 15, scale: 2 }).default("0"),
  
  // Profit metrics
  grossProfit: numeric("gross_profit", { precision: 15, scale: 2 }).default("0"),
  netProfit: numeric("net_profit", { precision: 15, scale: 2 }).default("0"),
  profitMargin: numeric("profit_margin", { precision: 5, scale: 2 }).default("0"), // percentage
  
  // Order metrics
  totalCompletedOrders: integer("total_completed_orders").default(0),
  totalFailedOrders: integer("total_failed_orders").default(0),
  totalRefundedOrders: integer("total_refunded_orders").default(0),
  successRate: numeric("success_rate", { precision: 5, scale: 2 }).default("0"), // percentage
  
  // Customer metrics
  newCustomers: integer("new_customers").default(0),
  returningCustomers: integer("returning_customers").default(0),
  repeatPurchaseRate: numeric("repeat_purchase_rate", { precision: 5, scale: 2 }).default("0"), // percentage
  
  // Growth metrics
  dayOverDayGrowth: numeric("day_over_day_growth", { precision: 5, scale: 2 }).default("0"), // percentage
  monthOverMonthGrowth: numeric("month_over_month_growth", { precision: 5, scale: 2 }).default("0"), // percentage
  yearOverYearGrowth: numeric("year_over_year_growth", { precision: 5, scale: 2 }).default("0"), // percentage
  
  // Payment methods breakdown
  paymentMethodMetadata: text("payment_method_metadata"), // JSON: { method: count, method: revenue }
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertAnalyticsSchema = createInsertSchema(analyticsTable).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export type InsertAnalytics = typeof analyticsTable.$inferInsert;
export type Analytics = typeof analyticsTable.$inferSelect;
