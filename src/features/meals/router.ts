import { Router } from "express";
import { mealHandlers } from "./handler.js";

// Meal route wiring: maps /api/meals paths to handlers. Wiring only, no logic.
export function createMealsRouter() {
  const router = Router();

  router.get("/", (req, res) => mealHandlers.getMeals(req, res));
  router.get("/:id", (req, res) => mealHandlers.getMealById(req, res));
  router.post("/", (req, res) => mealHandlers.createMeal(req, res));
  router.put("/:id", (req, res) => mealHandlers.updateMeal(req, res));
  router.delete("/:id", (req, res) => mealHandlers.deleteMeal(req, res));
  router.get("/categories", (req, res) => mealHandlers.getCategories(req, res));
  router.get("/areas", (req, res) => mealHandlers.getAreas(req, res));

  return router;
}
