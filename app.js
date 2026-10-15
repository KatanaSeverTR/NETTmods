// NETTmods Interactive Client Scripts

document.addEventListener('DOMContentLoaded', () => {
    initFilters();
    initFAQ();
    initMobileMenu();
});

// 1. Category Filtering Logic
function initFilters() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const productCards = document.querySelectorAll('.product-card');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active from all
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.getAttribute('data-category');

            productCards.forEach(card => {
                if (category === 'all' || card.getAttribute('data-category') === category) {
                    card.style.display = 'flex';
                    card.style.animation = 'fadeIn 0.4s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// 2. FAQ Accordion Logic
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        questionBtn.addEventListener('click', () => {
            const isOpen = item.classList.contains('active');
            
            // Close all items
            faqItems.forEach(i => i.classList.remove('active'));

            // Toggle clicked
            if (!isOpen) {
                item.classList.add('active');
            }
        });
    });
}

// 3. Mobile Menu Toggle
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

// 4. Modal Handlers
function openOrderModal(title, price) {
    const modal = document.getElementById('orderModal');
    const modalTitle = document.getElementById('modalProductTitle');
    const modalPrice = document.getElementById('modalProductPrice');

    if (modal && modalTitle && modalPrice) {
        modalTitle.innerText = title;
        modalPrice.innerText = price;
        modal.classList.add('active');
    }
}

function closeOrderModal() {
    const modal = document.getElementById('orderModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    const modal = document.getElementById('orderModal');
    if (e.target === modal) {
        closeOrderModal();
    }
});

// 5. Toast Notification & Copy
function showToast(message) {
    const toast = document.getElementById('toastNotification');
    if (toast) {
        toast.innerText = message;
        toast.classList.add('active');
        setTimeout(() => {
            toast.classList.remove('active');
        }, 3000);
    }
}

function copyDiscordName() {
    const discordTag = "NETTmods#0001";
    navigator.clipboard.writeText(discordTag).then(() => {
        showToast("✅ Discord kullanıcı adı kopyalandı: " + discordTag);
    }).catch(() => {
        showToast("Discord: NETTmods");
    });
}
