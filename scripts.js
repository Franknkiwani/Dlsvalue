import { auth, db, googleProvider } from './firebase.js';
import { 
    signInWithPopup, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    sendPasswordResetEmail 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Ensure the DOM is fully loaded before attaching listeners
document.addEventListener('DOMContentLoaded', () => {

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

    // --- 1. MODAL OPEN/CLOSE ---
    if (openBtn) {
        openBtn.addEventListener('click', () => {
            modal.style.display = 'flex';
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    // --- 2. LOGIN/REGISTER SWITCHER ---
    if (switchBtn) {
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
    }

    // --- 3. GOOGLE LOGIN ---
    if (googleBtn) {
        googleBtn.addEventListener('click', async () => {
            try {
                await signInWithPopup(auth, googleProvider);
                modal.style.display = 'none';
                location.reload(); 
            } catch (e) {
                alert(e.message);
            }
        });
    }

    // --- 4. MAIN SUBMIT (EMAIL/PASS) ---
    if (mainBtn) {
        mainBtn.addEventListener('click', async () => {
            const email = emailInput.value;
            const password = passwordInput.value;
            const username = usernameInput.value;

            if (!email || !password) return alert("Please fill in all fields.");

            try {
                if (!isLogin) {
                    // REGISTER
                    const res = await createUserWithEmailAndPassword(auth, email, password);
                    await setDoc(doc(db, "users", res.user.uid), {
                        username: username || "User",
                        email: email,
                        createdAt: serverTimestamp()
                    });
                } else {
                    // LOGIN
                    await signInWithEmailAndPassword(auth, email, password);
                }
                modal.style.display = 'none';
                location.reload();
            } catch (e) {
                alert(e.message);
            }
        });
    }

    // --- 5. FORGOT PASSWORD ---
    if (forgotBtn) {
        forgotBtn.addEventListener('click', async () => {
            if (!emailInput.value) return alert("Please enter your email first.");
            try {
                await sendPasswordResetEmail(auth, emailInput.value);
                alert("Password reset link sent to your email!");
            } catch (e) {
                alert(e.message);
            }
        });
    }
});
