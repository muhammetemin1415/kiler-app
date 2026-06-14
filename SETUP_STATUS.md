# Kilerim Kurulum Durumu

## Tamamlananlar

- Proje içine yerel Node/npm kuruldu: `tools/node`
- Capacitor bağımlılıkları kuruldu: `node_modules`
- Web prototipi mobil çıktı klasörüne kopyalanıyor: `www`
- Android Capacitor projesi üretildi: `android`
- Android senkronizasyonu çalıştı: `./node_modules/.bin/cap sync android`
- Android Studio resmi indirmesi Safari üzerinden tamamlandı.
- Android Studio DMG SHA-256 kontrolü resmi değerle eşleşti.
- Android Studio `/Applications` içine kuruldu.
- Android Studio ilk açılış SDK bileşenlerini indirip kuruyor.
- Homebrew resmi sayfası Safari'de açıldı.

## Bu Bilgisayarda Eksik Olanlar

- Android Studio SDK kurulumunun tamamlanması
- Java Runtime / JDK komut satırı görünürlüğü
- Tam Xcode
- CocoaPods

## Manuel Kurulum Gerekenler

1. Android Studio Setup Wizard bitince `Finish` düğmesine bas.
2. Android Studio içinde proje klasörü olarak `kiler-app/android` aç.
3. Xcode'u App Store üzerinden kur.
4. Xcode açıldıktan sonra lisansı kabul et.
5. CocoaPods için Homebrew kuruluysa:

```bash
brew install cocoapods
```

Homebrew yoksa resmi Homebrew kurulumunu çalıştırdıktan sonra aynı komutu kullan.

## Kurulumdan Sonra Komutlar

Android:

```bash
tools/node/bin/npm run sync:web
./node_modules/.bin/cap sync android
open android
```

iOS:

```bash
tools/node/bin/npm run sync:web
./node_modules/.bin/cap add ios
./node_modules/.bin/cap sync ios
open ios/App/App.xcworkspace
```

## Not

Komut satırından başlatılan eski Android Studio indirmesi 26 MB'lık kısmi dosya olarak yeniden adlandırıldı: `/Users/emndmn/Downloads/android-studio-quail1-mac_arm.partial.dmg`. Geçerli kurulum dosyası `/Users/emndmn/Downloads/android-studio-quail1-mac_arm-2.dmg`.
