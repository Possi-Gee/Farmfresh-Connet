// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA_w4jw8NNPcjdB5diIUVc5guEopXpKIAw",
  authDomain: "university-portal-be5d4.firebaseapp.com",
  projectId: "university-portal-be5d4",
  storageBucket: "university-portal-be5d4.firebasestorage.app",
  messagingSenderId: "289856617092",
  appId: "1:289856617092:web:ace6244a20891c439de0d1",
  measurementId: "G-5K0MF0SS2G"
};


// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = () => {
    return signInWithPopup(auth, googleProvider);
};


export { app, auth };
