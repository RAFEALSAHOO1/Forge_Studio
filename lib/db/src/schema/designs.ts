import { pgTable, text, serial, timestamp, json, integer, varchar, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const designsTable = pgTable("designs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => require('./users').usersTable.id),
  name: text("name").notNull(),
  description: text("description"),
  category: varchar("category", { length: 50 }).notNull(),
  templateId: integer("template_id"),
  
  // Design customization data
  colors: json("colors"), // Array of selected colors
  fonts: json("fonts"), // Array of selected fonts
  layout: json("layout"), // Layout configuration
  customizations: json("customizations"), // Additional customizations
  
  // File references
  previewImageUrl: text("preview_image_url"),
  designDataUrl: text("design_data_url"),
  svgData: text("svg_data"),
  
  // Status
  status: varchar("status", { length: 20 }).default("draft"), // draft, published, archived
  isPublic: boolean("is_public").default(false),
  
  // Tracking
  viewCount: integer("view_count").default(0),
  downloadCount: integer("download_count").default(0),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertDesignSchema = createInsertSchema(designsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertDesign = typeof designsTable.$inferInsert;
export type Design = typeof designsTable.$inferSelect;
