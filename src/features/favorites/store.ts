import { prisma } from "../../lib/prisma.js";

// Favorite data access: Prisma effects only.
export const favoriteStore = {
  findManyByUser: (userId: string) =>
    prisma.favorite.findMany({
      where: { userId },
      include: { meal: { include: { ingredients: true } } },
      orderBy: { createdAt: "desc" },
    }),

  findUserAndMeal: (userId: string, mealId: string) =>
    Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.meal.findUnique({ where: { id: mealId } }),
    ]),

  findFirst: (userId: string, mealId: string) =>
    prisma.favorite.findFirst({
      where: { userId, mealId },
      include: { meal: { include: { ingredients: true } } },
    }),

  create: (userId: string, mealId: string) =>
    prisma.favorite.create({
      data: { userId, mealId },
      include: { meal: { include: { ingredients: true } } },
    }),

  delete: (id: string) =>
    prisma.favorite.delete({ where: { id } }),

  clearByUser: (userId: string) =>
    prisma.favorite.deleteMany({ where: { userId } }),
};
