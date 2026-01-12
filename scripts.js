// --- UI UTILITIES ---
function notify(msg) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast glass border border-white/20 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest mb-3 pointer-events-auto text-white shadow-2xl';
    toast.innerText = msg;
    container.appendChild(toast);
    setTimeout(() => { 
        toast.style.opacity = '0'; 
        setTimeout(() => toast.remove(), 500); 
    }, 3000);
}

function toggleModal(show) {
    const modal = document.getElementById('auth-modal');
    modal.classList.toggle('hidden', !show);
    document.body.classList.toggle('modal-open', show);
}

function setTab(type) {
    const isReg = type === 'register';
    document.getElementById('register-fields').classList.toggle('hidden', !isReg);
    document.getElementById('tab-login').classList.toggle('text-neutral-600', isReg);
    document.getElementById('tab-login').classList.toggle('text-white', !isReg);
    document.getElementById('tab-register').classList.toggle('text-white', isReg);
    document.getElementById('tab-register').classList.toggle('text-neutral-600', !isReg);
    document.getElementById('auth-submit-btn').innerText = isReg ? 'Create Account' : 'Submit';
}

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
            const isPro = false; // This would normally come from your database
            updateUserTier(isPro);
        }
    } else {
        if(authBtn) authBtn.classList.remove('hidden');
        if(profileHub) profileHub.classList.add('hidden');
    }
});

function updateUserTier(isPro) {
    const badge = document.getElementById('status-badge');
    const tokenText = document.getElementById('token-count');
    if (isPro) {
        badge.innerText = "PRO";
        badge.className = "text-[7px] px-1.5 py-0.5 rounded font-black uppercase tracking-widest pro";
        tokenText.innerText = "250";
    } else {
        badge.innerText = "FREE";
        badge.className = "text-[7px] px-1.5 py-0.5 rounded font-black uppercase tracking-widest free";
        tokenText.innerText = "50";
    }
}

// --- EVENT LISTENERS ---

// Google Login
document.getElementById('google-login-btn').onclick = () => {
    auth.signInWithPopup(googleProvider).then((res) => {
        notify(`Welcome, ${res.user.displayName}`);
        toggleModal(false);
    }).catch(() => notify("Login Failed"));
};

// Email Submit
document.getElementById('auth-submit-btn').onclick = () => {
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

// App Initialization
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('main-skeleton').classList.add('hidden');
        document.getElementById('hero-content').classList.remove('hidden');
        notify("AI Neural Network Online");
    }, 2500);
});

// File Selection
document.getElementById('file-input').onchange = (e) => {
    if(e.target.files[0]) {
        notify("Starting 11 Scan Initiated...");
        setTimeout(() => {
            const hasMore = confirm("AI detected 8+ substitutes. Scan full bench? (Premium Feature)");
            if(hasMore) { toggleModal(true); }
        }, 2000);
    }
};

// Modal Close on click outside
document.getElementById('auth-modal').onclick = (e) => {
    if(e.target.id === 'auth-modal') toggleModal(false);
};
