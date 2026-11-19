import { Router } from "express";
import { userHandlers } from "./handler.js";

// User route wiring: maps /api/users/:userId paths to handlers.
export function createUsersRouter() {
  const router = Router({ mergeParams: true });

  router.get("/:userId", (req, res) => userHandlers.getProfile(req, res));

  return router;
}
