import { shoppingListStore } from "./store.js";

// Shopping list business logic: decide, no effects. Calls store for persistence.
export const shoppingListService = {
  getItems: async (userId: string) => {
    return shoppingListStore.findManyByUser(userId);
  },

  addItem: async (userId: string, mealId: string) => {
    const [user, meal] = await shoppingListStore.findUserAndMeal(userId, mealId);
    if (!user || !meal) return null;
    const existing = await shoppingListStore.findManyByUserAndMeal(userId, mealId);
    const existingNames = new Set(existing.map((item) => item.ingredientName));
    const seenNames = new Set<string>();
    const newIngredients = meal.ingredients.filter((ingredient) => {
      if (existingNames.has(ingredient.name) || seenNames.has(ingredient.name)) {
        return false;
      }
      seenNames.add(ingredient.name);
      return true;
    });
    if (newIngredients.length > 0) {
      await shoppingListStore.createMany(userId, mealId, newIngredients);
    }
    return shoppingListStore.findManyByUserAndMeal(userId, mealId);
  },

  toggleItem: async (itemId: string, checked: boolean) => {
    const item = await shoppingListStore.findUnique(itemId);
    if (!item) return null;
    return shoppingListStore.update(itemId, checked);
  },

  removeItem: async (itemId: string) => {
    const item = await shoppingListStore.findUnique(itemId);
    if (!item) return null;
    await shoppingListStore.delete(itemId);
    return true;
  },

  clearItems: async (userId: string) => {
    const result = await shoppingListStore.clearByUser(userId);
    return result.count > 0;
  },
};
