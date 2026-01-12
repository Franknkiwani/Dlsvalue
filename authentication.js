import { auth, db, googleProvider } from './firebase.js';
import { 
    signInWithPopup, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    sendPasswordResetEmail 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export const googleSignIn = () => signInWithPopup(auth, googleProvider);

export const forgotPassword = (email) => sendPasswordResetEmail(auth, email);

export const authSubmit = async (isLogin, email, password, username) => {
    if (!isLogin) {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, "users", res.user.uid), {
            username: username || "User",
            email: email,
            createdAt: serverTimestamp()
        });
        return res;
    } else {
        return await signInWithEmailAndPassword(auth, email, password);
    }
};
