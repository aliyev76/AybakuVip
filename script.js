document.addEventListener('DOMContentLoaded', () => {

    // --- State & DOM Elements ---
    const screens = {
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

    // Feedback Toast Elements
    const feedbackToast = document.getElementById('feedback-toast');
    const feedbackText = document.getElementById('feedback-text');

    let userSelections = {
        privilege: null,
        privilegeKey: null
    };

    // --- Feedback Helper ---
    function showFeedback(message, callback) {
        feedbackText.textContent = message;
        feedbackToast.classList.remove('hidden');

        setTimeout(() => {
            feedbackToast.classList.add('hidden');
            if (callback) callback();
        }, 2000); // Show for 2 seconds
    }

    // --- Loading Sequence ---
    startLoading();

    function startLoading() {
        // Simulate progress bar
        const bar = document.querySelector('.progress-fill');
        let width = 0;
        const interval = setInterval(() => {
            if (width >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    screens.loading.classList.add('hidden');
                    screens.step0.classList.remove('hidden');
                }, 500);
            } else {
                width++;
                bar.style.width = width + '%';
            }
        }, 30);
    }

    // --- Navigation Helpers ---
    window.nextStep = function (stepNumber) {
        // Hide all screens
        Object.values(screens).forEach(el => el.classList.add('hidden'));

        // Show target
        if (screens[`step${stepNumber}`]) {
            screens[`step${stepNumber}`].classList.remove('hidden');
        }
    }

    // --- Step 0: Access Verification ---
    buttons.checkAccess.addEventListener('click', () => {
        const val = inputs.accessCode.value.trim();
        if (val.toLowerCase() === 'ukala') {
            errors.msg0.classList.add('hidden');
            buttons.checkAccess.textContent = "Giriş Başarılı...";
            buttons.checkAccess.style.background = "#4CAF50";
            setTimeout(() => {
                nextStep(1);
            }, 800);
        } else {
            errors.msg0.classList.remove('hidden');
            buttons.checkAccess.classList.add('shake');
            setTimeout(() => buttons.checkAccess.classList.remove('shake'), 500);
        }
    });

    // --- Step 1: Visual Assessment ---
    window.handleStep1 = function (choice) {
        let msg = "";
        if (choice === 'yes') {
            msg = "Veritabanımız, Yönetici'nin ilk kayıt sırasındaki şaşkınlığını teyit ediyor. ✅";
        } else {
            msg = "Yönetici Notu: Zeka tartışılmaz, ancak ilk etki için görsel veri baskındır. 😉";
        }
        showFeedback(msg, () => nextStep(2));
    }
    // Update HTML buttons to call handleStep1

    document.querySelector('#step-1 .btn-primary').onclick = () => handleStep1('yes');
    document.querySelector('#step-1 .btn-secondary').onclick = () => handleStep1('no');


    // --- Step 2: Location Analysis (Validation) ---
    window.handleStep2 = function () {
        const selected = document.querySelector('input[name="location_joke"]:checked');
        if (!selected) { alert("Bir seçenek belirleyiniz."); return; }

        const val = selected.value;
        if (val === 'minibus') {
            showFeedback("Doğru. Yönetici, o yolculuğun travmasını hala yaşıyor. 😅", () => nextStep(3));
        } else {
            showFeedback("Hayır. O kadar medeni bir taşıma aracı değildi. Lütfen tekrar düşünün!", null); // No callback = stay
        }
    }
    document.querySelector('#step-2 button').onclick = handleStep2;


    // --- Step 3: Intellectual Interaction ---
    window.handleStep3 = function () {
        // Just proceed, text is optional
        showFeedback("Girişiniz kaydedildi. O dersin konusunu sonsuza dek unutmuş olabiliriz. 😂", () => nextStep(4));
    }
    document.querySelector('#step-3 button').onclick = handleStep3;


    // --- Step 4: Competition Analysis (Validation) ---
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
    document.querySelector('#step-4 button').onclick = handleStep4;


    // --- Step 5: Relationship Dynamics ---
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
    document.querySelector('#step-5 button').onclick = handleStep5;


    // --- Step 6: Privilege Selection ---
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

        userSelections.privilege = labels[val];
        userSelections.privilegeKey = val;

        const summaryPrivilege = document.getElementById('summary-privilege');
        if (summaryPrivilege) {
            summaryPrivilege.textContent = userSelections.privilege;
        }

        let msg = "";
        if (val === 'platinum') {
            msg = "En cesur seçim! Yönetici'nin zamanını resmen talep ettiniz. 😎";
        } else {
            msg = "Zarif bir seçim. Unutmayın, üst seviyeler her zaman daha fazla maceradır. 🥂";
        }

        showFeedback(msg, () => nextStep(7));
    }
    document.querySelector('#step-6 button').onclick = handleStep6;


    // --- Step 7: Final Confirmation ---
    buttons.finish.addEventListener('click', () => {
        finalizeForm();
    });

    function finalizeForm() {
        const msgEl = document.getElementById('success-privilege-msg');
        let text = "Seçtiğiniz ayrıcalık hemen devreye girmiştir.";
        if (userSelections.privilegeKey === 'platinum') {
            text += " 'Özel Kart'ınızın kullanımı için, <strong>Elnur</strong> en kısa sürede sizinle iletişime geçecektir.";
        }
        msgEl.innerHTML = text;

        Object.values(screens).forEach(el => el.classList.add('hidden'));
        screens.success.classList.remove('hidden');
    }

    // Enter key support
    inputs.accessCode.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') buttons.checkAccess.click();
    });

});
