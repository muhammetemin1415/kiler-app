# Kilerim Adminli Prototip

Mobil öncelikli kullanıcı deneyimi ve bilgisayardan denenebilen admin paneli olan yerel prototip.

## Aksiyonlar

- Kiler malzemesi ekleme
- Fiş metninden malzeme ayıklama prototipi
- Evdeki malzemeye göre tarif eşleştirme
- Malzeme kullanınca yeşil puan ve konfeti ödülü
- LocalStorage ile kalıcı veri
- Admin modunda malzeme kataloğu yönetimi
- Admin modunda tarif veritabanı yönetimi
- Fiş/OCR test lab
- Premium, affiliate, rozet ve haftalık özet simülasyonları
- Alışveriş listesi ve haftalık yemek planı
- Topluluk tarifi paylaşımı ve admin moderasyon görünümü
- Fiş fotoğrafı seçme/kamera akışı ve OCR sözlüğü yönetimi

## Çalıştırma

Yerel önizleme:

```bash
python3 -m http.server 8000
```

Sonra tarayıcıda `http://localhost:8000` adresini aç.

Sağ üstteki `Admin` düğmesiyle yönetim paneline, `Kullanıcı` düğmesiyle mobil deneyime geçebilirsin.

## Mobil Build

Gerçek iOS/Android uygulamaya taşıma notları için [MOBILE_BUILD_PLAN.md](/Users/emndmn/Desktop/final/kiler-app/MOBILE_BUILD_PLAN.md) dosyasına bak.

Bu klasörde proje içi Node/npm ve Capacitor kurulumu hazırlandı. Android proje çıktısı `android/` klasöründe üretildi.

Kurulumun güncel durum özeti için [SETUP_STATUS.md](/Users/emndmn/Desktop/final/kiler-app/SETUP_STATUS.md) dosyasına bak.
