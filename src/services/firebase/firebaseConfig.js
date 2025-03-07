import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCzEWST07nqhvoP8nXRgokcshDYCV_4Mi0",
  authDomain: "nodos-f2d11.firebaseapp.com",
  projectId: "nodos-f2d11",
  storageBucket: "nodos-f2d11.firebasestorage.app",
  messagingSenderId: "539504463480",
  appId: "1:539504463480:web:eb658748b9a7bce031678d",
  measurementId: "G-0H4TB74QPZ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);

export default [db, auth];
