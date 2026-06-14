# Kilerim Mobil Uygulama Taşıma Planı

Bu prototip şu an PWA olarak çalışır. Gerçek App Store / Google Play yoluna geçerken aynı ürün mantığı aşağıdaki sırayla taşınmalı.

## Ücretsiz Araçlar

- Xcode: iOS simulator ve App Store build için gerekir. Bu bilgisayarda tam Xcode yok, sadece komut satırı araçları var.
- Android Studio: Android emulator ve Play Store build için gerekir.
- Node.js + npm: React Native / Expo ya da Capacitor kurulumu için gerekir. Bu bilgisayarda Node var ama npm yok.
- Firebase Spark Plan: kullanıcı, veritabanı, storage ve bildirim prototipi için ücretsiz başlangıç.
- Tesseract OCR veya Google ML Kit: cihaz üstü fiş okuma prototipi için.

## Önerilen Teknik Yol

1. PWA prototipini kullanıcı testinde doğrula.
2. Expo React Native projesi aç.
3. Veri modelini `users`, `pantryItems`, `recipes`, `receiptRules`, `shoppingLists`, `weeklyPlans`, `communityRecipes` koleksiyonlarına taşı.
4. Kamera ekranında önce fotoğraf çek, sonra OCR pipeline'a gönder.
5. Admin panelini web dashboard olarak ayrı tut; mobil uygulamada admin yüzeyi göstermeye gerek yok.
6. Push notification, premium ve affiliate linklerini en son bağla.

## Bu Projede Hazırlanan Mobil Hat

Prototip Capacitor ile mobil pakete sarılacak şekilde hazırlandı.

```bash
tools/node/bin/npm install
tools/node/bin/npm run sync:web
tools/node/bin/npm run cap:add:android
tools/node/bin/npm run cap:sync
```

Bu bilgisayarda proje içi Node/npm kuruldu ve `android/` klasörü üretildi. Android Studio kurulduktan sonra `android/` klasörü doğrudan açılabilir.

iOS için ek gereksinimler:

- Tam Xcode kurulumu
- CocoaPods kurulumu

Sonrasında:

```bash
tools/node/bin/npm run sync:web
./node_modules/.bin/cap add ios
./node_modules/.bin/cap sync ios
```

`ios/` klasörünü açmak için tam Xcode, `android/` klasörünü açmak için Android Studio gerekir.

## Kurulum Hazırlığı

Tam mobil build için bu bilgisayara şunlar kurulmalı:

```bash
# Bu projede Node/npm yerel olarak tools/node içine kuruldu.

# iOS için
# Xcode App Store üzerinden kurulur

# Android için
# Android Studio resmi siteden kurulur
```

Bu prototipin ürün mantığı `app.js` içinde bağımsız tutuldu; Expo/React Native'e taşırken önce veri ve eşleştirme fonksiyonları ayrılmalı.
