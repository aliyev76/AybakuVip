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

    let userSelections = {
        privilege: null,
        privilegeKey: null
    };

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
        }, 30); // 30ms * 100 = 3000ms = 3s
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
        // Case-insensitive check for "Ukala"
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

    // --- Step 6: Privilege Selection ---
    window.goToFinalStep = function () {
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
        userSelections.privilegeKey = val; // Store key for final logic

        // Populate Summary
        const summaryPrivilege = document.getElementById('summary-privilege');
        if (summaryPrivilege) {
            summaryPrivilege.textContent = userSelections.privilege;
        }

        nextStep(7);
    }

    // --- Step 7: Final Confirmation ---
    buttons.finish.addEventListener('click', () => {
        finalizeForm();
    });

    function finalizeForm() {
        // Prepare success message based on selection
        const msgEl = document.getElementById('success-privilege-msg');

        let text = "Seçtiğiniz ayrıcalık hemen devreye girmiştir.";
        if (userSelections.privilegeKey === 'platinum') {
            text += " 'Özel Kart'ınızın kullanımı için, <strong>Elnur</strong> en kısa sürede sizinle iletişime geçecektir.";
        }

        msgEl.innerHTML = text; // Use innerHTML to handle bold tag

        Object.values(screens).forEach(el => el.classList.add('hidden'));
        screens.success.classList.remove('hidden');
    }

    // Enter key support
    inputs.accessCode.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') buttons.checkAccess.click();
    });

});
