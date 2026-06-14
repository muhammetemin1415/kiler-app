export const NUTRIENT_KEYS = [
  "caloriesKcal",
  "proteinG",
  "carbsG",
  "fatG",
  "fiberG",
  "sugarG",
  "sodiumMg",
];

export const NUTRITION_SOURCE_REGISTRY = [
  {
    id: "usda-fdc",
    name: "USDA FoodData Central",
    url: "https://fdc.nal.usda.gov/api-guide/",
    type: "official-food-composition",
    license: "CC0 1.0 Universal / public domain",
    bestFor: ["base foods", "raw ingredients", "branded foods"],
    licenseRequired: true,
    priority: 1,
  },
  {
    id: "open-food-facts",
    name: "Open Food Facts",
    url: "https://openfoodfacts.github.io/openfoodfacts-server/api/",
    type: "open-product-database",
    license: "Open Database License for database, Database Contents License for contents",
    bestFor: ["barcoded foods", "packaged products"],
    licenseRequired: true,
    priority: 2,
  },
];

export const SAMPLE_FOOD_INDEX = {
  yumurta: {
    id: "sample-egg",
    name: "Yumurta",
    source: "demo-estimate",
    confidence: 0.8,
    nutrientsPer100g: {
      caloriesKcal: 143,
      proteinG: 12.6,
      carbsG: 0.7,
      fatG: 9.5,
      fiberG: 0,
      sugarG: 0.4,
      sodiumMg: 142,
    },
  },
  domates: {
    id: "sample-tomato",
    name: "Domates",
    source: "demo-estimate",
    confidence: 0.78,
    nutrientsPer100g: {
      caloriesKcal: 18,
      proteinG: 0.9,
      carbsG: 3.9,
      fatG: 0.2,
      fiberG: 1.2,
      sugarG: 2.6,
      sodiumMg: 5,
    },
  },
  peynir: {
    id: "sample-cheese",
    name: "Peynir",
    source: "demo-estimate",
    confidence: 0.7,
    nutrientsPer100g: {
      caloriesKcal: 264,
      proteinG: 14.2,
      carbsG: 4.1,
      fatG: 21.3,
      fiberG: 0,
      sugarG: 4.1,
      sodiumMg: 917,
    },
  },
};
