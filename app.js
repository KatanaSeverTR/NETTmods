// NETTmods - E-Commerce & Subscription Client Logic

let currentSelectedPlan = {
    tier: 2,
    name: "Ticaret & Bilet",
    price: 650
};
let isAnnualBilling = false;

document.addEventListener('DOMContentLoaded', () => {
    initBillingToggle();
    initFAQ();
    initMobileMenu();
});

// 1. Monthly / Annual Billing Toggle (%20 Discount)
function initBillingToggle() {
    const toggle = document.getElementById('billingToggle');
    const priceElements = document.querySelectorAll('.price-val');
    const annualNotes = document.querySelectorAll('.annual-note');

    if (!toggle) return;

    toggle.addEventListener('change', () => {
        isAnnualBilling = toggle.checked;

        priceElements.forEach(el => {
            const monthly = el.getAttribute('data-monthly');
            const annual = el.getAttribute('data-annual');
            el.innerText = isAnnualBilling ? annual : monthly;
        });

        annualNotes.forEach(el => {
            el.style.display = isAnnualBilling ? 'block' : 'none';
        });
    });
}

// 2. Open Subscription Modal
function startSubscription(tier, planName) {
    currentSelectedPlan.tier = tier;
    currentSelectedPlan.name = planName;

    const basePrice = tier === 1 ? 400 : (tier === 2 ? 650 : 950);
    const finalPrice = isAnnualBilling ? Math.round(basePrice * 0.8) : basePrice;
    const period = isAnnualBilling ? "TL / ay (Yıllık)" : "TL / ay";

    currentSelectedPlan.price = finalPrice;

    const modal = document.getElementById('checkoutModal');
    const modalTitle = document.getElementById('modalPlanTitle');
    const modalPrice = document.getElementById('modalPlanPrice');
    const form = document.getElementById('subscriptionForm');
    const successView = document.getElementById('orderSuccessView');

    if (modal && modalTitle && modalPrice) {
        modalTitle.innerText = `Seviye ${tier}: ${planName}`;
        modalPrice.innerText = `${finalPrice} ${period}`;
        
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

// 3. Handle Subscription Form Submission
function handleSubscriptionSubmit(e) {
    e.preventDefault();
    const guildId = document.getElementById('orderGuildId').value.trim();
    const discordUser = document.getElementById('orderDiscordUser').value.trim();
    const method = document.getElementById('paymentMethod').value;

    if (!guildId || !discordUser) {
        alert("Lütfen tüm zorunlu alanları doldurun.");
        return;
    }

    // Generate random reference code
    const randomCode = "NETT-" + Math.floor(1000 + Math.random() * 9000);
    document.getElementById('refCodeText').innerText = randomCode;

    let paymentInfoHtml = "";
    if (method === "pazaryeri") {
        paymentInfoHtml = `
            <strong>🛒 Pazaryeri Güvencesi (Kredi Kartı / Taksit):</strong><br>
            Banka hesabı veya şirket olmadan, 3D Secure kredi kartı ve taksitle güvenli satın alma bağlantılarımız:<br>
            • <a href="https://www.itemsatis.com" target="_blank" style="color:var(--primary); font-weight:bold; text-decoration:underline;">👉 İtemsatış Mağazamızdan Satın Al (${currentSelectedPlan.price} TL)</a><br>
            • <a href="https://www.gamesatis.com" target="_blank" style="color:var(--primary); font-weight:bold; text-decoration:underline;">👉 GameSatış Mağazamızdan Satın Al (${currentSelectedPlan.price} TL)</a><br>
            • <a href="https://www.bynogame.com" target="_blank" style="color:var(--primary); font-weight:bold; text-decoration:underline;">👉 ByNoGame Mağazamızdan Satın Al (${currentSelectedPlan.price} TL)</a><br>
            <small style="color:var(--text-secondary); display:block; margin-top:6px;">Satın aldıktan sonra platformdaki Sipariş Numaranızı Discord sipariş masanıza veya destek biletinize iletmeniz yeterlidir. Bot anında lisanslanır.</small>
        `;
    } else if (method === "fintech") {
        paymentInfoHtml = `
            <strong>⚡ FinTech & Ön Ödemeli Kartlar (Sıfır Komisyon):</strong><br>
            Genç ve kolay transfer cüzdanları ile 7/24 anında ödeme:<br>
            • <strong>Papara No:</strong> <code>1234567890</code><br>
            • <strong>Tosla No / IBAN:</strong> <code>TR00 0000 0000 0000 0000 00</code><br>
            • <strong>Nays / Paycell / FUPS:</strong> <code>0555 000 00 00</code><br>
            • <strong>Tutar:</strong> ${currentSelectedPlan.price} TL<br>
            • <strong>Açıklama:</strong> <code>${randomCode}</code><br>
            <small style="color:var(--primary); display:block; margin-top:6px;">Açıklama kısmına <strong>${randomCode}</strong> referans kodunuzu yazınız. Ödeme anında yetkili ekranına düşer.</small>
        `;
    } else if (method === "havale") {
        paymentInfoHtml = `
            <strong>🏦 Banka / FAST / Havale (7/24 Anında Aktivasyon):</strong><br>
            Tüm bankalardan saniyeler içinde masrafsız FAST transferi:<br>
            • <strong>IBAN:</strong> <code>TR00 0000 0000 0000 0000 0000 00</code><br>
            • <strong>Alıcı:</strong> NETTmods Altyapı Yönetimi<br>
            • <strong>Tutar:</strong> ${currentSelectedPlan.price} TL<br>
            • <strong>Açıklama:</strong> <code>${randomCode} (${guildId})</code><br>
            <small style="color:var(--primary); display:block; margin-top:6px;">Ödeme açıklamasına mutlaka referans kodunu yazınız. Lisansınız 2 dakikada otomatik onaylanır.</small>
        `;
    } else {
        paymentInfoHtml = `
            <strong>💎 Kripto Para (Sıfır Kesinti & Düşük Ağ Ücreti):</strong><br>
            Kuruş düzeyinde transfer ücreti ile küresel ödeme:<br>
            • <strong>USDT (TRC-20):</strong> <code>TXXXXXXXXXXXXXXXXXXXXXXXXXXXXX</code> ($${Math.round(currentSelectedPlan.price / 35)} USDT)<br>
            • <strong>USDT (BEP-20 / BSC):</strong> <code>0xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX</code> ($${Math.round(currentSelectedPlan.price / 35)} USDT)<br>
            • <strong>Litecoin (LTC):</strong> <code>ltc1qxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</code> (~${(currentSelectedPlan.price / 35 / 75).toFixed(3)} LTC)<br>
            <small style="color:var(--primary); display:block; margin-top:6px;">Ağ transferi onaylandıktan sonra TXID kodunu canlı destek biletinize iletiniz.</small>
        `;
    }

    document.getElementById('paymentDetailsBox').innerHTML = paymentInfoHtml;

    // Save order summary for 1-click clipboard copy
    lastOrderSummary = `[NETTmods Sipariş] Referans: ${randomCode} | Paket: ${currentSelectedPlan.name} (${currentSelectedPlan.price} TL) | Sunucu ID: ${guildId} | Kullanıcı: ${discordUser}`;

    // Show success view
    document.getElementById('subscriptionForm').style.display = 'none';
    document.getElementById('orderSuccessView').style.display = 'block';
}

let lastOrderSummary = "";

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

// 4. Free Trial Modal
function openTrialModal() {
    const modal = document.getElementById('trialModal');
    if (modal) modal.classList.add('active');
}

function closeTrialModal() {
    const modal = document.getElementById('trialModal');
    if (modal) modal.classList.remove('active');
}

// 5. Guvenilir Lisans Sorgulama Ekrani
function checkLicense() {
    const input = document.getElementById('guildIdInput');
    const resultBox = document.getElementById('licenseResult');
    const guildId = input.value.trim();

    if (!guildId || !/^-?[0-9]{9,20}$/.test(guildId)) {
        showToast("⚠️ Lütfen geçerli bir Discord Sunucu (18-19 hane) veya Telegram Grup ID (-100...) girin.");
        return;
    }

    resultBox.style.display = 'block';
    resultBox.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
            <div>
                <h4 style="color:var(--text-primary); margin-bottom:4px;">Sunucu / Grup Kimliği: <code>${guildId}</code></h4>
                <p style="color:var(--primary); font-size:13px;">🔒 <strong>Güvenlik Kalkanı:</strong> Canlı lisans verileri üçüncü kişilere karşı gizlilik protokolüyle korunmaktadır.</p>
                <p style="color:var(--text-secondary); font-size:12px;">Discord'da <code>!lisans-bilgi</code>, Telegram grubunuzda <code>/id</code> veya <code>/kurulum</code> komutunu kullanarak anlık sürenizi görebilirsiniz.</p>
            </div>
            <a href="#paketler" class="btn btn-primary btn-sm">Paket Seç / Yenile</a>
        </div>
    `;
}

// 6. FAQ Accordion Logic
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        questionBtn.addEventListener('click', () => {
            const isOpen = item.classList.contains('active');
            faqItems.forEach(i => i.classList.remove('active'));
            if (!isOpen) {
                item.classList.add('active');
            }
        });
    });
}

// 7. Mobile Menu
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
    const trial = document.getElementById('trialModal');
    if (e.target === checkout) closeCheckoutModal();
    if (e.target === trial) closeTrialModal();
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

// 8. Interactive Web Dashboard Simulation & State
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

    // Update live status pill
    const statusEl = document.getElementById('dashLiveStatus');
    if (statusEl) {
        statusEl.innerText = "Ayarlar Kaydedildi (Bulut Senkronize ⚡)";
        setTimeout(() => {
            statusEl.innerText = "Canlı Bağlantı: Shard #01";
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
                    <div class="text">Merhaba, sunucumuzda Leetspeak filtresini Seviye 3'e yükselttik, ancak özel bir rolü muaf tutmak istiyoruz.</div>
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

