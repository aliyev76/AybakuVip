document.addEventListener('DOMContentLoaded', () => {
    
    // --- State & DOM Elements ---
    const screens = {
        loading: document.getElementById('loading-screen'),
        step0: document.getElementById('step-0'),
        step1: document.getElementById('step-1'),
        step2: document.getElementById('step-2'),
        step3: document.getElementById('step-3'),
        step4: document.getElementById('step-4'),
        success: document.getElementById('success-screen')
    };

    const inputs = {
        accessCode: document.getElementById('access-code'),
        finalCode: document.getElementById('final-code')
    };

    const buttons = {
        checkAccess: document.getElementById('btn-check-access'),
        finish: document.getElementById('btn-finish')
    };

    const errors = {
        msg0: document.getElementById('error-msg-0'),
        msg4: document.getElementById('error-msg-4')
    };

    let selection = null;

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
    window.nextStep = function(stepNumber) {
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
            // Show success animation or small loading? Prompt says: "Giriş Başarılı... Yükleniyor..."
            // I'll do a quick fake alert/toast style or just proceed. 
            // Let's just proceed immediately but change text briefly.
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

    // --- Step 1: Modesty Check ---
    window.handleModesty = function() {
        alert("Gerekli Mütevazılık Not Edildi.");
        nextStep(2);
    }

    // --- Step 3: Selection ---
    window.goToSummary = function() {
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
        
        selection = labels[val];
        document.getElementById('selected-privilege-display').textContent = selection;
        
        nextStep(4);
    }

    // --- Step 4: Final Verification ---
    buttons.finish.addEventListener('click', () => {
        const val = inputs.finalCode.value.trim();
        // Check for "Seninle"
        if (val.toLowerCase() === 'seninle') {
            errors.msg4.classList.add('hidden');
            finalizeForm();
        } else {
            errors.msg4.classList.remove('hidden');
        }
    });

    function finalizeForm() {
        // Prepare success message based on selection
        const radioVal = document.querySelector('input[name="privilege"]:checked').value;
        const msgEl = document.getElementById('success-privilege-msg');
        
        let text = "Seçtiğiniz ayrıcalık hemen devreye girmiştir.";
        if (radioVal === 'platinum') {
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
