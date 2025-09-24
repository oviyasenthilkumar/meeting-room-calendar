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

// const firebaseConfig = {
//   apiKey: "AIzaSyD27iKf5mJ7_b5FH7lF57lSf-8yQf7ZqEU",
//   authDomain: "meetlink-2a1e0.firebaseapp.com",
//   projectId: "meetlink-2a1e0",
//   storageBucket: "meetlink-2a1e0.firebasestorage.app",
//   messagingSenderId: "931083093340",
//   appId: "1:931083093340:web:5053ce1db2b7cda5e06d99",
//   measurementId: "G-BFDZN5HYKK"
// };

// const firebaseConfig = {
//   apiKey: "AIzaSyDxsNmA39jpHc-b6XC9LyZtNJdvhT5Aki8",
//   authDomain: "meeting-84ce9.firebaseapp.com",
//   projectId: "meeting-84ce9",
//   storageBucket: "meeting-84ce9.firebasestorage.app",
//   messagingSenderId: "27046801164",
//   appId: "1:27046801164:web:6f45a1d42252527f7ee329",
//   measurementId: "G-BWSBKV7VD6"
// };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
// Export Firestore instance
const db = getFirestore(app);
export { db };


