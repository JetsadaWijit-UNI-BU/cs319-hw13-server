import "dotenv/config";
import { createRequire } from "module";
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// @prisma/client is a CJS module; use createRequire so the named import
// works in ESM on all Node versions / platforms.
const require = createRequire(import.meta.url);
const { PrismaClient } = require("@prisma/client");

// Reuse the same single-instance client wiring as the app (adapter-pg over pg Pool)
const pool = new Pool({
  connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL || "postgresql://127.0.0.1:5432/postgres",
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

type JsonIngredient = {
  ingredient: string;
  measure: string;
};

type JsonMeal = {
  idMeal: string;
  strMeal: string;
  strCategory: string | null;
  strCountry: string | null;
  strMealThumb: string;
  strYoutube: string | null;
  strInstructions: string;
  ingredients: JsonIngredient[];
};

type RawMeals = { meals: JsonMeal[] };

// Resolve meals.json next to this seed file so the seed works regardless of CWD.
const seedDir = dirname(fileURLToPath(import.meta.url));
const mealsJsonPath = join(seedDir, "meals.json");

// Load meal data from the local JSON file. One responsibility: read + parse.
function loadMealsFromJson(filePath: string): JsonMeal[] {
  const raw = readFileSync(filePath, "utf8");
  const parsed: RawMeals = JSON.parse(raw);
  return parsed.meals;
}

// Map a JSON meal record to a Prisma meal create input.
// One responsibility: transform JSON shape into the Prisma input shape.
function toMealCreateInput(meal: JsonMeal) {
  return {
    data: {
      title: meal.strMeal,
      category: meal.strCategory ?? null,
      area: meal.strCountry ?? null,
      instructions: meal.strInstructions,
      thumbnail: meal.strMealThumb,
      youtube: meal.strYoutube ?? null,
      ingredients: {
        create: meal.ingredients.map((i) => ({
          name: i.ingredient,
          measure: i.measure ?? null,
        })),
      },
    },
  };
}

// Clear existing data in FK-safe order. One responsibility: wipe tables.
async function clearDatabase() {
  await prisma.ingredient.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.shoppingListItem.deleteMany();
  await prisma.meal.deleteMany();
  await prisma.user.deleteMany();
}

// Create the seed users. One responsibility: insert users.
async function createUsers() {
  const user1 = await prisma.user.create({
    data: {
      email: "owen@example.com",
      password: "password123",
      name: "เจษฎา วิจิตร",
    },
  });
  const user2 = await prisma.user.create({
    data: {
      email: "oak@example.com",
      password: "password123",
      name: "ศรดิษฐ์ เขียวป้อ",
    },
  });
  return [user1, user2] as const;
}

// Seed every meal from the JSON data, each with its ingredients.
// One responsibility: insert all meals.
async function seedMeals(meals: JsonMeal[]) {
  const created: Array<Awaited<ReturnType<typeof prisma.meal.create>>> = [];
  for (const meal of meals) {
    created.push(await prisma.meal.create(toMealCreateInput(meal)));
  }
  return created;
}

// Create one sample favorite for user1. One responsibility: insert a favorite.
async function createSampleFavorite(userId: string, mealId: string) {
  await prisma.favorite.create({ data: { userId, mealId } });
}

async function main() {
  console.log("🌱 Seeding database...");

  await clearDatabase();
  const [user1, user2] = await createUsers();

  const meals = loadMealsFromJson(mealsJsonPath);
  const createdMeals = await seedMeals(meals);

  await createSampleFavorite(user1.id, createdMeals[0].id);

  console.log("✅ Created users:", user1.email, user2.email);
  console.log(`✅ Created ${createdMeals.length} meals from ${mealsJsonPath}`);
  console.log("✅ Created sample favorite");

  console.log("🎉 Seed complete");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
