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
    if (method === "havale") {
        paymentInfoHtml = `
            <strong>Banka / FAST Bilgileri:</strong><br>
            • <strong>IBAN:</strong> TR00 0000 0000 0000 0000 0000 00<br>
            • <strong>Alıcı:</strong> NETTmods Yazılım<br>
            • <strong>Tutar:</strong> ${currentSelectedPlan.price} TL<br>
            • <strong>Açıklama:</strong> ${randomCode} (${guildId})<br>
            <small style="color:var(--primary); display:block; margin-top:6px;">Ödeme açıklamanıza mutlaka referans kodunu yazınız. Lisansınız 2 dakikada otomatik açılır.</small>
        `;
    } else if (method === "shopier") {
        paymentInfoHtml = `
            <strong>Online Kredi Kartı Ödemesi (Shopier):</strong><br>
            Aşağıdaki bağlantıdan 3D Secure ile 7/24 güvenli ödeme yapabilirsiniz:<br>
            <a href="https://shopier.com" target="_blank" style="color:var(--primary); text-decoration:underline; font-weight:bold;">
                👉 Shopier ile Güvenli Öde (${currentSelectedPlan.price} TL)
            </a><br>
            <small>Ödeme sonrası sipariş masamıza bildirim düşer ve bot yetkiniz onaylanır.</small>
        `;
    } else if (method === "papara") {
        paymentInfoHtml = `
            <strong>Papara ile Anında Ödeme:</strong><br>
            • <strong>Papara No:</strong> 1234567890<br>
            • <strong>Tutar:</strong> ${currentSelectedPlan.price} TL<br>
            • <strong>Açıklama:</strong> ${randomCode}
        `;
    } else {
        paymentInfoHtml = `
            <strong>Kripto Para (USDT - TRC20):</strong><br>
            • <strong>Ağ:</strong> TRC-20<br>
            • <strong>Cüzdan:</strong> TXXXXXXXXXXXXXXXXXXXXXXXXXXXXX<br>
            • <strong>Tutar:</strong> $${Math.round(currentSelectedPlan.price / 35)} USDT
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
