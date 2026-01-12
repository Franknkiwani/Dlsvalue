import { auth, db, googleProvider } from './firebase.js';
import { 
    signInWithPopup, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    sendPasswordResetEmail,
    signOut 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// --- SELECTORS ---
const modal = document.getElementById('login-modal');
const openBtn = document.getElementById('open-auth');
const closeBtn = document.getElementById('close-modal');
const switchBtn = document.getElementById('switch-to-reg');
const mainBtn = document.getElementById('main-btn');
const googleBtn = document.querySelector('.google-btn');
const forgotBtn = document.getElementById('forgot-pass');

const emailInput = document.getElementById('email-input');
const passwordInput = document.getElementById('password-input');
const usernameInput = document.getElementById('username');
const registerFields = document.getElementById('register-fields');
const authTitle = document.getElementById('auth-title');

let isLogin = true;

// --- MODAL TOGGLE LOGIC ---
const toggleModal = () => {
    modal.style.display = (modal.style.display === 'flex') ? 'none' : 'flex';
};

openBtn.addEventListener('click', toggleModal);
closeBtn.addEventListener('click', toggleModal);

// --- SWITCH BETWEEN LOGIN/REGISTER ---
switchBtn.addEventListener('click', () => {
    isLogin = !isLogin;
    if (!isLogin) {
        authTitle.innerText = "Create Account";
        registerFields.style.display = "block";
        forgotBtn.style.display = "none";
        mainBtn.innerText = "Create Identity";
        switchBtn.innerText = "Sign In";
    } else {
        authTitle.innerText = "Sign In";
        registerFields.style.display = "none";
        forgotBtn.style.display = "block";
        mainBtn.innerText = "Continue";
        switchBtn.innerText = "Sign Up";
    }
});

// --- FIREBASE ACTIONS ---
googleBtn.addEventListener('click', async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        toggleModal();
        handleAuthSuccess(result.user);
    } catch (e) { alert(e.message); }
});

mainBtn.addEventListener('click', async () => {
    const email = emailInput.value;
    const password = passwordInput.value;
    if (!email || !password) return alert("Please fill fields");

    try {
        if (!isLogin) {
            const res = await createUserWithEmailAndPassword(auth, email, password);
            await setDoc(doc(db, "users", res.user.uid), {
                username: usernameInput.value || "User",
                email: email,
                createdAt: serverTimestamp()
            });
            handleAuthSuccess(res.user);
        } else {
            const res = await signInWithEmailAndPassword(auth, email, password);
            handleAuthSuccess(res.user);
        }
        toggleModal();
    } catch (e) { alert(e.message); }
});

forgotBtn.addEventListener('click', async () => {
    if (!emailInput.value) return alert("Enter email first");
    try {
        await sendPasswordResetEmail(auth, emailInput.value);
        alert("Reset link sent!");
    } catch (e) { alert(e.message); }
});

function handleAuthSuccess(user) {
    document.getElementById('app').innerHTML = `
        <div style="text-align:center; margin-top:100px;">
            <h1>Dimension Accessed</h1>
            <p>${user.email}</p>
            <button class="submit-btn" style="width:auto; padding:10px 40px;" onclick="location.reload()">Exit</button>
        </div>`;
}
