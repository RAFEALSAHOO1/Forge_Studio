import { pgTable, text, serial, timestamp, integer, boolean, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Color Palettes
export const colorPalettesTable = pgTable("color_palettes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  colors: text("colors").notNull(), // JSON array of color objects
  colorCount: integer("color_count").notNull(),
  category: varchar("category", { length: 50 }),
  isDefault: boolean("is_default").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertColorPaletteSchema = createInsertSchema(colorPalettesTable).omit({ id: true, createdAt: true });
export type InsertColorPalette = typeof colorPalettesTable.$inferInsert;
export type ColorPalette = typeof colorPalettesTable.$inferSelect;

// Fonts
export const fontsTable = pgTable("fonts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  category: varchar("category", { length: 50 }).notNull(), // serif, sans-serif, display, monospace, etc
  fontFamily: text("font_family").notNull(),
  variants: text("variants"), // JSON array of available weights
  googleFontUrl: text("google_font_url"),
  fontFileUrl: text("font_file_url"),
  isDefault: boolean("is_default").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertFontSchema = createInsertSchema(fontsTable).omit({ id: true, createdAt: true });
export type InsertFont = typeof fontsTable.$inferInsert;
export type Font = typeof fontsTable.$inferSelect;

// User color preferences
export const userColorPreferencesTable = pgTable("user_color_preferences", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => require('./users').usersTable.id),
  paletteId: integer("palette_id").notNull().references(() => colorPalettesTable.id),
  preferredColor: varchar("preferred_color", { length: 7 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserColorPreferenceSchema = createInsertSchema(userColorPreferencesTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertUserColorPreference = typeof userColorPreferencesTable.$inferInsert;
export type UserColorPreference = typeof userColorPreferencesTable.$inferSelect;

// User font preferences
export const userFontPreferencesTable = pgTable("user_font_preferences", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => require('./users').usersTable.id),
  fontId: integer("font_id").notNull().references(() => fontsTable.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserFontPreferenceSchema = createInsertSchema(userFontPreferencesTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertUserFontPreference = typeof userFontPreferencesTable.$inferInsert;
export type UserFontPreference = typeof userFontPreferencesTable.$inferSelect;
