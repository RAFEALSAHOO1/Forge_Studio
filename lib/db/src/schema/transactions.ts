import { pgTable, text, serial, timestamp, numeric, varchar, integer, json, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const transactionsTable = pgTable("transactions", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull().references(() => require('./orders').ordersTable.id),
  userId: integer("user_id").notNull().references(() => require('./users').usersTable.id),
  
  // Transaction details
  transactionId: text("transaction_id").unique().notNull(),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  
  // Amount breakdown
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("usd"),
  processingFee: numeric("processing_fee", { precision: 10, scale: 2 }).default("0"),
  netAmount: numeric("net_amount", { precision: 10, scale: 2 }).notNull(), // amount - processingFee
  
  // Status
  status: varchar("status", { length: 20 }).default("pending"), // pending, completed, failed, refunded, disputed
  paymentMethod: varchar("payment_method", { length: 50 }),
  
  // Refund info
  isRefunded: boolean("is_refunded").default(false),
  refundAmount: numeric("refund_amount", { precision: 10, scale: 2 }).default("0"),
  refundReason: text("refund_reason"),
  refundedAt: timestamp("refunded_at"),
  
  // Additional metadata
  metadata: json("metadata"), // Store additional transaction info
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertTransactionSchema = createInsertSchema(transactionsTable).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export type InsertTransaction = typeof transactionsTable.$inferInsert;
export type Transaction = typeof transactionsTable.$inferSelect;
