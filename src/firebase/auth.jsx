// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDpMx_IFVodjUYrH2mwoxp8Y6IHYYJfTeA",
  authDomain: "tradelens-d85c5.firebaseapp.com",
  projectId: "tradelens-d85c5",
  storageBucket: "tradelens-d85c5.firebasestorage.app",
  messagingSenderId: "902704011865",
  appId: "1:902704011865:web:cd986999936b8809502f48",
  measurementId: "G-44778NS6C2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);

export { app };
