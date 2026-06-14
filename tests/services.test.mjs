import test from "node:test";
import assert from "node:assert/strict";

import { DEFAULT_RECEIPT_MAP, DEFAULT_RECIPES } from "../src/data/demo-data.js";
import { parseReceipt } from "../src/services/receipts.js";
import { getRecipeMatches } from "../src/services/recipes.js";
import { normalize, titleize } from "../src/utils/text.js";

test("normalize converts Turkish characters and trims punctuation", () => {
  assert.equal(normalize("  KaŞAr, Peynİr!  "), "kasar peynir");
});

test("titleize restores common Turkish display names", () => {
  assert.equal(titleize("salatalik"), "Salatalık");
  assert.equal(titleize("tereyagi"), "Tereyağı");
});

test("parseReceipt finds unique ingredients from receipt lines", () => {
  const parsed = parseReceipt("DOMATES KG\nPINAR SUT 1LT\nYUMURTA 15LI\nDOMATES SALKIM", DEFAULT_RECEIPT_MAP);

  assert.deepEqual(
    parsed.map((item) => item.ingredient),
    ["domates", "sut", "yumurta"],
  );
});

test("getRecipeMatches sorts best recipe matches first", () => {
  const pantry = ["yumurta", "domates", "peynir", "biber"].map((name) => ({ name }));
  const matches = getRecipeMatches(pantry, DEFAULT_RECIPES);

  assert.equal(matches[0].name, "Domatesli Peynirli Omlet");
  assert.equal(matches[0].match, 100);
  assert.deepEqual(matches[0].missing, []);
});
