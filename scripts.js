// --- WRAPPER TO ENSURE DOM IS READY ---
document.addEventListener('DOMContentLoaded', () => {

    // --- UI UTILITIES (Attached to window so HTML can see them) ---
    window.notify = function(msg) {
        const container = document.getElementById('toast-container');
        if (!container) return;
        const toast = document.createElement('div');
        toast.className = 'toast glass border border-white/20 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest mb-3 pointer-events-auto text-white shadow-2xl';
        toast.innerText = msg;
        container.appendChild(toast);
        setTimeout(() => { 
            toast.style.opacity = '0'; 
            setTimeout(() => toast.remove(), 500); 
        }, 3000);
    };

    window.toggleModal = function(show) {
        const modal = document.getElementById('auth-modal');
        if (!modal) return;
        modal.classList.toggle('hidden', !show);
        document.body.classList.toggle('modal-open', show);
    };

    window.setTab = function(type) {
        const isReg = type === 'register';
        const regFields = document.getElementById('register-fields');
        const loginTab = document.getElementById('tab-login');
        const regTab = document.getElementById('tab-register');
        const submitBtn = document.getElementById('auth-submit-btn');

        if (regFields) regFields.classList.toggle('hidden', !isReg);
        
        if (loginTab) {
            loginTab.classList.toggle('text-neutral-600', isReg);
            loginTab.classList.toggle('text-white', !isReg);
        }
        if (regTab) {
            regTab.classList.toggle('text-white', isReg);
            regTab.classList.toggle('text-neutral-600', !isReg);
        }
        if (submitBtn) submitBtn.innerText = isReg ? 'Create Account' : 'Submit';
    };

    // --- AUTH OBSERVER (Handle Profile UI) ---
    auth.onAuthStateChanged((user) => {
        const authBtn = document.getElementById('header-auth-btn');
        const profileHub = document.getElementById('user-profile-hub');
        
        if (user) {
            if(authBtn) authBtn.classList.add('hidden');
            if(profileHub) {
                profileHub.classList.remove('hidden');
                document.getElementById('display-username').innerText = user.displayName || user.email.split('@')[0];
                document.getElementById('user-avatar').src = user.photoURL || `https://ui-avatars.com/api/?name=${user.email}&background=333&color=fff`;
                
                // Logic for Premium Status and Tokens
                const isPro = false; // Set to true to test the Gold/250 token UI
                updateUserTier(isPro);
            }
        } else {
            if(authBtn) authBtn.classList.remove('hidden');
            if(profileHub) profileHub.classList.add('hidden');
        }
    });

    window.updateUserTier = function(isPro) {
        const badge = document.getElementById('status-badge');
        const tokenText = document.getElementById('token-count');
        if (!badge || !tokenText) return;

        if (isPro) {
            badge.innerText = "PRO";
            badge.className = "text-[7px] px-1.5 py-0.5 rounded font-black uppercase tracking-widest pro";
            tokenText.innerText = "250";
        } else {
            badge.innerText = "FREE";
            badge.className = "text-[7px] px-1.5 py-0.5 rounded font-black uppercase tracking-widest free";
            tokenText.innerText = "50";
        }
    };

    // --- EVENT LISTENERS ---

    // Google Login
    const googleBtn = document.getElementById('google-login-btn');
    if (googleBtn) {
        googleBtn.onclick = () => {
            auth.signInWithPopup(googleProvider).then((res) => {
                notify(`Welcome, ${res.user.displayName}`);
                toggleModal(false);
            }).catch(() => notify("Login Failed"));
        };
    }

    // Email Submit
    const authSubmitBtn = document.getElementById('auth-submit-btn');
    if (authSubmitBtn) {
        authSubmitBtn.onclick = () => {
            const email = document.getElementById('auth-email').value;
            const password = document.getElementById('auth-password').value;
            const isReg = !document.getElementById('register-fields').classList.contains('hidden');

            if(!email || !password) return notify("Missing Credentials");

            if(isReg) {
                auth.createUserWithEmailAndPassword(email, password)
                    .then(() => { notify("Account Created!"); toggleModal(false); })
                    .catch(err => notify(err.message));
            } else {
                auth.signInWithEmailAndPassword(email, password)
                    .then(() => { notify("Logged In!"); toggleModal(false); })
                    .catch(err => notify("Invalid Login"));
            }
        };
    }

    // App Initialization
    setTimeout(() => {
        const skeleton = document.getElementById('main-skeleton');
        const content = document.getElementById('hero-content');
        if (skeleton) skeleton.classList.add('hidden');
        if (content) content.classList.remove('hidden');
        notify("AI Neural Network Online");
    }, 2500);

    // File Selection
    const fileInput = document.getElementById('file-input');
    if (fileInput) {
        fileInput.onchange = (e) => {
            if(e.target.files[0]) {
                notify("Starting 11 Scan Initiated...");
                setTimeout(() => {
                    const hasMore = confirm("AI detected 8+ substitutes. Scan full bench? (Premium Feature)");
                    if(hasMore) { toggleModal(true); }
                }, 2000);
            }
        };
    }

    // Modal Close on click outside
    const authModal = document.getElementById('auth-modal');
    if (authModal) {
        authModal.onclick = (e) => {
            if(e.target.id === 'auth-modal') toggleModal(false);
        };
    }
});
