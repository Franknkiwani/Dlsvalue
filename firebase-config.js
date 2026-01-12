// Your specific Firebase configuration
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

// Initialize Firebase safely
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Initialize Services
const auth = firebase.auth();
const db = firebase.firestore();
const googleProvider = new firebase.auth.GoogleAuthProvider();

// --- Auth Event Listeners ---

// 1. Google Login Logic
document.getElementById('google-login-btn').addEventListener('click', () => {
    auth.signInWithPopup(googleProvider)
        .then((result) => {
            const user = result.user;
            notify(`Welcome, ${user.displayName || 'User'}`);
            
            // Update UI Header Button to show "Dashboard" or User Name
            document.getElementById('header-auth-btn').innerText = "Account";
            
            toggleModal(false);
        })
        .catch((error) => {
            console.error("Auth Error:", error.code);
            notify("Google Login Failed");
        });
});

// 2. Email/Password Submit Logic
document.getElementById('auth-submit-btn').addEventListener('click', () => {
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;
    const username = document.getElementById('auth-username').value;

    if (!email || !password) {
        notify("Missing Email or Password");
        return;
    }

    // Check if we are in Register mode or Login mode
    const isRegisterMode = !document.getElementById('register-fields').classList.contains('hidden');

    if (isRegisterMode) {
        // Create User
        auth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                // Save username to Firestore if provided
                if(username) {
                    db.collection("users").doc(user.uid).set({
                        handle: username,
                        email: email,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                        isPremium: false
                    });
                }
                notify("Account Created!");
                toggleModal(false);
            })
            .catch((error) => {
                notify(error.message);
            });
    } else {
        // Login User
        auth.signInWithEmailAndPassword(email, password)
            .then(() => {
                notify("Successfully Logged In");
                toggleModal(false);
            })
            .catch((error) => {
                notify("Login Failed: Check details");
            });
    }
});

// 3. Simple State Observer
auth.onAuthStateChanged((user) => {
    if (user) {
        console.log("User is active:", user.uid);
        document.getElementById('header-auth-btn').innerText = "Dashboard";
    } else {
        document.getElementById('header-auth-btn').innerText = "Login";
    }
});
