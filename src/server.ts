import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { createMealsRouter } from "./features/meals/router.js";
import { createAuthRouter } from "./features/auth/router.js";
import { createFavoritesRouter } from "./features/favorites/router.js";
import { createShoppingListRouter } from "./features/shoppingList/router.js";
import { createUsersRouter } from "./features/users/router.js";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Serve meal images stored at the repo root (images/<file>) under /images.
const __dirname = dirname(fileURLToPath(import.meta.url));
app.use("/images", express.static(join(__dirname, "..", "images")));

app.use(cors());
app.use(express.json());

// Mount feature routers (wiring only — no business logic lives here).
app.use("/api/meals", createMealsRouter(PORT));
app.use("/api/auth", createAuthRouter());
app.use("/api/users/:userId/favorites", createFavoritesRouter(PORT));
app.use("/api/users/:userId/shopping-list", createShoppingListRouter());
app.use("/api/users", createUsersRouter());

// เริ่มทำงาน Server
app.listen(PORT, () => {
  console.log(`🚀 Gusto Backend running on http://localhost:${PORT}`);
});
