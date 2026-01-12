import { auth, db, googleProvider } from './firebase.js';
import { 
    signInWithPopup, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Export the "Open/Close" logic
export const toggleModal = (modalElement) => {
    const isFlex = modalElement.style.display === 'flex';
    modalElement.style.display = isFlex ? 'none' : 'flex';
};

// Export the Login/Register logic
export const handleAuth = async (isLogin, email, password, username) => {
    if (isLogin) {
        return await signInWithEmailAndPassword(auth, email, password);
    } else {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, "users", res.user.uid), {
            username: username || "User",
            email: email,
            createdAt: serverTimestamp()
        });
        return res;
    }
};

// Export Google login
export const loginWithGoogle = async () => {
    return await signInWithPopup(auth, googleProvider);
};
