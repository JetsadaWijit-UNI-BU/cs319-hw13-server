import { type DbMeal } from "./types.js";

// Convert a relative thumbnail path (images/<file>) into an absolute
// URL the browser can fetch from this server.
// One responsibility: build the full image URL.
export function toImageUrl(port: number, thumbnail: string): string {
  if (thumbnail.startsWith("http://") || thumbnail.startsWith("https://")) {
    return thumbnail;
  }
  // thumbnails are stored as images/<file> and served at /images/<file>,
  // so prepend the host directly (the path already includes "images/").
  return `http://localhost:${port}/${thumbnail}`;
}

export function toMealResponse(port: number, m: DbMeal) {
  const ing = m.ingredients.map((i, idx) => ({
    [`strIngredient${idx + 1}`]: i.name,
    [`strMeasure${idx + 1}`]: i.measure ?? "",
  }));
  return {
    idMeal: m.id,
    strMeal: m.title,
    strCategory: m.category ?? "",
    strArea: m.area ?? "",
    strInstructions: m.instructions,
    strMealThumb: toImageUrl(port, m.thumbnail),
    strYoutube: m.youtube ?? "",
    ingredients: m.ingredients.map((i) => ({ ...i, ingredient: i.name })),
    ...Object.assign({}, ...ing),
  };
}
