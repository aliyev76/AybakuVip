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
        success: document.getElementById('success-screen')
    };

    const inputs = {
        accessCode: document.getElementById('access-code'),
        finalCode: document.getElementById('final-code'),
        step1Feedback: document.getElementById('step1-feedback')
    };

    const buttons = {
        checkAccess: document.getElementById('btn-check-access'),
        finish: document.getElementById('btn-finish')
    };

    const errors = {
        msg0: document.getElementById('error-msg-0'),
        msg5: document.getElementById('error-msg-5')
    };

    const managerNote = document.getElementById('manager-note');

    let userSelections = {
        trait: null,
        privilege: null
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

    // --- Step 2: Visual Validation ---
    window.handleVisualValidation = function () {
        // Show manager note
        managerNote.classList.remove('hidden');

        // Wait 2.5s then go to Step 3
        setTimeout(() => {
            managerNote.classList.add('hidden');
            nextStep(3);
        }, 2500);
    }

    // --- Step 3: Trait Selection ---
    window.saveTraitAndContinue = function () {
        const selectedTrait = document.querySelector('input[name="trait"]:checked');
        if (!selectedTrait) {
            alert("Lütfen sizi en iyi anlatan özelliği seçiniz.");
            return;
        }
        userSelections.trait = selectedTrait.value;
        nextStep(4);
    }

    // --- Step 4 (Old 3): Privilege Selection ---
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
            platinum: "Platinum Kalp (Özel Kart)"
        };

        userSelections.privilege = labels[val];
        userSelections.privilegeKey = val; // Store key for final logic

        // Populate Summary
        document.getElementById('summary-trait').textContent = userSelections.trait;
        document.getElementById('summary-privilege').textContent = userSelections.privilege;

        nextStep(5);
    }

    // --- Step 5: Final Validation ---
    buttons.finish.addEventListener('click', () => {
        const val = inputs.finalCode.value.trim();
        // Check for "Koylu Kızı" (case insensitive)
        if (val.toLowerCase() === 'koylu kızı' || val.toLowerCase() === 'köylü kızı') {
            errors.msg5.classList.add('hidden');
            finalizeForm();
        } else {
            errors.msg5.classList.remove('hidden');
        }
    });

    function finalizeForm() {
        // Prepare success message based on selection
        const msgEl = document.getElementById('success-privilege-msg');

        let text = "Seçtiğiniz ayrıcalık hemen devreye girmiştir.";
        if (userSelections.privilegeKey === 'platinum') {
            text += " 'Özel Kart'ınızın kullanımı için, yönetici (yani ben) en kısa sürede sizinle iletişime geçecektir.";
        }

        msgEl.textContent = text;

        Object.values(screens).forEach(el => el.classList.add('hidden'));
        screens.success.classList.remove('hidden');
    }

    // Enter key support
    inputs.accessCode.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') buttons.checkAccess.click();
    });
    inputs.finalCode.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') buttons.finish.click();
    });

});
