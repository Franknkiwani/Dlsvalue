import { db } from './firebase.js'; // Assuming you exported db from firebase.js
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    googleAuthProvider, 
    signInWithPopup,
    sendPasswordResetEmail 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const auth = getAuth();
const provider = new googleAuthProvider();

// --- SELECTORS ---
const mainBtn = document.getElementById('main-btn');
const googleBtn = document.querySelector('.google-btn');
const emailInput = document.querySelector('input[type="email"]');
const passwordInput = document.querySelector('input[type="password"]');
const usernameInput = document.getElementById('username');

// --- 1. GOOGLE LOGIN ---
googleBtn.addEventListener('click', async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        console.log("User logged in via Google:", result.user);
        window.toggleModal(); // Close modal on success
        loadDashboard(result.user);
    } catch (error) {
        console.error("Google Auth Error:", error.message);
        alert(error.message);
    }
});

// --- 2. EMAIL/PASSWORD LOGIC (Login & Register) ---
mainBtn.addEventListener('click', async () => {
    const email = emailInput.value;
    const password = passwordInput.value;
    const isRegisterMode = document.getElementById('register-fields').style.display === 'block';

    if (!email || !password) return alert("Please fill in all fields.");

    try {
        if (isRegisterMode) {
            // REGISTER FLOW
            const username = usernameInput.value;
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log("Account Created:", userCredential.user);
            // You can save the username to Firestore here if needed
        } else {
            // LOGIN FLOW
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log("Logged In:", userCredential.user);
        }
        
        window.toggleModal();
        loadDashboard(auth.currentUser);
    } catch (error) {
        alert(error.message);
    }
});

// --- 3. FORGOT PASSWORD ---
window.resetFlow = async () => {
    const email = emailInput.value;
    if (!email) return alert("Please enter your email address first.");
    
    try {
        await sendPasswordResetEmail(auth, email);
        alert("Reset link sent! Check your inbox.");
    } catch (error) {
        alert(error.message);
    }
};

// --- 4. SUCCESS DASHBOARD ---
function loadDashboard(user) {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div style="text-align: center; animation: slideUp 0.8s ease;">
            <h1>Welcome back, ${user.displayName || 'User'}</h1>
            <p style="color: #a1a1aa;">Your secure session is active.</p>
            <div class="auth-card" style="margin: 20px auto; max-width: 300px;">
                <p>Status: Authenticated</p>
                <button class="submit-btn" onclick="location.reload()">Sign Out</button>
            </div>
        </div>
    `;
}
