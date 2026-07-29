import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBUkQUYdMyrQ4KNYzS4UVMIK79shS_E74I",
  authDomain: "zeng-wear.firebaseapp.com",
  projectId: "zeng-wear",
  storageBucket: "zeng-wear.firebasestorage.app",
  messagingSenderId: "1057334846542",
  appId: "1:1057334846542:web:b5cb3eec6afa8528efcf1f",
  measurementId: "G-9FHS98ENCG"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
