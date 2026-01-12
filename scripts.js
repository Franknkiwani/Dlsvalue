import { googleSignIn, forgotPassword, authSubmit } from './authentication.js';

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('login-modal');
    const openBtn = document.getElementById('open-auth');
    const closeBtn = document.getElementById('close-modal');
    const switchBtn = document.getElementById('switch-to-reg');
    const mainBtn = document.getElementById('main-btn');
    const googleBtn = document.querySelector('.google-btn');
    const forgotBtn = document.getElementById('forgot-pass');

    let isLogin = true;

    // UI Toggles
    const toggle = () => modal.style.display = (modal.style.display === 'flex') ? 'none' : 'flex';
    if(openBtn) openBtn.onclick = toggle;
    if(closeBtn) closeBtn.onclick = toggle;

    // Login/Register Switcher
    if(switchBtn) {
        switchBtn.onclick = () => {
            isLogin = !isLogin;
            document.getElementById('auth-title').innerText = isLogin ? "Sign In" : "Create Account";
            document.getElementById('register-fields').style.display = isLogin ? "none" : "block";
            mainBtn.innerText = isLogin ? "Continue" : "Create Identity";
            if(forgotBtn) forgotBtn.style.display = isLogin ? "block" : "none";
        };
    }

    // Google Action
    if(googleBtn) {
        googleBtn.onclick = async () => {
            try { await googleSignIn(); toggle(); location.reload(); } 
            catch (e) { alert(e.message); }
        };
    }

    // Main Submit Action
    if(mainBtn) {
        mainBtn.onclick = async () => {
            const email = document.getElementById('email-input').value;
            const pass = document.getElementById('password-input').value;
            const user = document.getElementById('username')?.value;
            try {
                await authSubmit(isLogin, email, pass, user);
                toggle();
                location.reload();
            } catch (e) { alert(e.message); }
        };
    }
});
