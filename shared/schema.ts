import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const locations = pgTable("locations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  productGroup: text("product_group").notNull(),
});

export const plans = pgTable("plans", {
  id: serial("id").primaryKey(),
  locationId: integer("location_id").notNull(),
  productId: integer("product_id").notNull(),
});

export const scans = pgTable("scans", {
  id: serial("id").primaryKey(),
  locationId: integer("location_id").notNull(),
  productId: integer("product_id").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertLocationSchema = createInsertSchema(locations).omit({ id: true });
export const insertProductSchema = createInsertSchema(products).omit({ id: true });
export const insertPlanSchema = createInsertSchema(plans).omit({ id: true });
export const insertScanSchema = createInsertSchema(scans).omit({ id: true, timestamp: true });

export type Location = typeof locations.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Plan = typeof plans.$inferSelect;
export type Scan = typeof scans.$inferSelect;

export type InsertLocation = z.infer<typeof insertLocationSchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type InsertPlan = z.infer<typeof insertPlanSchema>;
export type InsertScan = z.infer<typeof insertScanSchema>;

export type CreateScanRequest = {
  scans: InsertScan[];
};

export type AnalysisResult = {
  product: Product;
  status: 'correct' | 'wrong_location' | 'missing' | 'extra';
  expectedLocation?: Location;
  actualLocation?: Location;
};
