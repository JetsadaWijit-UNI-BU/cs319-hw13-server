import { type Request, type Response } from "express";
import { z } from "zod";
import { favoriteService } from "./service.js";
import { toMealResponse } from "../meals/transform.js";
import { idSchema } from "../../lib/schemas.js";

// Favorite HTTP handlers: request → service → response.
export const favoriteHandlers = {
  getFavorites: async (req: Request, res: Response, port: number) => {
    const userId = String(req.params.userId);
    const meals = await favoriteService.getFavorites(userId);
    res.json({
      success: true,
      count: meals.length,
      data: { meals: meals.map((m) => toMealResponse(port, m as any)) },
    });
  },

  addFavorite: async (req: Request, res: Response, port: number) => {
    const userId = String(req.params.userId);
    const parsed = idSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, message: parsed.error.issues[0]?.message ?? "ข้อมูลไม่ถูกต้อง" });
      return;
    }
    const { mealId } = parsed.data;
    const meal = await favoriteService.addFavorite(userId, mealId, port);
    if (!meal) {
      res.status(404).json({ success: false, message: "ไม่พบผู้ใช้หรือเมนูอาหาร" });
      return;
    }
    res.status(201).json({
      success: true,
      message: "เพิ่มรายการโปรดเรียบร้อย",
      data: meal,
    });
  },

  removeFavorite: async (req: Request, res: Response) => {
    const userId = String(req.params.userId);
    const mealId = String(req.params.mealId);
    const removed = await favoriteService.removeFavorite(userId, mealId);
    if (!removed) {
      res.status(404).json({ success: false, message: "ไม่พบรายการโปรดนี้" });
      return;
    }
    res.json({ success: true, message: "ลบรายการโปรดเรียบร้อย" });
  },

  clearFavorites: async (req: Request, res: Response) => {
    const userId = String(req.params.userId);
    await favoriteService.clearFavorites(userId);
    res.json({ success: true, message: "ล้างรายการโปรดทั้งหมดเรียบร้อย" });
  },
};
