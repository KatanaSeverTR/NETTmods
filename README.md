# 🌐 NETTmods Resmi Web Sitesi (GitHub Pages Uyumlu)

Bu web sitesi **NETTmods** markası için özel olarak tasarlanmış, Discord BaaS botlarını, oyun modlarını ve dijital yazılım hizmetlerini tanıtan **modern, mobil uyumlu ve %100 statik** bir vitrin platformudur.

---

## 🚀 GitHub Pages Üzerinde 2 Dakikada Canlıya Alma Rehberi

GitHub Pages, bu siteyi **tamamen ücretsiz** ve **otomatik SSL (HTTPS)** sertifikası ile barındırmanızı sağlar.

### Yöntem 1: GitHub Web Arayüzü ile (Kodsuz & Kolay)
1. [GitHub.com](https://github.com) adresine gidin ve hesabınıza giriş yapın.
2. Sağ üstteki **+** simgesine tıklayıp **New repository** (Yeni Depo) seçin.
3. Depo adını `NETTmods` (veya `nettmods.github.io`) yapın ve **Public** olarak oluşturun.
4. Sayfada **"uploading an existing file"** (var olan dosyaları yükle) bağlantısına tıklayın.
5. Bu klasördeki (`index.html`, `style.css`, `app.js`, `README.md`) dosyalarını sürükleyip bırakın ve **Commit changes** deyin.
6. Deponuzun **Settings (Ayarlar) -> Pages** sekmesine gidin.
7. **Branch** kısmını `main` ve `/ (root)` seçip **Save** butonuna basın.
8. 1-2 dakika içinde siteniz **`https://<kullanici-adiniz>.github.io/NETTmods/`** adresinde canlıya geçer! 🎉

---

### Yöntem 2: Git Terminali ile
```bash
cd "c:\Users\KatanaSever\Documents\Pi Otomasyon\nettmods-website"
git init
git add .
git commit -m "feat: NETTmods website initial release"
git branch -M main
git remote add origin https://github.com/<KULLANICI_ADINIZ>/NETTmods.git
git push -u origin main
```
Ardından GitHub Depo Ayarlarından **Pages -> Deploy from a branch (main)** seçmeniz yeterlidir.

---

## 🎨 Sitenin Özellikleri
- **Cyber / Gaming Dark UI:** Neon mavi/mor geçişler ve modern cam (glassmorphism) kartlar.
- **Kategori Filtreleme:** Discord Botları (BaaS), Oyun Modları ve Yazılım Araçları arasında anlık filtreleme.
- **İnteraktif Sipariş Masası:** Ürüne tıklanıldığında doğrudan Discord bilet masasına yönlendiren modal pencere.
- **S.S.S. Akordeon:** Ziyaretçilerin en çok sorduğu sorular için açılır kapanır panel.
- **Tam Mobil Uyumlu:** Telefon, tablet ve masaüstünde kusursuz görüntü.
