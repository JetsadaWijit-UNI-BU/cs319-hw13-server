import { Router } from "express";
import { mealHandlers } from "./handler.js";

// Meal route wiring: maps /api/meals paths to handlers. Wiring only, no logic.
export function createMealsRouter(port: number) {
  const router = Router();

  router.get("/", (req, res) => mealHandlers.getMeals(req, res, port));
  router.get("/:id", (req, res) => mealHandlers.getMealById(req, res, port));
  router.post("/", (req, res) => mealHandlers.createMeal(req, res, port));
  router.put("/:id", (req, res) => mealHandlers.updateMeal(req, res, port));
  router.delete("/:id", (req, res) => mealHandlers.deleteMeal(req, res, port));
  router.get("/categories", (req, res) => mealHandlers.getCategories(req, res));
  router.get("/areas", (req, res) => mealHandlers.getAreas(req, res));

  return router;
}
