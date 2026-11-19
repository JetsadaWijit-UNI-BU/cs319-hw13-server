export type DbMeal = {
  id: string;
  title: string;
  category: string | null;
  area: string | null;
  instructions: string;
  thumbnail: string;
  youtube: string | null;
  ingredients: Array<{ name: string; measure: string | null }>;
};
