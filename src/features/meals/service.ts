import { mealStore } from "./store.js";

// Meal business logic: decide, no effects. Calls store for persistence.
export const mealService = {
  getMeals: async (q?: string) =>
    mealStore.findMany(
      q ? { title: { contains: q, mode: "insensitive" } as const } : {},
      { ingredients: true },
      { createdAt: "desc" }
    ),

  getMealById: async (id: string) =>
    mealStore.findUnique(id, { ingredients: true }),

  createMeal: async (data: {
    title: string;
    category?: string | null;
    area?: string | null;
    instructions: string;
    thumbnail: string;
    youtube?: string | null;
    ingredients: Array<{ name: string; measure?: string | null }>;
  }) =>
    mealStore.create(
      {
        title: data.title,
        category: data.category || null,
        area: data.area || null,
        instructions: data.instructions,
        thumbnail: data.thumbnail,
        youtube: data.youtube || null,
        ingredients: {
          create: data.ingredients.map((i) => ({
            name: i.name,
            measure: i.measure || null,
          })),
        },
      },
      { ingredients: true }
    ),

  updateMeal: async (id: string, data: {
    title: string;
    category?: string | null;
    area?: string | null;
    instructions: string;
    thumbnail: string;
    youtube?: string | null;
    ingredients: Array<{ name: string; measure?: string | null }>;
  }) => {
    const existing = await mealStore.findUnique(id, undefined);
    if (!existing) return null;
    await mealStore.deleteIngredients(id);
    return mealStore.update(id, {
      title: data.title,
      category: data.category || null,
      area: data.area || null,
      instructions: data.instructions,
      thumbnail: data.thumbnail,
      youtube: data.youtube || null,
      ingredients: {
        create: data.ingredients.map((i) => ({
          name: i.name,
          measure: i.measure || null,
        })),
      },
    }, { ingredients: true });
  },

  deleteMeal: async (id: string) => {
    const existing = await mealStore.findUnique(id, undefined);
    if (!existing) return null;
    await mealStore.delete(id);
    return existing.title;
  },

  getCategories: async () => {
    const rows = await mealStore.distinctCategories();
    return rows.map((r) => r.category).filter(Boolean);
  },

  getAreas: async () => {
    const rows = await mealStore.distinctAreas();
    return rows.map((r) => r.area).filter(Boolean);
  },
};
