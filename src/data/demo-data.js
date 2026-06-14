export const STORAGE_KEY = "kilerim-prototype-state-v3";

export const DEFAULT_CATALOG = [
  { name: "domates", category: "sebze", shelfDays: 5, price: 18 },
  { name: "salatalik", category: "sebze", shelfDays: 5, price: 14 },
  { name: "biber", category: "sebze", shelfDays: 5, price: 16 },
  { name: "patates", category: "sebze", shelfDays: 20, price: 10 },
  { name: "sogan", category: "sebze", shelfDays: 25, price: 8 },
  { name: "marul", category: "sebze", shelfDays: 4, price: 20 },
  { name: "tavuk", category: "protein", shelfDays: 3, price: 95 },
  { name: "yumurta", category: "protein", shelfDays: 14, price: 5 },
  { name: "nohut", category: "protein", shelfDays: 90, price: 20 },
  { name: "mercimek", category: "protein", shelfDays: 90, price: 18 },
  { name: "sut", category: "sut", shelfDays: 6, price: 35 },
  { name: "yogurt", category: "sut", shelfDays: 7, price: 45 },
  { name: "peynir", category: "sut", shelfDays: 10, price: 75 },
  { name: "kasar", category: "sut", shelfDays: 12, price: 80 },
  { name: "tereyagi", category: "sut", shelfDays: 20, price: 90 },
  { name: "makarna", category: "tahil", shelfDays: 120, price: 25 },
  { name: "pirinc", category: "tahil", shelfDays: 120, price: 30 },
  { name: "bulgur", category: "tahil", shelfDays: 120, price: 22 },
  { name: "ekmek", category: "tahil", shelfDays: 3, price: 12 },
  { name: "limon", category: "meyve", shelfDays: 12, price: 12 },
  { name: "elma", category: "meyve", shelfDays: 12, price: 15 },
  { name: "muz", category: "meyve", shelfDays: 5, price: 18 },
];

export const DEFAULT_RECEIPT_MAP = [
  ["domates", "domates"],
  ["salkim", "domates"],
  ["salat", "salatalik"],
  ["biber", "biber"],
  ["patates", "patates"],
  ["sogan", "sogan"],
  ["yum", "yumurta"],
  ["sut", "sut"],
  ["süt", "sut"],
  ["yog", "yogurt"],
  ["yoğ", "yogurt"],
  ["peyn", "peynir"],
  ["kasar", "kasar"],
  ["kaşar", "kasar"],
  ["pilic", "tavuk"],
  ["piliç", "tavuk"],
  ["tavuk", "tavuk"],
  ["makarna", "makarna"],
  ["pirinc", "pirinc"],
  ["pirinç", "pirinc"],
  ["bulgur", "bulgur"],
  ["limon", "limon"],
  ["elma", "elma"],
  ["muz", "muz"],
];

export const ROADMAP = [
  "3 ekran MVP akışı",
  "Kiler veri modeli",
  "Tarif eşleştirme algoritması",
  "Fiş/OCR ayrıştırma prototipi",
  "Admin veri yönetimi",
  "Kamera/fiş fotoğrafı akışı",
  "Alışveriş listesi",
  "Haftalık yemek planı",
  "Atıksız yaşam puanı",
  "Rozet sistemi",
  "Haftalık özet simülasyonu",
  "Topluluk paylaşımı",
  "Premium/paywall simülasyonu",
  "Affiliate satın alma yönlendirmesi",
];

export const DEFAULT_RECIPES = [
  createRecipe("r-omlet", "Domatesli Peynirli Omlet", 12, 420, ["yumurta", "domates", "peynir", "biber"], "Yumurtayı çırp, sebzeleri sotele, peynirle birlikte tavada pişir."),
  createRecipe("r-tavuk-bulgur", "Tavuklu Bulgur Kasesi", 28, 610, ["tavuk", "bulgur", "sogan", "yogurt"], "Bulguru haşla, tavuğu sotele, yoğurtla ferah bir kase hazırla."),
  createRecipe("r-makarna", "Sebzeli Makarna", 22, 540, ["makarna", "domates", "biber", "sogan"], "Makarnayı haşla, sebzeleri sos haline getir, hepsini birleştir."),
  createRecipe("r-salata", "Nohutlu Yeşil Salata", 10, 360, ["nohut", "salatalik", "domates", "limon", "marul"], "Hepsini doğra, limon ve zeytinyağı ile karıştır.", true),
  createRecipe("r-tost", "Kahvaltı Tostu", 9, 450, ["ekmek", "kasar", "domates", "tereyagi"], "Ekmeği yağla, kaşar ve domatesle kızart."),
];

export function createRecipe(id, name, time, calories, ingredients, steps, premium = false) {
  return { id, name, time, calories, ingredients, steps, premium };
}
