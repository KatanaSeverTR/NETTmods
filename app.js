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

    // Show success view
    document.getElementById('subscriptionForm').style.display = 'none';
    document.getElementById('orderSuccessView').style.display = 'block';
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

// 5. License Status Checker Simulation
function checkLicense() {
    const input = document.getElementById('guildIdInput');
    const resultBox = document.getElementById('licenseResult');
    const guildId = input.value.trim();

    if (!guildId || guildId.length < 15) {
        showToast("⚠️ Lütfen geçerli bir Discord Sunucu Kimliği (Guild ID) girin.");
        return;
    }

    resultBox.style.display = 'block';
    resultBox.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center;">
            <div>
                <h4 style="color:var(--text-primary); margin-bottom:4px;">Sunucu Kimliği: <code>${guildId}</code></h4>
                <p style="color:var(--success); font-size:13px;">🟢 Durum: <strong>Aktif Seviye 2 Lisansı</strong> (BaaS Otopilot)</p>
                <p style="color:var(--text-secondary); font-size:12px;">Kalan Süre: 28 Gün • Son Yenileme: 2026-11-15</p>
            </div>
            <a href="#paketler" class="btn btn-card">Yükselt</a>
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
