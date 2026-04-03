import { pgTable, text, serial, timestamp, integer, boolean, varchar, numeric, date, json } from "drizzle-orm/pg-core";

// Users table
export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  clerkId: varchar("clerk_id", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }),
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  profileImage: text("profile_image"),
  phoneNumber: varchar("phone_number", { length: 20 }),
  countryCode: varchar("country_code", { length: 10 }),
  isPhoneVerified: boolean("is_phone_verified").default(false),
  isEmailVerified: boolean("is_email_verified").default(false),
  preferredAuthMethod: varchar("preferred_auth_method", { length: 50 }).default("email"),
  authProvider: varchar("auth_provider", { length: 50 }).default("email"),
  role: varchar("role", { length: 50 }).default("user"), // user, owner, admin
  googleId: varchar("google_id", { length: 255 }),
  googleToken: text("google_token"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  lastLoginAt: timestamp("last_login_at"),
});

// OTPs table
export const otpsTable = pgTable("otps", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }),
  phoneNumber: varchar("phone_number", { length: 20 }),
  countryCode: varchar("country_code", { length: 10 }),
  otpCode: varchar("otp_code", { length: 6 }).notNull(),
  isVerified: boolean("is_verified").default(false),
  attempts: integer("attempts").default(0),
  maxAttempts: integer("max_attempts").default(5),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Designs table
export const designsTable = pgTable("designs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }).notNull(),
  colors: text("colors"), // JSON
  fonts: text("fonts"), // JSON
  layout: text("layout"), // JSON
  customizations: text("customizations"), // JSON
  previewImageUrl: text("preview_image_url"),
  svgData: text("svg_data"),
  status: varchar("status", { length: 50 }).default("draft"),
  isPublic: boolean("is_public").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Orders table
export const ordersTable = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  orderId: varchar("order_id", { length: 255 }).notNull().unique(),
  items: text("items").notNull(), // JSON
  subtotal: numeric("subtotal", { precision: 15, scale: 2 }).notNull(),
  taxAmount: numeric("tax_amount", { precision: 15, scale: 2 }).default("0"),
  shippingCost: numeric("shipping_cost", { precision: 15, scale: 2 }).default("0"),
  shippingMethod: varchar("shipping_method", { length: 50 }).default("standard"),
  totalAmount: numeric("total_amount", { precision: 15, scale: 2 }).notNull(),
  orderStatus: varchar("order_status", { length: 50 }).default("pending"),
  paymentStatus: varchar("payment_status", { length: 50 }).default("pending"),
  shippingAddress: text("shipping_address"), // JSON
  billingAddress: text("billing_address"), // JSON
  trackingNumber: varchar("tracking_number", { length: 255 }),
  estimatedDeliveryDate: timestamp("estimated_delivery_date"),
  cancellationReason: text("cancellation_reason"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  shippedAt: timestamp("shipped_at"),
  deliveredAt: timestamp("delivered_at"),
});

// Transactions table
export const transactionsTable = pgTable("transactions", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  userId: integer("user_id").notNull(),
  transactionId: varchar("transaction_id", { length: 255 }).notNull().unique(),
  stripePaymentIntentId: varchar("stripe_payment_intent_id", { length: 255 }),
  amount: numeric("amount", { precision: 15, scale: 2 }).notNull(),
  processingFee: numeric("processing_fee", { precision: 15, scale: 2 }).default("0"),
  netAmount: numeric("net_amount", { precision: 15, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 10 }).default("USD"),
  status: varchar("status", { length: 50 }).notNull(),
  paymentMethod: varchar("payment_method", { length: 50 }).notNull(),
  refundAmount: numeric("refund_amount", { precision: 15, scale: 2 }).default("0"),
  isRefunded: boolean("is_refunded").default(false),
  refundReason: text("refund_reason"),
  metadata: text("metadata"), // JSON
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Analytics table
export const analyticsTable = pgTable("analytics", {
  id: serial("id").primaryKey(),
  dateRange: date("date_range").notNull(),
  period: varchar("period", { length: 20 }).notNull(),
  totalRevenue: numeric("total_revenue", { precision: 15, scale: 2 }).default("0"),
  totalOrders: integer("total_orders").default(0),
  averageOrderValue: numeric("average_order_value", { precision: 10, scale: 2 }).default("0"),
  totalProcessingFees: numeric("total_processing_fees", { precision: 15, scale: 2 }).default("0"),
  totalRefunds: numeric("total_refunds", { precision: 15, scale: 2 }).default("0"),
  totalCosts: numeric("total_costs", { precision: 15, scale: 2 }).default("0"),
  grossProfit: numeric("gross_profit", { precision: 15, scale: 2 }).default("0"),
  netProfit: numeric("net_profit", { precision: 15, scale: 2 }).default("0"),
  profitMargin: numeric("profit_margin", { precision: 5, scale: 2 }).default("0"),
  totalCompletedOrders: integer("total_completed_orders").default(0),
  totalFailedOrders: integer("total_failed_orders").default(0),
  totalRefundedOrders: integer("total_refunded_orders").default(0),
  successRate: numeric("success_rate", { precision: 5, scale: 2 }).default("0"),
  newCustomers: integer("new_customers").default(0),
  returningCustomers: integer("returning_customers").default(0),
  repeatPurchaseRate: numeric("repeat_purchase_rate", { precision: 5, scale: 2 }).default("0"),
  dayOverDayGrowth: numeric("day_over_day_growth", { precision: 5, scale: 2 }).default("0"),
  monthOverMonthGrowth: numeric("month_over_month_growth", { precision: 5, scale: 2 }).default("0"),
  yearOverYearGrowth: numeric("year_over_year_growth", { precision: 5, scale: 2 }).default("0"),
  paymentMethodMetadata: text("payment_method_metadata"), // JSON
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Color Palettes table
export const colorPalettesTable = pgTable("color_palettes", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  colors: text("colors").notNull(), // JSON array
  colorCount: integer("color_count").notNull(),
  category: varchar("category", { length: 100 }),
  isDefault: boolean("is_default").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Fonts table
export const fontsTable = pgTable("fonts", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  category: varchar("category", { length: 100 }).notNull(),
  fontFamily: text("font_family").notNull(),
  variants: text("variants"), // JSON
  googleFontUrl: text("google_font_url"),
  fontFileUrl: text("font_file_url"),
  isDefault: boolean("is_default").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});
