import { NUTRIENT_KEYS } from "../data/nutrition-sources.js";
import { normalize } from "../utils/text.js";

export function createEmptyNutrition() {
  return Object.fromEntries(NUTRIENT_KEYS.map((key) => [key, 0]));
}

export function scaleNutrientsPerGram(foodRecord, grams) {
  const ratio = (grams || 0) / 100;
  const nutrients = foodRecord?.nutrientsPer100g ?? {};

  return Object.fromEntries(
    NUTRIENT_KEYS.map((key) => [key, Number(((nutrients[key] ?? 0) * ratio).toFixed(4))]),
  );
}

export function sumNutrition(items) {
  return items.reduce((total, item) => {
    for (const key of NUTRIENT_KEYS) {
      total[key] += item[key] ?? 0;
    }

    return total;
  }, createEmptyNutrition());
}

export function roundNutrition(nutrition) {
  return Object.fromEntries(
    NUTRIENT_KEYS.map((key) => {
      const value = nutrition[key] ?? 0;
      return [key, key === "caloriesKcal" || key === "sodiumMg" ? Math.round(value) : Number(value.toFixed(1))];
    }),
  );
}

export function calculateIngredientNutrition(ingredient, foodIndex) {
  const name = normalize(ingredient.name);
  const grams = ingredient.grams ?? 0;
  const foodRecord = foodIndex[name] ?? null;

  if (!foodRecord) {
    return {
      ingredient: name,
      grams,
      matched: false,
      source: null,
      confidence: 0,
      nutrients: createEmptyNutrition(),
    };
  }

  return {
    ingredient: name,
    grams,
    matched: true,
    foodId: foodRecord.id,
    source: foodRecord.source,
    confidence: foodRecord.confidence ?? 0.75,
    nutrients: scaleNutrientsPerGram(foodRecord, grams),
  };
}

export function calculateRecipeNutrition(recipe, foodIndex) {
  const servings = recipe.servings || 1;
  const ingredients = recipe.ingredients.map((ingredient) =>
    calculateIngredientNutrition(
      typeof ingredient === "string" ? { name: ingredient, grams: 0 } : ingredient,
      foodIndex,
    ),
  );
  const matchedIngredients = ingredients.filter((item) => item.matched);
  const rawTotal = sumNutrition(ingredients.map((item) => item.nutrients));
  const total = roundNutrition(rawTotal);
  const perServing = roundNutrition(
    Object.fromEntries(NUTRIENT_KEYS.map((key) => [key, rawTotal[key] / servings])),
  );
  const sources = [...new Set(matchedIngredients.map((item) => item.source).filter(Boolean))];
  const confidence =
    ingredients.length === 0
      ? 0
      : Number(
          (
            matchedIngredients.reduce((sum, item) => sum + item.confidence, 0) / ingredients.length
          ).toFixed(2),
        );

  return {
    recipeId: recipe.id,
    servings,
    total,
    perServing,
    ingredients,
    sources,
    confidence,
    unmatched: ingredients.filter((item) => !item.matched).map((item) => item.ingredient),
  };
}
