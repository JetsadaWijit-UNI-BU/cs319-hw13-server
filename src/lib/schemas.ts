import { z } from "zod";

export const idSchema = z.object({ mealId: z.string().min(1) });
