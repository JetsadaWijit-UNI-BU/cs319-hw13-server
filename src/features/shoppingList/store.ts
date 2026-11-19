import { prisma } from "../../lib/prisma.js";

// Shopping list data access: Prisma effects only.
// Each row now tracks a single ingredient of a meal (grouped by mealId),
// not the whole meal as one checklist item.
export const shoppingListStore = {
  findManyByUser: (userId: string) =>
    prisma.shoppingListItem.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    }),

  findManyByUserAndMeal: (userId: string, mealId: string) =>
    prisma.shoppingListItem.findMany({
      where: { userId, mealId },
      orderBy: { createdAt: "asc" },
    }),

  findUserAndMeal: (userId: string, mealId: string) =>
    Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.meal.findUnique({ where: { id: mealId }, include: { ingredients: true } }),
    ]),

  findUnique: (id: string) =>
    prisma.shoppingListItem.findUnique({ where: { id } }),

  findFirstByUserAndMeal: (userId: string, mealId: string) =>
    prisma.shoppingListItem.findFirst({
      where: { userId, mealId },
    }),

  createMany: (
    userId: string,
    mealId: string,
    ingredients: Array<{ name: string; measure?: string | null }>,
  ) =>
    prisma.shoppingListItem.createMany({
      data: ingredients.map((ingredient) => ({
        userId,
        mealId,
        ingredientName: ingredient.name,
        measure: ingredient.measure ?? null,
      })),
    }),

  update: (id: string, checked: boolean) =>
    prisma.shoppingListItem.update({ where: { id }, data: { checked } }),

  delete: (id: string) =>
    prisma.shoppingListItem.delete({ where: { id } }),

  clearByUser: (userId: string) =>
    prisma.shoppingListItem.deleteMany({ where: { userId } }),
};
