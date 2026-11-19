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

// Trust reverse-proxy headers (X-Forwarded-Proto, etc.) so the app sees
// https when served over HTTPS through a proxy (e.g. nginx on Render).
app.set("trust proxy", 1);

// Serve meal images stored at the repo root (images/<file>) under /images.
const __dirname = dirname(fileURLToPath(import.meta.url));
app.use("/images", express.static(join(__dirname, "..", "images")));

app.use(cors());
app.use(express.json());

// Mount feature routers (wiring only — no business logic lives here).
app.use("/api/meals", createMealsRouter());
app.use("/api/auth", createAuthRouter());
app.use("/api/users/:userId/favorites", createFavoritesRouter());
app.use("/api/users/:userId/shopping-list", createShoppingListRouter());
app.use("/api/users", createUsersRouter());

// Root welcome page.
app.get("/", (_req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Gusto Backend</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: system-ui, -apple-system, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #1f2937;
    }
    .card {
      background: #ffffff;
      border-radius: 16px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
      padding: 48px 64px;
      text-align: center;
      max-width: 480px;
      width: 90%;
    }
    h1 { font-size: 2rem; margin-bottom: 8px; letter-spacing: -0.5px; }
    p { color: #6b7280; margin-top: 4px; }
  </style>
</head>
<body>
  <div class="card">
    <h1>This is server</h1>
    <p>Gusto Backend — Recipe Hub API</p>
  </div>
</body>
</html>`);
});

// เริ่มทำงาน Server
app.listen(PORT, () => {
  console.log(`🚀 Gusto Backend running on http://localhost:${PORT}`);
});
