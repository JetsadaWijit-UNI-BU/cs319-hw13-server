import { type Request, type Response } from "express";
import { z } from "zod";
import { shoppingListService } from "./service.js";
import { idSchema } from "../../lib/schemas.js";

// Shopping list HTTP handlers: request → service → response.
export const shoppingListHandlers = {
  getItems: async (req: Request, res: Response) => {
    const userId = String(req.params.userId);
    const items = await shoppingListService.getItems(userId);
    res.json({
      success: true,
      count: items.length,
      data: {
        ingredients: items.map((item) => ({
          itemId: item.id,
          mealId: item.mealId,
          ingredientName: item.ingredientName,
          measure: item.measure ?? "",
          checked: item.checked,
        })),
      },
    });
  },

  addItem: async (req: Request, res: Response) => {
    const userId = String(req.params.userId);
    const parsed = idSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, message: parsed.error.issues[0]?.message ?? "ข้อมูลไม่ถูกต้อง" });
      return;
    }
    const { mealId } = parsed.data;
    const items = await shoppingListService.addItem(userId, mealId);
    if (!items) {
      res.status(404).json({ success: false, message: "ไม่พบผู้ใช้หรือเมนูอาหาร" });
      return;
    }
    res.status(201).json({
      success: true,
      message: "เพิ่มในรายการซื้อของเรียบร้อย",
      data: {
        ingredients: items.map((item) => ({
          itemId: item.id,
          mealId: item.mealId,
          ingredientName: item.ingredientName,
          measure: item.measure ?? "",
          checked: item.checked,
        })),
      },
    });
  },

  toggleItem: async (req: Request, res: Response) => {
    const itemId = String(req.params.itemId);
    const { checked } = z.object({ checked: z.boolean() }).parse(req.body);
    const item = await shoppingListService.toggleItem(itemId, checked);
    if (!item) {
      res.status(404).json({ success: false, message: "ไม่พบรายการนี้" });
      return;
    }
    res.json({
      success: true,
      message: "อัปเดตรายการซื้อของเรียบร้อย",
      data: { itemId: item.id, checked: item.checked },
    });
  },

  removeItem: async (req: Request, res: Response) => {
    const itemId = String(req.params.itemId);
    const removed = await shoppingListService.removeItem(itemId);
    if (!removed) {
      res.status(404).json({ success: false, message: "ไม่พบรายการนี้" });
      return;
    }
    res.json({ success: true, message: "ลบรายการซื้อของเรียบร้อย" });
  },

  clearItems: async (req: Request, res: Response) => {
    const userId = String(req.params.userId);
    await shoppingListService.clearItems(userId);
    res.json({ success: true, message: "ล้างรายการซื้อของเรียบร้อย" });
  },
};
