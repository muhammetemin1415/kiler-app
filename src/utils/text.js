export function normalize(text) {
  return String(text || "")
    .toLocaleLowerCase("tr-TR")
    .replaceAll("ı", "i")
    .replaceAll("ğ", "g")
    .replaceAll("ü", "u")
    .replaceAll("ş", "s")
    .replaceAll("ö", "o")
    .replaceAll("ç", "c")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function displayName(text) {
  return {
    salatalik: "salatalık",
    sogan: "soğan",
    yogurt: "yoğurt",
    sut: "süt",
    kasar: "kaşar",
    pirinc: "pirinç",
    havuc: "havuç",
    tereyagi: "tereyağı",
  }[text] || text;
}

export function titleize(text) {
  return displayName(text)
    .split(" ")
    .map((word) => word.charAt(0).toLocaleUpperCase("tr-TR") + word.slice(1))
    .join(" ");
}
