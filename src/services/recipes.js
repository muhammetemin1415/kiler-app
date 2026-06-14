import { normalize } from "../utils/text.js";

export function getRecipeMatches(pantry, recipes) {
  const pantryNames = new Set(pantry.map((item) => item.name));

  return recipes
    .map((item) => {
      const ingredients = item.ingredients.map(normalize);
      const matched = ingredients.filter((ingredient) => pantryNames.has(ingredient));

      return {
        ...item,
        ingredients,
        matched,
        missing: ingredients.filter((ingredient) => !pantryNames.has(ingredient)),
        match: Math.round((matched.length / ingredients.length) * 100),
      };
    })
    .sort((a, b) => b.match - a.match || a.time - b.time);
}
