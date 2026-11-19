import { Router } from "express";
import { authHandlers } from "./handler.js";

// Auth route wiring: maps /api/auth paths to handlers. Wiring only, no logic.
export function createAuthRouter() {
  const router = Router();

  router.post("/login", (req, res) => authHandlers.login(req, res));
  router.post("/register", (req, res) => authHandlers.register(req, res));

  return router;
}
