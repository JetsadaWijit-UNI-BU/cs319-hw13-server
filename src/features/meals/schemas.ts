import { z } from "zod";

export const mealSchema = z.object({
  title: z.string().min(1, "กรุณาระบุชื่ออาหาร"),
  category: z.string().optional(),
  area: z.string().optional(),
  instructions: z.string().min(1, "กรุณาระบุวิธีทำ"),
  thumbnail: z.string().url().optional().or(z.literal("")),
  youtube: z.string().url().optional().or(z.literal("")),
  ingredients: z
    .array(z.object({ name: z.string().min(1), measure: z.string().optional() }))
    .optional()
    .default([]),
});
