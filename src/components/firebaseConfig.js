// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyDOJCBuO4t2GMfgJughurnj9LVzvJwToJM",
  authDomain: "meeting-room-booking-c26be.firebaseapp.com",
  projectId: "meeting-room-booking-c26be",
  storageBucket: "meeting-room-booking-c26be.firebasestorage.app",
  messagingSenderId: "932152712614",
  appId: "1:932152712614:web:3cd867ffbf45d351ae4367",
  measurementId: "G-70HBFLNLQW",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
// Export Firestore instance
const db = getFirestore(app);
export { db };
