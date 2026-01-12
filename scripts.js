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
const mainBtn = document.getElementById('main-btn');
const googleBtn = document.querySelector('.google-btn');
const emailInput = document.querySelector('input[type="email"]');
const passwordInput = document.querySelector('input[type="password"]');
const usernameInput = document.getElementById('username');
const registerFields = document.getElementById('register-fields');

// --- 1. GOOGLE LOGIN ---
googleBtn.addEventListener('click', async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        window.toggleModal();
        handleAuthSuccess(result.user);
    } catch (error) {
        alert("Google Error: " + error.message);
    }
});

// --- 2. EMAIL/PASSWORD (Login & Register) ---
mainBtn.addEventListener('click', async () => {
    const email = emailInput.value;
    const password = passwordInput.value;
    const isRegister = registerFields.style.display === 'block';

    if (!email || !password) return alert("Fill in all fields");

    try {
        if (isRegister) {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            // Save username to Firestore using v10 syntax
            await setDoc(doc(db, "users", user.uid), {
                username: usernameInput.value,
                email: email,
                createdAt: serverTimestamp()
            });
            
            window.toggleModal();
            handleAuthSuccess(user);
        } else {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            window.toggleModal();
            handleAuthSuccess(userCredential.user);
        }
    } catch (err) {
        alert(err.message);
    }
});

// --- 3. FORGOT PASSWORD ---
window.resetFlow = async () => {
    const email = emailInput.value;
    if (!email) return alert("Enter your email first");

    try {
        await sendPasswordResetEmail(auth, email);
        alert("Reset link sent to " + email);
    } catch (err) {
        alert(err.message);
    }
};

// --- 4. SUCCESS DASHBOARD ---
function handleAuthSuccess(user) {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div style="text-align: center; margin-top: 50px; animation: fadeIn 1s forwards;">
            <h1 style="font-weight: 200; letter-spacing: 2px;">WELCOME</h1>
            <p style="color: #666;">${user.email}</p>
            <div style="margin-top: 30px; padding: 20px; border: 1px solid rgba(255,255,255,0.08); border-radius: 15px; background: rgba(255,255,255,0.02);">
                <p>Access Granted</p>
                <button class="submit-btn" style="width: auto; padding: 10px 30px;" id="sign-out-btn">Sign Out</button>
            </div>
        </div>
    `;
    
    document.getElementById('sign-out-btn').addEventListener('click', () => {
        signOut(auth).then(() => location.reload());
    });
}
