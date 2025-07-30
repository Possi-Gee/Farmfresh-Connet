// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDlD6jAhY_DwSzkwGJ76lvn4pjJuMPnpns",
  authDomain: "farmfresh-connect-km6ym.firebaseapp.com",
  projectId: "farmfresh-connect-km6ym",
  storageBucket: "farmfresh-connect-km6ym.firebasestorage.app",
  messagingSenderId: "377386999103",
  appId: "1:377386999103:web:be403fa13968b9ad58078a"
};


// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = () => {
    return signInWithPopup(auth, googleProvider);
};


export { app, auth };
