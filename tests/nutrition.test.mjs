import test from "node:test";
import assert from "node:assert/strict";

import { SAMPLE_FOOD_INDEX } from "../src/data/nutrition-sources.js";
import {
  calculateIngredientNutrition,
  calculateRecipeNutrition,
  scaleNutrientsPerGram,
} from "../src/services/nutrition.js";

test("scaleNutrientsPerGram scales per-100g nutrition to ingredient grams", () => {
  const egg = SAMPLE_FOOD_INDEX.yumurta;
  const nutrition = scaleNutrientsPerGram(egg, 50);

  assert.equal(nutrition.caloriesKcal, 71.5);
  assert.equal(nutrition.proteinG, 6.3);
});

test("calculateIngredientNutrition returns unmatched ingredients safely", () => {
  const result = calculateIngredientNutrition({ name: "safran", grams: 2 }, SAMPLE_FOOD_INDEX);

  assert.equal(result.matched, false);
  assert.equal(result.nutrients.caloriesKcal, 0);
});

test("calculateRecipeNutrition returns total and per-serving values", () => {
  const recipe = {
    id: "r-test-omelet",
    servings: 2,
    ingredients: [
      { name: "yumurta", grams: 100 },
      { name: "domates", grams: 80 },
      { name: "peynir", grams: 40 },
    ],
  };
  const nutrition = calculateRecipeNutrition(recipe, SAMPLE_FOOD_INDEX);

  assert.equal(nutrition.total.caloriesKcal, 263);
  assert.equal(nutrition.perServing.caloriesKcal, 132);
  assert.equal(nutrition.unmatched.length, 0);
  assert.deepEqual(nutrition.sources, ["demo-estimate"]);
});

