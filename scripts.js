// FIREBASE INITIALIZATION
const firebaseConfig = {
    apiKey: "AIzaSyDFHskUWiyHhZke3KT9kkOtFI_gPsKfiGo",
    authDomain: "itzhoyoo-f9f7e.firebaseapp.com",
    projectId: "itzhoyoo-f9f7e",
    storageBucket: "itzhoyoo-f9f7e.filestorage.app",
    appId: "1:1094792075584:web:d49e9c3f899d3cd31082a5"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

let currentTokens = 50;
let selectedAmount = 0;

// --- UI CORE LOGIC ---
function toggleModal(id, show) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.toggle('hidden', !show);
    document.body.classList.toggle('modal-open', show);
    if (!show) switchView('main');
}

function switchView(view) {
    const main = document.getElementById('profile-view-main');
    const refill = document.getElementById('profile-view-refill');
    if (view === 'refill') {
        main.classList.add('hidden');
        refill.classList.remove('hidden');
    } else {
        main.classList.remove('hidden');
        refill.classList.add('hidden');
    }
}

function notify(msg) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'glass border border-white/20 px-8 py-4 rounded-3xl text-[10px] font-black uppercase tracking-widest mb-3 text-white shadow-2xl animate-up';
    toast.innerText = msg;
    container.appendChild(toast);
    setTimeout(() => { 
        toast.style.opacity = '0'; 
        setTimeout(() => toast.remove(), 500); 
    }, 3000);
}

// --- FILE UPLOAD HANDLING ---
const fileInput = document.getElementById('file-input');
if (fileInput) {
    fileInput.onchange = (e) => {
        if (e.target.files.length > 0) {
            const fileName = e.target.files[0].name;
            notify(`Analyzing: ${fileName}`);
            // Future logic: Trigger AI appraisal here
        }
    };
}

// --- PAYMENT & PACKS ---
function selectPack(el, amount) {
    document.querySelectorAll('.token-card').forEach(c => c.classList.remove('active'));
    el.classList.add('active');
    selectedAmount = amount;
    notify(`Selected Pack: ${amount} Tokens`);
}

function processPayment(method) {
    if (selectedAmount === 0) return notify("Select a token pack first");
    notify(`Connecting to ${method} Gateway...`);
    setTimeout(() => {
        currentTokens += selectedAmount;
        document.getElementById('token-count-header').innerText = `${currentTokens} Tokens`;
        notify(`Success! Added ${selectedAmount} Tokens.`);
        toggleModal('profile-overlay', false);
    }, 1500);
}

// --- FIREBASE OBSERVER ---
auth.onAuthStateChanged((user) => {
    const authBtn = document.getElementById('header-auth-btn');
    const profileHub = document.getElementById('user-profile-hub');
    
    if (user) {
        if (authBtn) authBtn.classList.add('hidden');
        if (profileHub) profileHub.classList.remove('hidden');
        
        const name = user.displayName || user.email.split('@')[0];
        document.getElementById('display-username').innerText = name;
        document.getElementById('overlay-username').innerText = name;
        document.getElementById('user-avatar').src = user.photoURL || `https://ui-avatars.com/api/?name=${user.email}&background=111&color=fff`;
    } else {
        if (authBtn) authBtn.classList.remove('hidden');
        if (profileHub) profileHub.classList.add('hidden');
    }
});

// --- AUTH EVENT HANDLERS ---
const googleBtn = document.getElementById('google-login-btn');
if (googleBtn) {
    googleBtn.onclick = () => {
        auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
            .then(() => toggleModal('auth-modal', false))
            .catch(err => notify(err.message));
    };
}

const authSubmitBtn = document.getElementById('auth-submit-btn');
if (authSubmitBtn) {
    authSubmitBtn.onclick = () => {
        const email = document.getElementById('auth-email').value;
        const pass = document.getElementById('auth-password').value;
        auth.signInWithEmailAndPassword(email, pass)
            .then(() => toggleModal('auth-modal', false))
            .catch(err => notify(err.message));
    };
}

function logoutUser() {
    if (confirm("Logout of session?")) {
        auth.signOut().then(() => {
            toggleModal('profile-overlay', false);
            notify("Logged Out");
        });
    }
}

async function deleteAccount() {
    const user = auth.currentUser; 
    if (!user) return;
    const pass = prompt("Confirm Account Deletion with password:");
    if (!pass) return;
    const cred = firebase.auth.EmailAuthProvider.credential(user.email, pass);
    try {
        await user.reauthenticateWithCredential(cred);
        if (confirm("FINAL WARNING: This is permanent. Delete?")) {
            await user.delete();
            toggleModal('profile-overlay', false);
            notify("Account Erased");
        }
    } catch (e) { notify("Incorrect Password"); }
}

// --- INITIAL LOAD ---
window.addEventListener('load', () => {
    setTimeout(() => {
        const skeleton = document.getElementById('main-skeleton');
        const hero = document.getElementById('hero-content');
        if (skeleton) skeleton.classList.add('hidden');
        if (hero) hero.classList.remove('hidden');
    }, 1500);
});
