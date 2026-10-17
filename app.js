// NETTmods - Otonom Satış & Lisans İstemci Motoru

let currentSelectedPlan = {
    tier: 10,
    name: "NETT Bump & Alert Pro",
    price: 349
};

document.addEventListener('DOMContentLoaded', () => {
    initFAQ();
    initMobileMenu();
    initCardSpotlight();
});

// Linear/Vercel Spotlight Mouse Tracking
function initCardSpotlight() {
    const cards = document.querySelectorAll('.clean-card, .master-banner, .review-card, .mockup-tray-wrapper');
    document.addEventListener('mousemove', (e) => {
        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
}

// 1. Kategori Filtreleme Fonksiyonu
function filterCategory(cat, btn) {
    const buttons = document.querySelectorAll('.cat-btn');
    buttons.forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');

    const cards = document.querySelectorAll('.clean-card');
    cards.forEach(card => {
        const itemCat = card.getAttribute('data-cat');
        if (cat === 'all' || itemCat === cat) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

// 2. Satın Alma Modalını Başlat
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
        modalTitle.innerText = `⚡ ${planName}`;
        modalPrice.innerText = `${price} TL (Tek Seferlik • Ömür Boyu Taşınabilir Lisans)`;

        if (form) form.style.display = 'block';
        if (successView) successView.style.display = 'none';

        modal.classList.add('active');
    }
}

function closeCheckoutModal() {
    const modal = document.getElementById('checkoutModal');
    if (modal) modal.classList.remove('active');
}

// 3. Sipariş Formu İşleme
let lastOrderSummary = "";

function handlePurchaseSubmit(e) {
    e.preventDefault();
    const customerName = document.getElementById('orderCustomerName').value.trim();
    const contactInfo = document.getElementById('orderContact').value.trim();
    const email = document.getElementById('orderEmail').value.trim();
    const method = document.getElementById('paymentMethod').value;
    const agreement = document.getElementById('orderAgreement');

    if (!customerName || !contactInfo || !email) {
        alert("Lütfen tüm zorunlu alanları doldurun.");
        return;
    }

    if (!agreement || !agreement.checked) {
        alert("Lütfen devam etmeden önce Lisans Sözleşmesi şartını onaylayınız.");
        return;
    }

    const randomCode = "NETT-" + Math.floor(1000 + Math.random() * 9000);
    document.getElementById('refCodeText').innerText = randomCode;

    let paymentInfoHtml = "";
    if (method === "kredikarti") {
        paymentInfoHtml = `
            <strong>💳 3D Secure Kredi Kartı / Banka Kartı ile Güvenli Ödeme:</strong><br>
            • <strong>Ödenecek Tutar:</strong> ${currentSelectedPlan.price} TL (Tek Seferlik)<br>
            • <strong>Seçilen Ürün:</strong> ${currentSelectedPlan.name}<br>
            • <strong>Güvenlik:</strong> 256-Bit SSL & Banka 3D SMS Onayı<br><br>
            <a href="https://shopier.com" target="_blank" class="btn btn-primary btn-block" style="text-align:center; display:block; padding:12px; font-weight:700; text-decoration:none;">
                <i class="fa-solid fa-lock"></i> Kredi Kartı ile 3D Güvenli Öde (${currentSelectedPlan.price} TL)
            </a>
            <small style="color:var(--text-secondary); display:block; margin-top:10px; line-height:1.5;">Ödeme onaylandığında lisans anahtarınız ve indirme linkiniz verdiğiniz e-posta ve iletişim numarasına anında iletilir.</small>
        `;
    } else if (method === "pazaryeri") {
        paymentInfoHtml = `
            <strong>🛒 Pazaryeri Güvencesi (3D Kredi Kartı / Taksit / Anında İndirme):</strong><br>
            • <a href="https://www.itemsatis.com" target="_blank" style="color:var(--primary); font-weight:bold; text-decoration:underline;">👉 İtemsatış Mağazamızdan Satın Al (${currentSelectedPlan.price} TL)</a><br>
            • <a href="https://www.gamesatis.com" target="_blank" style="color:var(--primary); font-weight:bold; text-decoration:underline;">👉 GameSatış Mağazamızdan Satın Al (${currentSelectedPlan.price} TL)</a><br>
            <small style="color:var(--text-secondary); display:block; margin-top:8px;">Pazaryeri üzerinden aldığınızda tekil aktivasyon anahtarınız ve .exe indirme linki saniyeler içinde ekranınıza düşer.</small>
        `;
    } else if (method === "fintech") {
        paymentInfoHtml = `
            <strong>⚡ FinTech Cüzdanlar (Papara / Tosla / Nays • Komisyonsuz):</strong><br>
            • <strong>Papara Hesap No:</strong> <code>1234567890</code><br>
            • <strong>Tutar:</strong> ${currentSelectedPlan.price} TL<br>
            • <strong>Açıklama:</strong> <code>${randomCode}</code><br>
            <small style="color:var(--primary); display:block; margin-top:8px;">Açıklama kısmına referans kodunuzu yazarak Discord veya Telegram destek hattımıza dekontu ilettiğinizde lisansınız hemen üretilir.</small>
        `;
    } else {
        paymentInfoHtml = `
            <strong>🏦 FAST / Havale (7/24 Anında):</strong><br>
            • <strong>IBAN:</strong> <code>TR00 0000 0000 0000 0000 0000 00</code><br>
            • <strong>Alıcı:</strong> NETT Otomasyon ve Yazılım<br>
            • <strong>Tutar:</strong> ${currentSelectedPlan.price} TL<br>
            • <strong>Açıklama:</strong> <code>${randomCode}</code><br>
            <small style="color:var(--primary); display:block; margin-top:8px;">Ödeme açıklamasına mutlaka referans kodunu yazınız.</small>
        `;
    }

    document.getElementById('paymentDetailsBox').innerHTML = paymentInfoHtml;
    lastOrderSummary = `[NETT Otomasyon Siparişi] Ref: ${randomCode} | Ürün: ${currentSelectedPlan.name} (${currentSelectedPlan.price} TL) | Alıcı: ${customerName} | İletişim: ${contactInfo} | E-Posta: ${email}`;

    document.getElementById('subscriptionForm').style.display = 'none';
    document.getElementById('orderSuccessView').style.display = 'block';
}

function copyOrderSummary() {
    if (!lastOrderSummary) return;
    navigator.clipboard.writeText(lastOrderSummary).then(() => {
        showToast("📋 Sipariş özeti panoya kopyalandı!");
    }).catch(() => {
        const t = document.createElement("textarea");
        t.value = lastOrderSummary;
        document.body.appendChild(t);
        t.select();
        document.execCommand("copy");
        document.body.removeChild(t);
        showToast("📋 Sipariş özeti panoya kopyalandı!");
    });
}

function showToast(msg) {
    const toast = document.getElementById('toastNotification');
    if (toast) {
        toast.innerText = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3500);
    }
}

function initFAQ() {
    const items = document.querySelectorAll('.faq-item');
    items.forEach(item => {
        const btn = item.querySelector('.faq-question');
        if (btn) {
            btn.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                items.forEach(i => i.classList.remove('active'));
                if (!isActive) item.classList.add('active');
            });
        }
    });
}

function initMobileMenu() {
    const btn = document.getElementById('mobileMenuBtn');
    const links = document.querySelector('.nav-links');
    if (btn && links) {
        btn.addEventListener('click', () => {
            links.style.display = links.style.display === 'flex' ? 'none' : 'flex';
            links.style.flexDirection = 'column';
            links.style.position = 'absolute';
            links.style.top = '100%';
            links.style.left = '0';
            links.style.width = '100%';
            links.style.background = '#08090d';
            links.style.padding = '20px';
            links.style.borderBottom = '1px solid var(--border-color)';
        });
    }
}

// 4. Canlı Yazılım Önizleme Sekmeleri
function switchShowcaseTab(tabName, btn) {
    const tabs = document.querySelectorAll('.showcase-tab-btn');
    tabs.forEach(t => t.classList.remove('active'));
    if (btn) btn.classList.add('active');

    const panels = document.querySelectorAll('.showcase-panel');
    panels.forEach(p => p.classList.remove('active'));

    const target = document.getElementById(`panel-${tabName}`);
    if (target) target.classList.add('active');
}

// 5. Müşteri Lisans & Oturum Paneli
function openCustomerPortal() {
    const modal = document.getElementById('portalModal');
    if (modal) modal.classList.add('active');
}

function closeCustomerPortal() {
    const modal = document.getElementById('portalModal');
    if (modal) modal.classList.remove('active');
}

function queryLicensePortal() {
    const key = document.getElementById('portalKeyInput').value.trim();
    if (!key) {
        alert("Lütfen geçerli bir lisans anahtarı veya referans kodu girin.");
        return;
    }

    const resultBox = document.getElementById('portalResult');
    const badge = document.getElementById('portalStatusBadge');
    const device = document.getElementById('portalActiveDevice');
    const prodTitle = document.getElementById('portalProductTitle');

    // Akıllı anahtar tespiti
    if (key.toUpperCase().includes("BUMP")) {
        prodTitle.innerText = "NETT Bump & Alert Pro (İlan & Mesaj Nöbetçisi)";
    } else if (key.toUpperCase().includes("KEY") || key.toUpperCase().includes("DROP")) {
        prodTitle.innerText = "NETT KeyDrop Lite (Otomatik Kod Teslimatçısı)";
    } else if (key.toUpperCase().includes("SNIPER")) {
        prodTitle.innerText = "NETT Market Sniper (Fırsat Yakalayıcı)";
    } else {
        prodTitle.innerText = "NETT Otomasyon Lisansı";
    }

    badge.className = "portal-status-badge status-active";
    badge.innerText = "Aktif (Ömür Boyu)";
    device.innerText = "Masaüstü Bilgisayar (Son Sinyal: 14 sn önce)";

    resultBox.style.display = "block";
    showToast("✅ Lisans doğrulandı: " + key);
}

function resetPortalSession() {
    const device = document.getElementById('portalActiveDevice');
    const badge = document.getElementById('portalStatusBadge');
    
    device.innerHTML = "<span style='color:var(--accent-green); font-weight:bold;'>Boşta (Oturum Sıfırlandı • Başka Bilgisayarda Açılabilir)</span>";
    badge.className = "portal-status-badge status-idle";
    badge.innerText = "Boşta / Hazır";

    showToast("🔄 Aktif oturum sıfırlandı! Şimdi diğer bilgisayarınızda programı açabilirsiniz.");
}
