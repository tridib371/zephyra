import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDllQUjJT1L-DBm-hIiCmR2oZVUSiG6Ojk",
    authDomain: "zephyra-a39d0.firebaseapp.com",
    projectId: "zephyra-a39d0",
    storageBucket: "zephyra-a39d0.firebasestorage.app",
    messagingSenderId: "285938199672",
    appId: "1:285938199672:web:4b43a5cf19842095e1d18d",
    measurementId: "G-V4RH0C3DGK"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, signInWithPopup };