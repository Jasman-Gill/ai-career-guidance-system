import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBeHRTW95ZKkx1U4qx39Da6F0ziZg8OYFw",
    authDomain: "ai-career-guidance-7d1d4.firebaseapp.com",
    projectId: "ai-career-guidance-7d1d4",
    storageBucket: "ai-career-guidance-7d1d4.firebasestorage.app",
    messagingSenderId: "570611856100",
    appId: "1:570611856100:web:085af17ac5b62d662eb2f1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);