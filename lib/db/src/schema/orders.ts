import { pgTable, text, serial, timestamp, json, integer, numeric, varchar, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const ordersTable = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => require('./users').usersTable.id),
  orderId: text("order_id").unique().notNull(), // Human-readable order ID
  
  // Items
  items: json("items").notNull(), // Array of order items with designs
  
  // Pricing
  subtotal: numeric("subtotal", { precision: 10, scale: 2 }).notNull(),
  taxAmount: numeric("tax_amount", { precision: 10, scale: 2 }).default("0"),
  shippingCost: numeric("shipping_cost", { precision: 10, scale: 2 }).default("0"),
  discountAmount: numeric("discount_amount", { precision: 10, scale: 2 }).default("0"),
  totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
  
  // Payment
  paymentStatus: varchar("payment_status", { length: 20 }).default("pending"), // pending, completed, failed, refunded
  paymentMethod: varchar("payment_method", { length: 20 }).default("stripe"), // stripe, paypal, etc
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  
  // Order status
  orderStatus: varchar("order_status", { length: 20 }).default("pending"), // pending, confirmed, processing, shipped, delivered, cancelled
  
  // Shipping
  shippingAddress: json("shipping_address").notNull(),
  billingAddress: json("billing_address"),
  shippingMethod: varchar("shipping_method", { length: 50 }),
  trackingNumber: text("tracking_number"),
  estimatedDeliveryDate: timestamp("estimated_delivery_date"),
  
  // Additional
  notes: text("notes"),
  cancellationReason: text("cancellation_reason"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  shippedAt: timestamp("shipped_at"),
  deliveredAt: timestamp("delivered_at"),
});

export const insertOrderSchema = createInsertSchema(ordersTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertOrder = typeof ordersTable.$inferInsert;
export type Order = typeof ordersTable.$inferSelect;
