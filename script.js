// Expose functions to global scope for HTML onclick access
window.handleStep1 = function (choice) {
    let msg = "";
    if (choice === 'yes') {
        msg = "Veritabanımız, Yönetici'nin ilk kayıt sırasındaki şaşkınlığını teyit ediyor. ✅";
    } else {
        msg = "Yönetici Notu: Zeka tartışılmaz, ancak ilk etki için görsel veri baskındır. 😉";
    }
    showFeedback(msg, () => nextStep(2));
}

window.handleStep2 = function () {
    const selected = document.querySelector('input[name="location_joke"]:checked');
    if (!selected) { alert("Bir seçenek belirleyiniz."); return; }

    const val = selected.value;
    if (val === 'minibus') {
        showFeedback("Doğru. Yönetici, o yolculuğun travmasını hala yaşıyor. 😅", () => nextStep(3));
    } else {
        showFeedback("Hayır. O kadar medeni bir taşıma aracı değildi. Lütfen tekrar düşünün!", null);
    }
}

window.handleStep3 = function () {
    showFeedback("Girişiniz kaydedildi. O anıları ikimiz de unutmayacağız.", () => nextStep(4));
}

window.handleStep4 = function () {
    const selected = document.querySelector('input[name="game_joke"]:checked');
    if (!selected) { alert("Bir seçenek belirleyiniz."); return; }

    const val = selected.value;
    if (val === 'team') {
        showFeedback("Kesinlikle doğru. Yönetici'yi yenmenin tek yolu onunla aynı takımda olmaktır. 🤝", () => nextStep(5));
    } else {
        showFeedback("Hatalı. Yöneticinin galibiyet serisi bu kadar kolay bozulamaz. Tekrar deneyin.", null);
    }
}

window.handleStep5 = function () {
    const selected = document.querySelector('input[name="bullying_reason"]:checked');
    if (!selected) { alert("Bir seçenek belirleyiniz."); return; }

    const val = selected.value;
    let msg = "";
    if (val === 'love') {
        msg = "Tebrikler. Formun en duygusal sorusunu yanıtladınız. ❤️";
    } else if (val === 'bully') {
        msg = "Yönetici'nin itirazı var! Amacının sadece ilgi çekmek olduğunu belirtiyor. 😉";
    } else {
        msg = "Kısmen doğru, ama asıl motivasyon daha derinde. İlerleyebiliriz.";
    }
    showFeedback(msg, () => nextStep(6));
}

window.handleStep6 = function () {
    const selectedOption = document.querySelector('input[name="privilege"]:checked');
    if (!selectedOption) {
        alert("Lütfen bir ayrıcalık seçiniz.");
        return;
    }

    const val = selectedOption.value;
    const labels = {
        silver: "Gümüş Üyelik (Sınırsız Kahve/Çay)",
        gold: "Altın Üyelik (Study Date Garantisi)",
        platinum: "Platinum Kalp Üyeliği (Özel Kart)"
    };

    // Store in global or closure if needed, but for now we put it in a global var or similar logic
    window.userSelections = window.userSelections || {};
    window.userSelections.privilege = labels[val];
    window.userSelections.privilegeKey = val;

    const summaryPrivilege = document.getElementById('summary-privilege');
    if (summaryPrivilege) {
        summaryPrivilege.textContent = window.userSelections.privilege;
    }

    let msg = "";
    if (val === 'platinum') {
        msg = "En cesur seçim! Yönetici'nin zamanını resmen talep ettiniz. 😎";
    } else {
        msg = "Zarif bir seçim. Unutmayın, üst seviyeler her zaman daha fazla maceradır. 🥂";
    }

    showFeedback(msg, () => nextStep(7));
}

window.goToFinalStep = window.handleStep6; // Alias if html uses goToFinalStep

// Navigation & Feedback Helpers
window.screens = {}; // Will populate on DOMContentLoaded

window.nextStep = function (stepNumber) {
    // Hide all screens
    Object.values(window.screens).forEach(el => el && el.classList.add('hidden'));

    // Show target
    if (window.screens[`step${stepNumber}`]) {
        window.screens[`step${stepNumber}`].classList.remove('hidden');
    }
}

let feedbackToast, feedbackText;

function showFeedback(message, callback) {
    if (!feedbackToast || !feedbackText) return;

    feedbackText.textContent = message;
    feedbackToast.classList.remove('hidden');

    setTimeout(() => {
        feedbackToast.classList.add('hidden');
        if (callback) callback();
    }, 2000);
}

document.addEventListener('DOMContentLoaded', () => {

    // Populate cache
    window.screens = {
        loading: document.getElementById('loading-screen'),
        step0: document.getElementById('step-0'),
        step1: document.getElementById('step-1'),
        step2: document.getElementById('step-2'),
        step3: document.getElementById('step-3'),
        step4: document.getElementById('step-4'),
        step5: document.getElementById('step-5'),
        step6: document.getElementById('step-6'),
        step7: document.getElementById('step-7'),
        success: document.getElementById('success-screen')
    };

    feedbackToast = document.getElementById('feedback-toast');
    feedbackText = document.getElementById('feedback-text');

    const inputs = {
        accessCode: document.getElementById('access-code'),
        step3Memory: document.getElementById('step3-memory')
    };

    const buttons = {
        checkAccess: document.getElementById('btn-check-access'),
        finish: document.getElementById('btn-finish')
    };

    const errors = {
        msg0: document.getElementById('error-msg-0')
    };

    // Global User selections init
    window.userSelections = {
        privilege: null,
        privilegeKey: null
    };

    // Loading Sequence
    startLoading();
    function startLoading() {
        const bar = document.querySelector('.progress-fill');
        let width = 0;
        const interval = setInterval(() => {
            if (width >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    if (window.screens.loading) window.screens.loading.classList.add('hidden');
                    if (window.screens.step0) window.screens.step0.classList.remove('hidden');
                }, 500);
            } else {
                width++;
                if (bar) bar.style.width = width + '%';
            }
        }, 30);
    }

    // Step 0 Logic (Access)
    if (buttons.checkAccess) {
        buttons.checkAccess.addEventListener('click', () => {
            const val = inputs.accessCode.value.trim();
            if (val.toLowerCase() === 'ukala') {
                errors.msg0.classList.add('hidden');
                buttons.checkAccess.textContent = "Giriş Başarılı...";
                buttons.checkAccess.style.background = "#4CAF50";
                setTimeout(() => nextStep(1), 800);
            } else {
                errors.msg0.classList.remove('hidden');
                buttons.checkAccess.classList.add('shake');
                setTimeout(() => buttons.checkAccess.classList.remove('shake'), 500);
            }
        });
    }

    // Step 7 Logic (Final)
    if (buttons.finish) {
        buttons.finish.addEventListener('click', () => {
            finalizeForm();
        });
    }

    // Enter key support
    if (inputs.accessCode) {
        inputs.accessCode.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') buttons.checkAccess.click();
        });
    }

    function finalizeForm() {
        const msgEl = document.getElementById('success-privilege-msg');
        let text = "Seçtiğiniz ayrıcalık hemen devreye girmiştir.";
        if (window.userSelections.privilegeKey === 'platinum') {
            text += " 'Özel Kart'ınızın kullanımı için, <strong>Elnur</strong> en kısa sürede sizinle iletişime geçecektir.";
        }
        if (msgEl) msgEl.innerHTML = text;

        Object.values(window.screens).forEach(el => el && el.classList.add('hidden'));
        if (window.screens.success) window.screens.success.classList.remove('hidden');
    }

});
