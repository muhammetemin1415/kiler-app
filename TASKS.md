# Kilerim Professional Task Backlog

Bu liste Kilerim prototipini kullanici testine, mobil pakete ve daha sonra canli urune tasimak icin hazirlandi. Tasklar GitHub issue olarak acilabilecek sekilde bolundu.

## P0 - Urun Temeli

### 1. Kullanici Akisini Netlestir
- Alan: UX / Product
- Amac: Ilk kez gelen kullanicinin 30 saniye icinde uygulamanin degerini anlamasi.
- Isler:
  - Ilk acilis ekraninda "kilerime ekle", "fis tara", "tarif bul" akisini sade hale getir.
  - Bos kiler, az malzeme, dolu kiler durumlari icin ayri bos durum metinleri hazirla.
  - Admin ve kullanici modlarini daha belirgin ayir.
- Kabul kriteri:
  - Kullanici ilk ekranda en az bir malzeme ekleyebiliyor.
  - Kullanici admin moduna yanlislikla gecmiyor.
  - Bos durumlar yol gosteriyor, ekrani kilitlemiyor.

### 2. Veri Modelini Uygulama Mantigindan Ayir
- Alan: Frontend Architecture
- Amac: `app.js` icindeki veri, is kurallari ve arayuz kodunu bolmek.
- Isler:
  - Katalog, tarif, fis kurallari ve demo verilerini ayri modul dosyalarina tasi.
  - Kiler, tarif eslestirme, fis ayriklastirma fonksiyonlarini saf fonksiyonlara bol.
  - UI render kodunu is mantigindan ayir.
- Kabul kriteri:
  - Tarif eslestirme fonksiyonu DOM'a bagli olmadan calisiyor.
  - Fis ayriklastirma fonksiyonu tek basina test edilebilir.
  - `app.js` daha kucuk ve okunabilir parcalara ayrilmis.

### 3. LocalStorage Veri Surumleme ve Goc Mekanizmasi
- Alan: Data / Reliability
- Amac: Eski demo verileri yeni surumlerde bozulmadan tasimak.
- Isler:
  - Kayitli state icine `version` alani ekle.
  - Eski state yapilarini yeni yapilara tasiyan migration fonksiyonlari yaz.
  - Bozuk JSON durumunda kullaniciya veri sifirlama secenegi sun.
- Kabul kriteri:
  - Eski state yuklenince uygulama patlamiyor.
  - Bozuk veri durumunda kullanici beyaz ekran gormuyor.
  - Demo reset akisi kontrollu calisiyor.

## P1 - Kullanici Deneyimi

### 4. Kiler Ekleme Deneyimini Iyilestir
- Alan: UX / Frontend
- Amac: Malzeme eklemeyi hizli, hataya dayanikli ve mobil dostu yapmak.
- Isler:
  - Yazarken katalog onerileri goster.
  - Ayni malzemeyi eklerken miktar artirma secenegi sun.
  - Kategori, son kullanma tahmini ve miktar alanlari ekle.
- Kabul kriteri:
  - Kullanici tek elle malzeme ekleyebiliyor.
  - Ayni malzeme tekrarlandiginda duplicate kart olusmuyor.
  - Malzeme kartinda kategori, miktar ve kalan gun gorunuyor.

### 5. Tarif Eslesmesini Profesyonel Hale Getir
- Alan: Product Logic / UX
- Amac: Kullaniciya sadece yuzde degil, neden o tarifin onerildigini gostermek.
- Isler:
  - Tarif kartinda "var olanlar", "eksikler", "acil kullanilacaklar" ayrimini goster.
  - Atik azaltma skoru hesapla.
  - Eksik malzemeleri alisveris listesine tek tikla ekle.
- Kabul kriteri:
  - Tarif kartlari kullaniciya karar verdirecek kadar acik.
  - Eksikler alisveris listesine eklenebiliyor.
  - Acil tuketilmesi gereken malzemeler tarif siralamasini etkiliyor.

### 6. Fis/OCR Akisini Gercekci Hale Getir
- Alan: OCR / UX
- Amac: Fis metni ve fis fotografi akisini kullanici testine hazirlamak.
- Isler:
  - Fis fotografi secildiginde onizleme ve manuel duzeltme alani goster.
  - OCR sonucu icin "bulunan malzemeler" ve "emin olunmayanlar" ayrimi yap.
  - Ayni fisin tekrar eklenmesini engellemek icin basit imza/hash olustur.
- Kabul kriteri:
  - Kullanici OCR sonucunu kilere eklemeden once duzeltebiliyor.
  - Belirsiz satirlar sessizce yok sayilmiyor.
  - Ayni fis iki kez eklenirse uyari veriliyor.

### 7. Alisveris Listesi ve Haftalik Plan Deneyimi
- Alan: Product / UX
- Amac: Tariflerden ve eksik malzemelerden aksiyona gecis saglamak.
- Isler:
  - Alisveris listesinde tamamlandi/isaretlendi durumu ekle.
  - Haftalik plana tarif surukle-birak veya secim akisi ekle.
  - Planin eksik malzeme maliyetini hesapla.
- Kabul kriteri:
  - Tarif eksikleri listeye ekleniyor.
  - Liste maddeleri tamamlanabiliyor.
  - Haftalik plan toplam tahmini maliyet gosteriyor.

### 8. Erisilebilirlik ve Mobil Dokunma Kalitesi
- Alan: Accessibility / Mobile UX
- Amac: Uygulamayi daha rahat, okunur ve dokunulabilir yapmak.
- Isler:
  - Buton hit area boyutlarini minimum 44px yap.
  - Renk kontrastlarini kontrol et.
  - Klavye ile gezinme ve focus state'leri ekle.
  - Dialog ve sheet kapanma davranislarini netlestir.
- Kabul kriteri:
  - Mobilde metinler tasma yapmiyor.
  - Focus state gorsel olarak anlasiliyor.
  - Dialoglar ESC/disari tiklama/kapama dugmesiyle kapanabiliyor.

## P1 - Teknik Altyapi

### 9. Proje Yapisi Standardizasyonu
- Alan: Engineering
- Amac: Projeyi buyuyebilir klasor yapisina tasimak.
- Isler:
  - `src/` altinda `data`, `services`, `ui`, `state`, `utils` klasorleri olustur.
  - Statik web dosyalarini kaynak ve build ciktisi olarak ayir.
  - `www/`, `android/`, `ios/`, `tools/` gibi uretilen ciktinin repo politikasini netlestir.
- Kabul kriteri:
  - Kaynak dosyalar ve uretilen dosyalar karismiyor.
  - Build/sync komutlari dokumante edilmis.
  - Git'e sadece gerekli dosyalar giriyor.

### 10. Test Altyapisini Kur
- Alan: Quality
- Amac: Temel is mantiginin bozulmasini engellemek.
- Isler:
  - Vitest veya benzeri hafif test araci ekle.
  - Tarif eslestirme testleri yaz.
  - Fis ayriklastirma testleri yaz.
  - State migration testleri yaz.
- Kabul kriteri:
  - `npm test` komutu calisiyor.
  - En kritik is kurallari testlerle korunuyor.
  - Testler DOM'a ihtiyac duymadan kosabiliyor.

### 11. Lint ve Format Kurallari
- Alan: Developer Experience
- Amac: Kod stilini tutarli hale getirmek.
- Isler:
  - ESLint ve Prettier kur.
  - `npm run lint` ve `npm run format` komutlarini ekle.
  - CI icin ayni komutlari kullanilabilir hale getir.
- Kabul kriteri:
  - Kod formati tek komutla duzeliyor.
  - Lint temel hatalari yakaliyor.
  - Yeni gelistirici ayni standartla kod yazabiliyor.

### 12. GitHub Actions CI Kur
- Alan: DevOps
- Amac: Her push'ta temel kontrollerin otomatik calismasi.
- Isler:
  - `lint`, `test`, `sync:web` adimlarini calistiran workflow ekle.
  - Pull request icin zorunlu kontrol seti tanimla.
  - Build artifact veya preview notu uret.
- Kabul kriteri:
  - GitHub Actions her push'ta calisiyor.
  - Hata varsa PR merge edilmeden gorunuyor.
  - Basarili run'larda net yesil durum var.

## P2 - Backend ve Hesap Sistemi

### 13. Kimlik ve Kullanici Hesabi Stratejisi
- Alan: Auth / Product
- Amac: Local demo verisinden gercek kullanici hesabina gecis planlamak.
- Isler:
  - Firebase Auth, Supabase Auth veya NextAuth secimini yap.
  - Email, Google ve Apple login gereksinimlerini yaz.
  - Misafir modundan hesap moduna veri tasima akisini tasarla.
- Kabul kriteri:
  - Auth saglayicisi secilmis ve gerekcesi yazilmis.
  - Misafir kullanici verisi hesap acinca kaybolmuyor.
  - Logout/login veri davranisi net.

### 14. Bulut Veri Modeli
- Alan: Backend / Database
- Amac: Gercek cok cihazli kullanim icin veri semasini tanimlamak.
- Isler:
  - `users`, `pantryItems`, `recipes`, `receiptRules`, `shoppingLists`, `weeklyPlans`, `communityRecipes` koleksiyonlarini tasarla.
  - Yetki kurallarini yaz.
  - Offline-first senkronizasyon stratejisini belirle.
- Kabul kriteri:
  - Veri semasi dokumante edilmis.
  - Hangi veri kullaniciya, hangi veri admine ait net.
  - Offline ve conflict durumlari icin karar var.

### 15. Admin Panel Yetkilendirme
- Alan: Security / Admin
- Amac: Admin ozelliklerini normal kullanicidan ayirmak.
- Isler:
  - Admin rol modeli tanimla.
  - Admin panelini sadece yetkili hesaplara ac.
  - Tarif, katalog ve OCR kural degisiklikleri icin audit log planla.
- Kabul kriteri:
  - Normal kullanici admin aksiyonlarini goremiyor.
  - Admin degisiklikleri takip edilebilir.
  - Demo mod ve gercek admin modu ayrilmis.

## P2 - Mobil ve Platform

### 16. Capacitor Android Stabilizasyonu
- Alan: Mobile / Android
- Amac: Android Studio'da acilabilen, build alinabilen bir paket.
- Isler:
  - Android SDK/JDK kurulumunu tamamla.
  - `cap sync android` ve debug build akisini test et.
  - Paket adi, ikon, splash screen ve izinleri duzenle.
- Kabul kriteri:
  - Android Studio projeyi hatasiz aciyor.
  - Debug APK alinabiliyor.
  - Uygulama ikon ve ad bilgileri dogru.

### 17. iOS Hazirlik
- Alan: Mobile / iOS
- Amac: iOS build icin gereksinimleri tamamlamak.
- Isler:
  - Tam Xcode kurulumunu tamamla.
  - CocoaPods kur.
  - `cap add ios` ve `cap sync ios` akisini test et.
  - Bundle id ve signing stratejisini belirle.
- Kabul kriteri:
  - Xcode workspace aciliyor.
  - Simulator build alinabiliyor.
  - iOS izin metinleri hazir.

### 18. PWA Kalitesi
- Alan: Web Platform
- Amac: Uygulamayi tarayicida yuklenebilir, hizli ve guvenilir hale getirmek.
- Isler:
  - Service worker ekle.
  - Offline acilis ve cache stratejisi tanimla.
  - Manifest ikonlarini ve tema renklerini tamamla.
- Kabul kriteri:
  - Tarayicida install prompt destekleniyor.
  - Offline durumda temel ekran aciliyor.
  - Lighthouse PWA kontrolleri geciyor.

## P2 - Gelir ve Buyume

### 19. Premium Akis Tasarimi
- Alan: Monetization / UX
- Amac: Premium ozellikleri kullaniciyi rahatsiz etmeden sunmak.
- Isler:
  - Premium ozellik listesini netlestir.
  - Paywall ekranini tasarla.
  - Deneme surumu ve limitli kullanim senaryosunu yaz.
- Kabul kriteri:
  - Premium tetikleyicileri mantikli noktalarda cikiyor.
  - Ucretsiz kullanici temel degeri alabiliyor.
  - Premium metrikleri takip edilebilir.

### 20. Affiliate ve Market Yonlendirme
- Alan: Growth / Partnerships
- Amac: Eksik malzemeden satin alma aksiyonuna gecis saglamak.
- Isler:
  - Affiliate link veri modelini tasarla.
  - Alisveris listesinden market linki uret.
  - Yonlendirme tiklama analitigi ekle.
- Kabul kriteri:
  - Eksik malzeme icin satin alma aksiyonu gorunuyor.
  - Affiliate linkler admin tarafindan yonetilebilir.
  - Tiklama metriği tutuluyor.

## P3 - Analitik ve Operasyon

### 21. Urun Analitigi
- Alan: Analytics
- Amac: Hangi ozelliklerin kullanildigini ve nerede takilma oldugunu anlamak.
- Isler:
  - Event sozlugu hazirla.
  - Kritik eventler: malzeme ekleme, fis tarama, tarif pisirme, listeye ekleme, premium tiklama.
  - Gizlilik dostu analitik araci sec.
- Kabul kriteri:
  - Event isimleri ve payload'lar dokumante.
  - Kisisel veri gereksiz toplanmiyor.
  - Test ortaminda eventler dogrulanabiliyor.

### 22. Hata Izleme
- Alan: Observability
- Amac: Kullanici hatalarini ve JavaScript problemlerini yakalamak.
- Isler:
  - Sentry veya alternatif hata izleme araci sec.
  - Global error handler ekle.
  - Kritik akislarda kullanici dostu hata mesajlari goster.
- Kabul kriteri:
  - Runtime hata raporu alinabiliyor.
  - Kullanici beyaz ekran yerine acik mesaj goruyor.
  - Hata raporlarinda hassas veri bulunmuyor.

### 23. Gizlilik ve Guvenlik Metinleri
- Alan: Legal / Trust
- Amac: Fis, yemek, saglik ve harcama verileri icin guven olusturmak.
- Isler:
  - Gizlilik politikasi taslagi hazirla.
  - Veri saklama ve silme akisini belirle.
  - Saglik onerileri icin sorumluluk reddi metni ekle.
- Kabul kriteri:
  - Kullanici hangi verinin neden toplandigini gorebiliyor.
  - Hesap silme/veri silme stratejisi yazili.
  - Saglik tavsiyesi profesyonel tibbi tavsiye gibi sunulmuyor.

## Milestone Siralamasi

### Milestone 1: Test Edilebilir Prototip
- Task 1, 2, 4, 5, 6, 8, 10
- Hedef: Kullanici testine hazir, daha az kirilgan web prototipi.

### Milestone 2: Mobil Hazirlik
- Task 3, 9, 11, 12, 16, 18
- Hedef: CI, test ve Android/PWA paket akisi.

### Milestone 3: Gercek Hesap ve Bulut
- Task 13, 14, 15, 21, 22, 23
- Hedef: Hesapli, izlenebilir, guvenli MVP altyapisi.

### Milestone 4: Buyume ve Gelir
- Task 7, 17, 19, 20
- Hedef: iOS hazirligi, premium, affiliate ve planlama deneyimi.

## Ilk Sprint Onerisi

1. Task 2 - Veri modelini uygulama mantigindan ayir.
2. Task 10 - Test altyapisini kur.
3. Task 4 - Kiler ekleme deneyimini iyilestir.
4. Task 5 - Tarif eslesmesini profesyonel hale getir.
5. Task 6 - Fis/OCR akisini gercekci hale getir.

Bu sprint sonunda prototip hem daha profesyonel gorunur hem de sonraki teknik buyumeye hazir olur.
