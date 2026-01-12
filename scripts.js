// --- UI State Management ---

/**
 * Toggles the Auth Modal and manages background scroll lock
 * @param {boolean} show - Whether to show or hide the modal
 */
function toggleModal(show) {
    const modal = document.getElementById('auth-modal');
    if (show) {
        modal.classList.remove('hidden');
        document.body.classList.add('modal-open'); // CSS class to block scroll
    } else {
        modal.classList.add('hidden');
        document.body.classList.remove('modal-open');
    }
}

/**
 * Switches between Login and Register tabs in the modal
 * @param {string} type - 'login' or 'register'
 */
function setTab(type) {
    const isReg = type === 'register';
    const regFields = document.getElementById('register-fields');
    const tabLogin = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');
    const submitBtn = document.getElementById('auth-submit-btn');

    regFields.classList.toggle('hidden', !isReg);
    
    // Update Tab UI
    tabLogin.classList.toggle('text-white', !isReg);
    tabLogin.classList.toggle('text-neutral-600', isReg);
    tabRegister.classList.toggle('text-white', isReg);
    tabRegister.classList.toggle('text-neutral-600', !isReg);
    
    submitBtn.innerText = isReg ? 'Create Account' : 'Sign In';
}

// --- Notification System ---

/**
 * Creates and displays a custom glassmorphic toast notification
 * @param {string} msg - The message to display
 */
function notify(msg) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    
    toast.className = 'toast glass border border-white/20 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest mb-3 pointer-events-auto text-white shadow-2xl';
    toast.innerText = msg;
    
    container.appendChild(toast);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

// --- App Logic ---

// 1. Initial Loading Sequence
window.addEventListener('load', () => {
    setTimeout(() => {
        const skeleton = document.getElementById('main-skeleton');
        const content = document.getElementById('hero-content');
        
        if(skeleton) skeleton.classList.add('hidden');
        if(content) {
            content.classList.remove('hidden');
            content.classList.add('animate-[slideUp_0.6s_ease-out]');
        }
        
        notify("AI Engine Ready");
    }, 2500);
});

// 2. File Upload Handling & Premium Upsell Logic
const fileInput = document.getElementById('file-input');
if (fileInput) {
    fileInput.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            notify("Analyzing Starting 11...");
            
            // Artificial delay to simulate AI processing
            setTimeout(() => {
                const userChoice = confirm("AI detected 8+ substitutes. Would you like to upload a second screenshot for a full bench appraisal? (Premium Feature)");
                
                if (userChoice) {
                    notify("Redirecting to Premium Auth...");
                    toggleModal(true);
                } else {
                    notify("Processing value for visible players...");
                    // Here you would normally trigger the appraisal result page
                }
            }, 2000);
        }
    };
}

// 3. Close modal on background click
document.getElementById('auth-modal').addEventListener('click', (e) => {
    if (e.target.id === 'auth-modal') {
        toggleModal(false);
    }
});
