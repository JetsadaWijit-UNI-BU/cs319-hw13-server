import { Router } from "express";
import { favoriteHandlers } from "./handler.js";

// Favorite route wiring: maps /api/users/:userId/favorites paths to handlers.
// Wiring only, no logic.
export function createFavoritesRouter() {
  const router = Router({ mergeParams: true });

  router.get("/", (req, res) => favoriteHandlers.getFavorites(req, res));
  router.post("/", (req, res) => favoriteHandlers.addFavorite(req, res));
  router.delete("/", (req, res) => favoriteHandlers.clearFavorites(req, res));
  router.delete("/:mealId", (req, res) => favoriteHandlers.removeFavorite(req, res));

  return router;
}
