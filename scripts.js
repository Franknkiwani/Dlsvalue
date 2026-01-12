// 1. FIREBASE CONFIGURATION
// (Variables are defined globally so all functions can see them)
const firebaseConfig = {
    apiKey: "AIzaSyDFHskUWiyHhZke3KT9kkOtFI_gPsKfiGo",
    authDomain: "itzhoyoo-f9f7e.firebaseapp.com",
    databaseURL: "https://itzhoyoo-f9f7e-default-rtdb.firebaseio.com",
    projectId: "itzhoyoo-f9f7e",
    storageBucket: "itzhoyoo-f9f7e.filestorage.app",
    messagingSenderId: "1094792075584",
    appId: "1:1094792075584:web:d49e9c3f899d3cd31082a5",
    measurementId: "G-LLT6F9WRKH"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const googleProvider = new firebase.auth.GoogleAuthProvider();

// 2. MAIN APP LOGIC
// We wait for the HTML (DOM) to load before running any UI commands
document.addEventListener('DOMContentLoaded', () => {

    // --- UI UTILITIES (Attached to window for HTML access) ---
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
        if (modal) {
            modal.classList.toggle('hidden', !show);
            document.body.classList.toggle('modal-open', show);
        }
    };

    window.setTab = function(type) {
        const isReg = type === 'register';
        const fields = document.getElementById('register-fields');
        if (fields) fields.classList.toggle('hidden', !isReg);
        
        document.getElementById('tab-login').className = isReg ? 'text-sm font-black text-neutral-600 uppercase tracking-widest' : 'text-sm font-black text-white uppercase tracking-widest';
        document.getElementById('tab-register').className = isReg ? 'text-sm font-black text-white uppercase tracking-widest' : 'text-sm font-black text-neutral-600 uppercase tracking-widest';
        document.getElementById('auth-submit-btn').innerText = isReg ? 'Create Account' : 'Submit';
    };

    // --- AUTH OBSERVER (Updates Profile UI) ---
    auth.onAuthStateChanged((user) => {
        const authBtn = document.getElementById('header-auth-btn');
        const profileHub = document.getElementById('user-profile-hub');
        
        if (user) {
            if(authBtn) authBtn.classList.add('hidden');
            if(profileHub) {
                profileHub.classList.remove('hidden');
                document.getElementById('display-username').innerText = user.displayName || user.email.split('@')[0];
                document.getElementById('user-avatar').src = user.photoURL || `https://ui-avatars.com/api/?name=${user.email}&background=333&color=fff`;
                
                // Tier Logic: Toggle isPro to true manually to see the Gold UI
                const isPro = false; 
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

    // --- EVENT LISTENERS (Button Actions) ---

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
    const submitBtn = document.getElementById('auth-submit-btn');
    if (submitBtn) {
        submitBtn.onclick = () => {
            const email = document.getElementById('auth-email').value;
            const password = document.getElementById('auth-password').value;
            const isReg = !document.getElementById('register-fields').classList.contains('hidden');

            if(!email || !password) return notify("Enter Credentials");

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

    // --- INITIALIZATION ---
    setTimeout(() => {
        const skeleton = document.getElementById('main-skeleton');
        const content = document.getElementById('hero-content');
        if (skeleton) skeleton.classList.add('hidden');
        if (content) content.classList.remove('hidden');
        notify("AI Neural Network Online");
    }, 2500);

    const fileInput = document.getElementById('file-input');
    if (fileInput) {
        fileInput.onchange = (e) => {
            if(e.target.files[0]) {
                notify("Starting 11 Scan...");
                setTimeout(() => {
                    const hasMore = confirm("Scan full bench? (Premium Feature)");
                    if(hasMore) toggleModal(true);
                }, 2000);
            }
        };
    }

    const modalDiv = document.getElementById('auth-modal');
    if (modalDiv) {
        modalDiv.onclick = (e) => { if(e.target.id === 'auth-modal') toggleModal(false); };
    }
});
