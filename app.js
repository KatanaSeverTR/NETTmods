// NETTmods - Digital Products & Source Code Marketplace Client Logic

let currentSelectedPlan = {
    tier: 2,
    name: "Ticaret & Steam Bilet Altyapısı",
    price: 349
};

document.addEventListener('DOMContentLoaded', () => {
    initFAQ();
    initMobileMenu();
});

// 1. Open Purchase / Checkout Modal
function startPurchase(tier, planName, price) {
    currentSelectedPlan.tier = tier;
    currentSelectedPlan.name = planName;
    currentSelectedPlan.price = price;

    const modal = document.getElementById('checkoutModal');
    const modalTitle = document.getElementById('modalPlanTitle');
    const modalPrice = document.getElementById('modalPlanPrice');
    const form = document.getElementById('subscriptionForm');
    const successView = document.getElementById('orderSuccessView');

    if (modal && modalTitle && modalPrice) {
        modalTitle.innerText = `📦 ${planName}`;
        modalPrice.innerText = `${price} TL (Tek Seferlik • Ömür Boyu)`;

        // Reset view
        if (form) form.style.display = 'block';
        if (successView) successView.style.display = 'none';

        modal.classList.add('active');
    }
}

function closeCheckoutModal() {
    const modal = document.getElementById('checkoutModal');
    if (modal) modal.classList.remove('active');
}

// 2. Handle Purchase Form Submission
let lastOrderSummary = "";

function handlePurchaseSubmit(e) {
    e.preventDefault();
    const guildId = document.getElementById('orderGuildId').value.trim();
    const usagePurpose = document.getElementById('orderUsagePurpose').value;
    const discordUser = document.getElementById('orderDiscordUser').value.trim();
    const email = document.getElementById('orderEmail').value.trim();
    const method = document.getElementById('paymentMethod').value;
    const agreement = document.getElementById('orderAgreement');

    if (!guildId || !discordUser || !email) {
        alert("Lütfen tüm zorunlu alanları doldurun.");
        return;
    }

    if (!agreement || !agreement.checked) {
        alert("Lütfen devam etmeden önce Lisans & Kullanım Sözleşmesi şartını onaylayınız.");
        return;
    }

    // Generate unique order reference code
    const randomCode = "NETT-" + Math.floor(1000 + Math.random() * 9000);
    document.getElementById('refCodeText').innerText = randomCode;

    let paymentInfoHtml = "";
    if (method === "pazaryeri") {
        paymentInfoHtml = `
            <strong>🛒 Pazaryeri Güvencesi (Kredi Kartı / Taksit / Anında İndirme):</strong><br>
            Banka hesabı olmadan, 3D Secure kredi kartı ve taksit imkanıyla anında satın alma mağazalarımız:<br>
            • <a href="https://www.itemsatis.com" target="_blank" style="color:var(--primary); font-weight:bold; text-decoration:underline;">👉 İtemsatış Mağazamızdan Satın Al (${currentSelectedPlan.price} TL)</a><br>
            • <a href="https://www.gamesatis.com" target="_blank" style="color:var(--primary); font-weight:bold; text-decoration:underline;">👉 GameSatış Mağazamızdan Satın Al (${currentSelectedPlan.price} TL)</a><br>
            • <a href="https://www.bynogame.com" target="_blank" style="color:var(--primary); font-weight:bold; text-decoration:underline;">👉 ByNoGame Mağazamızdan Satın Al (${currentSelectedPlan.price} TL)</a><br>
            <small style="color:var(--text-secondary); display:block; margin-top:8px;">Satın aldığınızda ZIP arşiv indirme linki, tek kullanımlık aktivasyon biletiniz ve çift tıkla çalışan BASLAT.bat kurulum sihirbazı otomatik olarak teslim edilir.</small>
        `;
    } else if (method === "fintech") {
        paymentInfoHtml = `
            <strong>⚡ FinTech & Cüzdanlar (Sıfır Komisyon • 7/24):</strong><br>
            Genç ve pratik ödeme kanallarımız ile anında teslimat:<br>
            • <strong>Papara No:</strong> <code>1234567890</code><br>
            • <strong>Tosla No:</strong> <code>TR00 0000 0000 0000 00</code><br>
            • <strong>Nays / Paycell:</strong> <code>0555 000 00 00</code><br>
            • <strong>Tutar:</strong> ${currentSelectedPlan.price} TL<br>
            • <strong>Açıklama:</strong> <code>${randomCode}</code><br>
            <small style="color:var(--primary); display:block; margin-top:8px;">Açıklama kısmına <strong>${randomCode}</strong> kodunu yazıp Discord biletine dekontu ilettiğinizde ZIP arşiviniz, tekil biletiniz ve çift tık başlatıcınız 2 dakikada gönderilir.</small>
        `;
    } else if (method === "havale") {
        paymentInfoHtml = `
            <strong>🏦 Banka / FAST / Havale (7/24 Kesintisiz):</strong><br>
            Tüm bankalardan saniyeler içinde masrafsız FAST transferi:<br>
            • <strong>IBAN:</strong> <code>TR00 0000 0000 0000 0000 0000 00</code><br>
            • <strong>Alıcı:</strong> NETTmods Dijital Altyapı<br>
            • <strong>Tutar:</strong> ${currentSelectedPlan.price} TL<br>
            • <strong>Açıklama:</strong> <code>${randomCode}</code><br>
            <small style="color:var(--primary); display:block; margin-top:8px;">Ödeme açıklamasına mutlaka referans kodunu yazınız. Dekontu ilettiğiniz an ZIP arşivi, biletiniz ve çift tık kurulum paketiniz teslim edilir.</small>
        `;
    } else {
        paymentInfoHtml = `
            <strong>💎 Kripto Para (Düşük Ağ Ücreti):</strong><br>
            Global ve gizli ödeme seçeneği:<br>
            • <strong>USDT (TRC-20):</strong> <code>TXXXXXXXXXXXXXXXXXXXXXXXXXXXXX</code> (~$${Math.round(currentSelectedPlan.price / 35)} USDT)<br>
            • <strong>USDT (BEP-20):</strong> <code>0xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX</code> (~$${Math.round(currentSelectedPlan.price / 35)} USDT)<br>
            • <strong>Litecoin (LTC):</strong> <code>ltc1qxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</code> (~${(currentSelectedPlan.price / 35 / 75).toFixed(3)} LTC)<br>
            <small style="color:var(--primary); display:block; margin-top:8px;">Transfer TXID kodunu Discord destek masamıza ilettiğinizde hazır paketiniz anında iletilir.</small>
        `;
    }

    document.getElementById('paymentDetailsBox').innerHTML = paymentInfoHtml;

    // Save order summary for 1-click clipboard copy
    const purposeText = usagePurpose === "kisisel" ? "Kişisel Topluluk" : "Ticari Hizmet";
    lastOrderSummary = `[NETTmods Hazır Otomasyon Siparişi] Ref: ${randomCode} | Ürün: ${currentSelectedPlan.name} (${currentSelectedPlan.price} TL) | Sunucu ID: ${guildId} | Amaç: ${purposeText} | Yetkili: ${discordUser} | E-Posta: ${email} | Mülkiyet: Turnkey (Çift Tık Kurulum)`;

    // Switch to success view
    document.getElementById('subscriptionForm').style.display = 'none';
    document.getElementById('orderSuccessView').style.display = 'block';
}

function copyOrderSummary() {
    if (!lastOrderSummary) {
        showToast("⚠️ Kopyalanacak sipariş detayı bulunamadı.");
        return;
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(lastOrderSummary).then(() => {
            showToast("📋 Sipariş özeti panoya kopyalandı! Discord biletine yapıştırabilirsiniz.");
        }).catch(() => {
            copyFallback();
        });
    } else {
        copyFallback();
    }
}

function copyFallback() {
    const temp = document.createElement("textarea");
    temp.value = lastOrderSummary;
    document.body.appendChild(temp);
    temp.select();
    document.execCommand("copy");
    document.body.removeChild(temp);
    showToast("📋 Sipariş özeti panoya kopyalandı!");
}

// 3. FAQ Accordion Logic
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        if (questionBtn) {
            questionBtn.addEventListener('click', () => {
                const isOpen = item.classList.contains('active');
                faqItems.forEach(i => i.classList.remove('active'));
                if (!isOpen) {
                    item.classList.add('active');
                }
            });
        }
    });
}

// 4. Mobile Menu
function initMobileMenu() {
    const btn = document.getElementById('mobileMenuBtn');
    const navLinks = document.querySelector('.nav-links');
    if (btn && navLinks) {
        btn.addEventListener('click', () => {
            if (navLinks.style.display === 'flex') {
                navLinks.style.display = 'none';
            } else {
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.background = '#0d0f15';
                navLinks.style.padding = '20px';
                navLinks.style.borderBottom = '1px solid rgba(255,255,255,0.1)';
            }
        });
    }
}

// Close Modals on Outer Click
window.addEventListener('click', (e) => {
    const checkout = document.getElementById('checkoutModal');
    if (e.target === checkout) closeCheckoutModal();
});

// Toast Helper
function showToast(message) {
    const toast = document.getElementById('toastNotification');
    if (toast) {
        toast.innerText = message;
        toast.classList.add('active');
        setTimeout(() => toast.classList.remove('active'), 3500);
    }
}

// 5. Interactive Web Dashboard Simulation & State
const dashState = {
    aho: true,
    leet: true,
    raid: true,
    triage: true,
    sla: true,
    csat: true,
    backup: true,
    heal: true
};

function updateDashState(key, isChecked) {
    dashState[key] = isChecked;
    const labels = {
        aho: "Aho-Corasick Küfür/Reklam Kalkanı",
        leet: "Leetspeak De-obfuscation Filtresi",
        raid: "Anti-Raid & 14 Günlük Hesap Karantinası",
        triage: "Açılır Ön Teşhis Formu (Triage Modal)",
        sla: "Geri Sayımlı Canlı SLA Sayacı",
        csat: "Kapanışta 5 Yıldız Memnuniyet Anketi",
        backup: "6 Saatte Bir Offsite Şifreli Yedekleme",
        heal: "Self-Healing Otomatik Yeniden Başlatma"
    };
    const statusText = isChecked ? "Aktif Edildi 🟢" : "Devre Dışı Bırakıldı ⚪";
    showToast(`${labels[key] || key}: ${statusText}`);

    const statusEl = document.getElementById('dashLiveStatus');
    if (statusEl) {
        statusEl.innerText = "Yerel Ayarlar Güncellendi ⚡";
        setTimeout(() => {
            statusEl.innerText = "VDS Durumu: Çalışıyor (Port 8080)";
        }, 2000);
    }
}

function openTranscriptModalDemo() {
    showToast("📄 HTML Bilet Transkript Arşivi yeni sekmede açılıyor...");
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <title>Steam Standart Bilet Transkripti - #TK-8492</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0e1118; color: #c6d4df; margin: 0; padding: 40px; }
        .container { max-width: 800px; margin: auto; background: #161c26; border-radius: 12px; border: 1px solid #2a3447; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        .header { background: #1b2838; padding: 24px; border-bottom: 2px solid #66c0f4; }
        .title { font-size: 20px; font-weight: bold; color: #66c0f4; margin: 0 0 8px 0; }
        .meta { font-size: 13px; color: #8f98a0; }
        .messages { padding: 24px; }
        .msg { display: flex; gap: 14px; margin-bottom: 18px; }
        .avatar { width: 40px; height: 40px; border-radius: 50%; background: #66c0f4; color: #000; display: flex; align-items: center; justify-content: center; font-weight: bold; }
        .bubble { background: #1e2633; padding: 12px 16px; border-radius: 8px; flex-grow: 1; border: 1px solid #2d384a; }
        .author { font-size: 14px; font-weight: bold; color: #fff; margin-bottom: 4px; }
        .time { font-size: 11px; color: #8f98a0; font-weight: normal; margin-left: 8px; }
        .text { font-size: 14px; line-height: 1.5; }
        .csat-box { background: #18221b; border: 1px solid #2e5939; padding: 16px; border-radius: 8px; margin-top: 20px; text-align: center; }
        .csat-score { font-size: 18px; font-weight: bold; color: #a4d007; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="title">🎫 Steam Standart Destek Transkripti — Bilet #TK-8492</div>
            <div class="meta">Kategori: Teknik Destek / Kurulum • SLA: 8 dakika içinde çözüldü • Durum: Kapandı</div>
        </div>
        <div class="messages">
            <div class="msg">
                <div class="avatar" style="background:#a4d007;">K</div>
                <div class="bubble">
                    <div class="author">Kullanıcı (Mert) <span class="time">Bugün 14:15</span></div>
                    <div class="text">Merhaba, sunucumuzda Leetspeak filtresini kurduk, ancak özel bir rolü muaf tutmak istiyoruz.</div>
                </div>
            </div>
            <div class="msg">
                <div class="avatar" style="background:#66c0f4;">D</div>
                <div class="bubble">
                    <div class="author">Yetkili Destek Ekibi <span class="time">Bugün 14:21 (6 dk sonra)</span></div>
                    <div class="text">Merhaba Mert Bey! Web Kontrol Paneliniz üzerinden veya <code>/muaf rol @Yetkili</code> yazarak ilgili rolü anında filtre dışı bırakabilirsiniz. İşleminiz tamamlanmıştır!</div>
                </div>
            </div>
            <div class="csat-box">
                <div class="csat-score">⭐ CSAT Oylaması: 5 / 5 Yıldız (Çok Memnun)</div>
                <small style="color:#8f98a0;">"Harika hız, 6 dakikada sorunum çözüldü teşekkürler!"</small>
            </div>
        </div>
    </div>
</body>
</html>`);
}

// 6. Online Ticket Verification & Anti-Piracy Simulation
function loadSampleTicket(type) {
    const input = document.getElementById('ticketInput');
    if (!input) return;
    if (type === 'sample_active') {
        input.value = "TICKET-66E2-B77E-E2DF";
    } else if (type === 'sample_unclaimed') {
        input.value = "TICKET-9A4B-31C2-88EF";
    } else if (type === 'sample_pirate') {
        input.value = "TICKET-PIRATE-COPY-ATTEMPT";
    }
    verifyTicketOnline();
}

function verifyTicketOnline() {
    const input = document.getElementById('ticketInput');
    const box = document.getElementById('ticketResultBox');
    if (!input || !box) return;
    const code = (input.value || "").trim().toUpperCase();
    if (!code) {
        showToast("Lütfen bir aktivasyon bileti kodu girin!");
        return;
    }

    box.style.display = "block";
    if (code.includes("PIRATE")) {
        box.style.background = "rgba(255, 77, 77, 0.12)";
        box.style.border = "1px solid #ff4d4d";
        box.style.color = "#ff8585";
        box.innerHTML = `
            <div style="font-weight:bold; font-size:15px; margin-bottom:6px;"><i class="fa-solid fa-triangle-exclamation"></i> ⛔ KORSAN KLONLAMA ENGELLENDİ!</div>
            <strong>Hata:</strong> Bu bilet ZATEN başka bir Discord sunucusuna (Guild ID: 5555) mühürlenmiştir.<br>
            <strong>Sonuç:</strong> Bot yetkisiz sunucudan otomatik ayrılır ve kendini kapatır (Exit Code: 42). Kodlar çoğaltılamaz!
        `;
    } else if (code.includes("9A4B") || code.includes("UNCLAIMED")) {
        box.style.background = "rgba(102, 192, 244, 0.12)";
        box.style.border = "1px solid #66c0f4";
        box.style.color = "#c6d4df";
        box.innerHTML = `
            <div style="font-weight:bold; font-size:15px; color:#66c0f4; margin-bottom:6px;"><i class="fa-solid fa-check"></i> 🟢 BİLET GEÇERLİ (KULLANIMA HAZIR)</div>
            <strong>Bilet Kodu:</strong> <code>${code}</code><br>
            <strong>Paket Seviyesi:</strong> Seviye 2 (Ticaret & Steam Bilet Altyapısı)<br>
            <strong>Durum:</strong> Henüz Mühürlenmedi (İlk çalıştırıldığı Discord sunucusuna mühürlenecektir).<br>
            <strong>Mülkiyet:</strong> Ömür Boyu Turnkey (0 TL Aylık Ücret).
        `;
    } else {
        box.style.background = "rgba(164, 208, 7, 0.12)";
        box.style.border = "1px solid #a4d007";
        box.style.color = "#d2efa4";
        box.innerHTML = `
            <div style="font-weight:bold; font-size:15px; color:#a4d007; margin-bottom:6px;"><i class="fa-solid fa-shield-check"></i> 🛡️ BİLET AKTİF & MÜHÜRLÜ (KORUMA ALTINDA)</div>
            <strong>Bilet Kodu:</strong> <code>${code}</code><br>
            <strong>Mühürlü Sunucu:</strong> Guild ID: <code>5555 (Mert Gaming)</code><br>
            <strong>Kriptografik İmza:</strong> HMAC-SHA256 Doğrulandı<br>
            <strong>Klonlama Koruması:</strong> Aktif (Başka sunucularda çalıştırılamaz).
        `;
    }
}

// 7. Interactive Mobile Command Center (Telegram Synapse Simulator)
function triggerTgAction(action) {
    const responseBox = document.getElementById('tgDynamicResponse');
    const chatBody = document.getElementById('tgChatBody');
    if (!responseBox) return;

    let responseHtml = "";
    if (action === 'stock') {
        responseHtml = `
            <div class="tg-reply-bubble">
                <strong>📦 [Telegram Otopilot] Güncel Depo Stoğu:</strong><br>
                • Steam Random Key VIP: <strong>42 Adet</strong><br>
                • CS2 Skin Kasa Anahtarı: <strong>18 Adet</strong><br>
                • Durum: <em>Stoklar yeterli, otomatik satış kesintisiz devam ediyor.</em>
                <div class="tg-bubble-meta">Şimdi ✓✓</div>
            </div>
        `;
        showToast("📦 Cepte Yönetim: Stok bilgisi Telegram ekranında gösterildi!");
    } else if (action === 'report') {
        responseHtml = `
            <div class="tg-reply-bubble">
                <strong>📊 [Telegram Kasa Raporu - Son 24 Saat]:</strong><br>
                • Toplam Başarılı Sipariş: <strong>14 Adet</strong><br>
                • Toplam Hacim: <strong>3.450 TL</strong><br>
                • En Çok Satan: Steam Random Key VIP<br>
                • İade / İtiraz: <strong>0 Adet</strong> (%100 Başarı)
                <div class="tg-bubble-meta">Şimdi ✓✓</div>
            </div>
        `;
        showToast("📊 24 Saatlik Kasa Raporu Telegram ekranında görüntülendi!");
    } else if (action === 'mute') {
        responseHtml = `
            <div class="tg-reply-bubble" style="background:rgba(239, 68, 68, 0.15); border-color:rgba(239, 68, 68, 0.35); color:#fca5a5;">
                <strong>🔇 [Discord Otopilot Eylemi]:</strong><br>
                Kullanıcı <code>SpammerGuy</code> Discord sunucunuzda <strong>10 dakika susturuldu</strong>.<br>
                Tüm kanallarda yazma yetkisi geçici olarak alındı.
                <div class="tg-bubble-meta">Şimdi ✓✓</div>
            </div>
        `;
        showToast("🔇 Discord Eylemi: Kullanıcı cepten 10 dakika susturuldu!");
    } else if (action === 'kick') {
        responseHtml = `
            <div class="tg-reply-bubble" style="background:rgba(239, 68, 68, 0.2); border-color:#ef4444; color:#fca5a5;">
                <strong>🔨 [Discord Otopilot Eylemi]:</strong><br>
                Kullanıcı <code>SpammerGuy</code> <strong>Discord sunucusundan atıldı</strong>.<br>
                Paylaştığı reklam/phishing mesajları tüm kanallardan temizlendi.
                <div class="tg-bubble-meta">Şimdi ✓✓</div>
            </div>
        `;
        showToast("🔨 Discord Eylemi: Kullanıcı cepten sunucudan atıldı!");
    } else if (action === 'ok') {
        responseHtml = `
            <div class="tg-reply-bubble" style="background:rgba(100, 181, 246, 0.15); border-color:rgba(100, 181, 246, 0.3); color:#bbdefb;">
                <strong>✅ [Telegram Otopilot]:</strong> Tehdit ihbarı kapatıldı ve loglara arşivlendi.
                <div class="tg-bubble-meta">Şimdi ✓✓</div>
            </div>
        `;
        showToast("✅ Tehdit onaylandı ve kapatıldı.");
    } else if (action === 'close_ticket') {
        responseHtml = `
            <div class="tg-reply-bubble" style="background:rgba(245, 158, 11, 0.15); border-color:rgba(245, 158, 11, 0.35); color:#fde68a;">
                <strong>🔒 [Discord Otopilot Eylemi]:</strong><br>
                <code>#TK-4912</code> bilet kanalı kapatıldı.<br>
                📄 <strong>HTML Bilet Transkripti</strong> SQLite veritabanına ve web paneline arşivlendi.
                <div class="tg-bubble-meta">Şimdi ✓✓</div>
            </div>
        `;
        showToast("🔒 Discord Eylemi: Bilet cepten kapatıldı ve transkript arşivlendi!");
    }

    responseBox.innerHTML = responseHtml;
    if (chatBody) {
        setTimeout(() => {
            chatBody.scrollTop = chatBody.scrollHeight;
        }, 50);
    }
}


