import { pgTable, text, serial, timestamp, varchar, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const otpsTable = pgTable("otps", {
  id: serial("id").primaryKey(),
  email: text("email"),
  phoneNumber: varchar("phone_number", { length: 20 }),
  countryCode: varchar("country_code", { length: 5 }),
  otpCode: varchar("otp_code", { length: 6 }).notNull(),
  isVerified: boolean("is_verified").default(false),
  attempts: integer("attempts").default(0),
  maxAttempts: integer("max_attempts").default(5),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertOtpSchema = createInsertSchema(otpsTable).omit({ id: true, createdAt: true });
export type InsertOtp = typeof otpsTable.$inferInsert;
export type Otp = typeof otpsTable.$inferSelect;
