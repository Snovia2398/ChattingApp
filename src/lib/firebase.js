import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY, 
  authDomain: "reactchat-fdd37.firebaseapp.com",
  projectId: "reactchat-fdd37",
  storageBucket: "reactchat-fdd37.appspot.com",
  messagingSenderId: "32372286607",
  appId: "1:32372286607:web:8632a603fff62c8b2bbcfa"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth= getAuth();
export const db= getFirestore();
export const storage= getStorage();