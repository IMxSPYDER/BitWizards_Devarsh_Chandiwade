import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCGtg1DTOwLrnE1jx2D9h9nz9tWF7VPPYk",
    authDomain: "healthcare-4b178.firebaseapp.com",
    projectId: "healthcare-4b178",
    storageBucket: "healthcare-4b178.firebasestorage.app",
    messagingSenderId: "963043686310",
    appId: "1:963043686310:web:eb56685ed49dd099854167",
    measurementId: "G-LT3WQYBDD9"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); 