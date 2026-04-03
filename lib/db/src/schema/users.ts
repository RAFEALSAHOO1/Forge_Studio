import { pgTable, text, serial, timestamp, boolean, varchar, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  clerkId: text("clerk_id").unique(),
  email: text("email").unique().notNull(),
  password: text("password"), // for email/password auth
  phoneNumber: varchar("phone_number", { length: 20 }).unique(),
  countryCode: varchar("country_code", { length: 5 }),
  firstName: text("first_name"),
  lastName: text("last_name"),
  profileImage: text("profile_image"),
  googleId: text("google_id").unique(), // for Google OAuth
  authProvider: varchar("auth_provider", { length: 20 }).default("email"), // email, google, phone
  isPhoneVerified: boolean("is_phone_verified").default(false),
  isEmailVerified: boolean("is_email_verified").default(false),
  preferredAuthMethod: varchar("preferred_auth_method", { length: 10 }).default("email"), // email, phone, google
  role: varchar("role", { length: 20 }).default("client"), // client, owner
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(usersTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertUser = typeof usersTable.$inferInsert;
export type User = typeof usersTable.$inferSelect;
