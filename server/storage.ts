import { db } from "./db";
import { locations, products, plans, scans, type Location, type Product, type Plan, type Scan, type InsertPlan, type InsertScan, type AnalysisResult } from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getLocations(): Promise<Location[]>;
  getProducts(): Promise<Product[]>;
  getPlans(): Promise<Plan[]>;
  getScans(): Promise<Scan[]>;
  
  createPlan(plan: InsertPlan): Promise<Plan>;
  deletePlan(id: number): Promise<void>;
  
  submitScans(newScans: InsertScan[]): Promise<{ count: number }>;
  clearScans(): Promise<void>;
  
  getAnalysis(): Promise<AnalysisResult[]>;
}

export class DatabaseStorage implements IStorage {
  async getLocations(): Promise<Location[]> {
    return await db.select().from(locations);
  }

  async getProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getPlans(): Promise<Plan[]> {
    return await db.select().from(plans);
  }

  async getScans(): Promise<Scan[]> {
    return await db.select().from(scans);
  }

  async createPlan(plan: InsertPlan): Promise<Plan> {
    const [created] = await db.insert(plans).values(plan).returning();
    return created;
  }

  async deletePlan(id: number): Promise<void> {
    await db.delete(plans).where(eq(plans.id, id));
  }

  async submitScans(newScans: InsertScan[]): Promise<{ count: number }> {
    if (newScans.length === 0) return { count: 0 };
    const inserted = await db.insert(scans).values(newScans).returning();
    return { count: inserted.length };
  }

  async clearScans(): Promise<void> {
    await db.delete(scans);
  }

  async getAnalysis(): Promise<AnalysisResult[]> {
    const allProducts = await this.getProducts();
    const allLocations = await this.getLocations();
    const allPlans = await this.getPlans();
    const allScans = await this.getScans();

    // Group by latest scan per product
    const latestScans = new Map<number, Scan>();
    for (const scan of allScans) {
      const existing = latestScans.get(scan.productId);
      if (!existing || new Date(scan.timestamp!) > new Date(existing.timestamp!)) {
        latestScans.set(scan.productId, scan);
      }
    }

    const planMap = new Map<number, Plan>();
    for (const plan of allPlans) {
      planMap.set(plan.productId, plan);
    }

    const locMap = new Map<number, Location>();
    for (const loc of allLocations) {
      locMap.set(loc.id, loc);
    }

    const results: AnalysisResult[] = [];

    for (const product of allProducts) {
      const planned = planMap.get(product.id);
      const scanned = latestScans.get(product.id);

      if (planned && scanned) {
        if (planned.locationId === scanned.locationId) {
          results.push({
            product,
            status: 'correct',
            expectedLocation: locMap.get(planned.locationId),
            actualLocation: locMap.get(scanned.locationId),
          });
        } else {
          results.push({
            product,
            status: 'wrong_location',
            expectedLocation: locMap.get(planned.locationId),
            actualLocation: locMap.get(scanned.locationId),
          });
        }
      } else if (planned && !scanned) {
        results.push({
          product,
          status: 'missing',
          expectedLocation: locMap.get(planned.locationId),
        });
      } else if (!planned && scanned) {
        results.push({
          product,
          status: 'extra',
          actualLocation: locMap.get(scanned.locationId),
        });
      }
    }

    return results;
  }
}

export const storage = new DatabaseStorage();
