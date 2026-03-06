import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { db } from "./db";
import { locations, products } from "@shared/schema";

async function seedDatabase() {
  const existingLocs = await storage.getLocations();
  if (existingLocs.length === 0) {
    await db.insert(locations).values([
      { name: "Entrance Table" },
      { name: "Wall A Upper" },
      { name: "Wall A Middle" },
      { name: "Wall B Feature" },
      { name: "Cashier Side" }
    ]);
  }

  const existingProds = await storage.getProducts();
  if (existingProds.length === 0) {
    await db.insert(products).values([
      { name: "Classic White T-Shirt", productGroup: "T-Shirts" },
      { name: "Graphic Print T-Shirt", productGroup: "T-Shirts" },
      { name: "Blue Jeans Regular", productGroup: "Pants" },
      { name: "Black Denim Jacket", productGroup: "Jackets" },
      { name: "Summer Dress Floral", productGroup: "Dresses" },
      { name: "Sneakers White", productGroup: "Shoes" },
      { name: "Beanie Hat", productGroup: "Accessories" },
    ]);
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Call seed on startup
  seedDatabase().catch(console.error);

  app.get(api.locations.list.path, async (req, res) => {
    const results = await storage.getLocations();
    res.status(200).json(results);
  });

  app.get(api.products.list.path, async (req, res) => {
    const results = await storage.getProducts();
    res.status(200).json(results);
  });

  app.get(api.plans.list.path, async (req, res) => {
    const results = await storage.getPlans();
    res.status(200).json(results);
  });

  app.post(api.plans.create.path, async (req, res) => {
    try {
      const input = api.plans.create.input.parse(req.body);
      const plan = await storage.createPlan(input);
      res.status(201).json(plan);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.delete(api.plans.delete.path, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    await storage.deletePlan(id);
    res.status(204).send();
  });

  app.get(api.scans.list.path, async (req, res) => {
    const results = await storage.getScans();
    res.status(200).json(results);
  });

  app.post(api.scans.submit.path, async (req, res) => {
    try {
      const input = api.scans.submit.input.parse(req.body);
      const result = await storage.submitScans(input.scans);
      res.status(201).json({ message: "Scans submitted", count: result.count });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.post(api.scans.clear.path, async (req, res) => {
    await storage.clearScans();
    res.status(200).json({ message: "Scans cleared" });
  });

  app.get(api.analysis.get.path, async (req, res) => {
    const results = await storage.getAnalysis();
    res.status(200).json(results);
  });

  return httpServer;
}