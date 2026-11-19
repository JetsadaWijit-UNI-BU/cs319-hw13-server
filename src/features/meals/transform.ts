import { type DbMeal } from "./types.js";

// Origins that must never reach a browser over HTTPS. A local-network URL
// (http://localhost:<port>/... or http://127.0.0.1:<port>/...) is stripped
// down to its path so it resolves against the host actually serving the page.
// External https:// URLs are intentionally left untouched.
const LOCAL_ORIGIN_RE = /^https?:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?/i;

// Normalize a thumbnail stored in the database into a safe, clean URL.
// - External https:// URLs are preserved as-is.
// - http://localhost / http://127.0.0.1 origins (including ones already
//   seeded into production databases) are rewritten to their path.
// - Relative paths ("images/x.jpg" or "/images/x.jpg") become root-relative
//   ("/images/x.jpg") so they resolve against whichever host serves the page,
//   with no hardcoded http://localhost:... fallback.
export function normalizeImageUrl(thumbnail: string): string {
  if (!thumbnail) return thumbnail;
  if (thumbnail.startsWith("https://")) return thumbnail;
  const stripped = thumbnail.replace(LOCAL_ORIGIN_RE, "");
  return stripped.startsWith("/") ? stripped : `/${stripped}`;
}

// Build the image URL returned by the API. Always root-relative and
// environment-agnostic — the client resolves it against the configured API
// base URL, so no insecure local-network URL ever leaves this server.
export function toImageUrl(thumbnail: string): string {
  return normalizeImageUrl(thumbnail);
}

export function toMealResponse(m: DbMeal) {
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
    strMealThumb: toImageUrl(m.thumbnail),
    strYoutube: m.youtube ?? "",
    ingredients: m.ingredients.map((i) => ({ ...i, ingredient: i.name })),
    ...Object.assign({}, ...ing),
  };
}
