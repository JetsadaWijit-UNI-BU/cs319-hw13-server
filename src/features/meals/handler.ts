import { type Request, type Response } from "express";
import { z } from "zod";
import { mealService } from "./service.js";
import { toMealResponse } from "./transform.js";
import { mealSchema } from "./schemas.js";

// Meal HTTP handlers: request → service → response. One responsibility per handler.
export const mealHandlers = {
  getMeals: async (req: Request, res: Response, port: number) => {
    const { q } = req.query as { q?: string };
    const meals = await mealService.getMeals(q);
    res.json({
      success: true,
      count: meals.length,
      data: { meals: meals.map((m) => toMealResponse(port, m as any)) },
    });
  },

  getMealById: async (req: Request, res: Response, port: number) => {
    const id = String(req.params.id);
    const meal = await mealService.getMealById(id);
    if (!meal) {
      res.status(404).json({ success: false, message: "ไม่พบเมนูอาหารนี้" });
      return;
    }
    res.json({ success: true, data: { meals: [toMealResponse(port, meal as any)] } });
  },

  createMeal: async (req: Request, res: Response, port: number) => {
    const parsed = mealSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, message: parsed.error.issues[0]?.message ?? "ข้อมูลไม่ถูกต้อง" });
      return;
    }
    const data = {
      title: parsed.data.title,
      category: parsed.data.category ?? null,
      area: parsed.data.area ?? null,
      instructions: parsed.data.instructions,
      thumbnail: parsed.data.thumbnail ?? "",
      youtube: parsed.data.youtube ?? null,
      ingredients: parsed.data.ingredients.map((i) => ({
        name: i.name,
        measure: i.measure ?? null,
      })),
    };
    const meal = await mealService.createMeal(data);
    res.status(201).json({
      success: true,
      message: "สร้างเมนูอาหารสำเร็จ",
      data: toMealResponse(port, meal as any),
    });
  },

  updateMeal: async (req: Request, res: Response, port: number) => {
    const parsed = mealSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, message: parsed.error.issues[0]?.message ?? "ข้อมูลไม่ถูกต้อง" });
      return;
    }
    const id = String(req.params.id);
    const data = {
      title: parsed.data.title,
      category: parsed.data.category ?? null,
      area: parsed.data.area ?? null,
      instructions: parsed.data.instructions,
      thumbnail: parsed.data.thumbnail ?? "",
      youtube: parsed.data.youtube ?? null,
      ingredients: parsed.data.ingredients.map((i) => ({
        name: i.name,
        measure: i.measure ?? null,
      })),
    };
    const meal = await mealService.updateMeal(id, data);
    if (!meal) {
      res.status(404).json({ success: false, message: "ไม่พบเมนูอาหารนี้" });
      return;
    }
    res.json({
      success: true,
      message: "อัปเดตเมนูอาหารเรียบร้อย",
      data: toMealResponse(port, meal as any),
    });
  },

  deleteMeal: async (req: Request, res: Response, port: number) => {
    const id = String(req.params.id);
    const title = await mealService.deleteMeal(id);
    if (!title) {
      res.status(404).json({ success: false, message: "ไม่พบเมนูอาหารนี้" });
      return;
    }
    res.json({ success: true, message: `ลบเมนูอาหาร '${title}' สำเร็จ` });
  },

  getCategories: async (req: Request, res: Response) => {
    const categories = await mealService.getCategories();
    res.json({ success: true, data: { categories } });
  },

  getAreas: async (req: Request, res: Response) => {
    const areas = await mealService.getAreas();
    res.json({ success: true, data: { areas } });
  },
};
