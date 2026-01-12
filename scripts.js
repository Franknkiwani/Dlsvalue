// Import only the functional methods from Firebase Auth CDN
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    onAuthStateChanged, 
    signOut 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// 1. SELECT ELEMENTS
const modal = document.getElementById('login-modal');
const title = document.getElementById('auth-title');
const mainBtn = document.getElementById('main-btn');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginTrigger = document.querySelector('.login-trigger');
const toggleText = document.querySelector('.toggle-link');

// 2. AUTH STATE LOGIC
// We use window.auth because it was defined in your HTML script block
const auth = window.auth;

// Listen for User Login/Logout
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is logged in
        loginTrigger.innerText = "Exit Dimension";
        // Change the header button behavior to Logout
        loginTrigger.parentElement.onclick = () => handleLogout();
        console.log("Welcome to the Dimension:", user.email);
    } else {
        // User is logged out
        loginTrigger.innerText = "Login";
        loginTrigger.parentElement.onclick = () => toggleModal();
        console.log("Outside the Dimension");
    }
});

// 3. ACTION HANDLERS
async function handleAuth() {
    const email = emailInput.value;
    const password = passwordInput.value;
    const isLogin = title.innerText === "Welcome";

    if (!email || !password) {
        alert("Please fill in all fields.");
        return;
    }

    // Visual feedback: Disable button while processing
    mainBtn.disabled = true;
    mainBtn.innerText = "Processing...";

    try {
        if (isLogin) {
            await signInWithEmailAndPassword(auth, email, password);
        } else {
            await createUserWithEmailAndPassword(auth, email, password);
        }
        toggleModal(); // Close modal on success
    } catch (error) {
        console.error("Auth Error:", error.code);
        alert(error.message);
    } finally {
        mainBtn.disabled = false;
        mainBtn.innerText = isLogin ? "Enter Dimension" : "Create Identity";
    }
}

async function handleLogout() {
    try {
        await signOut(auth);
    } catch (error) {
        alert("Error signing out.");
    }
}

// 4. UI TOGGLES (Bridging to Global for HTML onclicks)
window.toggleModal = () => {
    modal.style.display = (modal.style.display === 'flex') ? 'none' : 'flex';
};

window.switchAuth = () => {
    const isLogin = title.innerText === "Welcome";
    
    // Add a quick "pop" animation to the card
    const card = document.querySelector('.auth-card');
    card.style.animation = 'none';
    card.offsetHeight; // Trigger reflow
    card.style.animation = 'slideUp 0.4s ease';

    if (isLogin) {
        title.innerText = "Join Us";
        mainBtn.innerText = "Create Identity";
        toggleText.innerHTML = "Already a member? <span>Login here</span>";
    } else {
        title.innerText = "Welcome";
        mainBtn.innerText = "Enter Dimension";
        toggleText.innerHTML = "New explorer? <span>Register here</span>";
    }
};

// Bind the main button click
mainBtn.addEventListener('click', handleAuth);
