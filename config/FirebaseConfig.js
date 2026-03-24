// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
//import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: "primero-981e5.firebaseapp.com",
  projectId: "primero-981e5",
  storageBucket: "primero-981e5.appspot.com",
  messagingSenderId: "156359852817",
  appId: "1:156359852817:web:aaf22a74e6d29b3b21c2b0",
  measurementId: "G-KSKVF9L0JJ"
};


// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); 
export const storage = getStorage(app);
//const analytics = getAnalytics(app);