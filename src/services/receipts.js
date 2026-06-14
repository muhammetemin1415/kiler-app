import { normalize } from "../utils/text.js";

export function parseReceipt(text, receiptMap) {
  const found = new Map();

  String(text || "")
    .split(/\n+/)
    .forEach((line) => {
      const cleanLine = normalize(line);
      receiptMap.forEach(([needle, ingredient]) => {
        if (cleanLine.includes(normalize(needle))) {
          found.set(ingredient, { ingredient, line: line.trim() || needle });
        }
      });
    });

  return [...found.values()];
}
