// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "farmfresh-connect-km6ym",
  "appId": "1:377386999103:web:be403fa13968b9ad58078a",
  "storageBucket": "farmfresh-connect-km6ym.firebasestorage.app",
  "apiKey": "AIzaSyDlD6jAhY_DwSzkwGJ76lvn4pjJuMPnpns",
  "authDomain": "farmfresh-connect-km6ym.firebaseapp.com",
  "messagingSenderId": "377386999103"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = () => {
    return signInWithPopup(auth, googleProvider);
};

export { app, auth };
