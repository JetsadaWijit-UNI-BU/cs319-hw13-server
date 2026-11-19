import type { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";

// Meal data access: Prisma effects only. No business logic, no HTTP.
export const mealStore = {
  findMany: (
    where: Prisma.MealWhereInput,
    include: Prisma.MealInclude,
    orderBy: Prisma.MealOrderByWithRelationInput
  ) =>
    prisma.meal.findMany({ where, include, orderBy }),

  findUnique: (id: string, include?: Prisma.MealInclude) =>
    prisma.meal.findUnique({ where: { id }, ...(include ? { include } : {}) }),

  create: (data: Prisma.MealCreateInput, include: Prisma.MealInclude) =>
    prisma.meal.create({ data, include }),

  update: (id: string, data: Prisma.MealUpdateInput, include: Prisma.MealInclude) =>
    prisma.meal.update({ where: { id }, data, include }),

  delete: (id: string) =>
    prisma.meal.delete({ where: { id } }),

  deleteIngredients: (mealId: string) =>
    prisma.ingredient.deleteMany({ where: { mealId } }),

  distinctCategories: () =>
    prisma.meal.findMany({
      distinct: ["category"],
      select: { category: true },
      where: { category: { not: null } },
    }),

  distinctAreas: () =>
    prisma.meal.findMany({
      distinct: ["area"],
      select: { area: true },
      where: { area: { not: null } },
    }),
};
