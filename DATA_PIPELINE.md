# Recipe and Nutrition Data Pipeline

Bu dokuman Kilerim'in 60.000-70.000 tarif bandina cikmasi ve tariflerin besin degerlerini guvenilir sekilde hesaplamasi icin yol haritasidir.

## Hedef

- 60.000-70.000 arasi dunya mutfagi tarifi.
- Her tarif icin malzeme listesi, gramaj, porsiyon, hazirlama suresi, mutfak, diyet etiketleri ve kaynak bilgisi.
- Her tarif icin kalori, protein, karbonhidrat, yag, lif, seker ve sodyum hesabi.
- Her besin hesabinda hangi veri kaynaginin kullanildigini ve guven skorunu tutmak.

## Ilke

Internetteki tum diyet yazilarini kopyalayarak ilerlemeyecegiz. Bunun yerine acik lisansli ve resmi veri kaynaklarini kullanacagiz, her kaynagin lisansini kaydedecegiz, blog ve makaleleri sadece dogrulama ve icerik kalitesi icin referans katmani olarak ele alacagiz.

Saglik iddialari tibbi tavsiye gibi sunulmayacak. Uygulama "besin degeri tahmini" verir; diyabet, gebelik, bobrek hastaligi, alerji veya tibbi diyet gibi durumlarda kullaniciya uzman gorusu gerektigi soylenir.

## Kaynak Katmanlari

### 1. Besin Verisi

- USDA FoodData Central: Ana besin degeri kaynagi. Temel gida ve markali urun kayitlari icin kullanilir.
- Open Food Facts: Barkodlu ve paketli urunler icin destek kaynagi.
- Ulusal gida kompozisyon tabloları: Turkiye ve Avrupa urunleri icin ikinci dogrulama katmani olarak eklenebilir.

Kaynak referanslari:

- USDA FoodData Central API: https://fdc.nal.usda.gov/api-guide/
- Open Food Facts API: https://openfoodfacts.github.io/openfoodfacts-server/api/

### 2. Tarif Verisi

- Acik lisansli tarif veri setleri.
- Uygulama icinde uretilen ve moderasyondan gecen topluluk tarifleri.
- Marka veya yayin kaynakli tarifler sadece lisans uygunsa iceri aktarilir.

### 3. Kanit ve Icerik Kalitesi

- Resmi kurum rehberleri ve akademik ozetler diyet etiketi kurallari icin kullanilir.
- Blog yazilari otomatik besin hesabi kaynagi yapilmaz.
- Her diyet etiketi icin kural yazilir: vegan, vejetaryen, glutensiz, laktozsuz, yuksek protein, dusuk sodyum gibi.

## Veri Modeli

### Food Record

```json
{
  "id": "usda-170379",
  "name": "egg, whole, raw",
  "source": "USDA FoodData Central",
  "sourceId": "170379",
  "nutrientsPer100g": {
    "caloriesKcal": 143,
    "proteinG": 12.56,
    "carbsG": 0.72,
    "fatG": 9.51,
    "fiberG": 0,
    "sugarG": 0.37,
    "sodiumMg": 142
  },
  "confidence": 0.95
}
```

### Recipe Ingredient

```json
{
  "name": "yumurta",
  "grams": 100,
  "foodId": "usda-170379",
  "preparation": "raw"
}
```

### Recipe Nutrition

```json
{
  "recipeId": "r-omlet",
  "servings": 2,
  "total": {
    "caloriesKcal": 520,
    "proteinG": 28,
    "carbsG": 14,
    "fatG": 38,
    "fiberG": 3,
    "sugarG": 7,
    "sodiumMg": 780
  },
  "perServing": {
    "caloriesKcal": 260,
    "proteinG": 14,
    "carbsG": 7,
    "fatG": 19,
    "fiberG": 1.5,
    "sugarG": 3.5,
    "sodiumMg": 390
  },
  "sources": ["USDA FoodData Central"],
  "confidence": 0.92
}
```

## Is Akisi

1. Kaynak secimi ve lisans kontrolu.
2. Ham tarif ve besin verisini ayri depolama.
3. Malzeme adlarini normalize etme.
4. Malzemeyi besin kaydiyla eslestirme.
5. Gramaj yoksa olcu birimi donusumu yapma.
6. Tarif toplam besin degerini hesaplama.
7. Porsiyon basina degeri hesaplama.
8. Guven skoru ve kaynak listesini kaydetme.
9. Supheli tarifleri admin incelemesine gonderme.
10. Uygulamaya sadece onayli veri indeksini yayinlama.

## Kalite Kurallari

- Gramaji olmayan tarif otomatik yayina cikmaz.
- Bir malzeme besin kaydiyla eslesmediyse tarifin guven skoru duser.
- Markali urunlerde barkod veya urun adi kaynakla birlikte saklanir.
- Kullaniciya kesin tibbi sonuc yerine tahmini besin degeri gosterilir.
- Kaynaksiz diyet iddiasi kullanilmaz.

## Ilk Uygulama Asamasi

- Besin hesaplama servisi kurulduktan sonra once 50-100 tariflik dogrulanmis seed veri hazirlanacak.
- Sonra 5.000 tariflik ithalat denemesi yapilacak.
- Kalite raporu gecerse 60.000-70.000 tariflik tam kataloga gecilecek.
