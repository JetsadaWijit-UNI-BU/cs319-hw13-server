import { favoriteStore } from "./store.js";
import { toMealResponse } from "../meals/transform.js";

// Favorite business logic: decide, no effects. Calls store for persistence.
export const favoriteService = {
  getFavorites: async (userId: string) => {
    const favs = await favoriteStore.findManyByUser(userId);
    return favs.map((f) => f.meal);
  },

  addFavorite: async (userId: string, mealId: string) => {
    const [user, meal] = await favoriteStore.findUserAndMeal(userId, mealId);
    if (!user || !meal) return null;
    const existing = await favoriteStore.findFirst(userId, mealId);
    if (existing) return toMealResponse(existing.meal as any);
    const fav = await favoriteStore.create(userId, mealId);
    return toMealResponse(fav.meal as any);
  },

  removeFavorite: async (userId: string, mealId: string) => {
    const fav = await favoriteStore.findFirst(userId, mealId);
    if (!fav) return null;
    await favoriteStore.delete(fav.id);
    return true;
  },

  clearFavorites: async (userId: string) => {
    const result = await favoriteStore.clearByUser(userId);
    return result.count > 0;
  },
};
